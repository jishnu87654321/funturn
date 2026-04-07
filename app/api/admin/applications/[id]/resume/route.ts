import { NextResponse } from 'next/server';
import { fetchAdminBackend } from '@/lib/admin-api';
import { clearAdminSessionToken, getAdminSessionToken } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getAdminSessionToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const url = new URL(request.url);
  const query = url.searchParams.toString();

  try {
    const response = await fetchAdminBackend(`/api/admin/applications/${id}/resume${query ? `?${query}` : ''}`, {
      token,
    });

    if (response.status === 401) {
      await clearAdminSessionToken();
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!response.ok) {
      const payload = await response.json();
      return NextResponse.json(payload, { status: response.status });
    }

    const headers = new Headers();
    headers.set('content-type', response.headers.get('content-type') || 'application/octet-stream');

    const disposition = response.headers.get('content-disposition');
    if (disposition) {
      headers.set('content-disposition', disposition);
    }

    const length = response.headers.get('content-length');
    if (length) {
      headers.set('content-length', length);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to load resume' },
      { status: 502 },
    );
  }
}
