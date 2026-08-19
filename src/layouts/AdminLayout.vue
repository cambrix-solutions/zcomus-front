<template>
  <div class="ecom-admin-root">
    <div class="screen-overlay" :class="{ show: asideOpen }" @click="asideOpen = false" />
    <aside class="navbar-aside" :class="{ show: asideOpen }">
      <div class="aside-top">
        <router-link class="brand-wrap" to="/admin">
          <img class="logo" :src="logo" alt="Zcomus Admin" />
        </router-link>
        <div>
          <button class="btn btn-icon btn-aside-minimize" type="button" @click="asideOpen = false">
            <i class="text-muted material-icons md-menu_open" />
          </button>
        </div>
      </div>
      <nav>
        <ul class="menu-aside">
          <li
            v-for="item in menu"
            :key="item.to"
            class="menu-item"
            :class="{ active: isActive(item.to) }"
          >
            <router-link class="menu-link" :to="item.to" @click="asideOpen = false">
              <i class="icon material-icons" :class="item.icon" />
              <span class="text">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
        <hr />
        <ul class="menu-aside">
          <li class="menu-item">
            <router-link class="menu-link" to="/" @click="asideOpen = false">
              <i class="icon material-icons md-storefront" />
              <span class="text">View storefront</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="main-wrap">
      <header class="main-header navbar">
        <div class="col-search">
          <form class="searchform" @submit.prevent>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Search term" list="admin_search_terms" />
              <button class="btn btn-light bg" type="submit">
                <i class="material-icons md-search" />
              </button>
            </div>
            <datalist id="admin_search_terms">
              <option value="Products" />
              <option value="New orders" />
              <option value="Sellers" />
            </datalist>
          </form>
        </div>
        <div class="col-nav">
          <button
            class="btn btn-icon btn-mobile me-auto"
            type="button"
            @click="asideOpen = !asideOpen"
          >
            <i class="material-icons md-apps" />
          </button>
          <ul class="nav">
            <li class="nav-item">
              <a class="nav-link btn-icon" href="#" @click.prevent>
                <i class="material-icons md-notifications animation-shake" />
                <span class="badge rounded-pill">3</span>
              </a>
            </li>
            <li class="nav-item">
              <router-link class="nav-link btn-icon" to="/account" title="Account">
                <i class="material-icons md-person" />
              </router-link>
            </li>
          </ul>
        </div>
      </header>
      <section class="content-main">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const asideOpen = ref(false);
const logo = '/ecom-admin/assets/imgs/theme/logo.svg';

const menu = [
  { label: 'Dashboard', to: '/admin', icon: 'md-home' },
  { label: 'Products', to: '/admin/products', icon: 'md-shopping_bag' },
  { label: 'Categories', to: '/admin/categories', icon: 'md-category' },
  { label: 'Orders', to: '/admin/orders', icon: 'md-shopping_cart' },
  { label: 'Sellers', to: '/admin/sellers', icon: 'md-store' },
  { label: 'Transactions', to: '/admin/transactions', icon: 'md-monetization_on' },
  { label: 'Settings', to: '/admin/settings', icon: 'md-settings' },
];

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin';
  return route.path.startsWith(to);
}

const adminCssId = 'ecom-admin-css';
const storefrontCssId = 'ecom-storefront-css';

onMounted(() => {
  const storefront = document.getElementById(storefrontCssId) as HTMLLinkElement | null;
  if (storefront) storefront.disabled = true;

  if (!document.getElementById(adminCssId)) {
    const link = document.createElement('link');
    link.id = adminCssId;
    link.rel = 'stylesheet';
    link.href = '/ecom-admin/assets/css/style.css';
    document.head.appendChild(link);
  }
  document.body.classList.add('ecom-admin-body');
});

onUnmounted(() => {
  document.body.classList.remove('ecom-admin-body');
  document.getElementById(adminCssId)?.remove();
  const storefront = document.getElementById(storefrontCssId) as HTMLLinkElement | null;
  if (storefront) storefront.disabled = false;
});
</script>

<style>
.ecom-admin-root {
  min-height: 100vh;
  background: #f7f8f9;
}
.ecom-admin-body {
  background: #f7f8f9 !important;
  margin: 0;
}
.ecom-admin-body .screen-overlay.show {
  display: block;
  opacity: 0.5;
}
</style>
