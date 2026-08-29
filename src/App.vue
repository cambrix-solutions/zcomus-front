<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { applyRouteSeo } from 'src/helper/seo';

const route = useRoute();
const { locale } = useI18n();

// The router's afterEach only fires on navigation, so re-run SEO when the
// language changes on a page the visitor is already sitting on.
watch(locale, () => {
  applyRouteSeo(route);
});
</script>
