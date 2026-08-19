<template>
  <main class="main">
    <section class="section-box shop-template mt-60 mb-50">
      <div class="container">
        <div class="row mb-100">
          <div class="col-lg-1" />
          <div class="col-lg-5">
            <h3>Create an account</h3>
            <p class="font-md color-gray-500">Access to all features. No credit card required.</p>
            <div v-if="auth.error" class="alert alert-danger mt-20 font-sm">{{ auth.error }}</div>
            <form class="form-register mt-30 mb-30" @submit.prevent="onSubmit">
              <div class="form-group">
                <label class="mb-5 font-sm color-gray-700">Full Name *</label>
                <input v-model="name" class="form-control" type="text" placeholder="Steven job" required />
              </div>
              <div class="form-group">
                <label class="mb-5 font-sm color-gray-700">Email *</label>
                <input
                  v-model="email"
                  class="form-control"
                  type="email"
                  placeholder="stevenjob@gmail.com"
                  required
                />
              </div>
              <div class="form-group">
                <label class="mb-5 font-sm color-gray-700">Username *</label>
                <input v-model="username" class="form-control" type="text" placeholder="stevenjob" required />
              </div>
              <div class="form-group">
                <label class="mb-5 font-sm color-gray-700">Password *</label>
                <input
                  v-model="password"
                  class="form-control"
                  type="password"
                  placeholder="******************"
                  required
                />
              </div>
              <div class="form-group">
                <label class="mb-5 font-sm color-gray-700">Re-Password *</label>
                <input
                  v-model="passwordConfirmation"
                  class="form-control"
                  type="password"
                  placeholder="******************"
                  required
                />
              </div>
              <div class="form-group">
                <label class="font-sm color-gray-700">
                  <input v-model="agree" class="checkagree" type="checkbox" required />
                  By clicking Register button, you agree our
                  <router-link class="color-brand-2" to="/terms">terms and policy</router-link>,
                </label>
              </div>
              <div class="form-group">
                <button class="font-md-bold btn btn-buy" type="submit" :disabled="auth.loading">
                  {{ auth.loading ? 'Creating…' : 'Sign Up' }}
                </button>
              </div>
              <div class="mt-20">
                <span class="font-xs color-gray-500 font-medium">Already have an account?</span>
                <router-link class="font-xs color-brand-3 font-medium" to="/login">
                  Sign In
                </router-link>
              </div>
            </form>
          </div>
          <div class="col-lg-5">
            <div class="box-login-social pt-65 pl-50">
              <h5 class="text-center">Use Social Network Account</h5>
              <div class="box-button-login mt-25">
                <a class="btn btn-login font-md-bold color-brand-3 mb-15" href="#" @click.prevent>
                  Sign up with
                  <img :src="google" alt="Google" />
                </a>
                <a class="btn btn-login font-md-bold color-brand-3 mb-15" href="#" @click.prevent>
                  Sign up with
                  <span class="color-blue font-md-bold">Facebook</span>
                </a>
                <a class="btn btn-login font-md-bold color-brand-3 mb-15" href="#" @click.prevent>
                  Sign up with
                  <img :src="amazon" alt="Amazon" />
                </a>
              </div>
              <div class="mt-10 text-center">
                <span class="font-xs color-gray-900">Buying for work?</span>
                <a class="color-brand-1 font-xs" href="#" @click.prevent>Create a free business account</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { ecom } from 'src/helper/ecomAssets';
import { useAuthStore } from 'stores/auth-store';

const auth = useAuthStore();
const router = useRouter();
const name = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const agree = ref(false);
const google = ecom('imgs/page/account/google.svg');
const amazon = ecom('imgs/page/account/amazon.svg');

async function onSubmit() {
  if (password.value !== passwordConfirmation.value) {
    Notify.create({ type: 'negative', message: 'Passwords do not match', position: 'top' });
    return;
  }
  try {
    await auth.register({
      name: name.value || username.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    Notify.create({ type: 'positive', message: 'Account created', position: 'top' });
    void router.push('/account');
  } catch {
    /* store sets error */
  }
}
</script>
