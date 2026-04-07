import { NextResponse } from 'next/server';
import { fetchAdminBackend } from '@/lib/admin-api';
import { clearAdminSessionToken, getAdminSessionToken } from '@/lib/admin-session';
import { ensureTrustedOrigin } from '@/lib/trusted-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const blockedResponse = ensureTrustedOrigin(request);
  if (blockedResponse) {
    return blockedResponse;
  }

  const token = await getAdminSessionToken();

  try {
    if (token) {
      await fetchAdminBackend('/api/admin/logout', {
        method: 'POST',
        token,
      });
    }
  } catch {
    // Ignore backend logout failures and clear local session regardless.
  }

  await clearAdminSessionToken();

  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}
