export interface ApiClient {
  get<T>(path: string, options?: RequestInit): Promise<T>;
  post<T>(path: string, body: any, options?: RequestInit): Promise<T>;
  put<T>(path: string, body: any, options?: RequestInit): Promise<T>;
  patch<T>(path: string, body: any, options?: RequestInit): Promise<T>;
  delete<T>(path: string, options?: RequestInit): Promise<T>;
}

export function createApiClient(config: {
  baseURL: string;
  getAccessToken?: () => Promise<string | null>;
  refreshToken?: () => Promise<string>;
  onUnauthorized?: () => void;
}): ApiClient {
  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  const refreshTokenAndRetry = async (): Promise<string | null> => {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await config.refreshToken!();
        refreshSubscribers.forEach(cb => cb(newToken));
        refreshSubscribers = [];
        return newToken;
      } catch {
        config.onUnauthorized?.();
        return null;
      } finally {
        isRefreshing = false;
      }
    }
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  };

  const request = async <T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${config.baseURL}${path}`;
    let token = await config.getAccessToken?.() || null;

    // Use Record<string, string> for mutable headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    // Merge any existing headers from options
    if (options.headers) {
      const existingHeaders = options.headers as Record<string, string>;
      Object.entries(existingHeaders).forEach(([key, value]) => {
        if (value !== undefined) headers[key] = value;
      });
    }
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401 && config.refreshToken) {
      const newToken = await refreshTokenAndRetry();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  return {
    get: <T>(path: string, options?: RequestInit) => request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body: any, options?: RequestInit) =>
      request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: any, options?: RequestInit) =>
      request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: any, options?: RequestInit) =>
      request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string, options?: RequestInit) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  };
}