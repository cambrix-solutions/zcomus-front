<template>
  <ContentPageShell
    title="About Us"
    hero="Cambodia’s local marketplace"
    subtitle="Trusted vendors, nationwide delivery, and payments that work the way Cambodians already pay."
    kicker="About Zcomus"
    hero-variant="default"
  >
    <div class="z-split z-split-2 z-section">
      <div class="z-card">
        <p>Zcomus connects trusted local vendors with shoppers across Phnom Penh, Siem Reap, and the provinces.</p>
        <p class="z-muted" style="margin-top: 10px">
          Clear product information, fast checkout, and delivery within Cambodia.
        </p>
        <ul class="z-list-check z-section">
          <li>200+ verified sellers</li>
          <li>Delivery to all 25 provinces</li>
          <li>KHQR, ABA, Wing, and COD</li>
        </ul>
      </div>
      <img :src="aboutImg" alt="About Zcomus" class="z-img-rounded" />
    </div>
    <div class="z-trust z-section">
      <div v-for="stat in stats" :key="stat.title" class="z-trust__item">
        <strong>{{ stat.title }}</strong>
        <span>{{ stat.text }}</span>
      </div>
    </div>
    <h3 class="z-section">Team</h3>
    <div class="z-grid z-grid-4 z-section">
      <div v-for="m in team" :key="m.name" class="z-card z-card--lift">
        <img :src="m.image" :alt="m.name" class="z-img-rounded" style="margin-bottom: 8px" />
        <h4>{{ m.name }}</h4>
        <p class="z-muted">{{ m.role }}</p>
      </div>
    </div>
    <div class="z-actions">
      <router-link class="z-btn z-btn-deal" to="/shop">{{ t('nav.shop') }}</router-link>
      <router-link class="z-btn z-btn-ghost" to="/contact">{{ t('nav.contact') }}</router-link>
    </div>
  </ContentPageShell>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ContentPageShell from 'components/store/ContentPageShell.vue';
import { ecom } from 'src/helper/ecomAssets';

const { t } = useI18n();
const aboutImg = ecom('imgs/page/about/img.png');
const stats = [
  { title: '12 Years', text: 'Serving Cambodian shoppers.' },
  { title: '200+ Vendors', text: 'Sellers across Phnom Penh and the provinces.' },
  { title: '25 Provinces', text: 'Delivery nationwide.' },
  { title: 'Phnom Penh HQ', text: 'Office and warehouse in Phnom Penh.' },
];
const team = [
  { name: 'Ronald Richards', role: 'Chief Executive Officer', image: ecom('imgs/page/about/staft1.png') },
  { name: 'Jenny Wilson', role: 'Chief Financial Officer', image: ecom('imgs/page/about/staft2.png') },
  { name: 'Cody Fisher', role: 'Chief Operating Officer', image: ecom('imgs/page/about/staft3.png') },
  { name: 'Jacob Jones', role: 'Chief Technology Officer', image: ecom('imgs/page/about/staft4.png') },
];
</script>
