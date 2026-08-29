<template>
  <main class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('shop.title'), to: '/shop' }, { label: t('cart.title') }]" />

    <div v-if="booting" class="z-cart-layout z-fade-item">
      <div class="z-card">
        <div v-for="n in 2" :key="n" class="z-skel-cart-line">
          <div class="z-skel z-skel-cart-line__img" />
          <div class="z-skel-cart-line__body">
            <div class="z-skel z-skel--md" style="width: 70%" />
            <div class="z-skel z-skel--sm" style="width: 40%; margin-top: 8px" />
          </div>
        </div>
      </div>
      <div class="z-card">
        <div class="z-skel z-skel--md" style="width: 50%" />
        <div class="z-skel z-skel--sm" style="width: 100%; margin-top: 14px; height: 80px" />
        <div class="z-skel z-skel--btn" style="margin-top: 16px" />
      </div>
    </div>

    <div v-else-if="!cart.items.length" class="z-empty z-fade-item">
      <h3>{{ t('cart.empty') }}</h3>
      <p>{{ t('cart.emptyHint') }}</p>
      <router-link class="z-btn z-btn-primary" to="/shop">{{ t('cart.continue') }}</router-link>
    </div>

    <div v-else class="z-cart-layout z-fade-item">
      <div class="z-cart-layout__main">
        <!-- Desktop table -->
        <div class="z-table-wrap z-cart-desktop">
          <table class="z-cart-table">
            <thead>
              <tr>
                <th>{{ t('cart.product') }}</th>
                <th>{{ t('cart.price') }}</th>
                <th>{{ t('cart.qty') }}</th>
                <th>{{ t('cart.subtotal') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in cart.items" :key="lineKey(line)">
                <td>
                  <div class="z-cart-product">
                    <router-link :to="`/product/${line.product.slug}`">
                      <img :src="line.product.image" :alt="line.product.name" />
                    </router-link>
                    <div>
                      <router-link class="z-cart-product__name" :to="`/product/${line.product.slug}`">
                        {{ line.product.name }}
                      </router-link>
                      <p v-if="optionsLabel(line)" class="z-muted z-cart-product__opts">{{ optionsLabel(line) }}</p>
                    </div>
                  </div>
                </td>
                <td><PriceDisplay :amount="line.product.price" :alt="false" /></td>
                <td>
                  <div class="z-qty">
                    <button type="button" @click="cart.setQty(line.product.id, Math.max(1, line.qty - 1), line.options)">−</button>
                    <input :value="line.qty" readonly />
                    <button type="button" @click="cart.setQty(line.product.id, line.qty + 1, line.options)">+</button>
                  </div>
                </td>
                <td><PriceDisplay :amount="line.product.price * line.qty" :alt="false" /></td>
                <td>
                  <button class="z-btn z-btn-text" type="button" @click="cart.remove(line.product.id, line.options)">
                    {{ t('cart.remove') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="z-cart-mobile">
          <article v-for="line in cart.items" :key="`m-${lineKey(line)}`" class="z-cart-line">
            <router-link class="z-cart-line__img" :to="`/product/${line.product.slug}`">
              <img :src="line.product.image" :alt="line.product.name" />
            </router-link>
            <div class="z-cart-line__body">
              <router-link class="z-cart-line__name" :to="`/product/${line.product.slug}`">
                {{ line.product.name }}
              </router-link>
              <p v-if="optionsLabel(line)" class="z-muted">{{ optionsLabel(line) }}</p>
              <div class="z-cart-line__price">
                <PriceDisplay :amount="line.product.price" :alt="false" />
              </div>
              <div class="z-cart-line__row">
                <div class="z-qty">
                  <button type="button" @click="cart.setQty(line.product.id, Math.max(1, line.qty - 1), line.options)">−</button>
                  <input :value="line.qty" readonly />
                  <button type="button" @click="cart.setQty(line.product.id, line.qty + 1, line.options)">+</button>
                </div>
                <PriceDisplay :amount="line.product.price * line.qty" :alt="false" />
              </div>
              <button class="z-btn z-btn-text z-cart-line__remove" type="button" @click="cart.remove(line.product.id, line.options)">
                {{ t('cart.remove') }}
              </button>
            </div>
          </article>
        </div>

        <div class="z-cart-actions">
          <router-link class="z-btn z-btn-ghost" to="/shop">{{ t('cart.continue') }}</router-link>
          <button class="z-btn z-btn-ghost" type="button" @click="cart.clear()">{{ t('cart.clear') }}</button>
        </div>

        <div class="z-cart-utils">
          <div class="z-card z-cart-coupon">
            <h4>{{ t('cart.coupon') }}</h4>
            <p class="z-muted">{{ t('cart.couponHint') }}</p>
            <div class="z-cart-utils__row">
              <input v-model="coupon" class="z-input" placeholder="SAVE10" />
              <button class="z-btn z-btn-primary" type="button" @click="onCoupon">{{ t('cart.apply') }}</button>
            </div>
          </div>
        </div>
      </div>

      <aside class="z-card z-order-summary">
        <h3>{{ t('cart.totals') }}</h3>
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
        <router-link class="z-btn z-btn-deal z-btn-block" to="/checkout">{{ t('cart.checkout') }}</router-link>
      </aside>
    </div>

    <TrustStrip />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import PriceDisplay from 'components/store/PriceDisplay.vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import { useCartStore, type CartLine } from 'stores/cart-store';

const { t } = useI18n();
const cart = useCartStore();
const booting = ref(true);
const coupon = ref('');
const discount = ref(0);
const shippingFee = computed(() => (cart.subtotal >= 75 ? 0 : 5));
const total = computed(() => Math.max(0, cart.subtotal + shippingFee.value - discount.value));

function lineKey(line: CartLine) {
  const o = line.options || {};
  return `${line.product.id}-${o.color || ''}-${o.style || ''}-${o.size || ''}`;
}

function optionsLabel(line: CartLine) {
  const parts = [
    line.options?.color,
    line.options?.style,
    line.options?.size,
  ].filter(Boolean);
  return parts.join(' · ');
}

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 300));
  booting.value = false;
});

function onCoupon() {
  const code = coupon.value.trim().toUpperCase();
  if (code === 'SAVE10') {
    discount.value = Math.round(cart.subtotal * 0.1 * 100) / 100;
    Notify.create({ type: 'positive', message: 'SAVE10 applied', position: 'top' });
  } else {
    discount.value = 0;
    Notify.create({ type: 'warning', message: 'Use SAVE10', position: 'top' });
  }
}
</script>
