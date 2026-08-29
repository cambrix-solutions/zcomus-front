import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteLocationNormalized,
} from 'vue-router';
import { isAdminRole } from 'src/helper/authRoles';
import { useAuthStore } from 'stores/auth-store';
import routes from './routes';

function rolesFor(to: RouteLocationNormalized): string[] | null {
  let found: string[] | null = null;
  for (const record of to.matched) {
    if (Array.isArray(record.meta.roles) && record.meta.roles.length) {
      found = record.meta.roles as string[];
    }
  }
  return found;
}

function requiresAuth(to: RouteLocationNormalized): boolean {
  return to.matched.some((r) => r.meta.requiresAuth === true || Array.isArray(r.meta.roles));
}

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    if (!requiresAuth(to)) return true;

    const auth = useAuthStore();
    if (!auth.user) {
      return { path: '/login', query: { next: to.fullPath } };
    }

    const roles = rolesFor(to);
    if (roles?.length) {
      const role = auth.user.role || '';
      if (!roles.includes(role)) {
        return { path: isAdminRole(role) ? '/admin' : '/account' };
      }
    }

    return true;
  });

  return Router;
});
