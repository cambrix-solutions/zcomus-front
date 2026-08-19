<template>
  <section class="section-box bg-gray-50 pt-50 pb-50 mt-50">
    <div class="container">
      <div class="head-main bd-gray-200">
        <div class="row align-items-end">
          <div class="col-xl-7 col-lg-6">
            <h3 class="mb-5">Top Brands</h3>
            <p class="font-base color-gray-500 mb-0">Special products in this month.</p>
          </div>
          <div class="col-xl-5 col-lg-6">
            <ul class="nav nav-tabs text-uppercase justify-content-lg-end" role="tablist">
              <li v-for="tab in tabs" :key="tab">
                <a
                  href="#"
                  :class="{ active: active === tab }"
                  @click.prevent="active = tab"
                >
                  {{ tab }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row mt-20">
        <div
          v-for="brand in filtered"
          :key="brand.name"
          class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-20"
        >
          <div class="card-grid-style-4">
            <div class="card-grid-inner">
              <div class="image-box">
                <router-link :to="`/vendors/${brand.slug}`">
                  <img :src="brand.cover" :alt="brand.name" />
                </router-link>
              </div>
              <div class="info-right">
                <router-link :to="`/vendors/${brand.slug}`">
                  <img :src="brand.logo" :alt="brand.name" style="max-height: 22px" />
                </router-link>
                <p class="font-xs color-brand-3">{{ brand.desc }}</p>
                <div class="divide mb-5" />
                <div class="font-lg-bold color-brand-3">{{ brand.offer }}</div>
                <div class="box-link">
                  <router-link
                    class="btn btn-link-brand-2 btn-arrow-brand-2 btn-arrow-small text-lowercase pt-0 pb-0"
                    :to="{ path: '/shop', query: { q: brand.name } }"
                  >
                    Shop Now
                  </router-link>
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
import { computed, ref } from 'vue';
import { ecom } from 'src/helper/ecomAssets';

defineProps<{ brands?: string[] }>();

const tabs = ['All', 'Digitals', 'Furniture', 'Fashion'];
const active = ref('All');

const brandCards = [
  {
    name: 'Microsoft',
    slug: 'microsoft',
    cover: ecom('imgs/page/homepage2/img-microsoft.png'),
    logo: ecom('imgs/page/homepage2/microsoft.svg'),
    desc: 'PC, Laptop, Smart Watch, Gaming Gear ...',
    offer: 'Up to 25% off',
    tab: 'Digitals',
  },
  {
    name: 'Nokia',
    slug: 'nokia',
    cover: ecom('imgs/page/homepage2/img-nokia.png'),
    logo: ecom('imgs/page/homepage2/nokia.svg'),
    desc: 'PC, Laptop, Smart Watch, Gaming Gear ...',
    offer: 'Up to 30% off',
    tab: 'Digitals',
  },
  {
    name: 'Panasonic',
    slug: 'panasonic',
    cover: ecom('imgs/page/homepage2/img-panasonic.png'),
    logo: ecom('imgs/page/homepage2/panasonic.svg'),
    desc: 'PC, Laptop, Smart Watch, Gaming Gear ...',
    offer: 'Up to 55% off',
    tab: 'Furniture',
  },
  {
    name: 'Casio',
    slug: 'casio',
    cover: ecom('imgs/page/homepage2/img-casio.png'),
    logo: ecom('imgs/page/homepage2/casio.svg'),
    desc: 'Watches, Audio, Accessories ...',
    offer: 'Up to 40% off',
    tab: 'Fashion',
  },
  {
    name: 'Acer',
    slug: 'acer',
    cover: ecom('imgs/page/homepage2/img-acer.png'),
    logo: ecom('imgs/page/homepage2/acer.svg'),
    desc: 'PC, Laptop, Monitors ...',
    offer: 'Up to 35% off',
    tab: 'Digitals',
  },
  {
    name: 'Philip',
    slug: 'philip',
    cover: ecom('imgs/page/homepage2/img-philip.png'),
    logo: ecom('imgs/slider/logo/panasonic.svg'),
    desc: 'Home electronics & lifestyle',
    offer: 'Up to 20% off',
    tab: 'Furniture',
  },
];

const filtered = computed(() => {
  if (active.value === 'All') return brandCards.slice(0, 4);
  const list = brandCards.filter((b) => b.tab === active.value);
  return list.length ? list : brandCards.slice(0, 4);
});
</script>
