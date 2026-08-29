<template>
  <section
    ref="root"
    class="z-container z-section z-reveal"
    :class="[
      { 'z-deal-section': flash, 'z-section--muted': muted, 'is-in': visible },
    ]"
  >
    <div class="z-section-head" :class="{ 'z-section-head--deal': flash }">
      <div>
        <span v-if="flash" class="z-section-tag">{{ t('home.limited') }}</span>
        <h2>{{ title }}</h2>
        <p class="z-muted">{{ subtitle }}</p>
      </div>
      <div class="z-section-head__actions">
        <div class="z-scroll-nav">
          <button type="button" :disabled="loading || !canPrev" aria-label="Previous" @click="slide(-1)">
            <i class="material-icons">chevron_left</i>
          </button>
          <button type="button" :disabled="loading || !canNext" aria-label="Next" @click="slide(1)">
            <i class="material-icons">chevron_right</i>
          </button>
        </div>
        <router-link
          class="z-btn z-btn-sm"
          :class="flash ? 'z-btn-deal' : 'z-btn-ghost'"
          :to="viewAll"
        >
          {{ t('home.viewAll') }}
        </router-link>
      </div>
    </div>

    <SkeletonRow v-if="loading" variant="product" :count="6" />
    <div v-else-if="!products.length" class="z-muted">—</div>
    <div v-else class="z-slideshow">
      <div ref="scroller" class="z-slideshow__track z-scroll-products" @scroll="onScroll">
        <ProductCard
          v-for="(product, i) in products.slice(0, 10)"
          :key="product.id"
          class="z-fade-item"
          :style="{ '--i': i }"
          :product="product"
          :flash="flash"
          :deal="flash"
          @add="$emit('add', $event)"
          @open="$emit('open', $event)"
          @quickview="$emit('quickview', $event)"
        />
      </div>
      <div class="z-slideshow__dots" aria-hidden="true">
        <button
          v-for="n in dotCount"
          :key="n"
          type="button"
          :class="{ 'is-active': activeDot === n - 1 }"
          @click="goDot(n - 1)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Product } from 'src/data/mock-catalog';
import ProductCard from 'components/store/ProductCard.vue';
import SkeletonRow from 'components/store/SkeletonRow.vue';
import { useReveal } from 'src/composables/useReveal';

withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    products: Product[];
    tabs?: string[];
    flash?: boolean;
    muted?: boolean;
    viewAll?: string;
    loading?: boolean;
  }>(),
  { subtitle: '', flash: false, muted: false, viewAll: '/shop', loading: false },
);

defineEmits<{ add: [Product]; open: [Product]; quickview: [Product] }>();
const { t } = useI18n();

const root = ref<HTMLElement | null>(null);
const { visible } = useReveal(root);

const scroller = ref<HTMLElement | null>(null);
const canPrev = ref(false);
const canNext = ref(true);
const activeDot = ref(0);
const pageCount = ref(1);
const dotCount = computed(() => Math.max(1, pageCount.value));

function measure() {
  const el = scroller.value;
  if (!el) return;
  pageCount.value = Math.max(1, Math.ceil(el.scrollWidth / Math.max(el.clientWidth, 1)));
  onScroll();
}

function onScroll() {
  const el = scroller.value;
  if (!el) return;
  canPrev.value = el.scrollLeft > 8;
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 8;
  activeDot.value = Math.min(
    pageCount.value - 1,
    Math.max(0, Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))),
  );
}

function slide(dir: number) {
  const el = scroller.value;
  if (!el) return;
  el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.8), behavior: 'smooth' });
}

function goDot(index: number) {
  const el = scroller.value;
  if (!el) return;
  el.scrollTo({ left: index * Math.max(260, el.clientWidth * 0.8), behavior: 'smooth' });
}

onMounted(async () => {
  await nextTick();
  measure();
  window.addEventListener('resize', measure);
});

onUnmounted(() => {
  window.removeEventListener('resize', measure);
});
</script>
