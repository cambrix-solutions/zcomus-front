<template>
  <main class="z-container z-page">
    <div class="z-404 z-fade-item">
      <h1>404</h1>
      <p class="z-muted">This page does not exist.</p>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
        <router-link class="z-btn z-btn-primary" to="/">{{ t('nav.home') }}</router-link>
        <router-link class="z-btn z-btn-ghost" to="/shop">{{ t('nav.shop') }}</router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
