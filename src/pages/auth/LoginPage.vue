<template>
  <main class="main">
    <section class="section-box shop-template mt-60 mb-50">
      <div class="container">
        <div class="row mb-100">
          <div class="col-lg-1" />
          <div class="col-lg-5">
            <h3>Member Login</h3>
            <p class="font-md color-gray-500">Welcome back!</p>
            <div v-if="auth.error" class="alert alert-danger mt-20 font-sm">{{ auth.error }}</div>
            <form class="form-register mt-30 mb-30" @submit.prevent="onSubmit">
              <div class="form-group">
                <label class="mb-5 font-sm color-gray-700">Email / Phone / Username *</label>
                <input
                  v-model="email"
                  class="form-control"
                  type="email"
                  placeholder="stevenjob@gmail.com"
                  required
                />
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
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <label class="color-gray-500 font-xs">
                      <input v-model="remember" class="checkagree" type="checkbox" />
                      Remember me
                    </label>
                  </div>
                </div>
                <div class="col-lg-6 text-end">
                  <div class="form-group">
                    <a class="font-xs color-gray-500" href="#" @click.prevent>Forgot your password?</a>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <button class="font-md-bold btn btn-buy" type="submit" :disabled="auth.loading">
                  {{ auth.loading ? 'Signing in…' : 'Sign In' }}
                </button>
              </div>
              <div class="form-group mt-10">
                <button class="btn btn-border w-100" type="button" @click="onDemo">
                  Continue as demo user
                </button>
              </div>
              <div class="mt-20">
                <span class="font-xs color-gray-500 font-medium">Have not an account?</span>
                <router-link class="font-xs color-brand-3 font-medium ms-1" to="/register">
                  Sign Up
                </router-link>
              </div>
            </form>
          </div>
          <div class="col-lg-5">
            <div class="box-login-social pt-65 pl-50">
              <h5 class="text-center">Use Social Network Account</h5>
              <div class="box-button-login mt-25">
                <a class="btn btn-login font-md-bold color-brand-3 mb-15" href="#" @click.prevent>
                  Sign in with
                  <img :src="google" alt="Google" />
                </a>
                <a class="btn btn-login font-md-bold color-brand-3 mb-15" href="#" @click.prevent>
                  Sign in with
                  <span class="color-blue font-md-bold">Facebook</span>
                </a>
                <a class="btn btn-login font-md-bold color-brand-3 mb-15" href="#" @click.prevent>
                  Sign in with
                  <img :src="amazon" alt="Amazon" />
                </a>
              </div>
              <div class="mt-10 text-center">
                <span class="font-xs color-gray-900">Buying for work?</span>
                <router-link class="color-brand-1 font-xs ms-1" to="/register">
                  Create a free business account
                </router-link>
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
const email = ref('');
const password = ref('');
const remember = ref(true);
const google = ecom('imgs/page/account/google.svg');
const amazon = ecom('imgs/page/account/amazon.svg');

async function onSubmit() {
  try {
    await auth.login(email.value, password.value);
    Notify.create({ type: 'positive', message: 'Logged in', position: 'top' });
    void router.push(remember.value ? '/account' : '/');
  } catch {
    /* store sets error */
  }
}

function onDemo() {
  auth.loginDemo();
  Notify.create({ type: 'positive', message: 'Demo session started', position: 'top' });
  void router.push('/account');
}
</script>
