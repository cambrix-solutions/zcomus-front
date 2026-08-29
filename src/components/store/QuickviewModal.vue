<template>
  <div v-if="product" class="z-modal" @click.self="ui.closeQuickview()" @keydown.esc="ui.closeQuickview()">
    <div class="z-modal__panel z-quickview" role="dialog" aria-modal="true" :aria-label="product.name">
      <button class="z-quickview__close" type="button" aria-label="Close" @click="ui.closeQuickview()">
        <i class="material-icons">close</i>
      </button>
      <div class="z-quickview__grid">
        <div class="z-quickview__media">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="z-quickview__body">
          <p class="z-pcard__vendor">{{ product.brand }}</p>
          <h3>{{ product.name }}</h3>
          <div class="z-stars">★★★★★ <span>(65)</span></div>
          <div class="z-quickview__price">
            <PriceDisplay :amount="product.price" :compare-at="product.compare_at_price" />
          </div>
          <p class="z-muted">
            {{ product.description || 'Premium marketplace product ready to ship in Cambodia.' }}
          </p>
          <div class="z-quickview__actions">
            <button class="z-btn z-btn-primary" type="button" @click="onAdd">{{ t('product.addCart') }}</button>
            <button class="z-btn z-btn-deal" type="button" @click="onBuy">{{ t('product.buy') }}</button>
            <button class="z-btn z-btn-ghost" type="button" @click="onWish">{{ t('product.wishlist') }}</button>
          </div>
          <router-link
            class="z-btn z-btn-text"
            :to="`/product/${product.slug}`"
            @click="ui.closeQuickview()"
          >
            {{ t('product.fullDetails') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import PriceDisplay from 'components/store/PriceDisplay.vue';
import { useUiStore } from 'stores/ui-store';
import { useCartStore } from 'stores/cart-store';
import { useWishlistStore } from 'stores/wishlist-store';

const { t } = useI18n();
const router = useRouter();
const ui = useUiStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const { quickviewProduct: product } = storeToRefs(ui);
const productRef = computed(() => product.value);

watch(product, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

function onAdd() {
  if (!productRef.value) return;
  cart.add(productRef.value);
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}

function onBuy() {
  if (!productRef.value) return;
  cart.add(productRef.value);
  ui.closeQuickview();
  void router.push('/checkout');
}

function onWish() {
  if (!productRef.value) return;
  wishlist.toggle(productRef.value);
  Notify.create({ type: 'positive', message: t('product.wishlist'), position: 'top' });
}
</script>
