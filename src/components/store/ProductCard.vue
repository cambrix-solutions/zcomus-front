<template>
  <div class="card-grid-style-3" :class="{ 'hover-show hover-hide-show-cart': flash }">
    <div class="card-grid-inner">
      <div class="tools">
        <a class="btn btn-trend btn-tooltip mb-10" href="#" aria-label="Trend" @click.prevent />
        <a
          class="btn btn-wishlist btn-tooltip mb-10"
          href="#"
          aria-label="Wishlist"
          @click.prevent="onWish"
        />
        <a
          class="btn btn-compare btn-tooltip mb-10"
          href="#"
          aria-label="Compare"
          @click.prevent="onCompare"
        />
        <a
          class="btn btn-quickview btn-tooltip"
          href="#"
          aria-label="Quick view"
          @click.prevent="ui.openQuickview(product)"
        />
      </div>
      <div class="image-box">
        <span v-if="product.badge" class="label bg-brand-2">{{ product.badge }}</span>
        <a href="#" @click.prevent="$emit('open', product)">
          <img :src="product.image" :alt="product.name" />
        </a>
      </div>

      <div v-if="flash" class="box-count">
        <div class="deals-countdown font-sm">
          <span class="countdown-section">
            <span class="countdown-amount font-sm-bold">{{ time.d }}</span>
            <span class="countdown-period font-xs"> day </span>
          </span>
          <span class="countdown-section">
            <span class="countdown-amount font-sm-bold">{{ time.h }}</span>
            <span class="countdown-period font-xs"> hour </span>
          </span>
          <span class="countdown-section">
            <span class="countdown-amount font-sm-bold">{{ time.m }}</span>
            <span class="countdown-period font-xs"> min </span>
          </span>
          <span class="countdown-section">
            <span class="countdown-amount font-sm-bold">{{ time.s }}</span>
            <span class="countdown-period font-xs"> sec </span>
          </span>
        </div>
      </div>

      <div class="info-right">
        <a class="font-xs color-gray-500" href="#" @click.prevent>{{ product.brand }}</a>
        <br />
        <a
          class="color-brand-3 font-sm-bold"
          href="#"
          @click.prevent="$emit('open', product)"
        >
          <template v-if="listTitle">
            <h4 class="color-brand-3">{{ product.name }}</h4>
          </template>
          <template v-else>{{ product.name }}</template>
        </a>
        <div class="rating">
          <img v-for="n in 5" :key="n" :src="star" alt="" />
          <span class="font-xs color-gray-500">(65)</span>
        </div>
        <div class="price-info">
          <strong class="font-lg-bold color-brand-3 price-main">
            ${{ product.price.toFixed(2) }}
          </strong>
          <span v-if="product.compare_at_price" class="color-gray-500 price-line">
            ${{ product.compare_at_price.toFixed(2) }}
          </span>
        </div>

        <div v-if="flash" class="box-progress box-progress-small mt-10">
          <div class="progress-bar">
            <div class="progress-bar-inner" :style="{ width: `${soldPct}%` }" />
          </div>
          <div class="row">
            <div class="col-6">
              <span class="font-xs color-gray-500">Available:</span>
              <span class="font-xs-bold color-gray-900"> {{ available }}</span>
            </div>
            <div class="col-6 text-end">
              <span class="font-xs color-gray-500">Sold:</span>
              <span class="font-xs-bold color-gray-900"> {{ sold }}</span>
            </div>
          </div>
        </div>

        <div class="mt-20" :class="flash ? 'box-add-cart' : 'box-btn-cart'">
          <a class="btn btn-cart" href="#" @click.prevent="$emit('add', product)">Add To Cart</a>
        </div>
        <ul v-if="flash" class="list-features">
          <li>Delivery in Cambodia. Free over $75</li>
        </ul>
        <ul v-else-if="features?.length" class="list-features">
          <li v-for="f in features" :key="f">{{ f }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from 'vue';
import { Notify } from 'quasar';
import type { Product } from 'src/data/mock-catalog';
import { ecom } from 'src/helper/ecomAssets';
import { useWishlistStore } from 'stores/wishlist-store';
import { useCompareStore } from 'stores/compare-store';
import { useUiStore } from 'stores/ui-store';

const props = withDefaults(
  defineProps<{
    product: Product;
    flash?: boolean;
    features?: string[];
    listTitle?: boolean;
  }>(),
  { flash: false, listTitle: false },
);

defineEmits<{ add: [Product]; open: [Product] }>();

const wishlist = useWishlistStore();
const compare = useCompareStore();
const ui = useUiStore();
const star = ecom('imgs/template/icons/star.svg');

const available = computed(() => 120 + (props.product.id * 37) % 400);
const sold = computed(() => 80 + (props.product.id * 53) % 220);
const soldPct = computed(() =>
  Math.min(90, Math.round((sold.value / (sold.value + available.value)) * 100)),
);

const time = reactive({ d: '00', h: '00', m: '00', s: '00' });
let timer: ReturnType<typeof setInterval> | null = null;
const endAt = Date.now() + (2 + (props.product.id % 3)) * 24 * 60 * 60 * 1000;

function tick() {
  const diff = Math.max(0, endAt - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  time.d = String(d).padStart(2, '0');
  time.h = String(h).padStart(2, '0');
  time.m = String(m).padStart(2, '0');
  time.s = String(s).padStart(2, '0');
}

function onWish() {
  const added = wishlist.toggle(props.product);
  Notify.create({
    type: 'positive',
    message: added ? 'Added to wishlist' : 'Removed from wishlist',
    position: 'top',
  });
}

function onCompare() {
  const wasIn = compare.has(props.product.id);
  const ok = compare.toggle(props.product);
  Notify.create({
    type: ok ? 'positive' : 'warning',
    message: !ok
      ? `Compare list is full (max ${compare.MAX})`
      : wasIn
        ? 'Removed from compare'
        : 'Added to compare',
    position: 'top',
  });
}

onMounted(() => {
  if (!props.flash) return;
  tick();
  timer = setInterval(tick, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.deals-countdown {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 8px 4px;
}
.countdown-section {
  background: #0e224d;
  color: #fff;
  border-radius: 4px;
  padding: 4px 6px;
  text-align: center;
  min-width: 48px;
}
.countdown-period {
  display: block;
  opacity: 0.85;
}
.progress-bar {
  height: 6px;
  background: #e8eef3;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}
.progress-bar-inner {
  height: 100%;
  background: #fd9636;
  border-radius: 4px;
}
</style>
