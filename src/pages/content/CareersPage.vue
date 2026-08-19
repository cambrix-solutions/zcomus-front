<template>
  <ContentPageShell title="Careers">
    <section class="section-box shop-template mt-30 mb-50">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 mx-auto page-content">
            <h2 class="text-center mb-20">Work with us</h2>
            <img class="mb-30 img-fluid" :src="hero" alt="Careers at Zcomus" />
            <p class="font-md color-gray-700 mb-20">
              We’re hiring in Cambodia — looking for people who want to build the next generation of
              local marketplace commerce for shoppers and sellers nationwide.
            </p>

            <h5>Programs and Internships</h5>
            <p class="font-md color-gray-700 mb-20">
              Internships and graduate programs run year-round in Phnom Penh across product,
              engineering, design, and marketplace operations. You’ll work with mentors, ship real
              features, and learn how a multi-vendor platform scales.
            </p>

            <h5>Current Openings</h5>
            <div class="mt-20 mb-30">
              <div
                v-for="job in jobs"
                :key="job.title"
                class="card-grid-style-3 mb-20"
              >
                <div class="card-grid-inner p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <h5 class="mb-5">{{ job.title }}</h5>
                    <span class="font-sm color-gray-500">{{ job.meta }}</span>
                    <p class="font-sm color-gray-700 mt-10 mb-0">{{ job.blurb }}</p>
                  </div>
                  <router-link class="btn btn-buy btn-sm" to="/contact">Apply</router-link>
                </div>
              </div>
            </div>

            <h5>Behind the Mission</h5>
            <p class="font-md color-gray-700 mb-20">
              We’re building a trusted marketplace for Cambodian shoppers and sellers. If you care about
              craftsmanship, customer experience, and inclusive teamwork, we’d love to hear from you.
            </p>
            <router-link class="btn btn-border" to="/contact">Send your CV</router-link>
          </div>
        </div>
      </div>
    </section>
  </ContentPageShell>
</template>

<script setup lang="ts">
import ContentPageShell from 'components/store/ContentPageShell.vue';
import { ecom } from 'src/helper/ecomAssets';

const hero = ecom('imgs/page/about/team-2.jpg');

const jobs = [
  {
    title: 'Frontend Engineer',
    meta: 'Phnom Penh · Full-time · Engineering',
    blurb: 'Build storefront experiences with Vue, Quasar, and high-performance UI.',
  },
  {
    title: 'Marketplace Operations',
    meta: 'Phnom Penh · Full-time · Operations',
    blurb: 'Partner with vendors, improve listing quality, and keep fulfillment smooth.',
  },
  {
    title: 'Product Designer',
    meta: 'Phnom Penh · Hybrid · Design',
    blurb: 'Shape shopping journeys from browse to checkout with clear visual systems.',
  },
];
</script>
