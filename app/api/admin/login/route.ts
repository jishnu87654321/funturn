import { NextResponse } from 'next/server';
import { fetchAdminBackend } from '@/lib/admin-api';
import { setAdminSessionToken } from '@/lib/admin-session';
import { ensureTrustedOrigin } from '@/lib/trusted-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const blockedResponse = ensureTrustedOrigin(request);
  if (blockedResponse) {
    return blockedResponse;
  }

  try {
    const body = await request.json();
    const response = await fetchAdminBackend('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json();

    if (!response.ok || !payload.success || !payload.data?.token) {
      return NextResponse.json(payload, { status: response.status || 401 });
    }

    await setAdminSessionToken(payload.data.token);

    return NextResponse.json({
      success: true,
      message: payload.message || 'Login successful',
      data: {
        admin: payload.data.admin,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to login right now. Please try again.',
      },
      { status: 502 },
    );
  }
}
