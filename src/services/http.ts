import type { ApiEnvelope } from './endpoints';

const TOKEN_STORAGE_KEY = 'colourplus_lead_desk_token';
const TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000;

// Fired whenever the backend rejects our token, so AuthContext can sign the user out.
export const UNAUTHORIZED_EVENT = 'colourplus:unauthorized';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const REFRESH_TOKEN_STORAGE_KEY = 'colourplus_lead_desk_refresh_token';
const ID_TOKEN_STORAGE_KEY = 'colourplus_lead_desk_id_token';

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  getIdToken(): string | null {
    try {
      return localStorage.getItem(ID_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(token: string, refreshToken?: string, idToken?: string): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      if (idToken) localStorage.setItem(ID_TOKEN_STORAGE_KEY, idToken);
    } catch {
      // Storage unavailable (private mode) - token lives only for this page load
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(ID_TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};

/** True when the JWT's `exp` claim is in the past (or the token is unreadable). */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

type QueryValue = string | number | boolean | undefined | null;

export function withQuery(url: string, query?: Record<string, QueryValue>): string {
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/** Calls the backend, unwraps the `{ success, data }` envelope and throws ApiError on failure. */
export async function apiRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body !== undefined) headers.set('Content-Type', 'application/json');
  const token = tokenStore.get();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers, signal: controller.signal });
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError';
    throw new ApiError(
      timedOut ? 'The server took too long to respond.' : 'Cannot reach the ColourPlus server. Check that the backend is running.',
      0
    );
  } finally {
    clearTimeout(timer);
  }

  let body: ApiEnvelope<T> | null = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON body (e.g. proxy error page)
  }

  if (res.status === 401 && token) {
    tokenStore.clear();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!res.ok || !body || (typeof body === 'object' && 'success' in (body as Record<string, unknown>) && (body as { success?: boolean }).success === false)) {
    let message = `Request failed (HTTP ${res.status})`;
    if (body && typeof body === 'object' && 'error' in (body as Record<string, unknown>)) {
      const err = (body as { error?: unknown }).error;
      if (typeof err === 'string') message = err;
      else if (err && typeof err === 'object' && 'message' in (err as Record<string, unknown>)) {
        message = String((err as { message?: unknown }).message);
      }
    }
    throw new ApiError(message, res.status);
  }

  if (body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)) {
    return (body as { data: T }).data;
  }

  return body as unknown as T;
}

export const http = {
  get: <T>(url: string, query?: Record<string, QueryValue>) => apiRequest<T>(withQuery(url, query)),
  post: <T>(url: string, body: unknown) => apiRequest<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(url: string, body: unknown) => apiRequest<T>(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(url: string) => apiRequest<T>(url, { method: 'DELETE' }),
};
