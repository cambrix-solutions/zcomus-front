<template>
  <section ref="root" class="z-container z-section z-reveal" :class="{ 'is-in': visible }">
    <div class="z-section-head z-section-head--gold">
      <div>
        <span class="z-section-tag z-section-tag--gold">{{ t('home.local') }}</span>
        <h2>{{ t('home.vendors') }}</h2>
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
        <router-link class="z-btn z-btn-deal z-btn-sm" to="/vendors">{{ t('home.viewAll') }}</router-link>
      </div>
    </div>

    <SkeletonRow v-if="loading" variant="vendor" :count="4" />
    <div v-else class="z-slideshow">
      <div ref="scroller" class="z-slideshow__track z-vendor-track" @scroll="onScroll">
        <router-link
          v-for="(v, i) in vendors.slice(0, 8)"
          :key="v.slug"
          class="z-vendor-card z-vendor-card--home z-fade-item"
          :style="{ '--i': i }"
          :to="`/vendors/${v.slug}`"
        >
          <div class="z-vendor-card__cover">
            <div class="z-vendor-card__cover-media">
              <img class="cover" :src="v.cover" :alt="v.name" />
            </div>
            <img class="logo" :src="v.logo" :alt="`${v.name} logo`" />
          </div>
          <div class="z-vendor-card__body">
            <h3>{{ v.name }}</h3>
            <p class="z-muted">{{ shortAddress(v.address) }}</p>
            <span class="z-vendor-card__pill">{{ v.products }} {{ t('home.items') }}</span>
          </div>
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
import { mockVendors } from 'src/data/mock-vendors';
import SkeletonRow from 'components/store/SkeletonRow.vue';
import { useReveal } from 'src/composables/useReveal';

withDefaults(defineProps<{ loading?: boolean }>(), { loading: false });

const { t } = useI18n();
const vendors = mockVendors;

const root = ref<HTMLElement | null>(null);
const { visible } = useReveal(root);

const scroller = ref<HTMLElement | null>(null);
const canPrev = ref(false);
const canNext = ref(true);
const activeDot = ref(0);
const pageCount = ref(1);
const dotCount = computed(() => Math.max(1, pageCount.value));

function shortAddress(address: string) {
  const parts = address.split(',');
  return parts.slice(-2).join(',').trim() || address;
}

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
