<template>
  <ContentPageShell
    title="Contact"
    hero="Talk to our Phnom Penh team"
    subtitle="Support, vendor onboarding, and order help — we reply in English and Khmer."
    hero-variant="default"
  >
    <div class="z-contact-quick">
      <a class="z-contact-quick__item" href="tel:+855235550100">
        <i class="material-icons">call</i>
        <span>
          <strong>Call us</strong>
          <small>(+855) 23 555 0100</small>
        </span>
      </a>
      <a class="z-contact-quick__item" href="mailto:support@zcomus.com">
        <i class="material-icons">mail</i>
        <span>
          <strong>Email</strong>
          <small>support@zcomus.com</small>
        </span>
      </a>
      <button class="z-contact-quick__item" type="button" @click="scrollToForm">
        <i class="material-icons">chat</i>
        <span>
          <strong>Message</strong>
          <small>We reply in EN & KM</small>
        </span>
      </button>
    </div>

    <div class="z-contact-layout">
      <form id="contact-form" class="z-contact-form" @submit.prevent="onSubmit">
        <div class="z-contact-form__head">
          <h3>Send a message</h3>
          <p class="z-muted">Usually reply within 1 business day.</p>
        </div>

        <div class="z-contact-form__grid">
          <label class="z-field">
            <span class="z-label">First name</span>
            <input v-model="form.firstName" class="z-input" required />
          </label>
          <label class="z-field">
            <span class="z-label">Last name</span>
            <input v-model="form.lastName" class="z-input" required />
          </label>
          <label class="z-field">
            <span class="z-label">Email</span>
            <input v-model="form.email" class="z-input" type="email" required />
          </label>
          <label class="z-field">
            <span class="z-label">Phone</span>
            <input v-model="form.phone" class="z-input" placeholder="Optional" />
          </label>
        </div>

        <label class="z-field">
          <span class="z-label">Topic</span>
          <select v-model="form.topic" class="z-select">
            <option value="order">Order help</option>
            <option value="vendor">Become a vendor</option>
            <option value="payment">Payment / KHQR</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label class="z-field">
          <span class="z-label">Message</span>
          <textarea v-model="form.message" class="z-textarea" rows="5" required />
        </label>

        <button class="z-btn z-btn-deal z-contact-form__submit" type="submit" :disabled="sending">
          <i class="material-icons">{{ sending ? 'hourglass_top' : 'send' }}</i>
          {{ sending ? 'Sending…' : 'Send message' }}
        </button>
      </form>

      <aside class="z-contact-side">
        <div class="z-contact-card">
          <div class="z-contact-card__icon"><i class="material-icons">location_on</i></div>
          <div>
            <h4>Visit us</h4>
            <p>#12, St. 168, Sangkat Veal Vong, Khan 7 Makara, Phnom Penh</p>
            <p class="z-muted">Mon–Sat · 8:00–17:00</p>
          </div>
        </div>

        <div class="z-contact-card">
          <div class="z-contact-card__icon is-orange"><i class="material-icons">support_agent</i></div>
          <div>
            <h4>Support line</h4>
            <p><a href="tel:+855235550100">(+855) 23 555 0100</a></p>
            <p><a href="mailto:support@zcomus.com">support@zcomus.com</a></p>
          </div>
        </div>

        <div class="z-contact-pickups">
          <h4>Pickup points</h4>
          <p class="z-muted">Tap a city for directions details.</p>
          <button
            v-for="s in stores"
            :key="s.city"
            class="z-contact-pickup"
            :class="{ 'is-open': openCity === s.city }"
            type="button"
            @click="toggleCity(s.city)"
          >
            <span class="z-contact-pickup__row">
              <i class="material-icons">storefront</i>
              <strong>{{ s.city }}</strong>
              <i class="material-icons z-contact-pickup__chevron">expand_more</i>
            </span>
            <span v-if="openCity === s.city" class="z-contact-pickup__detail">
              {{ s.line }}
              <a :href="`tel:${s.phone}`">{{ s.phone }}</a>
            </span>
          </button>
        </div>
      </aside>
    </div>
  </ContentPageShell>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Notify } from 'quasar';
import ContentPageShell from 'components/store/ContentPageShell.vue';

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  topic: 'order',
  message: '',
});
const sending = ref(false);
const openCity = ref('Phnom Penh');
const stores = [
  { city: 'Phnom Penh', line: '#12, St. 168, Sangkat Veal Vong', phone: '(+855) 23 555 0100' },
  { city: 'Siem Reap', line: 'Sivatha Blvd, Mondul 1', phone: '(+855) 63 555 0200' },
  { city: 'Battambang', line: 'Street 3, Kammeeng', phone: '(+855) 53 555 0300' },
];

function toggleCity(city: string) {
  openCity.value = openCity.value === city ? '' : city;
}

function scrollToForm() {
  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function onSubmit() {
  sending.value = true;
  await new Promise((r) => setTimeout(r, 700));
  sending.value = false;
  Notify.create({
    type: 'positive',
    message: 'Thanks! We received your message.',
    position: 'top',
    actions: [{ icon: 'close', color: 'white' }],
  });
  Object.assign(form, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: 'order',
    message: '',
  });
}
</script>
