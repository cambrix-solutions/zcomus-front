<template>
  <header class="header sticky-bar" :class="{ stick: stuck }">
    <div class="container">
      <div class="main-header">
        <div class="header-left">
          <div class="header-logo">
            <router-link class="d-flex" to="/">
              <img alt="Zcomus" :src="ecom('imgs/template/logo.svg')" />
            </router-link>
          </div>

          <div class="header-search d-none d-lg-block">
            <div class="box-header-search">
              <form class="form-search" @submit.prevent="onSearch">
                <div class="box-category">
                  <select v-model="category">
                    <option value="all">All categories</option>
                    <option v-for="c in catalog.categories" :key="c.id" :value="c.slug">
                      {{ c.name }}
                    </option>
                  </select>
                </div>
                <div class="box-keysearch">
                  <input
                    v-model="query"
                    class="form-control font-xs"
                    type="text"
                    placeholder="Search for items"
                  />
                </div>
              </form>
            </div>
          </div>

          <div class="header-nav">
            <nav class="nav-main-menu d-none d-xl-block">
              <ul class="main-menu">
                <li
                  v-for="item in menu"
                  :key="item.label"
                  :class="{ 'has-children': item.children?.length }"
                  @mouseenter="openMenu = item.label"
                  @mouseleave="openMenu = null"
                >
                  <router-link
                    v-if="item.to"
                    :to="item.to"
                    :class="{ active: isActive(item) }"
                  >
                    {{ item.label }}
                  </router-link>
                  <a
                    v-else
                    href="#"
                    :class="{ active: openMenu === item.label }"
                    @click.prevent="openMenu = openMenu === item.label ? null : item.label"
                  >
                    {{ item.label }}
                  </a>
                  <ul
                    v-if="item.children?.length"
                    class="sub-menu"
                    :class="{ 'two-col': item.twoCol, 'is-open': openMenu === item.label }"
                  >
                    <li v-for="child in item.children" :key="child.to">
                      <router-link :to="child.to" @click="openMenu = null">
                        {{ child.label }}
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
            <div
              class="burger-icon burger-icon-white d-xl-none"
              role="button"
              tabindex="0"
              @click="ui.mobileMenuOpen = true"
              @keydown.enter="ui.mobileMenuOpen = true"
            >
              <span class="burger-icon-top" />
              <span class="burger-icon-mid" />
              <span class="burger-icon-bottom" />
            </div>
          </div>

          <div class="header-shop">
            <router-link
              class="font-lg icon-list icon-account"
              :to="auth.user ? '/account' : '/login'"
            >
              <span>{{ auth.user?.name || 'Account' }}</span>
            </router-link>

            <router-link class="font-lg icon-list icon-wishlist" to="/wishlist">
              <span>Wishlist</span>
              <span class="number-item font-xs">{{ wishlist.count }}</span>
            </router-link>

            <div
              class="d-inline-block box-dropdown-cart"
              @mouseenter="cartOpen = true"
              @mouseleave="cartOpen = false"
            >
              <router-link class="font-lg icon-list icon-cart" to="/cart">
                <span>Cart</span>
                <span class="number-item font-xs">{{ cart.count }}</span>
              </router-link>
              <div v-if="cartOpen && cart.items.length" class="dropdown-cart">
                <div
                  v-for="line in cart.items.slice(0, 3)"
                  :key="line.product.id"
                  class="item-cart mb-20"
                >
                  <div class="cart-image">
                    <img :src="line.product.image" :alt="line.product.name" />
                  </div>
                  <div class="cart-info">
                    <router-link
                      class="font-sm-bold color-brand-3"
                      :to="`/product/${line.product.slug}`"
                    >
                      {{ line.product.name }}
                    </router-link>
                    <p>
                      <span class="color-brand-2 font-sm-bold">
                        {{ line.qty }} x ${{ line.product.price.toFixed(2) }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="border-bottom pt-0 mb-15" />
                <div class="cart-total">
                  <div class="row">
                    <div class="col-6 text-start">
                      <span class="font-md-bold color-brand-3">Total</span>
                    </div>
                    <div class="col-6">
                      <span class="font-md-bold color-brand-1">
                        ${{ cart.subtotal.toFixed(2) }}
                      </span>
                    </div>
                  </div>
                  <div class="row mt-15">
                    <div class="col-6 text-start">
                      <router-link class="btn btn-cart w-auto" to="/cart">View cart</router-link>
                    </div>
                    <div class="col-6">
                      <router-link class="btn btn-buy w-auto" to="/checkout">Checkout</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <router-link
              class="font-lg icon-list icon-compare d-none d-xl-inline-block"
              to="/compare"
            >
              <span>Compare</span>
              <span v-if="compare.count" class="number-item font-xs">{{ compare.count }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="ui.mobileMenuOpen"
      class="mobile-header-active mobile-header-wrapper-style perfect-scrollbar sidebar-visible"
    >
      <div class="mobile-header-wrapper-inner">
        <div class="mobile-header-content-area p-3">
          <button class="btn btn-close mb-3" type="button" @click="ui.mobileMenuOpen = false">
            Close
          </button>
          <ul class="mobile-menu font-heading">
            <li v-for="item in flatMobile" :key="item.to">
              <router-link :to="item.to" @click="ui.mobileMenuOpen = false">
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      v-if="ui.mobileMenuOpen"
      class="body-overlay-1"
      @click="ui.mobileMenuOpen = false"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from 'stores/cart-store';
import { useAuthStore } from 'stores/auth-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useWishlistStore } from 'stores/wishlist-store';
import { useCompareStore } from 'stores/compare-store';
import { useUiStore } from 'stores/ui-store';
import { ecom } from 'src/helper/ecomAssets';

interface MenuChild {
  label: string;
  to: string;
}

interface MenuItem {
  label: string;
  to?: string;
  twoCol?: boolean;
  children?: MenuChild[];
}

const router = useRouter();
const route = useRoute();
const cart = useCartStore();
const auth = useAuthStore();
const catalog = useCatalogStore();
const wishlist = useWishlistStore();
const compare = useCompareStore();
const ui = useUiStore();

const query = ref('');
const category = ref('all');
const openMenu = ref<string | null>(null);
const cartOpen = ref(false);
const stuck = ref(false);

const menu: MenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Vendors', to: '/vendors' },
  {
    label: 'Pages',
    children: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Careers', to: '/careers' },
      { label: 'Term and Condition', to: '/terms' },
      { label: 'My Account', to: '/account' },
      { label: 'Register', to: '/register' },
      { label: 'Login', to: '/login' },
    ],
  },
  {
    label: 'Blog',
    to: '/blog',
    children: [
      { label: 'Blog - No Sidebar', to: '/blog' },
      { label: 'Blog - Right Sidebar', to: '/blog/alt' },
      { label: 'Blog List', to: '/blog/list' },
      { label: 'Blog category big', to: '/blog/big' },
    ],
  },
  { label: 'Contact Us', to: '/contact' },
];

const flatMobile = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Vendors', to: '/vendors' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Compare', to: '/compare' },
  { label: 'Blog', to: '/blog' },
  { label: 'Account', to: '/account' },
  { label: 'Contact', to: '/contact' },
]);

function isActive(item: MenuItem) {
  if (!item.to) return false;
  if (item.to === '/') return route.path === '/';
  return route.path.startsWith(item.to);
}

function onSearch() {
  void router.push({
    path: '/shop',
    query: {
      q: query.value || undefined,
      category: category.value === 'all' ? undefined : category.value,
    },
  });
}

function onScroll() {
  stuck.value = window.scrollY > 80;
}

onMounted(() => {
  if (!catalog.categories.length) void catalog.fetchCategories();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.sidebar-visible {
  visibility: visible !important;
  opacity: 1 !important;
  right: 0 !important;
  display: block !important;
  z-index: 10050;
}
.body-overlay-1 {
  display: block !important;
  opacity: 0.5;
  z-index: 10040;
}
.sub-menu.is-open {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
</style>
