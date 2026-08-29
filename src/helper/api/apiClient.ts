import { endpoints, getApiBaseUrl } from 'src/helper/api/apiConfig';

export interface ApiEnvelope<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  user?: T;
  meta?: unknown;
}

type ApiParamValue = string | number | boolean;
type ApiParam = ApiParamValue | ApiParamValue[] | null | undefined;

export interface ApiRequestOptions {
  method?: string;
  params?: Record<string, ApiParam>;
  body?: unknown;
  token?: string | null;
  credentials?: RequestCredentials;
}

export function resolveApiUrl(): string {
  return getApiBaseUrl();
}

export async function ensureCsrf(): Promise<void> {
  const base = resolveApiUrl();
  await fetch(`${base}${endpoints.csrfCookie}`, {
    method: 'GET',
    credentials: 'include',
  }).catch(async () => {
    await fetch(`${base}/`, { credentials: 'include' }).catch(() => undefined);
  });
}

function readXsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const url = new URL(path.replace(/^\//, ''), `${resolveApiUrl()}/`);

  Object.entries(options.params || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(`${key}[]`, String(item)));
      return;
    }

    url.searchParams.set(key, String(value));
  });

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const xsrf = readXsrfToken();
  if (xsrf) {
    headers['X-XSRF-TOKEN'] = xsrf;
  }

  const requestInit: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: options.credentials ?? 'include',
  };

  if (options.body !== undefined) {
    requestInit.body = JSON.stringify(options.body);
  }

  const response = await fetch(url.toString(), requestInit);
  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }

  return payload;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function unwrapList<T>(payload: ApiEnvelope<T[]> | T[]): T[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

export function unwrapData<T>(payload: ApiEnvelope<T> | T): T | null {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data ?? null;
  }
  return payload as T;
}
