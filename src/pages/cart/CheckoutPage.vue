<template>
  <main class="z-container z-page">
    <StoreCrumbs
      :crumbs="[
        { label: t('shop.title'), to: '/shop' },
        { label: t('cart.title'), to: '/cart' },
        { label: t('cart.checkout') },
      ]"
    />

    <div v-if="booting" class="z-cart-layout z-fade-item">
      <div class="z-card">
        <div class="z-skel z-skel--md" style="width: 45%" />
        <div class="z-skel z-skel--sm" style="width: 100%; height: 120px; margin-top: 14px" />
        <div class="z-skel z-skel--sm" style="width: 100%; height: 80px; margin-top: 12px" />
      </div>
      <div class="z-card">
        <div class="z-skel z-skel--md" style="width: 50%" />
        <div class="z-skel z-skel--btn" style="margin-top: 18px" />
      </div>
    </div>

    <div v-else-if="!cart.items.length" class="z-empty z-fade-item">
      <h3>{{ t('cart.empty') }}</h3>
      <router-link class="z-btn z-btn-primary" to="/shop">{{ t('nav.shop') }}</router-link>
    </div>

    <form v-else class="z-cart-layout z-fade-item" @submit.prevent="onSubmit">
      <div class="z-card">
        <h3 style="margin-bottom: 12px">Shipping in Cambodia</h3>
        <div class="z-pay" style="margin-bottom: 16px">
          <span>KHQR</span>
          <span>ABA</span>
          <span>Wing</span>
          <span>COD</span>
        </div>
        <p class="z-muted" style="margin-bottom: 12px">
          Already have an account?
          <router-link to="/login">{{ t('nav.login') }}</router-link>
        </p>
        <div class="z-field">
          <input v-model="form.email" class="z-input" type="email" placeholder="Email*" required />
        </div>
        <div class="z-grid z-grid-2">
          <input v-model="form.firstName" class="z-input" placeholder="First name*" required />
          <input v-model="form.lastName" class="z-input" placeholder="Last name*" required />
        </div>
        <div class="z-field" style="margin-top: 12px">
          <input v-model="form.address1" class="z-input" placeholder="Street / house no.*" required />
        </div>
        <div class="z-field">
          <input v-model="form.address2" class="z-input" placeholder="Sangkat" />
        </div>
        <div class="z-grid z-grid-2">
          <select v-model="form.country" class="z-select">
            <option value="kh">Cambodia</option>
          </select>
          <input v-model="form.city" class="z-input" placeholder="Khan / City*" required />
        </div>
        <div class="z-grid z-grid-2" style="margin-top: 12px">
          <input v-model="form.zip" class="z-input" placeholder="Postcode" />
          <input v-model="form.phone" class="z-input" placeholder="Phone*" required />
        </div>
        <div class="z-field" style="margin-top: 12px">
          <textarea v-model="form.notes" class="z-textarea" rows="4" placeholder="Notes" />
        </div>
        <div style="display:flex;justify-content:space-between;gap:8px;margin-top:12px">
          <router-link class="z-btn z-btn-ghost" to="/cart">{{ t('cart.title') }}</router-link>
          <button class="z-btn z-btn-deal" type="submit">Place order</button>
        </div>
      </div>

      <aside class="z-card z-order-summary">
        <h3 style="margin-bottom: 12px">Your order</h3>
        <div v-for="line in cart.items" :key="line.product.id" class="z-line-item">
          <img :src="line.product.image" :alt="line.product.name" />
          <div>
            {{ line.product.name }}
            <p class="z-muted">×{{ line.qty }}</p>
          </div>
          <PriceDisplay :amount="line.product.price * line.qty" :alt="false" />
        </div>
        <div class="z-field" style="margin-top: 12px; display:flex; gap:8px">
          <input v-model="coupon" class="z-input" placeholder="SAVE10" />
          <button class="z-btn z-btn-ghost" type="button" @click="onCoupon">{{ t('cart.apply') }}</button>
        </div>
        <div class="z-summary-row">
          <span class="z-muted">{{ t('cart.subtotal') }}</span>
          <PriceDisplay :amount="cart.subtotal" :alt="false" />
        </div>
        <div class="z-summary-row">
          <span class="z-muted">{{ t('cart.shipping') }}</span>
          <span v-if="shippingFee === 0">{{ t('cart.free') }}</span>
          <PriceDisplay v-else :amount="shippingFee" :alt="false" />
        </div>
        <div v-if="discount" class="z-summary-row">
          <span class="z-muted">{{ t('cart.discount') }}</span>
          <PriceDisplay :amount="discount" :alt="false" />
        </div>
        <div class="z-summary-row z-summary-row--total">
          <span>{{ t('cart.total') }}</span>
          <PriceDisplay :amount="total" />
        </div>
        <h4 style="margin: 16px 0 8px">Payment</h4>
        <label class="z-pay-option" :class="{ 'is-active': form.payment === 'cod' }">
          <input v-model="form.payment" type="radio" value="cod" /> Cash on delivery
        </label>
        <label class="z-pay-option" :class="{ 'is-active': form.payment === 'khqr' }">
          <input v-model="form.payment" type="radio" value="khqr" /> KHQR
        </label>
        <label class="z-pay-option" :class="{ 'is-active': form.payment === 'aba' }">
          <input v-model="form.payment" type="radio" value="aba" /> ABA / Wing
        </label>
      </aside>
    </form>

    <TrustStrip />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import PriceDisplay from 'components/store/PriceDisplay.vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import { useAuthStore } from 'stores/auth-store';
import { useCartStore } from 'stores/cart-store';

const { t } = useI18n();
const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const booting = ref(true);
const nameParts = (auth.user?.name ?? '').split(' ');

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 300));
  booting.value = false;
});
const form = reactive({
  email: auth.user?.email ?? '',
  firstName: nameParts[0] ?? '',
  lastName: nameParts.slice(1).join(' '),
  address1: '',
  address2: '',
  country: 'kh',
  city: 'Phnom Penh',
  zip: '',
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
    Notify.create({ type: 'positive', message: 'SAVE10', position: 'top' });
  } else {
    discount.value = 0;
    Notify.create({ type: 'warning', message: 'SAVE10', position: 'top' });
  }
}

function onSubmit() {
  Notify.create({
    type: 'positive',
    message: `Order placed (demo) · ${form.payment.toUpperCase()}`,
    position: 'top',
  });
  cart.clear();
  void router.push('/account');
}
</script>
