<template>
  <section class="section-box pt-50">
    <div class="container">
      <div class="head-main bd-gray-200">
        <div class="row align-items-end">
          <div class="col-xl-5 col-lg-5">
            <h3 class="mb-5">{{ title }}</h3>
            <p class="font-base color-gray-500 mb-0">{{ subtitle }}</p>
          </div>
          <div class="col-xl-7 col-lg-7">
            <ul class="nav nav-tabs nav-tabs-underline text-uppercase justify-content-lg-end" role="tablist">
              <li v-for="tab in tabs" :key="tab">
                <a
                  href="#"
                  :class="{ active: active === tab }"
                  role="tab"
                  @click.prevent="active = tab"
                >
                  {{ tab }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-20">
        <div v-if="!filtered.length" class="text-center py-40 color-gray-500">
          No products in this tab.
        </div>
        <div v-else class="row">
          <div
            v-for="product in filtered"
            :key="product.id"
            class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
          >
            <ProductCard
              :product="product"
              :flash="flash"
              @add="$emit('add', $event)"
              @open="$emit('open', $event)"
            />
          </div>
        </div>
        <div class="text-center mt-20">
          <router-link class="btn btn-border" to="/shop">View all products</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Product } from 'src/data/mock-catalog';
import ProductCard from 'components/store/ProductCard.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    products: Product[];
    tabs?: string[];
    flash?: boolean;
  }>(),
  {
    subtitle: 'Special products in this month.',
    tabs: () => ['All', 'Best seller', 'Most viewed', 'Top Brands'],
    flash: false,
  },
);

defineEmits<{ add: [Product]; open: [Product] }>();

const active = ref(props.tabs[0] ?? 'All');

const filtered = computed(() => {
  const list = props.products;
  if (active.value === 'Best seller') {
    const best = list.filter((p) => p.is_top_selling);
    return best.length ? best : list.slice(0, 4);
  }
  if (active.value === 'Most viewed') {
    const viewed = list.filter((p) => p.is_trending);
    return viewed.length ? viewed : list.slice(0, 4);
  }
  if (active.value === 'Top Brands') return list.slice(0, 4);
  return list;
});
</script>
