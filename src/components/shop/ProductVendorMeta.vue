<template>
  <div>
    <span class="bytext color-gray-500 font-xs font-medium">by</span>
    <router-link
      class="byAUthor color-gray-900 font-xs font-medium"
      :to="`/vendors/${vendorSlug}`"
    >
      {{ product.brand }}
    </router-link>
    <div class="rating mt-5">
      <img v-for="n in 5" :key="n" :src="star" alt="" />
      <span class="font-xs color-gray-500 font-medium"> (65 reviews)</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from 'src/data/mock-catalog';
import { ecom } from 'src/helper/ecomAssets';

defineProps<{ product: Product; vendorSlug?: string }>();

const star = ecom('imgs/template/icons/star.svg');
</script>
