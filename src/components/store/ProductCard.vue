<template>
  <article class="z-pcard" :class="{ 'is-list': listTitle, 'is-deal': deal || flash, 'is-flash': flash }">
    <div class="z-pcard__media">
      <span v-if="off" class="z-badge z-pcard__badge">−{{ off }}%</span>
      <button
        class="z-pcard__wish"
        :class="{ 'is-on': wishlist.has(product.id), 'is-pop': wishPop }"
        type="button"
        :aria-label="t('product.wishlist')"
        @click="onWish"
      >
        <i class="material-icons">{{ wishlist.has(product.id) ? 'favorite' : 'favorite_border' }}</i>
      </button>
      <a href="#" @click.prevent="$emit('open', product)">
        <img :src="product.image" :alt="product.name" />
      </a>
      <div v-if="flash" class="z-pcard__countdown" aria-hidden="true">
        {{ time.d }}d {{ time.h }}h {{ time.m }}m {{ time.s }}s
      </div>
      <button class="z-pcard__quick" type="button" @click.stop="$emit('quickview', product)">
        {{ t('product.quickView') }}
      </button>
    </div>
    <div class="z-pcard__body">
      <span class="z-pcard__vendor">{{ product.brand }}</span>
      <a class="z-pcard__name" href="#" @click.prevent="$emit('open', product)">{{ product.name }}</a>
      <div v-if="!flash" class="z-stars">★★★★★ <span>(65)</span></div>
      <PriceDisplay :amount="product.price" :compare-at="product.compare_at_price" />
      <button
        class="z-btn z-btn-sm z-btn-block"
        :class="deal || flash ? 'z-btn-deal' : 'z-btn-primary'"
        type="button"
        @click="$emit('add', product)"
      >
        {{ t('product.add') }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import type { Product } from 'src/data/mock-catalog';
import { discountPct } from 'src/helper/money';
import PriceDisplay from 'components/store/PriceDisplay.vue';
import { useWishlistStore } from 'stores/wishlist-store';

const props = withDefaults(
  defineProps<{
    product: Product;
    flash?: boolean;
    deal?: boolean;
    features?: string[];
    listTitle?: boolean;
  }>(),
  { flash: false, deal: false, listTitle: false },
);

defineEmits<{ add: [Product]; open: [Product]; quickview: [Product] }>();

const { t } = useI18n();
const wishlist = useWishlistStore();
const off = computed(() => discountPct(props.product.price, props.product.compare_at_price));
const wishPop = ref(false);

const time = reactive({ d: '00', h: '00', m: '00', s: '00' });
let timer: ReturnType<typeof setInterval> | null = null;
const endAt = Date.now() + (2 + (props.product.id % 3)) * 24 * 60 * 60 * 1000 + (props.product.id % 60) * 60000;

function tick() {
  const diff = Math.max(0, endAt - Date.now());
  time.d = String(Math.floor(diff / 86400000)).padStart(2, '0');
  time.h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  time.m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  time.s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}

function onWish() {
  wishlist.toggle(props.product);
  wishPop.value = true;
  setTimeout(() => {
    wishPop.value = false;
  }, 420);
  Notify.create({ type: 'positive', message: t('product.wishlist'), position: 'top' });
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
