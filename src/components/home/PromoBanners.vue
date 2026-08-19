<template>
  <section class="section-box pt-50">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 mb-20">
          <div
            class="bg-4 box-bdrd-4 p-4 h-100"
            :style="bg(ecom('imgs/page/homepage2/headphone.png'))"
          >
            <span class="font-md color-brand-3">Headphone</span>
            <h4 class="font-32 color-gray-1000 mb-10 mt-5">Rockez 547</h4>
            <p class="color-brand-1 font-sm">
              MUSIC EVERYWHERE<br class="d-none d-lg-block" />ANYTIME
            </p>
            <div class="mt-35">
              <router-link class="btn btn-brand-2 btn-arrow-right" to="/shop">Shop Now</router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-5 col-md-6 col-sm-6 mb-20">
          <div
            class="bg-6 box-bdrd-4 text-center p-4 h-100 d-flex flex-column justify-content-center"
            :style="bg(ecom('imgs/page/homepage2/clock.png'), 'center bottom')"
          >
            <h4 class="font-33 color-gray-1000">LIMITED WEEKLY DEAL</h4>
            <p class="font-18 mb-0">
              Last call for up to
              <strong class="font-24 color-brand-2">$252.00</strong> OFF
            </p>
            <div class="mt-20">
              <router-link class="btn btn-brand-2" to="/shop">Shop Now</router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 mb-20">
          <div
            class="bg-2 box-bdrd-4 p-4 h-100"
            :style="bg(ecom('imgs/page/homepage2/bg-xiaomi.svg'), 'right bottom')"
          >
            <span class="font-md color-brand-3">Xiaomi</span>
            <h4 class="color-gray-1000 mb-10 mt-5">Smart Home Bundle</h4>
            <p class="font-sm color-gray-500 mb-20">Sensors, hubs &amp; lighting packs</p>
            <router-link class="btn btn-brand-2" to="/shop">Explore</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ecom } from 'src/helper/ecomAssets';

function bg(url: string, position = 'right bottom') {
  return {
    minHeight: '220px',
    backgroundImage: `url(${url})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: position,
    backgroundSize: 'contain',
  };
}
</script>
