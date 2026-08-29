import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  apiRequest,
  ensureCsrf,
  getApiErrorMessage,
  type ApiEnvelope,
} from 'src/helper/api/apiClient';
import { endpoints } from 'src/helper/api/apiConfig';
import {
  homePathForRole,
  isAdminRole,
  isSuperAdminRole,
  type AuthRole,
} from 'src/helper/authRoles';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: AuthRole;
}

const STORAGE_KEY = 'zcomus-auth-user';

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function pickUser(payload: ApiEnvelope<AuthUser>): AuthUser | null {
  const next = payload.user ?? payload.data;
  if (!next || typeof next !== 'object' || !('id' in next)) return null;
  return next;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(loadUser());
  const loading = ref(false);
  const error = ref<string | null>(null);

  function persist(next: AuthUser | null) {
    user.value = next;
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      await ensureCsrf();
      const payload = await apiRequest<AuthUser>(endpoints.login, {
        method: 'POST',
        body: { email, password },
      });
      const next = pickUser(payload);
      if (!next) throw new Error(payload.message || 'Login failed');
      persist(next);
      return next;
    } catch (e: unknown) {
      error.value = getApiErrorMessage(e, 'Login failed. Check your credentials.');
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    loading.value = true;
    error.value = null;
    try {
      await ensureCsrf();
      const res = await apiRequest<AuthUser>(endpoints.register, {
        method: 'POST',
        body: payload,
      });
      const next = pickUser(res);
      if (!next) throw new Error(res.message || 'Registration failed');
      persist(next);
      return next;
    } catch (e: unknown) {
      error.value = getApiErrorMessage(e, 'Registration failed.');
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await ensureCsrf();
      await apiRequest(endpoints.logout, { method: 'POST' });
    } catch {
      /* ignore offline */
    } finally {
      persist(null);
    }
  }

  /** Frontend-only demo session when Laravel auth is unavailable */
  function loginDemo() {
    persist({
      id: 1,
      name: 'Demo Customer',
      email: 'demo@zcomus.test',
      role: 'customer',
    });
    error.value = null;
  }

  function loginDemoAdmin() {
    persist({
      id: 90,
      name: 'Platform Admin',
      email: 'admin@zcomus.test',
      role: 'admin',
    });
    error.value = null;
  }

  function loginDemoSuperAdmin() {
    persist({
      id: 91,
      name: 'Super Admin',
      email: 'super@zcomus.test',
      role: 'super_admin',
    });
    error.value = null;
  }

  async function fetchUser() {
    try {
      const res = await apiRequest<AuthUser>(endpoints.user);
      persist(pickUser(res));
      return user.value;
    } catch {
      persist(null);
      return null;
    }
  }

  const role = computed(() => user.value?.role ?? null);
  const isAdmin = computed(() => isAdminRole(role.value));
  const isSuperAdmin = computed(() => isSuperAdminRole(role.value));
  const canAccessAdmin = computed(() => isAdmin.value);
  const postLoginPath = computed(() => homePathForRole(role.value));

  return {
    user,
    loading,
    error,
    role,
    isAdmin,
    isSuperAdmin,
    canAccessAdmin,
    postLoginPath,
    login,
    register,
    logout,
    loginDemo,
    loginDemoAdmin,
    loginDemoSuperAdmin,
    fetchUser,
  };
});
