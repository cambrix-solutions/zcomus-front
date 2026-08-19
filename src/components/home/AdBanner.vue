<template>
  <section class="section-box mt-50">
    <div class="container text-center mt-30">
      <router-link to="/shop">
        <img
          :src="ecom('imgs/page/homepage2/banner-ads.png')"
          alt="Ads"
          class="img-fluid"
        />
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ecom } from 'src/helper/ecomAssets';
</script>
