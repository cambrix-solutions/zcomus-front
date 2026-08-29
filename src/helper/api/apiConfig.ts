export type AppApiMode = 'local' | 'production';

export interface ApiEndpointConfig {
  zcomus_api: string;
}

const API_CONFIG: Record<AppApiMode, ApiEndpointConfig> = {
  production: {
    zcomus_api: 'https://api.zcomus.site',
  },
  local: {
    zcomus_api: 'https://zcomus.test',
  },
};

export function resolveAppMode(): AppApiMode {
  const raw =
    import.meta.env.VITE_APP_MODE ||
    import.meta.env.APP_MODE ||
    (import.meta.env.PROD ? 'production' : 'local');

  return raw === 'production' ? 'production' : 'local';
}

export function getApiConfig(): ApiEndpointConfig {
  return API_CONFIG[resolveAppMode()];
}

/**
 * Master switch for backend traffic. While no Laravel API exists, every request
 * would just stall until it times out, so the app runs entirely on the Pinia
 * stores and their mock data instead. Set `VITE_USE_API=true` to turn the
 * network back on once the backend is live.
 */
export function isApiEnabled(): boolean {
  const raw = import.meta.env.VITE_USE_API;
  return raw === 'true' || raw === '1';
}

/** Backend base URL (no trailing slash). Optional VITE_API_URL overrides mode config. */
export function getApiBaseUrl(): string {
  const override = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  if (override) return override;
  return getApiConfig().zcomus_api.replace(/\/$/, '');
}

export const endpoints = {
  csrfCookie: '/csrf-cookie',
  login: '/login',
  register: '/register',
  logout: '/logout',
  user: '/api/user',
  categories: '/api/categories',
  products: '/api/products',
  product: (id: string | number) => `/api/products/${id}`,
  cart: '/api/cart',
  cartItem: (productId: string | number) => `/api/cart/${productId}`,
} as const;

export default API_CONFIG;
