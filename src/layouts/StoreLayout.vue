<template>
  <div class="z-store">
    <StoreHeader />
    <main class="z-main">
      <router-view />
    </main>
    <StoreFooter />
    <QuickviewModal />
    <button
      v-show="showTop"
      class="z-back-top"
      type="button"
      aria-label="Back to top"
      @click="toTop"
    >
      <i class="material-icons">arrow_upward</i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import StoreHeader from 'components/store/StoreHeader.vue';
import StoreFooter from 'components/store/StoreFooter.vue';
import QuickviewModal from 'components/store/QuickviewModal.vue';

const showTop = ref(false);

function onScroll() {
  showTop.value = window.scrollY > 480;
}

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>
