/** Marketplace + platform staff roles used by the SPA. */
export type AuthRole = 'customer' | 'vendor' | 'support' | 'admin' | 'super_admin';

export const ADMIN_ROLES: readonly AuthRole[] = ['admin', 'super_admin'];

export function normalizeRole(role?: string | null): AuthRole | null {
  if (!role) return null;
  const r = role.trim().toLowerCase();
  if (
    r === 'customer' ||
    r === 'vendor' ||
    r === 'support' ||
    r === 'admin' ||
    r === 'super_admin'
  ) {
    return r;
  }
  return null;
}

export function isAdminRole(role?: string | null): boolean {
  const r = normalizeRole(role);
  return r === 'admin' || r === 'super_admin';
}

export function isSuperAdminRole(role?: string | null): boolean {
  return normalizeRole(role) === 'super_admin';
}

/** Post-login landing path by role. */
export function homePathForRole(role?: string | null): string {
  const r = normalizeRole(role);
  if (r === 'admin' || r === 'super_admin') return '/admin';
  if (r === 'vendor') return '/vendor';
  return '/account';
}
