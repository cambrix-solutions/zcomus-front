<template>
  <ContentPageShell
    title="Careers"
    hero="Build Cambodia’s marketplace"
    subtitle="Engineering, design, and operations roles in Phnom Penh."
    kicker="Careers"
    hero-variant="deal"
  >
    <img :src="hero" alt="Careers at Zcomus" class="z-img-hero z-section" />
    <p>We’re hiring in Cambodia — product, engineering, design, and marketplace operations.</p>
    <div class="z-section">
      <div v-for="job in jobs" :key="job.title" class="z-card z-card--lift z-job">
        <div>
          <h3>{{ job.title }}</h3>
          <p class="z-muted">{{ job.meta }}</p>
          <p>{{ job.blurb }}</p>
        </div>
        <router-link class="z-btn z-btn-deal" to="/contact">Apply</router-link>
      </div>
    </div>
  </ContentPageShell>
</template>

<script setup lang="ts">
import ContentPageShell from 'components/store/ContentPageShell.vue';
import { ecom } from 'src/helper/ecomAssets';

const hero = ecom('imgs/page/about/team-2.jpg');
const jobs = [
  { title: 'Frontend Engineer', meta: 'Phnom Penh · Full-time', blurb: 'Vue, Quasar, storefront UI.' },
  { title: 'Marketplace Operations', meta: 'Phnom Penh · Full-time', blurb: 'Partner with vendors and keep fulfillment smooth.' },
  { title: 'Product Designer', meta: 'Phnom Penh · Hybrid', blurb: 'Shape browse-to-checkout journeys.' },
];
</script>
