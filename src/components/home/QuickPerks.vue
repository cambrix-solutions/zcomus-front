<template>
  <section class="z-container z-perks">
    <router-link v-for="p in perks" :key="p.label" class="z-perk" :to="p.to">
      <span class="z-perk__icon material-icons">{{ p.icon }}</span>
      <span class="z-perk__text">
        <strong>{{ p.label }}</strong>
        <small>{{ p.hint }}</small>
      </span>
    </router-link>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const perks = computed(() => [
  { icon: 'local_shipping', label: t('home.delivery'), hint: t('home.deliverySub'), to: '/shop' },
  { icon: 'payments', label: t('home.cod'), hint: t('home.codSub'), to: '/shop' },
  { icon: 'bolt', label: t('home.flash'), hint: t('home.flashSub'), to: '/shop?tab=flash' },
  { icon: 'storefront', label: t('home.vendors'), hint: t('home.vendorsSub'), to: '/vendors' },
]);
</script>
