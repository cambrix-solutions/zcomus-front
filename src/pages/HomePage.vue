<template>
  <div class="z-page z-page--home">
    <HeroBanner />
    <QuickPerks />
    <FeaturedCategories :categories="catalog.categories" :loading="booting" />
    <PromoBanners />
    <ProductTabsSection
      :title="t('home.topSelling')"
      :subtitle="t('home.topSellingSub')"
      :products="catalog.topSellingProducts"
      :loading="booting"
      view-all="/shop"
      @add="onAdd"
      @open="onOpen"
      @quickview="onQuickview"
    />
    <ProductTabsSection
      :title="t('home.flash')"
      :subtitle="t('home.flashSub')"
      :products="catalog.flashProducts"
      :loading="booting"
      flash
      view-all="/shop?tab=flash"
      @add="onAdd"
      @open="onOpen"
      @quickview="onQuickview"
    />
    <ProductTabsSection
      :title="t('home.trending')"
      :subtitle="t('home.trendingSub')"
      :products="catalog.trendingProducts"
      :loading="booting"
      muted
      view-all="/shop"
      @add="onAdd"
      @open="onOpen"
      @quickview="onQuickview"
    />
    <VendorSpotlight :loading="booting" />
    <PaymentStrip />
    <TrustStrip />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import HeroBanner from 'components/home/HeroBanner.vue';
import QuickPerks from 'components/home/QuickPerks.vue';
import PromoBanners from 'components/home/PromoBanners.vue';
import FeaturedCategories from 'components/home/FeaturedCategories.vue';
import ProductTabsSection from 'components/home/ProductTabsSection.vue';
import VendorSpotlight from 'components/home/VendorSpotlight.vue';
import PaymentStrip from 'components/home/PaymentStrip.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import type { Product } from 'src/data/mock-catalog';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useUiStore } from 'stores/ui-store';

const { t } = useI18n();
const router = useRouter();
const cart = useCartStore();
const catalog = useCatalogStore();
const ui = useUiStore();
const booting = ref(true);

function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}

function onOpen(product: Product) {
  void router.push(`/product/${product.slug || product.id}`);
}

function onQuickview(product: Product) {
  ui.openQuickview(product);
}

onMounted(async () => {
  await catalog.loadHomeCatalog();
  booting.value = false;
});
</script>
