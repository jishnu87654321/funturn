import { NextResponse } from 'next/server';

function getRequestOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    return origin;
  }

  const referer = request.headers.get('referer');
  if (!referer) {
    return '';
  }

  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
}

function getExpectedOrigin(request: Request) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) {
    return '';
  }

  const protocol = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}

export function ensureTrustedOrigin(request: Request) {
  const requestOrigin = getRequestOrigin(request);
  const expectedOrigin = getExpectedOrigin(request);

  if (!requestOrigin || !expectedOrigin || requestOrigin !== expectedOrigin) {
    return NextResponse.json(
      { success: false, message: 'Forbidden' },
      { status: 403 },
    );
  }

  return null;
}
