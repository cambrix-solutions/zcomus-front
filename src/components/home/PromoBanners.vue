<template>
  <section class="z-container z-section">
    <div class="z-promo-grid">
      <router-link class="z-promo z-promo--deal" to="/shop?tab=flash">
        <span class="z-promo__tag">{{ t('home.promoDeal') }}</span>
        <h3>{{ t('home.promoDealTitle') }}</h3>
        <p>{{ t('home.promoDealSub') }}</p>
        <span class="z-promo__cta">{{ t('home.shopNow') }}</span>
      </router-link>
      <router-link class="z-promo z-promo--gold" to="/shop">
        <span class="z-promo__tag">{{ t('home.promoNew') }}</span>
        <h3>{{ t('home.promoNewTitle') }}</h3>
        <p>{{ t('home.promoNewSub') }}</p>
        <span class="z-promo__cta">{{ t('home.viewAll') }}</span>
      </router-link>
      <router-link class="z-promo z-promo--vendor" to="/vendors">
        <span class="z-promo__tag">{{ t('home.vendors') }}</span>
        <h3>{{ t('home.promoVendorTitle') }}</h3>
        <p>{{ t('home.promoVendorSub') }}</p>
        <span class="z-promo__cta">{{ t('home.openShop') }}</span>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
