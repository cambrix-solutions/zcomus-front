<template>
  <ContentPageShell title="Contact" flush-breadcrumb>
    <section class="section-box shop-template mt-0 mb-50">
      <div class="container">
        <div class="box-contact">
          <div class="row">
            <div class="col-lg-6">
              <div class="contact-form">
                <h3 class="color-brand-3 mt-60">Contact Us</h3>
                <p class="font-sm color-gray-700 mb-30">Our team would love to hear from you!</p>
                <form class="row" @submit.prevent="onSubmit">
                  <div class="col-lg-6 col-md-6">
                    <div class="form-group">
                      <input v-model="form.firstName" class="form-control" type="text" placeholder="First name" required />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6">
                    <div class="form-group">
                      <input v-model="form.lastName" class="form-control" type="text" placeholder="Last name" required />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <input v-model="form.email" class="form-control" type="email" placeholder="Email" required />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <input v-model="form.phone" class="form-control" type="tel" placeholder="Phone number" />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <textarea v-model="form.message" class="form-control" placeholder="Message" rows="5" required />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <button class="btn btn-buy w-auto" type="submit">Send message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.8!2d104.916!3d11.556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDMzJzIxLjYiTiAxMDTCsDU0JzU3LjYiRQ!5e0!3m2!1sen!2skh!4v1"
                  height="550"
                  style="border: 0; width: 100%"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Map"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="box-contact-address pt-80 pb-50">
          <div class="row">
            <div class="col-lg-3 mb-30">
              <h3 class="mb-5">Visit our stores</h3>
              <p class="font-sm color-gray-700 mb-30">Find us at these locations</p>
              <a class="btn btn-buy w-auto" href="#support">View map</a>
            </div>
            <div v-for="(col, i) in storeColumns" :key="i" class="col-lg-3">
              <div v-for="s in col" :key="s.city" class="mb-30">
                <h4>{{ s.city }}</h4>
                <p class="font-sm color-gray-700">{{ s.line1 }}<br />{{ s.line2 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="support" class="box-contact-support pt-80 pb-50 background-gray-50">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 mb-30 text-center text-lg-start">
              <h3 class="mb-5">We’d love to hear from you</h3>
              <p class="font-sm color-gray-700">Chat with our friendly team</p>
            </div>
            <div
              v-for="c in channels"
              :key="c.title"
              class="col-lg-3 text-center mb-30"
            >
              <div class="box-image mb-20">
                <img :src="c.icon" :alt="c.title" />
              </div>
              <h4 class="mb-5">{{ c.title }}</h4>
              <p class="font-sm color-gray-700 mb-5">{{ c.text }}</p>
              <a class="font-sm color-gray-900" :href="c.href">{{ c.link }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </ContentPageShell>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Notify } from 'quasar';
import ContentPageShell from 'components/store/ContentPageShell.vue';
import { ecom } from 'src/helper/ecomAssets';

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
});

const storeColumns = [
  [
    { city: 'Phnom Penh', line1: '#12, St. 168, Sangkat Veal Vong', line2: 'Khan 7 Makara, Phnom Penh' },
    { city: 'Phnom Penh (Toul Kork)', line1: 'Street 289, Sangkat Boeung Kak I', line2: 'Khan Toul Kork, Phnom Penh' },
    { city: 'Phnom Penh (Mean Chey)', line1: 'Russian Blvd, Sangkat Teuk Thla', line2: 'Khan Sen Sok, Phnom Penh' },
  ],
  [
    { city: 'Siem Reap', line1: 'Sivatha Blvd, Mondul 1', line2: 'Siem Reap City, Siem Reap' },
    { city: 'Battambang', line1: 'Street 3, Kammeeng', line2: 'Battambang City, Battambang' },
    { city: 'Sihanoukville', line1: 'Ekareach Street', line2: 'Preah Sihanouk Province' },
  ],
  [
    { city: 'Kampong Cham', line1: 'National Road 7', line2: 'Kampong Cham City' },
    { city: 'Kampot', line1: 'River Road', line2: 'Kampot City, Kampot' },
    { city: 'Kandal', line1: 'National Road 1', line2: 'Ta Khmau, Kandal' },
  ],
];

const channels = [
  {
    title: 'Chat to support',
    text: 'Chat with our Cambodia support team',
    link: 'support@zcomus.com',
    href: 'mailto:support@zcomus.com',
    icon: ecom('imgs/page/contact/chat.svg'),
  },
  {
    title: 'Call us',
    text: 'Speak to our team in Phnom Penh.',
    link: '(+855) 23 555 0100',
    href: 'tel:+855235550100',
    icon: ecom('imgs/page/contact/call.svg'),
  },
  {
    title: 'Visit us',
    text: 'Visit our Phnom Penh HQ.',
    link: 'View on Google Maps',
    href: '#support',
    icon: ecom('imgs/page/contact/map.svg'),
  },
];

function onSubmit() {
  Notify.create({ type: 'positive', message: 'Message sent (demo)', position: 'top' });
  form.firstName = '';
  form.lastName = '';
  form.email = '';
  form.phone = '';
  form.message = '';
}
</script>
