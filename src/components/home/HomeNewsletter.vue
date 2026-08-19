<template>
  <section class="section-box box-newsletter">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 col-md-7 col-sm-12">
          <h3 class="color-white">
            Subscribe &amp; Get <span class="color-warning">10%</span> Discount
          </h3>
          <p class="font-lg color-white">
            Get E-mail updates about our latest shop and
            <span class="font-lg-bold">special offers.</span>
          </p>
        </div>
        <div class="col-lg-4 col-md-5 col-sm-12">
          <div class="box-form-newsletter mt-15">
            <form class="form-newsletter" @submit.prevent="onSubmit">
              <input
                v-model="email"
                class="input-newsletter font-xs"
                type="email"
                placeholder="Your email Address"
                required
              />
              <button class="btn btn-brand-2" type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Notify } from 'quasar';

const email = ref('');

function onSubmit() {
  Notify.create({
    type: 'positive',
    message: 'Thanks for subscribing!',
    position: 'top',
  });
  email.value = '';
}
</script>
