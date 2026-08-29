<template>
  <div class="z-skel-row" :class="`z-skel-row--${variant}`" aria-busy="true" aria-live="polite">
    <template v-if="variant === 'product'">
      <SkeletonProductCard v-for="n in count" :key="n" />
    </template>
    <template v-else-if="variant === 'category'">
      <div v-for="n in count" :key="n" class="z-skel-cat">
        <div class="z-skel z-skel-cat__media" />
        <div class="z-skel-cat__body">
          <div class="z-skel z-skel--md" style="width: 70%; margin: 0 auto" />
          <div class="z-skel z-skel--sm" style="width: 40%; margin: 8px auto 0" />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-for="n in count" :key="n" class="z-skel-vendor">
        <div class="z-skel z-skel-vendor__cover" />
        <div class="z-skel z-skel-vendor__logo" />
        <div class="z-skel-vendor__body">
          <div class="z-skel z-skel--md" style="width: 60%; margin: 0 auto" />
          <div class="z-skel z-skel--sm" style="width: 80%; margin: 8px auto 0" />
          <div class="z-skel z-skel--pill" style="margin: 12px auto 0" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import SkeletonProductCard from 'components/store/SkeletonProductCard.vue';

withDefaults(
  defineProps<{
    variant?: 'product' | 'category' | 'vendor';
    count?: number;
  }>(),
  { variant: 'product', count: 6 },
);
</script>
