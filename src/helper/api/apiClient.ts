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
  /** Abort the request after this many ms. `0` disables the timeout. */
  timeoutMs?: number;
}

/**
 * `fetch` has no timeout of its own, so an unreachable backend stalls until the
 * browser gives up — tens of seconds during which any screen waiting on the
 * call just shows skeletons. Every request is bounded instead.
 */
const DEFAULT_TIMEOUT_MS = 10_000;

/** Short bound for calls that have a mock fallback and block first paint. */
export const FAST_TIMEOUT_MS = 3_500;

function withTimeout(timeoutMs: number): {
  signal: AbortSignal | undefined;
  done: () => void;
} {
  if (timeoutMs <= 0 || typeof AbortController === 'undefined') {
    return { signal: undefined, done: () => undefined };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

export function resolveApiUrl(): string {
  return getApiBaseUrl();
}

export async function ensureCsrf(): Promise<void> {
  const base = resolveApiUrl();
  const { signal, done } = withTimeout(DEFAULT_TIMEOUT_MS);
  try {
    await fetch(`${base}${endpoints.csrfCookie}`, {
      method: 'GET',
      credentials: 'include',
      ...(signal ? { signal } : {}),
    }).catch(async () => {
      await fetch(`${base}/`, {
        credentials: 'include',
        ...(signal ? { signal } : {}),
      }).catch(() => undefined);
    });
  } finally {
    done();
  }
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

  const { signal, done } = withTimeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  if (signal) requestInit.signal = signal;

  let response: Response;
  try {
    response = await fetch(url.toString(), requestInit);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw e;
  } finally {
    done();
  }

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
