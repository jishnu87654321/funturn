import { getBackendApiBaseUrl } from '@/lib/backend-api';

export async function fetchAdminBackend(
  path: string,
  options: RequestInit & { token?: string } = {},
) {
  const { token, headers, ...rest } = options;

  return fetch(`${getBackendApiBaseUrl()}${path}`, {
    ...rest,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
