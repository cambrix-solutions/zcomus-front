<template>
  <section class="section-box">
    <div class="banner-hero banner-1">
      <div class="container">
        <div class="row">
          <div class="col-lg-7">
            <div class="box-swiper position-relative">
              <div
                v-for="(item, i) in slides"
                :key="i"
                v-show="slide === i"
                class="banner-big banner-big-2 bg-15"
                :style="{ backgroundImage: `url(${item.bg})` }"
              >
                <span class="saleoff">{{ item.sale }}</span>
                <span class="font-sm text-uppercase label-green">{{ item.tag }}</span>
                <h2 class="mt-10 color-white">{{ item.sub }}</h2>
                <h1 class="color-white lh-65">{{ item.title }}</h1>
                <div class="row">
                  <div class="col-lg-5 col-md-7 col-sm-12">
                    <ul class="list-disc">
                      <li v-for="f in item.features" :key="f" class="font-sm color-white">
                        {{ f }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="mt-30">
                  <router-link class="btn btn-brand-2 btn-gray-1000" to="/shop">Shop now</router-link>
                  <router-link class="btn btn-link btn-link-white" to="/shop">Learn more</router-link>
                </div>
              </div>
              <div class="hero-dots">
                <button
                  v-for="(_, i) in slides"
                  :key="i"
                  type="button"
                  class="hero-dot"
                  :class="{ active: slide === i }"
                  :aria-label="`Slide ${i + 1}`"
                  @click="go(i)"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                <router-link to="/shop" class="d-block text-decoration-none">
                  <div class="banner-small banner-laptop bg-16 text-center">
                    <span class="color-brand-3 font-md">New Arrivals</span>
                    <h4 class="mb-10 color-gray-1000">Tables Collection</h4>
                  </div>
                </router-link>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                <router-link to="/shop" class="d-block text-decoration-none">
                  <div class="banner-small banner-player bg-17">
                    <h6 class="mb-10 color-gray-1000">Xbox Core Wireless Controller</h6>
                    <p class="color-brand-1 font-sm">Aqua Shift<br />Special Edition</p>
                  </div>
                </router-link>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                <div class="banner-small banner-apple bg-2 text-center">
                  <h4 class="mb-0 color-gray-1000">Apple Days</h4>
                  <span class="color-brand-3 font-md">Hot devices, Latest trending</span>
                  <div class="mt-0">
                    <router-link class="btn btn-link-orange" to="/shop">Shop Now</router-link>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                <router-link to="/shop" class="d-block text-decoration-none">
                  <div class="banner-small banner-samsung bg-4">
                    <span class="color-brand-3 font-md">New Arrivals</span>
                    <h4 class="mb-10 color-gray-1000">
                      Samsung 2022 Led TV
                      <span class="color-brand-3 font-md">Special sale</span>
                    </h4>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ecom } from 'src/helper/ecomAssets';

const slide = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const slides = [
  {
    sale: '-25%',
    tag: 'new arrival',
    sub: 'Fly More Combo',
    title: 'DJI Mavic Air',
    features: ['SmartCapture', '21-Minute Flight Time', 'Advanced Pilot Assistance System'],
    bg: ecom('imgs/page/homepage2/bg-slide.png'),
  },
  {
    sale: '-25%',
    tag: 'Best Sale',
    sub: 'Omos Mobile',
    title: 'KMSZ 14 2022',
    features: ['6.8" WQHD+ Edge Screen.', '5,000mAh (45W Charging)', '8GB RAM | 128GB Storage'],
    bg: ecom('imgs/page/homepage2/bg-slide-2.png'),
  },
  {
    sale: '-25%',
    tag: 'new arrival',
    sub: 'Kitchen equipment',
    title: 'Trending Now',
    features: ['Free Shipping', '24 month support', 'Advanced Assistance System'],
    bg: ecom('imgs/page/homepage2/bg-slide-3.png'),
  },
];

function go(i: number) {
  slide.value = i;
  restart();
}

function restart() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    slide.value = (slide.value + 1) % slides.length;
  }, 5000);
}

onMounted(() => restart());
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.box-swiper {
  min-height: 500px;
}
.hero-dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}
.hero-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  padding: 0;
}
.hero-dot.active {
  background: #fd9636;
}
</style>
