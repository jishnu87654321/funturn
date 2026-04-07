import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'funtern_admin_session';
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export async function getAdminSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? '';
}

export async function setAdminSessionToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
