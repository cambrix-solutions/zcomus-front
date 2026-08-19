<template>
  <ContentPageShell title="About Us">
    <section class="section-box shop-template mt-30 mb-50">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <h5 class="color-gray-500 mb-10">About us</h5>
            <h2>Cambodia’s Leading Online Marketplace</h2>
            <div class="row mt-20">
              <div class="col-lg-6 mb-30">
                <p class="font-sm font-medium color-gray-700 mb-15">
                  Zcomus is built for Cambodia — connecting trusted local vendors with shoppers
                  across Phnom Penh, Siem Reap, and provinces nationwide.
                </p>
                <p class="font-sm font-medium color-gray-700 mb-15">
                  We focus on clear product information, fast checkout, and reliable delivery
                  within Cambodia.
                </p>
                <p class="font-sm font-medium color-gray-700 mb-15">
                  From electronics to lifestyle goods, we help Cambodian sellers grow and buyers
                  find what they need with confidence.
                </p>
                <ul class="list-services mt-20">
                  <li class="hover-up">We provide qualified &amp; expert support</li>
                  <li class="hover-up">Modern tools &amp; technology use</li>
                  <li class="hover-up">Neat &amp; cleaning top Services</li>
                  <li class="hover-up">We Develop Digital Future</li>
                </ul>
              </div>
              <div class="col-lg-6 mb-30">
                <img :src="aboutImg" alt="About Zcomus" class="img-fluid" />
              </div>
            </div>

            <div class="box-contact-support pt-80 pb-50 pl-50 pr-50 background-gray-50 mt-50 mb-90">
              <div class="row">
                <div
                  v-for="stat in stats"
                  :key="stat.title"
                  class="col-lg-3 mb-30 text-center text-lg-start"
                >
                  <h4 class="mb-5">{{ stat.title }}</h4>
                  <p class="font-md color-gray-700 mb-5">{{ stat.text }}</p>
                </div>
              </div>
            </div>

            <h5 class="color-gray-500 mb-10">Behind The Brands</h5>
            <h2 class="mb-40">
              The people who work at Zcomus share the vision and values of our community.
            </h2>
            <div class="row mb-50">
              <div
                v-for="m in team"
                :key="m.name"
                class="col-lg-3 col-md-4 col-sm-6 col-12"
              >
                <div class="card-staff hover-up">
                  <div class="image-staff">
                    <img :src="m.image" :alt="m.name" />
                  </div>
                  <div class="info-staff">
                    <h5>{{ m.name }}</h5>
                    <p class="font-md color-gray-500">{{ m.role }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center mb-30 d-flex flex-wrap justify-content-center gap-2">
              <router-link class="btn btn-buy w-auto" to="/shop">Start shopping</router-link>
              <router-link class="btn btn-border w-auto" to="/contact">Contact us</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </ContentPageShell>
</template>

<script setup lang="ts">
import ContentPageShell from 'components/store/ContentPageShell.vue';
import { ecom } from 'src/helper/ecomAssets';

const aboutImg = ecom('imgs/page/about/img.png');

const stats = [
  { title: '12 Years', text: 'We’ve more than 12 years serving Cambodian shoppers.' },
  { title: '200+ Vendors', text: 'Trusted sellers across Phnom Penh and the provinces.' },
  { title: '25 Provinces', text: 'We deliver to all 25 provinces in Cambodia.' },
  { title: 'Phnom Penh HQ', text: 'Our main office and warehouse are based in Phnom Penh.' },
];

const team = [
  { name: 'Ronald Richards', role: 'Chief Executive Officer', image: ecom('imgs/page/about/staft1.png') },
  { name: 'Jenny Wilson', role: 'Chief Financial Officer', image: ecom('imgs/page/about/staft2.png') },
  { name: 'Cody Fisher', role: 'Chief Operating Officer', image: ecom('imgs/page/about/staft3.png') },
  { name: 'Jacob Jones', role: 'Chief Technology Officer', image: ecom('imgs/page/about/staft4.png') },
  { name: 'Leslie Alexander', role: 'Chief Marketing Officer', image: ecom('imgs/page/about/staft5.png') },
  { name: 'Albert Flores', role: 'Head of Product', image: ecom('imgs/page/about/staft6.png') },
  { name: 'Devon Lane', role: 'Head of Support', image: ecom('imgs/page/about/staft7.png') },
  { name: 'Wade Warren', role: 'Head of Vendor Success', image: ecom('imgs/page/about/staft8.png') },
];
</script>
