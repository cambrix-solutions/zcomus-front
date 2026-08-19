<template>
  <section class="section-box mt-50">
    <div class="container">
      <div class="row">
        <div
          v-for="col in columns"
          :key="col.title"
          class="col-lg-3 col-md-6 col-sm-12 mb-30"
        >
          <div class="box-slider-item">
            <div class="head">
              <h5>{{ col.title }}</h5>
            </div>
            <div class="content-slider">
              <div
                v-for="product in col.products"
                :key="product.id"
                class="card-grid-style-2 card-grid-none-border hover-up mb-20"
                style="cursor: pointer"
                @click="$emit('open', product)"
              >
                <div class="image-box">
                  <span v-if="product.badge" class="label bg-brand-2">{{ product.badge }}</span>
                  <img :src="product.image" :alt="product.name" />
                </div>
                <div class="info-right">
                  <span class="font-xs color-gray-500">{{ product.brand }}</span>
                  <br />
                  <a class="color-brand-3 font-xs-bold" href="#" @click.prevent>
                    {{ product.name }}
                  </a>
                  <div class="rating mt-5">
                    <img
                      v-for="n in 5"
                      :key="n"
                      :src="ecom('imgs/template/icons/star.svg')"
                      alt=""
                    />
                  </div>
                  <div class="price-info">
                    <strong class="font-lg-bold color-brand-3 price-main">
                      ${{ product.price.toFixed(2) }}
                    </strong>
                    <span
                      v-if="product.compare_at_price"
                      class="color-gray-500 price-line"
                    >
                      ${{ product.compare_at_price.toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from 'src/data/mock-catalog';
import { ecom } from 'src/helper/ecomAssets';

defineProps<{
  columns: { title: string; products: Product[] }[];
}>();
defineEmits<{ open: [Product] }>();
</script>
