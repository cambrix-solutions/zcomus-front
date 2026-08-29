<template>
  <section class="z-trust-band">
    <div class="z-container z-trust">
      <div v-for="item in items" :key="item.title" class="z-trust__item">
        <span class="z-trust__icon material-icons">{{ item.icon }}</span>
        <div>
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const items = computed(() => [
  { icon: 'local_shipping', title: t('home.delivery'), text: t('home.deliverySub') },
  { icon: 'payments', title: t('home.cod'), text: t('home.codSub') },
  { icon: 'cached', title: t('home.returns'), text: t('home.returnsSub') },
  { icon: 'qr_code_2', title: t('home.pay'), text: t('home.paySub') },
]);
</script>
