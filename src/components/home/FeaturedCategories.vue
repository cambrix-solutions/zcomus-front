<template>
  <section class="section-box mt-30">
    <div class="container">
      <div class="border-bottom pb-25 head-main">
        <h3>Featured Categories</h3>
        <p class="font-base">Choose your necessary products from this feature categories.</p>
      </div>
      <div class="mt-10">
        <ul class="list-9-col">
          <li v-for="cat in categories.slice(0, 9)" :key="cat.id">
            <div class="box-category hover-up">
              <div class="image">
                <router-link :to="{ path: '/shop', query: { category: cat.slug } }">
                  <img :src="cat.image || placeholder" :alt="cat.name" />
                </router-link>
              </div>
              <div class="text-info">
                <router-link
                  class="font-sm color-gray-900 font-bold"
                  :to="{ path: '/shop', query: { category: cat.slug } }"
                >
                  {{ cat.name }}
                </router-link>
                <p class="font-xs color-gray-500">{{ cat.products_count ?? 0 }} items</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category } from 'src/data/mock-catalog';
import { ecom } from 'src/helper/ecomAssets';

defineProps<{ categories: Category[] }>();

const placeholder = ecom('imgs/page/homepage2/cat-img-1.png');
</script>
