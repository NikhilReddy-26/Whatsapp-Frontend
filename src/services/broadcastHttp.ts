import { USE_MOCK_API } from './endpoints';
import { ApiError, tokenStore, UNAUTHORIZED_EVENT, withQuery } from './http';

const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 20000;
const LONG_TIMEOUT_MS = 60000;

type QueryValue = string | number | boolean | undefined | null;

/** FastAPI errors are `{ detail: string | [{ msg }] }`, not the Go `{ success, error }` envelope. */
function detailMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((d) => (d && typeof d === 'object' && 'msg' in d ? String((d as { msg: unknown }).msg) : String(d)))
        .join('; ');
    }
  }
  return `Request failed (HTTP ${status})`;
}

async function request<T>(url: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  if (USE_MOCK_API) {
    throw new ApiError('Broadcast needs the live backend. Turn off demo mode (VITE_USE_MOCK_API) to use it.', 0);
  }

  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  // JSON bodies get a Content-Type; FormData must not (the browser adds the multipart boundary)
  if (typeof init.body === 'string') headers.set('Content-Type', 'application/json');
  const token = tokenStore.get();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers, signal: controller.signal });
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError';
    throw new ApiError(
      timedOut ? 'The broadcast server took too long to respond.' : 'Cannot reach the broadcast server. Check that it is running and that CORS allows this app.',
      0
    );
  } finally {
    clearTimeout(timer);
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON body (proxy error page)
  }

  if (res.status === 401 && token) {
    tokenStore.clear();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!res.ok) throw new ApiError(detailMessage(body, res.status), res.status);
  return body as T;
}

export const broadcastHttp = {
  get: <T>(url: string, query?: Record<string, QueryValue>) => request<T>(withQuery(url, query)),
  post: <T>(url: string, body?: unknown, longRunning = false) =>
    request<T>(
      url,
      { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) },
      longRunning ? LONG_TIMEOUT_MS : DEFAULT_TIMEOUT_MS
    ),
  upload: <T>(url: string, form: FormData) => request<T>(url, { method: 'POST', body: form }, LONG_TIMEOUT_MS),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
