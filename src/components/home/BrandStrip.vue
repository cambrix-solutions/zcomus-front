<template>
  <div class="section-box">
    <div class="container">
      <div class="list-brands list-none-border">
        <div class="row align-items-center justify-content-between">
          <div
            v-for="brand in displayBrands"
            :key="brand.name"
            class="col text-center py-3"
          >
            <router-link to="/shop">
              <img :src="brand.img" :alt="brand.name" style="max-height: 28px; opacity: 0.85" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ecom } from 'src/helper/ecomAssets';

const props = defineProps<{ brands?: { name: string; img: string }[] }>();

const defaults = [
  { name: 'Microsoft', img: ecom('imgs/slider/logo/microsoft.svg') },
  { name: 'Sony', img: ecom('imgs/slider/logo/sony.svg') },
  { name: 'Acer', img: ecom('imgs/slider/logo/acer.svg') },
  { name: 'Nokia', img: ecom('imgs/slider/logo/nokia.svg') },
  { name: 'Asus', img: ecom('imgs/slider/logo/assus.svg') },
  { name: 'Casio', img: ecom('imgs/slider/logo/casio.svg') },
  { name: 'Dell', img: ecom('imgs/slider/logo/dell.svg') },
  { name: 'Panasonic', img: ecom('imgs/slider/logo/panasonic.svg') },
];

const displayBrands = computed(() => props.brands ?? defaults);
</script>
