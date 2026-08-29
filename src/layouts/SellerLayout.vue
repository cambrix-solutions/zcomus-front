<template>
  <div
    class="z-vhub"
    :class="{ 'is-nav-open': mobileNavOpen, 'is-onboard': !shop.active }"
  >
    <div v-if="mobileNavOpen && shop.active" class="z-vhub__scrim" @click="mobileNavOpen = false" />

    <aside v-if="shop.active" class="z-vhub__sidebar">
      <router-link class="z-vhub__brand" to="/vendor" @click="onNav('dashboard')">
        <span class="z-vhub__brand-mark"><ZcomusMark :size="24" mono /></span>
        <div>
          <strong>Zcomus</strong>
          <small>{{ t('seller.center') }}</small>
        </div>
      </router-link>

      <div class="z-vhub__shop-card">
        <img v-if="shop.logo" class="z-vhub__shop-logo" :src="shop.logo" :alt="shop.name" />
        <em v-else>{{ shopInitial }}</em>
        <div>
          <strong>{{ shop.name }}</strong>
          <span>{{ shop.category || t('seller.category') }}</span>
        </div>
        <i class="z-vhub__live">{{ t('seller.shopActive') }}</i>
      </div>

      <nav class="z-vhub__nav" aria-label="Vendor navigation">
        <button
          v-for="item in panels"
          :key="item.id"
          type="button"
          :class="{ 'is-active': panel === item.id }"
          @click="onNav(item.id)"
        >
          <i class="material-icons">{{ item.icon }}</i>
          <span>{{ item.label }}</span>
          <b v-if="item.badge > 0">{{ item.badge }}</b>
        </button>
      </nav>

      <div class="z-vhub__sidebar-foot">
        <router-link v-if="storeUrl" class="z-vhub__foot-link" :to="storeUrl" target="_blank">
          <i class="material-icons">storefront</i>
          {{ t('seller.previewStore') }}
        </router-link>
        <router-link class="z-vhub__foot-link" to="/account">
          <i class="material-icons">person</i>
          {{ t('seller.backAccount') }}
        </router-link>
        <button v-if="auth.user" class="z-vhub__foot-link" type="button" @click="onSignOut">
          <i class="material-icons">logout</i>
          {{ t('account.signOut') }}
        </button>
      </div>
    </aside>

    <div class="z-vhub__shell">
      <header class="z-vhub__bar">
        <button
          v-if="shop.active"
          class="z-vhub__menu"
          type="button"
          aria-label="Menu"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          <i class="material-icons">menu</i>
        </button>

        <router-link v-else class="z-vhub__brand z-vhub__brand--compact" to="/">
          <span class="z-vhub__brand-mark"><ZcomusMark :size="24" mono /></span>
          <strong>Zcomus</strong>
        </router-link>

        <div v-if="shop.active" class="z-vhub__bar-title">
          <span>{{ activePanelLabel }}</span>
        </div>

        <div class="z-vhub__bar-actions">
          <router-link v-if="shop.active && storeUrl" class="z-vhub__bar-link" :to="storeUrl" target="_blank">
            <i class="material-icons">open_in_new</i>
            <span>{{ t('seller.previewStore') }}</span>
          </router-link>
          <button
            v-if="shop.active"
            class="z-btn z-btn-deal z-vhub__bar-cta"
            type="button"
            @click="openAddListing"
          >
            <i class="material-icons">add</i>
            <span>{{ t('seller.addListing') }}</span>
          </button>
        </div>
      </header>

      <main class="z-vhub__main">
        <router-view />
      </main>
    </div>

    <SellerListingDialog />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import SellerListingDialog from 'components/seller/SellerListingDialog.vue';
import ZcomusMark from 'components/brand/ZcomusMark.vue';
import { useSellerShop } from 'src/composables/useSellerShop';
import { useSellerUi, type SellerPanelId } from 'src/composables/useSellerUi';
import { useAuthStore } from 'stores/auth-store';

const { t } = useI18n();
const router = useRouter();
const auth = useAuthStore();
const { shop, listingCount, allListingCount, storeUrl } = useSellerShop();
const { panel, mobileNavOpen, openPanel, openAddListing } = useSellerUi();

const shopInitial = computed(() => (shop.name?.trim()?.[0] || 'V').toUpperCase());
const pendingOrders = computed(() => (listingCount.value ? 1 : 0));

const panels = computed(() => [
  { id: 'dashboard' as const, label: t('seller.dashboard'), icon: 'space_dashboard', badge: 0 },
  { id: 'listings' as const, label: t('seller.listings'), icon: 'inventory_2', badge: allListingCount.value },
  { id: 'orders' as const, label: t('seller.orders'), icon: 'receipt_long', badge: pendingOrders.value },
  { id: 'storefront' as const, label: t('seller.storefront'), icon: 'palette', badge: 0 },
  { id: 'analytics' as const, label: t('seller.analytics'), icon: 'insights', badge: 0 },
  { id: 'payouts' as const, label: t('seller.payouts'), icon: 'account_balance_wallet', badge: 0 },
  { id: 'settings' as const, label: t('seller.settings'), icon: 'settings', badge: 0 },
]);

const activePanelLabel = computed(
  () => panels.value.find((p) => p.id === panel.value)?.label ?? t('seller.dashboard'),
);

function onNav(id: SellerPanelId) {
  openPanel(id);
  mobileNavOpen.value = false;
}

async function onSignOut() {
  await auth.logout();
  Notify.create({ type: 'positive', message: t('account.signedOut'), position: 'top' });
  void router.push('/login');
}
</script>
