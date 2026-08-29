<template>
  <section ref="root" class="z-container z-section z-reveal" :class="{ 'is-in': visible }">
    <div class="z-section-head">
      <div>
        <h2>{{ t('home.categories') }}</h2>
        <p class="z-muted">{{ t('home.vendorsSub') }}</p>
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
        <router-link class="z-btn z-btn-ghost z-btn-sm" to="/shop">{{ t('home.viewAll') }}</router-link>
      </div>
    </div>

    <SkeletonRow v-if="loading" variant="category" :count="7" />
    <div v-else class="z-slideshow">
      <div ref="scroller" class="z-slideshow__track z-cats-track" @scroll="onScroll">
        <router-link
          v-for="(cat, i) in categories.slice(0, 10)"
          :key="cat.id"
          class="z-cat-tile z-fade-item"
          :style="{ '--i': i }"
          :to="{ path: '/shop', query: { category: cat.slug } }"
        >
          <span class="z-cat-tile__media">
            <img :src="cat.image" :alt="cat.name" />
          </span>
          <span class="z-cat-tile__body">
            <strong>{{ cat.name }}</strong>
            <small>{{ cat.products_count ?? 0 }} {{ t('home.items') }}</small>
          </span>
        </router-link>
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
import type { Category } from 'src/data/mock-catalog';
import SkeletonRow from 'components/store/SkeletonRow.vue';
import { useReveal } from 'src/composables/useReveal';

withDefaults(
  defineProps<{ categories: Category[]; loading?: boolean }>(),
  { loading: false },
);
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
  activeDot.value = Math.min(pageCount.value - 1, Math.max(0, Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))));
}

function slide(dir: number) {
  const el = scroller.value;
  if (!el) return;
  el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
}

function goDot(index: number) {
  const el = scroller.value;
  if (!el) return;
  el.scrollTo({ left: index * el.clientWidth * 0.85, behavior: 'smooth' });
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
