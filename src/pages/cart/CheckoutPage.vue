<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><router-link class="font-xs color-gray-500" to="/shop">Shop</router-link></li>
            <li><router-link class="font-xs color-gray-500" to="/cart">Cart</router-link></li>
            <li><span class="font-xs color-gray-500">Checkout</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template mb-50">
      <div class="container">
        <div v-if="!cart.items.length" class="text-center py-50">
          <h3 class="mb-15">Nothing to checkout</h3>
          <router-link class="btn btn-buy" to="/shop">Browse products</router-link>
        </div>

        <form v-else class="row" @submit.prevent="onSubmit">
          <div class="col-lg-6 mb-30">
            <div class="box-border">
              <div class="box-payment mb-20">
                <a class="btn btn-gpay" href="#" @click.prevent>
                  <img :src="gpay" alt="GPay" />
                </a>
                <a class="btn btn-paypal" href="#" @click.prevent>
                  <img :src="paypal" alt="PayPal" />
                </a>
                <a class="btn btn-amazon" href="#" @click.prevent>
                  <img :src="amazon" alt="Amazon" />
                </a>
              </div>
              <div class="border-bottom-4 text-center mb-20">
                <div class="text-or font-md color-gray-500">Or</div>
              </div>

              <div class="row">
                <div class="col-lg-6 col-sm-6 mb-20">
                  <h5 class="font-md-bold color-brand-3 text-sm-start text-center">
                    Contact information
                  </h5>
                </div>
                <div class="col-lg-6 col-sm-6 mb-20 text-sm-end text-center">
                  <span class="font-sm color-brand-3">Already have an account?</span>
                  <router-link class="font-sm color-brand-1" to="/login"> Login</router-link>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      v-model="form.email"
                      class="form-control font-sm"
                      type="email"
                      placeholder="Email*"
                      required
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <label class="font-sm color-brand-3" for="checkboxOffers">
                      <input
                        id="checkboxOffers"
                        v-model="form.offers"
                        class="checkboxOffer"
                        type="checkbox"
                      />
                      Keep me up to date on news and exclusive offers
                    </label>
                  </div>
                </div>

                <div class="col-lg-12">
                  <h5 class="font-md-bold color-brand-3 mt-15 mb-20">Shipping address</h5>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <input
                      v-model="form.firstName"
                      class="form-control font-sm"
                      type="text"
                      placeholder="First name*"
                      required
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <input
                      v-model="form.lastName"
                      class="form-control font-sm"
                      type="text"
                      placeholder="Last name*"
                      required
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      v-model="form.address1"
                      class="form-control font-sm"
                      type="text"
                      placeholder="Address 1*"
                      required
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      v-model="form.address2"
                      class="form-control font-sm"
                      type="text"
                      placeholder="Address 2"
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <select v-model="form.country" class="form-control font-sm select-style1 color-gray-700" required>
                      <option value="kh">Cambodia</option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <input
                      v-model="form.city"
                      class="form-control font-sm"
                      type="text"
                      placeholder="Province / City*"
                      required
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      v-model="form.zip"
                      class="form-control font-sm"
                      type="text"
                      placeholder="PostCode / ZIP*"
                      required
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <input
                      v-model="form.company"
                      class="form-control font-sm"
                      type="text"
                      placeholder="Company name"
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <input
                      v-model="form.phone"
                      class="form-control font-sm"
                      type="text"
                      placeholder="Phone*"
                      required
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group mb-0">
                    <textarea
                      v-model="form.notes"
                      class="form-control font-sm"
                      placeholder="Additional Information"
                      rows="5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-20">
              <div class="col-lg-6 col-5 mb-20">
                <router-link class="btn font-sm-bold color-brand-1 arrow-back-1" to="/cart">
                  Return to Cart
                </router-link>
              </div>
              <div class="col-lg-6 col-7 mb-20 text-end">
                <button class="btn btn-buy w-auto arrow-next" type="submit">
                  Place an Order
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-6 mb-30">
            <div class="box-border">
              <h5 class="font-md-bold mb-20">Your Order</h5>
              <div class="listCheckout">
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
                  <div class="wishlist-status">
                    <h5 class="color-gray-500">x{{ line.qty }}</h5>
                  </div>
                  <div class="wishlist-price">
                    <h4 class="color-brand-3 font-lg-bold">
                      ${{ (line.product.price * line.qty).toFixed(2) }}
                    </h4>
                  </div>
                </div>
              </div>

              <div class="form-group mt-20 mb-15">
                <div class="d-flex gap-2">
                  <input
                    v-model="coupon"
                    class="form-control font-sm"
                    placeholder="Discount code"
                  />
                  <button class="btn btn-buy w-auto" type="button" @click="onCoupon">
                    Apply
                  </button>
                </div>
              </div>

              <div class="border-top border-bottom py-15 my-15">
                <div class="d-flex justify-content-between mb-10">
                  <span class="font-sm color-gray-500">Subtotal</span>
                  <strong class="font-md color-brand-3">${{ cart.subtotal.toFixed(2) }}</strong>
                </div>
                <div class="d-flex justify-content-between mb-10">
                  <span class="font-sm color-gray-500">Shipping</span>
                  <strong class="font-md">
                    {{ shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}` }}
                  </strong>
                </div>
                <div v-if="discount" class="d-flex justify-content-between">
                  <span class="font-sm color-gray-500">Discount</span>
                  <strong class="font-md color-brand-2">−${{ discount.toFixed(2) }}</strong>
                </div>
              </div>

              <div class="d-flex justify-content-between mb-20">
                <span class="font-md-bold color-brand-3">Total</span>
                <strong class="font-xl-bold color-brand-3">${{ total.toFixed(2) }}</strong>
              </div>

              <h5 class="font-md-bold mb-15">Payment</h5>
              <label class="d-block mb-10 font-sm color-gray-900">
                <input v-model="form.payment" type="radio" value="cod" class="me-2" />
                Cash on delivery
              </label>
              <label class="d-block mb-10 font-sm color-gray-900">
                <input v-model="form.payment" type="radio" value="card" class="me-2" />
                Credit / Debit card (demo)
              </label>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { ecom } from 'src/helper/ecomAssets';
import { useAuthStore } from 'stores/auth-store';
import { useCartStore } from 'stores/cart-store';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const star = ecom('imgs/template/icons/star.svg');
const gpay = ecom('imgs/page/checkout/gpay.svg');
const paypal = ecom('imgs/page/checkout/paypal.svg');
const amazon = ecom('imgs/page/checkout/amazon.svg');

const nameParts = (auth.user?.name ?? '').split(' ');
const form = reactive({
  email: auth.user?.email ?? '',
  offers: true,
  firstName: nameParts[0] ?? '',
  lastName: nameParts.slice(1).join(' '),
  address1: '',
  address2: '',
  country: 'kh',
  city: '',
  zip: '',
  company: '',
  phone: '',
  notes: '',
  payment: 'cod',
});

const coupon = ref('');
const discount = ref(0);

const shippingFee = computed(() => (cart.subtotal >= 75 ? 0 : 5));
const total = computed(() => Math.max(0, cart.subtotal + shippingFee.value - discount.value));

function onCoupon() {
  const code = coupon.value.trim().toUpperCase();
  if (code === 'SAVE10') {
    discount.value = Math.round(cart.subtotal * 0.1 * 100) / 100;
    Notify.create({ type: 'positive', message: 'Coupon applied (−10%)', position: 'top' });
  } else {
    discount.value = 0;
    Notify.create({ type: 'warning', message: 'Invalid coupon (try SAVE10)', position: 'top' });
  }
}

function onSubmit() {
  Notify.create({
    type: 'positive',
    message: `Order placed (demo) · ${form.payment.toUpperCase()} · $${total.value.toFixed(2)}`,
    position: 'top',
  });
  cart.clear();
  void router.push('/account');
}
</script>
