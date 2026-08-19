<template>
  <div v-if="product" class="modal fade show d-block" tabindex="-1" style="background: rgba(14,34,77,.45)">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <button type="button" class="btn-close position-absolute end-0 top-0 m-3" aria-label="Close" @click="ui.closeQuickview()" />
        <div class="modal-body p-4">
          <div class="row">
            <div class="col-md-5 text-center">
              <img :src="product.image" :alt="product.name" class="img-fluid" />
            </div>
            <div class="col-md-7">
              <span class="font-xs color-gray-500">{{ product.brand }}</span>
              <h4 class="color-brand-3 mb-15">{{ product.name }}</h4>
              <div class="mb-15">
                <strong class="font-xl-bold color-brand-3">${{ product.price.toFixed(2) }}</strong>
                <span v-if="product.compare_at_price" class="color-gray-500 text-decoration-line-through ms-2">
                  ${{ product.compare_at_price.toFixed(2) }}
                </span>
              </div>
              <p class="font-sm color-gray-500 mb-20">
                {{ product.description || 'Premium marketplace product ready to ship.' }}
              </p>
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-cart" type="button" @click="onAdd">Add To Cart</button>
                <button class="btn btn-buy" type="button" @click="onWish">Wishlist</button>
                <router-link
                  class="btn btn-border"
                  :to="`/product/${product.slug}`"
                  @click="ui.closeQuickview()"
                >
                  View detail
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useUiStore } from 'stores/ui-store';
import { useCartStore } from 'stores/cart-store';
import { useWishlistStore } from 'stores/wishlist-store';

const ui = useUiStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const { quickviewProduct: product } = storeToRefs(ui);

const productRef = computed(() => product.value);

function onAdd() {
  if (!productRef.value) return;
  cart.add(productRef.value);
  Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' });
}

function onWish() {
  if (!productRef.value) return;
  const added = wishlist.toggle(productRef.value);
  Notify.create({
    type: 'positive',
    message: added ? 'Added to wishlist' : 'Removed from wishlist',
    position: 'top',
  });
}
</script>
