import { NextResponse } from 'next/server';
import { fetchAdminBackend } from '@/lib/admin-api';
import { clearAdminSessionToken, getAdminSessionToken } from '@/lib/admin-session';
import { ensureTrustedOrigin } from '@/lib/trusted-origin';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const blockedResponse = ensureTrustedOrigin(request);
  if (blockedResponse) {
    return blockedResponse;
  }

  const token = await getAdminSessionToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const response = await fetchAdminBackend(`/api/admin/applications/${id}/status`, {
      method: 'PATCH',
      token,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json();

    if (response.status === 401) {
      await clearAdminSessionToken();
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to update application status' },
      { status: 502 },
    );
  }
}
