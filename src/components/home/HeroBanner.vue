<template>
  <section class="z-container z-hero-banners">
    <router-link class="z-hero-banners__main" to="/shop">
      <img src="/imgs/banners/hero-1.png" :alt="t('home.title')" />
      <div class="z-hero-banners__overlay">
        <span class="z-hero-banners__tag">{{ t('home.kicker') }}</span>
        <h2>{{ t('home.title') }}</h2>
        <p>{{ t('home.subtitle') }}</p>
        <span class="z-btn z-btn-deal">{{ t('home.shopNow') }}</span>
      </div>
    </router-link>
    <div class="z-hero-banners__side">
      <router-link class="z-hero-banners__side-card" to="/shop?tab=flash">
        <img src="/imgs/banners/side-1.png" :alt="t('home.flash')" />
        <div class="z-hero-banners__overlay z-hero-banners__overlay--sm">
          <span class="z-hero-banners__tag z-hero-banners__tag--deal">{{ t('home.flash') }}</span>
          <h3>{{ t('home.promoDealTitle') }}</h3>
          <p>{{ t('home.flashSub') }}</p>
        </div>
      </router-link>
      <router-link class="z-hero-banners__side-card" to="/shop">
        <img src="/imgs/banners/side-2.png" :alt="t('home.promoNewTitle')" />
        <div class="z-hero-banners__overlay z-hero-banners__overlay--sm">
          <span class="z-hero-banners__tag z-hero-banners__tag--gold">{{ t('home.promoNew') }}</span>
          <h3>{{ t('home.promoNewTitle') }}</h3>
          <p>{{ t('home.promoNewSub') }}</p>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
