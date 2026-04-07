import { NextResponse } from 'next/server';
import { fetchAdminBackend } from '@/lib/admin-api';
import { clearAdminSessionToken, getAdminSessionToken } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = await getAdminSessionToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetchAdminBackend('/api/admin/me', { token });
    const payload = await response.json();

    if (response.status === 401) {
      await clearAdminSessionToken();
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to verify admin session' },
      { status: 502 },
    );
  }
}
