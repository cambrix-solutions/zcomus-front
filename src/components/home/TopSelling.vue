<template>
  <section class="section-box mt-50">
    <div class="container">
      <div class="head-main">
        <div class="row align-items-end">
          <div class="col-lg-8">
            <h3 class="mb-5">Top Selling Products</h3>
            <p class="font-base color-gray-500 mb-0">Special products in this month.</p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <router-link class="btn btn-border btn-sm" to="/shop">View more</router-link>
          </div>
        </div>
      </div>
      <div class="row mt-20">
        <div
          v-for="product in products.slice(0, 6)"
          :key="product.id"
          class="col-lg-4 col-md-6 col-sm-12"
        >
          <ProductCard
            :product="product"
            @add="$emit('add', $event)"
            @open="$emit('open', $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from 'src/data/mock-catalog';
import ProductCard from 'components/store/ProductCard.vue';

defineProps<{ products: Product[] }>();
defineEmits<{ add: [Product]; open: [Product] }>();
</script>
