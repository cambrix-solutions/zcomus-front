<template>
  <section class="section-box shop-template mt-60">
    <div class="container">
      <div class="text-center mb-100 mt-50">
        <div class="image-404 mb-40">
          <img
            :src="ecom('imgs/page/account/404.png')"
            alt="404"
            style="max-width: 320px"
            @error="onImgErr"
          />
        </div>
        <h3>404 - Page Not Found</h3>
        <p class="font-md-bold color-gray-600">Looks like this page doesn’t exist</p>
        <div class="mt-20 d-flex justify-content-center gap-2 flex-wrap">
          <router-link class="btn btn-buy w-auto" to="/">Back to Homepage</router-link>
          <router-link class="btn btn-border w-auto" to="/shop">Browse shop</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ecom } from 'src/helper/ecomAssets';

function onImgErr(e: Event) {
  const el = e.target as HTMLImageElement;
  el.style.display = 'none';
}
</script>
