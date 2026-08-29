<template>
  <nav class="z-crumbs">
    <router-link to="/">{{ t('nav.home') }}</router-link>
    <span v-for="(c, i) in crumbs" :key="c.label">
      /
      <router-link v-if="c.to && i < crumbs.length - 1" :to="c.to">{{ c.label }}</router-link>
      <span v-else>{{ c.label }}</span>
    </span>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  crumbs: { label: string; to?: string }[];
}>();

const { t } = useI18n();
</script>
