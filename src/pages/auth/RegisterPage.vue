<template>
  <div class="z-container z-page z-page--auth">
    <div class="z-auth-shell z-auth-shell--register">
      <aside class="z-auth-panel z-auth-panel--deal">
        <p class="z-page-hero__kicker">{{ t('auth.joinKicker') }}</p>
        <h1>{{ t('auth.createTitle') }}</h1>
        <p class="z-muted">{{ t('auth.createSub') }}</p>
        <ul class="z-auth-perks">
          <li>
            <i class="material-icons">storefront</i>
            <span>{{ t('auth.perkSell') }}</span>
          </li>
          <li>
            <i class="material-icons">shopping_bag</i>
            <span>{{ t('auth.perkShop') }}</span>
          </li>
          <li>
            <i class="material-icons">verified</i>
            <span>{{ t('auth.perkTrust') }}</span>
          </li>
        </ul>
        <div class="z-auth-panel__foot">
          <p class="z-muted">{{ t('auth.hasAccount') }}</p>
          <router-link class="z-btn z-btn-ghost z-btn-sm" to="/login">{{ t('nav.login') }}</router-link>
        </div>
      </aside>

      <div class="z-auth-form">
        <div v-if="auth.error" class="z-alert">{{ auth.error }}</div>
        <form @submit.prevent="onSubmit">
          <div class="z-field">
            <label class="z-label" for="reg-name">{{ t('auth.name') }}</label>
            <div class="z-input-wrap">
              <i class="material-icons">person_outline</i>
              <input id="reg-name" v-model="name" class="z-input" required :placeholder="t('auth.namePh')" />
            </div>
          </div>
          <div class="z-field">
            <label class="z-label" for="reg-email">{{ t('auth.email') }}</label>
            <div class="z-input-wrap">
              <i class="material-icons">mail_outline</i>
              <input
                id="reg-email"
                v-model="email"
                class="z-input"
                type="email"
                autocomplete="email"
                required
                :placeholder="t('auth.emailPh')"
              />
            </div>
          </div>
          <div class="z-auth-form__grid">
            <div class="z-field">
              <label class="z-label" for="reg-pass">{{ t('auth.password') }}</label>
              <div class="z-input-wrap">
                <i class="material-icons">lock_outline</i>
                <input
                  id="reg-pass"
                  v-model="password"
                  class="z-input"
                  :type="showPass ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                />
              </div>
            </div>
            <div class="z-field">
              <label class="z-label" for="reg-pass2">{{ t('auth.confirm') }}</label>
              <div class="z-input-wrap">
                <i class="material-icons">lock_outline</i>
                <input
                  id="reg-pass2"
                  v-model="passwordConfirmation"
                  class="z-input"
                  :type="showPass ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          <label class="z-check" style="margin-bottom: 14px">
            <input v-model="agree" type="checkbox" required />
            <span>
              {{ t('auth.agree') }}
              <router-link to="/terms">{{ t('auth.terms') }}</router-link>
            </span>
          </label>

          <button class="z-btn z-btn-deal z-btn-block" type="submit" :disabled="auth.loading">
            <span v-if="auth.loading" class="z-auth-spinner" aria-hidden="true" />
            {{ auth.loading ? t('auth.creating') : t('auth.signUp') }}
          </button>
        </form>

        <p class="z-auth-form__mobile-link z-muted">
          {{ t('auth.hasAccount') }}
          <router-link to="/login">{{ t('nav.login') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useAuthStore } from 'stores/auth-store';

const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const agree = ref(false);
const showPass = ref(false);

async function onSubmit() {
  if (password.value !== passwordConfirmation.value) {
    Notify.create({ type: 'negative', message: t('auth.passMismatch'), position: 'top' });
    return;
  }
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    Notify.create({ type: 'positive', message: t('success'), position: 'top' });
    void router.push('/account');
  } catch {
    /* store sets error */
  }
}
</script>
