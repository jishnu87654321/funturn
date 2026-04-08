import { fetchBackendApi } from '@/lib/backend-api';

export async function fetchAdminBackend(
  path: string,
  options: RequestInit & { token?: string } = {},
) {
  const { token, headers, ...rest } = options;

  return fetchBackendApi(path, {
    ...rest,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
