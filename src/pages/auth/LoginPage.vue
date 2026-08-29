<template>
  <div class="z-container z-page z-page--auth">
    <div class="z-auth-shell">
      <aside class="z-auth-panel">
        <p class="z-page-hero__kicker">{{ t('auth.kicker') }}</p>
        <h1>{{ t('nav.login') }}</h1>
        <p class="z-muted">{{ t('auth.loginSub') }}</p>
        <ul class="z-auth-perks">
          <li>
            <i class="material-icons">local_shipping</i>
            <span>{{ t('auth.perkOrders') }}</span>
          </li>
          <li>
            <i class="material-icons">favorite</i>
            <span>{{ t('auth.perkWish') }}</span>
          </li>
          <li>
            <i class="material-icons">payments</i>
            <span>{{ t('auth.perkPay') }}</span>
          </li>
        </ul>
        <div class="z-auth-panel__foot">
          <p class="z-muted">{{ t('auth.noAccount') }}</p>
          <router-link class="z-btn z-btn-ghost z-btn-sm" to="/register">{{ t('auth.signUp') }}</router-link>
        </div>
      </aside>

      <div class="z-auth-form">
        <div v-if="auth.error" class="z-alert">{{ auth.error }}</div>
        <form @submit.prevent="onSubmit">
          <div class="z-field">
            <label class="z-label" for="login-email">{{ t('auth.email') }}</label>
            <div class="z-input-wrap">
              <i class="material-icons">mail_outline</i>
              <input
                id="login-email"
                v-model="email"
                class="z-input"
                type="email"
                autocomplete="email"
                required
                :placeholder="t('auth.emailPh')"
              />
            </div>
          </div>
          <div class="z-field">
            <label class="z-label" for="login-password">{{ t('auth.password') }}</label>
            <div class="z-input-wrap">
              <i class="material-icons">lock_outline</i>
              <input
                id="login-password"
                v-model="password"
                class="z-input"
                :type="showPass ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :placeholder="t('auth.passwordPh')"
              />
              <button
                class="z-input-wrap__toggle"
                type="button"
                :aria-label="t('auth.showPass')"
                @click="showPass = !showPass"
              >
                <i class="material-icons">{{ showPass ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
          </div>

          <div class="z-auth-form__row">
            <label class="z-check">
              <input v-model="remember" type="checkbox" />
              <span>{{ t('auth.remember') }}</span>
            </label>
          </div>

          <button class="z-btn z-btn-deal z-btn-block" type="submit" :disabled="auth.loading">
            <span v-if="auth.loading" class="z-auth-spinner" aria-hidden="true" />
            {{ auth.loading ? t('auth.signingIn') : t('nav.login') }}
          </button>

          <div class="z-auth-divider"><span>{{ t('auth.or') }}</span></div>

          <button class="z-btn z-btn-ghost z-btn-block" type="button" @click="onDemo">
            <i class="material-icons">bolt</i>
            {{ t('auth.demo') }}
          </button>

          <div class="z-auth-demo-staff">
            <button class="z-btn z-btn-ghost z-btn-sm" type="button" @click="onDemoAdmin">
              {{ t('auth.demoAdmin') }}
            </button>
            <button class="z-btn z-btn-ghost z-btn-sm" type="button" @click="onDemoSuper">
              {{ t('auth.demoSuper') }}
            </button>
          </div>
        </form>

        <p class="z-auth-form__mobile-link z-muted">
          {{ t('auth.noAccount') }}
          <router-link to="/register">{{ t('auth.signUp') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { homePathForRole } from 'src/helper/authRoles';
import { useAuthStore } from 'stores/auth-store';

const { t } = useI18n();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const email = ref('');
const password = ref('');
const remember = ref(true);
const showPass = ref(false);

function nextPath(role?: string | null) {
  const next = typeof route.query.next === 'string' ? route.query.next : '';
  if (next.startsWith('/') && !next.startsWith('//')) return next;
  return homePathForRole(role);
}

async function onSubmit() {
  try {
    const user = await auth.login(email.value, password.value);
    Notify.create({ type: 'positive', message: t('success'), position: 'top' });
    void router.push(remember.value ? nextPath(user.role) : '/');
  } catch {
    /* store sets error */
  }
}

function onDemo() {
  auth.loginDemo();
  Notify.create({ type: 'positive', message: t('success'), position: 'top' });
  void router.push(nextPath('customer'));
}

function onDemoAdmin() {
  auth.loginDemoAdmin();
  Notify.create({ type: 'positive', message: t('success'), position: 'top' });
  void router.push(nextPath('admin'));
}

function onDemoSuper() {
  auth.loginDemoSuperAdmin();
  Notify.create({ type: 'positive', message: t('success'), position: 'top' });
  void router.push(nextPath('super_admin'));
}
</script>

<style scoped>
.z-auth-demo-staff {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.z-auth-demo-staff .z-btn {
  flex: 1;
  min-width: 140px;
}
</style>
