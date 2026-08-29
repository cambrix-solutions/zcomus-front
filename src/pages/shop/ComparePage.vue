<template>
  <main class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('shop.title'), to: '/shop' }, { label: t('nav.compare') }]" />
    <PageHero
      :title="t('nav.compare')"
      :subtitle="`Add up to ${compare.MAX} products, then compare side by side.`"
      variant="shop"
    />

    <div v-if="booting" class="z-products z-products--skel z-fade-item">
      <SkeletonProductCard v-for="n in 5" :key="n" />
    </div>
    <div v-else-if="!compare.items.length" class="z-empty z-fade-item">
      <h3>{{ t('nav.compare') }}</h3>
      <p>Add up to {{ compare.MAX }} products, then compare side by side.</p>
      <router-link class="z-btn z-btn-primary" to="/shop">{{ t('nav.shop') }}</router-link>
    </div>

    <template v-else>
      <div class="z-fade-item" style="display:flex;justify-content:space-between;margin-bottom:12px">
        <p class="z-muted">{{ compare.count }} / {{ compare.MAX }}</p>
        <button class="z-btn z-btn-ghost" type="button" @click="compare.clear()">{{ t('shop.clear') }}</button>
      </div>
      <div class="z-card z-fade-item" style="overflow:auto">
        <table class="z-table">
          <tbody>
            <tr>
              <th>Product</th>
              <td v-for="p in compare.items" :key="`n-${p.id}`">
                <img :src="p.image" :alt="p.name" style="height:80px;object-fit:contain" />
                <router-link :to="`/product/${p.slug}`">{{ p.name }}</router-link>
              </td>
            </tr>
            <tr>
              <th>Brand</th>
              <td v-for="p in compare.items" :key="`b-${p.id}`">{{ p.brand }}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td v-for="p in compare.items" :key="`c-${p.id}`">{{ categoryName(p.category_id) }}</td>
            </tr>
            <tr>
              <th>Price</th>
              <td v-for="p in compare.items" :key="`p-${p.id}`">
                <PriceDisplay :amount="p.price" :compare-at="p.compare_at_price" />
              </td>
            </tr>
            <tr>
              <th />
              <td v-for="p in compare.items" :key="`a-${p.id}`">
                <button class="z-btn z-btn-primary z-btn-sm" type="button" @click="onAdd(p)">{{ t('product.add') }}</button>
                <button class="z-btn z-btn-text" type="button" @click="compare.toggle(p)">{{ t('cart.remove') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <section class="z-section">
      <h3 style="margin-bottom: 12px">You may also like</h3>
      <div v-if="booting" class="z-products z-products--skel">
        <SkeletonProductCard v-for="n in 5" :key="`s-${n}`" />
      </div>
      <div v-else class="z-products">
        <ProductCard
          v-for="(p, i) in suggested"
          :key="p.id"
          class="z-fade-item"
          :style="{ '--i': i }"
          :product="p"
          @add="onAdd"
          @open="goProduct"
          @quickview="onQuickview"
        />
      </div>
    </section>
    <TrustStrip />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import SkeletonProductCard from 'components/store/SkeletonProductCard.vue';
import PageHero from 'components/store/PageHero.vue';
import PriceDisplay from 'components/store/PriceDisplay.vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import type { Product } from 'src/data/mock-catalog';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useCompareStore } from 'stores/compare-store';
import { useUiStore } from 'stores/ui-store';
import { useBootLoad } from 'src/composables/useBootLoad';

const { t } = useI18n();
const router = useRouter();
const compare = useCompareStore();
const cart = useCartStore();
const catalog = useCatalogStore();
const ui = useUiStore();
const { booting } = useBootLoad(() => catalog.loadHomeCatalog());
const suggested = computed(() => {
  const ids = new Set(compare.items.map((p) => p.id));
  return catalog.products.filter((p) => !ids.has(p.id)).slice(0, 5);
});
function categoryName(id: number) {
  return catalog.categories.find((c) => c.id === id)?.name ?? 'General';
}
function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}
function goProduct(product: Product) {
  void router.push(`/product/${product.slug}`);
}
function onQuickview(product: Product) {
  ui.openQuickview(product);
}
</script>
