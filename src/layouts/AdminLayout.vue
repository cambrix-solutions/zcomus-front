<template>
  <div class="z-ahub" :class="{ 'is-nav-open': mobileNavOpen }">
    <div v-if="mobileNavOpen" class="z-ahub__scrim" @click="mobileNavOpen = false" />

    <aside class="z-ahub__sidebar">
      <router-link class="z-ahub__brand" to="/admin" @click="mobileNavOpen = false">
        <span class="z-ahub__brand-mark">Z</span>
        <div>
          <strong>Zcomus</strong>
          <small>{{ t('admin.center') }}</small>
        </div>
      </router-link>

      <div class="z-ahub__user-card">
        <em>{{ userInitial }}</em>
        <div>
          <strong>{{ auth.user?.name || t('admin.staff') }}</strong>
          <span>{{ roleLabel }}</span>
        </div>
        <i class="z-ahub__role-pill" :class="{ 'is-super': auth.isSuperAdmin }">
          {{ auth.isSuperAdmin ? t('admin.roleSuper') : t('admin.roleAdmin') }}
        </i>
      </div>

      <nav class="z-ahub__nav" aria-label="Admin navigation">
        <router-link
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          :class="{ 'is-active': isActive(item.to) }"
          @click="mobileNavOpen = false"
        >
          <i class="material-icons">{{ item.icon }}</i>
          <span>{{ item.label }}</span>
          <b v-if="item.badge">{{ item.badge }}</b>
        </router-link>
      </nav>

      <div class="z-ahub__sidebar-foot">
        <router-link class="z-ahub__foot-link" to="/" @click="mobileNavOpen = false">
          <i class="material-icons">storefront</i>
          {{ t('admin.viewStore') }}
        </router-link>
        <router-link class="z-ahub__foot-link" to="/account" @click="mobileNavOpen = false">
          <i class="material-icons">person</i>
          {{ t('admin.backAccount') }}
        </router-link>
        <button v-if="auth.user" class="z-ahub__foot-link" type="button" @click="onSignOut">
          <i class="material-icons">logout</i>
          {{ t('account.signOut') }}
        </button>
      </div>
    </aside>

    <div class="z-ahub__shell">
      <header class="z-ahub__bar">
        <button
          class="z-ahub__menu"
          type="button"
          aria-label="Menu"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          <i class="material-icons">menu</i>
        </button>

        <div class="z-ahub__bar-title">
          <span>{{ pageTitle }}</span>
        </div>

        <div class="z-ahub__bar-actions">
          <router-link class="z-ahub__bar-link" to="/">
            <i class="material-icons">open_in_new</i>
            <span>{{ t('admin.viewStore') }}</span>
          </router-link>
        </div>
      </header>

      <main class="z-ahub__main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useAuthStore } from 'stores/auth-store';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const mobileNavOpen = ref(false);

const userInitial = computed(() => (auth.user?.name?.trim()?.[0] || 'A').toUpperCase());

const roleLabel = computed(() =>
  auth.isSuperAdmin ? t('admin.roleSuperHint') : t('admin.roleAdminHint'),
);

const menu = computed(() => {
  const base = [
    { to: '/admin', label: t('admin.navDashboard'), icon: 'space_dashboard', badge: 0 },
    { to: '/admin/orders', label: t('admin.navOrders'), icon: 'receipt_long', badge: 3 },
    { to: '/admin/sellers', label: t('admin.navVendors'), icon: 'storefront', badge: 1 },
    { to: '/admin/products', label: t('admin.navProducts'), icon: 'inventory_2', badge: 0 },
    { to: '/admin/categories', label: t('admin.navCategories'), icon: 'category', badge: 0 },
    { to: '/admin/transactions', label: t('admin.navTransactions'), icon: 'account_balance_wallet', badge: 0 },
  ];
  if (auth.isSuperAdmin) {
    base.push(
      { to: '/admin/users', label: t('admin.navUsers'), icon: 'group', badge: 0 },
      { to: '/admin/fees', label: t('admin.navFees'), icon: 'percent', badge: 0 },
      { to: '/admin/settings', label: t('admin.navSettings'), icon: 'settings', badge: 0 },
    );
  }
  return base;
});

const pageTitle = computed(() => {
  const hit = menu.value.find((item) => isActive(item.to));
  return hit?.label ?? t('admin.navDashboard');
});

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin';
  return route.path.startsWith(to);
}

async function onSignOut() {
  await auth.logout();
  Notify.create({ type: 'positive', message: t('account.signedOut'), position: 'top' });
  void router.push('/login');
}
</script>
