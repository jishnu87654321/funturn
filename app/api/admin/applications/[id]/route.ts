import { NextResponse } from 'next/server';
import { fetchAdminBackend } from '@/lib/admin-api';
import { clearAdminSessionToken, getAdminSessionToken } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getAdminSessionToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const response = await fetchAdminBackend(`/api/admin/applications/${id}`, { token });
    const payload = await response.json();

    if (response.status === 401) {
      await clearAdminSessionToken();
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to load application details' },
      { status: 502 },
    );
  }
}
