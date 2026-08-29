<template>
  <main class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('shop.title'), to: '/shop' }, { label: t('nav.wishlist') }]" />

    <div class="z-section-head z-fade-item">
      <div>
        <h1 class="z-h2">{{ t('nav.wishlist') }}</h1>
        <p class="z-muted">Save products you like, then add them to cart.</p>
      </div>
    </div>

    <div v-if="booting" class="z-products z-products--skel">
      <SkeletonProductCard v-for="n in 4" :key="n" />
    </div>

    <div v-else-if="!wishlist.items.length" class="z-empty z-fade-item">
      <h3>{{ t('nav.wishlist') }}</h3>
      <p>Save products you like, then add them to cart.</p>
      <router-link class="z-btn z-btn-primary" to="/shop">{{ t('cart.continue') }}</router-link>
    </div>

    <template v-else>
      <div class="z-shop-toolbar z-fade-item">
        <button class="z-btn z-btn-primary" type="button" :disabled="!selectedIds.length" @click="addSelected">
          Add selected ({{ selectedIds.length }})
        </button>
        <button class="z-btn z-btn-ghost" type="button" @click="wishlist.clear()">{{ t('shop.clear') }}</button>
      </div>
      <div class="z-products">
        <div
          v-for="(product, i) in wishlist.items"
          :key="product.id"
          class="z-wish-card z-fade-item"
          :style="{ '--i': i }"
        >
          <label class="z-wish-card__check">
            <input type="checkbox" :checked="selectedIds.includes(product.id)" @change="toggleSelect(product.id)" />
          </label>
          <ProductCard :product="product" @add="onAdd" @open="goProduct" @quickview="onQuickview" />
          <button class="z-btn z-btn-text z-wish-card__remove" type="button" @click="onRemove(product.id)">
            {{ t('cart.remove') }}
          </button>
        </div>
      </div>
    </template>

    <section class="z-section">
      <div class="z-section-head">
        <h3>You may also like</h3>
      </div>
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import SkeletonProductCard from 'components/store/SkeletonProductCard.vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import type { Product } from 'src/data/mock-catalog';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useWishlistStore } from 'stores/wishlist-store';
import { useUiStore } from 'stores/ui-store';
import { useBootLoad } from 'src/composables/useBootLoad';

const { t } = useI18n();
const router = useRouter();
const wishlist = useWishlistStore();
const cart = useCartStore();
const catalog = useCatalogStore();
const ui = useUiStore();
const selectedIds = ref<number[]>([]);
const { booting } = useBootLoad(() => catalog.loadHomeCatalog());

const suggested = computed(() => {
  const ids = new Set(wishlist.items.map((p) => p.id));
  return catalog.products.filter((p) => !ids.has(p.id)).slice(0, 5);
});
function toggleSelect(id: number) {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((x) => x !== id)
    : [...selectedIds.value, id];
}
function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}
function addSelected() {
  wishlist.items.filter((p) => selectedIds.value.includes(p.id)).forEach((p) => cart.add(p));
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}
function onRemove(id: number) {
  wishlist.remove(id);
  selectedIds.value = selectedIds.value.filter((x) => x !== id);
}
function goProduct(product: Product) {
  void router.push(`/product/${product.slug}`);
}
function onQuickview(product: Product) {
  ui.openQuickview(product);
}
</script>
