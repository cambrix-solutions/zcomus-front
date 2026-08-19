<template>
  <ShopListingPage :vendor-slug="slug" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ShopListingPage from 'pages/shop/ShopListingPage.vue';

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));
</script>
