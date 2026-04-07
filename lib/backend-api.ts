const DEFAULT_BACKEND_URL = 'http://localhost:5000';

export function getBackendApiBaseUrl() {
  const rawUrl =
    process.env.FUNTERN_BACKEND_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    DEFAULT_BACKEND_URL;

  return rawUrl.replace(/\/+$/, '');
}
