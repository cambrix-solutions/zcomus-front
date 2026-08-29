<template>
  <div class="z-pdp-meta">
    <span class="z-pdp-meta__brand">{{ product.brand }}</span>
    <div class="z-stars">★★★★★ <span>(65)</span></div>
    <router-link class="z-pdp-meta__vendor" :to="`/vendors/${slug}`">
      Sold by {{ vendorLabel }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from 'src/data/mock-catalog';

const props = defineProps<{ product: Product; vendorSlug?: string }>();

const slug = computed(() => props.vendorSlug || props.product.vendor_slug || 'fasfox');
const vendorLabel = computed(() => props.product.vendor_name || props.product.brand);
</script>
