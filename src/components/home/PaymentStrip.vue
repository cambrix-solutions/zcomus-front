<template>
  <section class="z-container z-pay-strip">
    <span class="z-pay-strip__label">{{ t('home.pay') }}</span>
    <div class="z-pay-strip__badges">
      <span>KHQR</span>
      <span>ABA</span>
      <span>Wing</span>
      <span>COD</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
