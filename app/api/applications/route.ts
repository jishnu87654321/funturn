import { NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/lib/backend-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const outgoing = new FormData();

    for (const [key, value] of incoming.entries()) {
      outgoing.append(key, value);
    }

    const response = await fetch(`${getBackendApiBaseUrl()}/api/applications`, {
      method: 'POST',
      body: outgoing,
      cache: 'no-store',
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Application submission failed. Please try again in a moment.',
      },
      { status: 502 },
    );
  }
}
