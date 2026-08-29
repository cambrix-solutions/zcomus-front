<template>
  <ContentPageShell
    title="Terms"
    hero="Terms and conditions"
    subtitle="How we handle your data, orders, and seller responsibilities on Zcomus."
    hero-variant="default"
  >
    <div class="z-card z-section">
      <h3>1. Personal data</h3>
      <p>We collect account, purchase, shipping, and support information you provide, plus limited device data.</p>
      <h3 class="z-section">2. Cookies</h3>
      <p>Cookies help us remember preferences, keep the shop secure, and improve the product.</p>
      <h3 class="z-section">3. Orders & returns</h3>
      <p>Orders depend on stock and seller confirmation. Returns follow seller policy and marketplace rules.</p>
      <p class="z-section">
        Questions? <router-link to="/contact">Contact us</router-link> or email support@zcomus.com.
      </p>
    </div>
  </ContentPageShell>
</template>

<script setup lang="ts">
import ContentPageShell from 'components/store/ContentPageShell.vue';
</script>
