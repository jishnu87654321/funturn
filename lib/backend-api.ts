const LOCAL_BACKEND_URL = 'http://localhost:5000';
const STABLE_PRODUCTION_BACKEND_URL = 'https://funturnbackend.vercel.app';

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const looksLikeMissingDeployment = (status: number, bodyText: string) =>
  status === 404 && /DEPLOYMENT_NOT_FOUND|The deployment could not be found on Vercel\./i.test(bodyText);

export function getBackendApiBaseUrlCandidates() {
  const candidates = [
    process.env.FUNTERN_BACKEND_URL,
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NODE_ENV === 'production' ? STABLE_PRODUCTION_BACKEND_URL : undefined,
    LOCAL_BACKEND_URL,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeBaseUrl);

  return [...new Set(candidates)];
}

export function getBackendApiBaseUrl() {
  return getBackendApiBaseUrlCandidates()[0] || LOCAL_BACKEND_URL;
}

export async function fetchBackendApi(path: string, init?: RequestInit) {
  const candidates = getBackendApiBaseUrlCandidates();
  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${path}`, init);

      if (response.status === 404) {
        const bodyText = await response.text();

        if (looksLikeMissingDeployment(response.status, bodyText)) {
          lastResponse = new Response(bodyText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
          continue;
        }

        return new Response(bodyText, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      }

      return response;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to reach backend API');
}
