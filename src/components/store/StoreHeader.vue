<template>
  <header class="z-header" :class="{ 'is-scrolled': scrolled }">
    <div class="z-header__utility d-none-xs">
      <div class="z-container z-header__utility-row">
        <div class="z-header__utility-links">
          <router-link to="/about">{{ t('nav.about') }}</router-link>
          <span>|</span>
          <router-link to="/careers">{{ t('footer.careers') }}</router-link>
          <span>|</span>
          <router-link to="/vendor">{{ t('footer.openShop') }}</router-link>
        </div>
        <p class="z-header__utility-center">{{ t('trust.shipping') }}</p>
        <div class="z-header__utility-right">
          <p>{{ t('trust.help') }} <strong>{{ t('trust.phone') }}</strong></p>
          <div class="z-header__prefs">
            <button class="z-header__pref" :class="{ 'is-active': prefs.locale === 'en-US' }" type="button" @click="setLang('en-US')">EN</button>
            <button class="z-header__pref" :class="{ 'is-active': prefs.locale === 'km' }" type="button" @click="setLang('km')">ខ្មែរ</button>
            <span class="z-header__sep">|</span>
            <button class="z-header__pref" :class="{ 'is-active': prefs.currency === 'USD' }" type="button" @click="prefs.setCurrency('USD')">USD</button>
            <button class="z-header__pref" :class="{ 'is-active': prefs.currency === 'KHR' }" type="button" @click="prefs.setCurrency('KHR')">៛</button>
          </div>
        </div>
      </div>
    </div>

    <div class="z-header__main">
      <div class="z-container z-header__row">
        <button class="z-header__menu z-menu-btn" type="button" aria-label="Menu" @click="ui.mobileMenuOpen = true">
          <i class="material-icons">menu</i>
        </button>

        <router-link class="z-logo" to="/" :aria-label="t('brand')">
          <ZcomusMark :size="40" />
          <span class="z-logo__text">{{ t('brand') }}</span>
        </router-link>

        <form class="z-search z-search--main" @submit.prevent="onSearch">
          <div class="z-search__field">
            <i class="material-icons z-search__icon">search</i>
            <select v-model="category" class="z-search__cat d-none-xs">
              <option value="all">{{ t('header.all') }}</option>
              <option v-for="c in catalog.categories" :key="c.id" :value="c.slug">
                {{ c.name }}
              </option>
            </select>
            <input v-model="query" type="search" :placeholder="t('header.search')" />
          </div>
          <button class="z-search__btn" type="submit">{{ t('header.searchBtn') }}</button>
        </form>

        <nav class="z-nav" :aria-label="t('header.mainNav')">
          <router-link
            v-for="item in mainNav"
            :key="item.to"
            :to="item.to"
            class="z-nav__link"
            :class="{ 'is-active': isNavActive(item.to) }"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="z-header__acts">
          <router-link class="z-header__action" :to="auth.user ? '/account' : '/login'">
            <i class="material-icons">person_outline</i>
            <span class="label">{{ t('nav.account') }}</span>
          </router-link>
          <router-link class="z-header__action" to="/wishlist">
            <i class="material-icons">favorite_border</i>
            <span class="label">{{ t('nav.wishlist') }}</span>
            <span v-if="wishlist.count" class="z-header__badge">{{ wishlist.count }}</span>
          </router-link>
          <div class="z-header__cart-wrap" @mouseenter="cartOpen = true" @mouseleave="cartOpen = false">
            <router-link
              class="z-header__action z-header__action--cart"
              :class="{ 'is-pulse': ui.cartPulse }"
              to="/cart"
            >
              <i class="material-icons">shopping_bag</i>
              <span class="label">{{ t('nav.cart') }}</span>
              <span v-if="cart.count" class="z-header__badge" :class="{ 'is-pulse': ui.cartPulse }">{{ cart.count }}</span>
            </router-link>
            <div v-if="cartOpen && cart.items.length" class="z-mini-cart">
              <div v-for="line in cart.items.slice(0, 3)" :key="line.product.id" class="z-mini-cart__item">
                <img :src="line.product.image" :alt="line.product.name" />
                <div>
                  <router-link :to="`/product/${line.product.slug}`">{{ line.product.name }}</router-link>
                  <p class="z-muted">{{ line.qty }} × <PriceDisplay :amount="line.product.price" :alt="false" /></p>
                </div>
              </div>
              <p class="z-muted" style="margin-bottom: 8px">
                {{ t('cart.total') }}: <PriceDisplay :amount="cart.subtotal" :alt="false" />
              </p>
              <div class="z-grid z-grid-2">
                <router-link class="z-btn z-btn-ghost" to="/cart">{{ t('footer.viewCart') }}</router-link>
                <router-link class="z-btn z-btn-deal" to="/checkout">{{ t('cart.checkout') }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="ui.mobileMenuOpen" class="z-drawer">
        <div class="z-drawer__mask" @click="ui.mobileMenuOpen = false" />
        <aside class="z-drawer__panel" role="dialog" aria-modal="true" :aria-label="t('header.menu')">
          <div class="z-drawer__head">
            <router-link class="z-logo" to="/" :aria-label="t('brand')" @click="ui.mobileMenuOpen = false">
              <ZcomusMark :size="36" />
              <span class="z-logo__text">{{ t('brand') }}</span>
            </router-link>
            <button class="z-drawer__close" type="button" :aria-label="t('header.close')" @click="ui.mobileMenuOpen = false">
              <i class="material-icons">close</i>
            </button>
          </div>

          <div class="z-drawer__quick">
            <router-link class="z-drawer__quick-btn" :to="auth.user ? '/account' : '/login'" @click="ui.mobileMenuOpen = false">
              <i class="material-icons">person_outline</i>
              <span>{{ auth.user ? t('nav.account') : t('nav.login') }}</span>
            </router-link>
            <router-link class="z-drawer__quick-btn" to="/wishlist" @click="ui.mobileMenuOpen = false">
              <i class="material-icons">favorite_border</i>
              <span>{{ t('nav.wishlist') }}</span>
              <em v-if="wishlist.count">{{ wishlist.count }}</em>
            </router-link>
            <router-link class="z-drawer__quick-btn" to="/cart" @click="ui.mobileMenuOpen = false">
              <i class="material-icons">shopping_bag</i>
              <span>{{ t('nav.cart') }}</span>
              <em v-if="cart.count">{{ cart.count }}</em>
            </router-link>
          </div>

          <p class="z-drawer__label">{{ t('header.mainNav') }}</p>
          <nav class="z-drawer__nav">
            <router-link
              v-for="item in mobileNav"
              :key="item.to"
              :to="item.to"
              class="z-drawer__link"
              :class="{ 'is-active': isNavActive(item.to) }"
              @click="ui.mobileMenuOpen = false"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <p class="z-drawer__label">{{ t('home.categories') }}</p>
          <div class="z-drawer__cats">
            <router-link class="z-chip z-chip--hot" to="/shop?tab=flash" @click="ui.mobileMenuOpen = false">{{ t('home.flash') }}</router-link>
            <router-link
              v-for="c in catalog.categories"
              :key="`drawer-${c.id}`"
              class="z-chip"
              :to="{ path: '/shop', query: { category: c.slug } }"
              @click="ui.mobileMenuOpen = false"
            >
              {{ c.name }}
            </router-link>
          </div>

          <div class="z-drawer__prefs">
            <button class="z-header__pref" :class="{ 'is-active': prefs.locale === 'en-US' }" type="button" @click="setLang('en-US')">EN</button>
            <button class="z-header__pref" :class="{ 'is-active': prefs.locale === 'km' }" type="button" @click="setLang('km')">ខ្មែរ</button>
            <span class="z-header__sep">|</span>
            <button class="z-header__pref" :class="{ 'is-active': prefs.currency === 'USD' }" type="button" @click="prefs.setCurrency('USD')">USD</button>
            <button class="z-header__pref" :class="{ 'is-active': prefs.currency === 'KHR' }" type="button" @click="prefs.setCurrency('KHR')">៛</button>
          </div>
        </aside>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import PriceDisplay from 'components/store/PriceDisplay.vue';
import ZcomusMark from 'components/brand/ZcomusMark.vue';
import { useCartStore } from 'stores/cart-store';
import { useAuthStore } from 'stores/auth-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useWishlistStore } from 'stores/wishlist-store';
import { useUiStore } from 'stores/ui-store';
import { usePrefsStore } from 'stores/prefs-store';
import type { AppLocale } from 'stores/prefs-store';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();
const catalog = useCatalogStore();
const wishlist = useWishlistStore();
const ui = useUiStore();
const prefs = usePrefsStore();

const query = ref('');
const category = ref('all');
const cartOpen = ref(false);
const scrolled = ref(false);

function onScroll() {
  scrolled.value = window.scrollY > 24;
}

const mainNav = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.shop'), to: '/shop' },
  { label: t('nav.vendors'), to: '/vendors' },
  { label: t('nav.blog'), to: '/blog' },
  { label: t('nav.contact'), to: '/contact' },
]);

const mobileNav = computed(() => [
  ...mainNav.value,
  { label: t('nav.about'), to: '/about' },
  { label: t('home.flash'), to: '/shop?tab=flash' },
  { label: t('nav.compare'), to: '/compare' },
]);

function isNavActive(to: string) {
  if (to === '/') return route.path === '/';
  return route.path === to || route.path.startsWith(`${to}/`);
}

function setLang(next: AppLocale) {
  prefs.setLocale(next);
  locale.value = next;
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

onMounted(() => {
  locale.value = prefs.locale;
  if (!catalog.categories.length) void catalog.fetchCategories();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>
