<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><router-link class="font-xs color-gray-500" to="/shop">Shop</router-link></li>
            <li><span class="font-xs color-gray-500">Cart</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template mb-50">
      <div class="container">
        <div v-if="!cart.items.length" class="text-center py-50">
          <h3 class="mb-15">Your cart is empty</h3>
          <p class="font-md color-gray-500 mb-25">Add products from the shop to continue.</p>
          <router-link class="btn btn-buy" to="/shop">Continue shopping</router-link>
        </div>

        <div v-else class="row">
          <div class="col-lg-9">
            <div class="box-carts">
              <div class="head-wishlist">
                <div class="item-wishlist">
                  <div class="wishlist-product">
                    <span class="font-md-bold color-brand-3">Product</span>
                  </div>
                  <div class="wishlist-price">
                    <span class="font-md-bold color-brand-3">Unit Price</span>
                  </div>
                  <div class="wishlist-status">
                    <span class="font-md-bold color-brand-3">Quantity</span>
                  </div>
                  <div class="wishlist-action">
                    <span class="font-md-bold color-brand-3">Subtotal</span>
                  </div>
                  <div class="wishlist-remove">
                    <span class="font-md-bold color-brand-3">Remove</span>
                  </div>
                </div>
              </div>

              <div class="content-wishlist mb-20">
                <div
                  v-for="line in cart.items"
                  :key="line.product.id"
                  class="item-wishlist"
                >
                  <div class="wishlist-product">
                    <div class="product-wishlist">
                      <div class="product-image">
                        <router-link :to="`/product/${line.product.slug}`">
                          <img :src="line.product.image" :alt="line.product.name" />
                        </router-link>
                      </div>
                      <div class="product-info">
                        <router-link :to="`/product/${line.product.slug}`">
                          <h6 class="color-brand-3">{{ line.product.name }}</h6>
                        </router-link>
                        <div class="rating">
                          <img v-for="n in 5" :key="n" :src="star" alt="" />
                          <span class="font-xs color-gray-500"> (65)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="wishlist-price">
                    <h4 class="color-brand-3">${{ line.product.price.toFixed(2) }}</h4>
                  </div>
                  <div class="wishlist-status">
                    <div class="box-quantity">
                      <div class="input-quantity">
                        <input
                          class="font-xl color-brand-3"
                          type="text"
                          :value="line.qty"
                          readonly
                        />
                        <span
                          class="minus-cart"
                          @click="cart.setQty(line.product.id, Math.max(1, line.qty - 1))"
                        />
                        <span
                          class="plus-cart"
                          @click="cart.setQty(line.product.id, line.qty + 1)"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="wishlist-action">
                    <h4 class="color-brand-3">
                      ${{ (line.product.price * line.qty).toFixed(2) }}
                    </h4>
                  </div>
                  <div class="wishlist-remove">
                    <a
                      class="btn btn-delete"
                      href="#"
                      aria-label="Remove"
                      @click.prevent="cart.remove(line.product.id)"
                    />
                  </div>
                </div>
              </div>

              <div class="row mb-40">
                <div class="col-lg-6 col-md-6">
                  <router-link class="btn btn-buy w-auto arrow-back mb-10" to="/shop">
                    Continue shopping
                  </router-link>
                </div>
                <div class="col-lg-6 col-md-6 text-md-end">
                  <button class="btn btn-buy w-auto update-cart mb-10" type="button" @click="onUpdate">
                    Update cart
                  </button>
                </div>
              </div>

              <div class="row mb-50">
                <div class="col-lg-6 col-md-6 mb-20">
                  <div class="box-cart-left">
                    <h5 class="font-md-bold mb-10">Calculate Shipping</h5>
                    <span class="font-sm-bold mb-5 d-inline-block color-gray-500">Delivery:</span>
                    <span class="font-sm-bold d-inline-block color-brand-3"> Cambodia only · Free over $75</span>
                    <div class="form-group mt-10">
                      <select v-model="shipCountry" class="form-control select-style1 color-gray-700">
                        <option value="kh">Cambodia</option>
                      </select>
                    </div>
                    <div class="row">
                      <div class="col-lg-6 mb-10">
                        <input v-model="shipState" class="form-control" placeholder="Province / City (e.g. Phnom Penh)" />
                      </div>
                      <div class="col-lg-6 mb-10">
                        <input v-model="shipZip" class="form-control" placeholder="PostCode / ZIP" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 mb-20">
                  <div class="box-cart-right p-20">
                    <h5 class="font-md-bold mb-10">Apply Coupon</h5>
                    <span class="font-sm-bold mb-5 d-inline-block color-gray-500">
                      Using A Promo Code?
                    </span>
                    <div class="form-group d-flex gap-2 mt-10">
                      <input
                        v-model="coupon"
                        class="form-control mr-15"
                        placeholder="Enter Your Coupon"
                      />
                      <button class="btn btn-buy w-auto" type="button" @click="onCoupon">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-3">
            <div class="box-cart-total">
              <h5 class="font-md-bold mb-10">Cart totals</h5>
              <div class="border-bottom mb-10 pb-10">
                <div class="d-flex justify-content-between mb-10">
                  <span class="font-sm color-gray-500">Subtotal</span>
                  <strong class="font-md color-brand-3">${{ cart.subtotal.toFixed(2) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-10">
                  <span class="font-sm color-gray-500">Shipping</span>
                  <span class="font-sm color-gray-900">
                    {{ shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}` }}
                  </span>
                </div>
                <div v-if="discount" class="d-flex justify-content-between">
                  <span class="font-sm color-gray-500">Discount</span>
                  <span class="font-sm color-brand-2">−${{ discount.toFixed(2) }}</span>
                </div>
              </div>
              <div class="d-flex justify-content-between mb-20">
                <span class="font-md-bold">Total</span>
                <strong class="font-xl-bold color-brand-3">${{ total.toFixed(2) }}</strong>
              </div>
              <router-link class="btn btn-buy w-100" to="/checkout">Proceed to checkout</router-link>
              <button class="btn btn-border w-100 mt-10" type="button" @click="cart.clear()">
                Clear cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Notify } from 'quasar';
import { ecom } from 'src/helper/ecomAssets';
import { useCartStore } from 'stores/cart-store';

const cart = useCartStore();
const star = ecom('imgs/template/icons/star.svg');

const shipCountry = ref('kh');
const shipState = ref('');
const shipZip = ref('');
const coupon = ref('');
const discount = ref(0);

const shippingFee = computed(() => (cart.subtotal >= 75 ? 0 : 5));
const total = computed(() => Math.max(0, cart.subtotal + shippingFee.value - discount.value));

function onUpdate() {
  Notify.create({ type: 'positive', message: 'Cart updated', position: 'top' });
}

function onCoupon() {
  const code = coupon.value.trim().toUpperCase();
  if (code === 'SAVE10') {
    discount.value = Math.round(cart.subtotal * 0.1 * 100) / 100;
    Notify.create({ type: 'positive', message: 'Coupon SAVE10 applied (−10%)', position: 'top' });
  } else if (!code) {
    Notify.create({ type: 'warning', message: 'Enter a coupon code', position: 'top' });
  } else {
    discount.value = 0;
    Notify.create({ type: 'warning', message: 'Invalid coupon (try SAVE10)', position: 'top' });
  }
}
</script>

<style scoped>
.input-quantity .minus-cart,
.input-quantity .plus-cart {
  cursor: pointer;
}
</style>

