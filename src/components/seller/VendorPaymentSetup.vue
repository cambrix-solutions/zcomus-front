<template>
  <section class="z-pay-setup">
    <header class="z-pay-setup__head">
      <div>
        <p class="z-pay-setup__kicker">{{ t('seller.paymentSetupKicker') }}</p>
        <h2>{{ t('seller.paymentSetupTitle') }}</h2>
        <p>{{ t('seller.paymentSetupSub') }}</p>
      </div>
      <div v-if="isConfigured && !wizardOpen" class="z-pay-setup__status is-ready">
        <i class="material-icons">verified</i>
        {{ t('seller.payoutReady') }}
      </div>
    </header>

    <!-- Configured summary -->
    <div v-if="isConfigured && !wizardOpen && savedProfile" class="z-pay-setup__summary">
      <article class="z-pay-setup__summary-card">
        <header>
          <i class="material-icons">shopping_cart_checkout</i>
          <div>
            <h3>{{ t('seller.setupPayinTitle') }}</h3>
            <p>{{ t('seller.setupPayinSummary') }}</p>
          </div>
        </header>
        <ul class="z-pay-setup__chips">
          <li v-for="id in enabledPayinIds(savedPayin)" :key="id">
            <i class="material-icons">{{ payinIcon(id) }}</i>
            {{ t(`seller.payin_${id}`) }}
          </li>
        </ul>
      </article>

      <article class="z-pay-setup__summary-card">
        <header>
          <i class="material-icons">{{ payoutMethodIcon(savedProfile.method) }}</i>
          <div>
            <h3>{{ t('seller.setupPayoutTitle') }}</h3>
            <p>{{ t('seller.setupPayoutSummary') }}</p>
          </div>
        </header>
        <dl class="z-pay-setup__summary-dl">
          <div>
            <dt>{{ t('seller.payoutReviewMethod') }}</dt>
            <dd>{{ payoutMethodLabel(savedProfile.method) }}</dd>
          </div>
          <div>
            <dt>{{ t('seller.payoutAccountName') }}</dt>
            <dd>{{ savedProfile.accountName }}</dd>
          </div>
          <div v-if="savedProfile.accountRef">
            <dt>{{ accountLabel(savedProfile.method) }}</dt>
            <dd>{{ maskedAccountRef }}</dd>
          </div>
          <div v-if="savedProfile.khqrImage && savedProfile.method === 'aba'" class="z-pay-setup__khqr-row">
            <dt>{{ t('seller.payoutKhqr') }}</dt>
            <dd>
              <img class="z-pay-setup__khqr-thumb" :src="savedProfile.khqrImage" alt="KHQR" />
              <span>{{ t('seller.payoutKhqrOnFile') }}</span>
            </dd>
          </div>
          <div v-if="savedProfile.bankName">
            <dt>{{ t('seller.payoutBankName') }}</dt>
            <dd>{{ savedProfile.bankName }}</dd>
          </div>
        </dl>
        <p class="z-pay-setup__summary-note">{{ t('seller.payoutActiveNote') }}</p>
      </article>

      <button class="z-btn z-btn-ghost z-pay-setup__edit" type="button" @click="resetWizard">
        {{ t('seller.paymentSetupEdit') }}
      </button>

      <section class="z-pay-setup__flow z-pay-setup__flow--summary">
        <header>
          <h4>{{ t('seller.setupFlowTitle') }}</h4>
          <p>{{ t('seller.setupFlowSub') }}</p>
        </header>
        <ol class="z-pay-setup__flow-steps">
          <li v-for="flowStep in moneyFlowStepsComplete" :key="flowStep.id" class="is-done">
            <i class="material-icons">{{ flowStep.icon }}</i>
            <div>
              <strong>{{ t(`seller.flow_${flowStep.id}`) }}</strong>
              <span>{{ t(`seller.flow_${flowStep.id}Hint`) }}</span>
            </div>
          </li>
        </ol>
      </section>
    </div>

    <!-- Setup wizard -->
    <template v-else>
      <div class="z-pay-setup__progress">
        <div class="z-pay-setup__progress-head">
          <div>
            <strong>{{ t('seller.setupProgressLabel', { current: step, total: 3 }) }}</strong>
            <span>{{ setupProgressHint }}</span>
          </div>
          <em>{{ setupProgressPercent }}%</em>
        </div>
        <div class="z-pay-setup__progress-bar" aria-hidden="true">
          <i :style="{ width: `${setupProgressPercent}%` }" />
        </div>
      </div>

      <ol class="z-pay-setup__stepper" :aria-label="t('seller.paymentSetupTitle')">
        <li
          v-for="item in setupSteps"
          :key="item.id"
          class="z-pay-setup__stepper-item"
          :class="{
            'is-active': item.active,
            'is-done': item.done,
            'is-locked': item.locked,
          }"
        >
          <button
            type="button"
            class="z-pay-setup__stepper-btn"
            :disabled="item.locked"
            @click="goToSetupTab(item.id)"
          >
            <span class="z-pay-setup__stepper-icon">
              <i v-if="item.done" class="material-icons">check</i>
              <i v-else class="material-icons">{{ item.icon }}</i>
            </span>
            <span class="z-pay-setup__stepper-copy">
              <em>{{ t('seller.setupStepNum', { n: item.num }) }}</em>
              <strong>{{ item.label }}</strong>
              <small>{{ item.hint }}</small>
            </span>
          </button>
        </li>
      </ol>

      <section class="z-pay-setup__flow">
        <header>
          <h4>{{ t('seller.setupFlowTitle') }}</h4>
          <p>{{ t('seller.setupFlowSub') }}</p>
        </header>
        <ol class="z-pay-setup__flow-steps">
          <li
            v-for="flowStep in moneyFlowSteps"
            :key="flowStep.id"
            :class="{
              'is-done': flowStep.done,
              'is-current': flowStep.current,
            }"
          >
            <i class="material-icons">{{ flowStep.icon }}</i>
            <div>
              <strong>{{ t(`seller.flow_${flowStep.id}`) }}</strong>
              <span>{{ t(`seller.flow_${flowStep.id}Hint`) }}</span>
            </div>
          </li>
        </ol>
      </section>

      <ul class="z-pay-setup__checklist" :aria-label="t('seller.setupChecklistTitle')">
        <li v-for="check in stepChecklist" :key="check.label" :class="{ 'is-done': check.done }">
          <i class="material-icons">{{ check.done ? 'check_circle' : 'radio_button_unchecked' }}</i>
          {{ check.label }}
        </li>
      </ul>

      <!-- Step 1: Pay-in -->
      <div v-if="setupTab === 'payin'" class="z-pay-setup__panel">
        <div class="z-pay-setup__panel-main">
          <h3>{{ t('seller.setupPayinTitle') }}</h3>
          <p class="z-pay-setup__lead">{{ t('seller.setupPayinLead') }}</p>

          <ul class="z-pay-setup__payin">
            <li
              v-for="item in payinOptions"
              :key="item.id"
              class="z-pay-setup__payin-card"
              :class="{ 'is-on': payinDraft[item.id], 'is-soon': item.soon }"
            >
              <div class="z-pay-setup__payin-icon">
                <i class="material-icons">{{ item.icon }}</i>
              </div>
              <div class="z-pay-setup__payin-body">
                <div class="z-pay-setup__payin-top">
                  <strong>{{ t(`seller.payin_${item.id}`) }}</strong>
                  <span v-if="item.soon" class="z-pay-setup__badge">{{ t('seller.setupComingSoon') }}</span>
                </div>
                <p>{{ t(`seller.setupPayin_${item.id}Hint`) }}</p>
                <ul class="z-pay-setup__meta">
                  <li v-for="(chip, idx) in item.metaKeys" :key="idx">
                    <i class="material-icons">{{ chip.icon }}</i>
                    {{ t(chip.key) }}
                  </li>
                </ul>
              </div>
              <label v-if="!item.soon" class="z-pay-setup__toggle">
                <input
                  type="checkbox"
                  :checked="payinDraft[item.id]"
                  @change="togglePayin(item.id)"
                />
                <span aria-hidden="true" />
              </label>
            </li>
          </ul>

          <p v-if="!payinValid" class="z-pay-setup__warn">
            <i class="material-icons">info</i>
            {{ t('seller.setupPayinRequired') }}
          </p>
        </div>

        <aside class="z-pay-setup__aside">
          <h4>{{ t('seller.setupPayinAsideTitle') }}</h4>
          <p>{{ t('seller.setupPayinAsideHint') }}</p>
          <ul>
            <li v-for="tip in payinAsideTips" :key="tip">
              <i class="material-icons">check_circle</i>
              {{ t(tip) }}
            </li>
          </ul>
        </aside>
      </div>

      <!-- Step 2: Payout -->
      <div v-else-if="setupTab === 'payout'" class="z-pay-setup__panel">
        <div class="z-pay-setup__panel-main">
          <h3>{{ t('seller.setupPayoutTitle') }}</h3>
          <p class="z-pay-setup__lead">{{ t('seller.setupPayoutLead') }}</p>

          <div class="z-pay-setup__method-tabs" role="tablist">
            <button
              v-for="method in payoutMethods"
              :key="method.id"
              type="button"
              role="tab"
              class="z-pay-setup__method-tab"
              :class="{ 'is-active': draftMethod === method.id }"
              :aria-selected="draftMethod === method.id"
              @click="selectMethod(method.id)"
            >
              <i class="material-icons">{{ method.icon }}</i>
              {{ method.label }}
            </button>
          </div>

          <div class="z-pay-setup__payout-grid">
            <div class="z-pay-setup__form">
              <p class="z-pay-setup__form-hint">{{ payoutDetailsHint }}</p>

              <div class="z-field">
                <label class="z-label" for="pay-name">{{ t('seller.payoutAccountName') }}</label>
                <input
                  id="pay-name"
                  v-model="form.accountName"
                  class="z-input"
                  :placeholder="t('seller.payoutAccountNamePh')"
                  autocomplete="name"
                />
              </div>

              <div v-if="draftMethod === 'bank'" class="z-field">
                <label class="z-label" for="pay-bank">{{ t('seller.payoutBankName') }}</label>
                <input
                  id="pay-bank"
                  v-model="form.bankName"
                  class="z-input"
                  :placeholder="t('seller.payoutBankNamePh')"
                />
              </div>

              <div v-if="draftMethod === 'aba'" class="z-field z-pay-setup__khqr">
                <label class="z-label">{{ t('seller.payoutKhqr') }}</label>
                <p class="z-pay-setup__khqr-lead">{{ t('seller.payoutKhqrHint') }}</p>
                <div v-if="form.khqrImage" class="z-pay-setup__khqr-preview">
                  <img :src="form.khqrImage" alt="KHQR preview" />
                  <button class="z-btn z-btn-ghost" type="button" @click="clearKhqr">
                    {{ t('seller.payoutKhqrRemove') }}
                  </button>
                </div>
                <button
                  v-else
                  class="z-pay-setup__khqr-upload"
                  type="button"
                  @click="khqrInput?.click()"
                >
                  <i class="material-icons">qr_code_2</i>
                  <span>{{ t('seller.payoutKhqrUpload') }}</span>
                  <small>{{ t('seller.payoutKhqrUploadHint') }}</small>
                </button>
                <input ref="khqrInput" type="file" accept="image/*" hidden @change="onKhqrPick" />
                <small class="z-pay-setup__field-hint">{{ t('seller.payoutKhqrOrPhone') }}</small>
              </div>

              <div v-if="draftMethod !== 'aba' || !form.khqrImage" class="z-field">
                <label class="z-label" for="pay-ref">{{ accountLabel(draftMethod) }}</label>
                <input
                  id="pay-ref"
                  v-model="form.accountRef"
                  class="z-input"
                  :placeholder="accountPlaceholder(draftMethod)"
                  inputmode="numeric"
                />
                <small class="z-pay-setup__field-hint">{{ accountHint(draftMethod) }}</small>
              </div>

              <div v-else class="z-field">
                <label class="z-label" for="pay-ref">{{ t('seller.payoutPhoneNumber') }} ({{ t('seller.optional') }})</label>
                <input
                  id="pay-ref"
                  v-model="form.accountRef"
                  class="z-input"
                  :placeholder="t('seller.payoutPhoneNumberPh')"
                  inputmode="numeric"
                />
              </div>
            </div>

            <div class="z-pay-setup__method-detail">
              <h4>{{ payoutMethodLabel(draftMethod) }}</h4>
              <ul>
                <li v-for="detail in payoutDetailKeys" :key="detail">
                  <i class="material-icons">arrow_forward</i>
                  {{ t(detail) }}
                </li>
              </ul>
              <p class="z-pay-setup__timing">
                <i class="material-icons">schedule</i>
                {{ payoutTiming(draftMethod) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Review -->
      <div v-else class="z-pay-setup__panel is-review">
        <div class="z-pay-setup__panel-main">
          <h3>{{ t('seller.payoutConfirmTitle') }}</h3>
          <p class="z-pay-setup__lead">{{ t('seller.setupReviewLead') }}</p>

          <div class="z-pay-setup__review-block">
            <h4>{{ t('seller.setupPayinTitle') }}</h4>
            <ul class="z-pay-setup__chips">
              <li v-for="id in enabledPayinIds()" :key="id">
                <i class="material-icons">{{ payinIcon(id) }}</i>
                {{ t(`seller.payin_${id}`) }}
              </li>
            </ul>
          </div>

          <dl class="z-pay-setup__review">
            <div>
              <dt>{{ t('seller.payoutReviewMethod') }}</dt>
              <dd>{{ payoutMethodLabel(draftMethod) }}</dd>
            </div>
            <div>
              <dt>{{ t('seller.payoutAccountName') }}</dt>
              <dd>{{ form.accountName }}</dd>
            </div>
            <div v-if="draftMethod === 'bank'">
              <dt>{{ t('seller.payoutBankName') }}</dt>
              <dd>{{ form.bankName }}</dd>
            </div>
            <div v-if="form.khqrImage && draftMethod === 'aba'">
              <dt>{{ t('seller.payoutKhqr') }}</dt>
              <dd><img class="z-pay-setup__khqr-thumb" :src="form.khqrImage" alt="KHQR" /></dd>
            </div>
            <div v-if="form.accountRef">
              <dt>{{ accountLabel(draftMethod) }}</dt>
              <dd>{{ form.accountRef }}</dd>
            </div>
          </dl>

          <label class="z-pay-setup__confirm">
            <input v-model="confirmChecked" type="checkbox" />
            <span>{{ t('seller.payoutConfirmCheck') }}</span>
          </label>
        </div>

        <aside class="z-pay-setup__aside">
          <h4>{{ t('seller.payoutPolicyTitle') }}</h4>
          <ul>
            <li v-for="policy in policyItems" :key="policy.title">
              <i class="material-icons">{{ policy.icon }}</i>
              <div>
                <strong>{{ t(policy.title) }}</strong>
                <span>{{ t(policy.hint) }}</span>
              </div>
            </li>
          </ul>
        </aside>
      </div>

      <footer class="z-pay-setup__foot">
        <button
          v-if="setupTab !== 'payin'"
          class="z-btn z-btn-ghost"
          type="button"
          @click="prevStep"
        >
          {{ t('seller.back') }}
        </button>
        <button
          v-if="setupTab !== 'review'"
          class="z-btn z-btn-deal"
          type="button"
          :disabled="setupTab === 'payin' ? !payinValid : !detailsValid()"
          @click="nextStep"
        >
          {{ t('seller.continue') }}
        </button>
        <button
          v-else
          class="z-btn z-btn-deal"
          type="button"
          :disabled="!confirmChecked"
          @click="onSave"
        >
          {{ t('seller.paymentSetupSave') }}
        </button>
      </footer>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import {
  useSellerPayout,
  type PayinSetupId,
  type PaymentSetupTab,
  type PayoutMethodId,
} from 'src/composables/useSellerPayout';

type PayinOption = {
  id: PayinSetupId;
  icon: string;
  soon: boolean;
  metaKeys: { icon: string; key: string }[];
};

const emit = defineEmits<{ saved: [] }>();

const { t } = useI18n();

const {
  savedProfile,
  savedPayin,
  wizardOpen,
  setupTab,
  step,
  draftMethod,
  confirmChecked,
  payinDraft,
  form,
  isConfigured,
  payinValid,
  maskedAccountRef,
  resetWizard,
  togglePayin,
  enabledPayinIds,
  selectMethod,
  detailsValid,
  nextStep,
  prevStep,
  goToSetupTab,
  savePayoutProfile,
  clearKhqr,
  abaPayoutValid,
} = useSellerPayout();

const khqrInput = ref<HTMLInputElement | null>(null);

const enabledPayinCount = computed(() => enabledPayinIds().length);

const setupProgressPercent = computed(() => {
  if (confirmChecked.value) return 100;
  if (detailsValid() && payinValid.value) {
    return setupTab.value === 'review' ? 85 : 67;
  }
  if (payinValid.value) {
    return setupTab.value === 'payout' ? 50 : 34;
  }
  return enabledPayinCount.value > 0 ? 12 : 4;
});

const setupProgressHint = computed(() => {
  if (setupTab.value === 'payin') {
    return payinValid.value
      ? t('seller.setupProgressPayinDone')
      : t('seller.setupProgressPayinActive', { n: enabledPayinCount.value });
  }
  if (setupTab.value === 'payout') {
    return detailsValid()
      ? t('seller.setupProgressPayoutDone')
      : t('seller.setupProgressPayoutActive');
  }
  return confirmChecked.value
    ? t('seller.setupProgressReviewDone')
    : t('seller.setupProgressReviewActive');
});

const setupSteps = computed(() => {
  const steps: Array<{
    id: PaymentSetupTab;
    num: number;
    icon: string;
    label: string;
    hint: string;
    done: boolean;
    active: boolean;
    locked: boolean;
  }> = [
    {
      id: 'payin',
      num: 1,
      icon: 'shopping_cart_checkout',
      label: t('seller.setupStepPayin'),
      hint: t('seller.setupStepPayinHint'),
      done: payinValid.value,
      active: setupTab.value === 'payin',
      locked: false,
    },
    {
      id: 'payout',
      num: 2,
      icon: 'account_balance_wallet',
      label: t('seller.setupStepPayout'),
      hint: t('seller.setupStepPayoutHint'),
      done: detailsValid(),
      active: setupTab.value === 'payout',
      locked: !payinValid.value,
    },
    {
      id: 'review',
      num: 3,
      icon: 'fact_check',
      label: t('seller.setupStepReview'),
      hint: t('seller.setupStepReviewHint'),
      done: isConfigured.value,
      active: setupTab.value === 'review',
      locked: !payinValid.value || !detailsValid(),
    },
  ];
  return steps;
});

const moneyFlowSteps = computed(() => {
  const onPayin = setupTab.value === 'payin';
  const onPayout = setupTab.value === 'payout';
  const onReview = setupTab.value === 'review';
  return [
    {
      id: 'payin',
      icon: 'shopping_cart_checkout',
      done: payinValid.value,
      current: onPayin,
    },
    {
      id: 'hold',
      icon: 'hourglass_top',
      done: payinValid.value && !onPayin,
      current: payinValid.value && onPayout,
    },
    {
      id: 'deliver',
      icon: 'local_shipping',
      done: detailsValid() && onReview,
      current: detailsValid() && onPayout,
    },
    {
      id: 'payout',
      icon: 'account_balance_wallet',
      done: isConfigured.value,
      current: onReview && detailsValid(),
    },
  ];
});

const moneyFlowStepsComplete = [
  { id: 'payin', icon: 'shopping_cart_checkout' },
  { id: 'hold', icon: 'hourglass_top' },
  { id: 'deliver', icon: 'local_shipping' },
  { id: 'payout', icon: 'account_balance_wallet' },
] as const;

const stepChecklist = computed(() => {
  if (setupTab.value === 'payin') {
    return [
      {
        done: enabledPayinCount.value > 0,
        label: t('seller.setupCheckPayinOne', { n: enabledPayinCount.value }),
      },
      {
        done: payinValid.value,
        label: t('seller.setupCheckPayinReady'),
      },
    ];
  }
  if (setupTab.value === 'payout') {
    return [
      {
        done: form.accountName.trim().length >= 2,
        label: t('seller.setupCheckPayoutName'),
      },
      ...(draftMethod.value === 'aba'
        ? [
            {
              done: !!form.khqrImage,
              label: t('seller.setupCheckKhqr'),
            },
            {
              done: abaPayoutValid(),
              label: t('seller.setupCheckPayoutAba'),
            },
          ]
        : [
            {
              done: form.accountRef.trim().length > 0,
              label: t('seller.setupCheckPayoutRef'),
            },
          ]),
      {
        done: detailsValid(),
        label: t('seller.setupCheckPayoutValid'),
      },
    ];
  }
  return [
    { done: payinValid.value, label: t('seller.setupStepPayin') },
    { done: detailsValid(), label: t('seller.setupStepPayout') },
    { done: confirmChecked.value, label: t('seller.setupCheckConfirm') },
  ];
});

const payinAsideTips = [
  'seller.setupPayinTip1',
  'seller.setupPayinTip2',
  'seller.setupPayinTip3',
] as const;

const policyItems = [
  { icon: 'schedule', title: 'seller.payoutPolicySchedule', hint: 'seller.payoutPolicyScheduleHint' },
  { icon: 'paid', title: 'seller.payoutPolicyMinimum', hint: 'seller.payoutPolicyMinimumHint' },
  { icon: 'percent', title: 'seller.payoutPolicyFee', hint: 'seller.payoutPolicyFeeHint' },
  { icon: 'lock', title: 'seller.payoutPolicySecure', hint: 'seller.payoutPolicySecureHint' },
] as const;

const payinOptions = computed((): PayinOption[] => [
  {
    id: 'aba',
    icon: 'qr_code_2',
    soon: false,
    metaKeys: [
      { icon: 'bolt', key: 'seller.setupPayin_abaMeta1' },
      { icon: 'verified_user', key: 'seller.setupPayin_abaMeta2' },
    ],
  },
  {
    id: 'wing',
    icon: 'phone_android',
    soon: false,
    metaKeys: [
      { icon: 'bolt', key: 'seller.setupPayin_wingMeta1' },
      { icon: 'verified_user', key: 'seller.setupPayin_wingMeta2' },
    ],
  },
  {
    id: 'cod',
    icon: 'local_shipping',
    soon: false,
    metaKeys: [
      { icon: 'groups', key: 'seller.setupPayin_codMeta1' },
      { icon: 'schedule', key: 'seller.setupPayin_codMeta2' },
    ],
  },
]);

const payoutMethods = computed(() => [
  {
    id: 'aba' as const,
    label: 'ABA',
    hint: t('seller.payAba'),
    icon: 'account_balance',
  },
  {
    id: 'wing' as const,
    label: 'Wing',
    hint: t('seller.payWing'),
    icon: 'phone_android',
  },
  {
    id: 'bank' as const,
    label: t('seller.payBank'),
    hint: t('seller.payBankHint'),
    icon: 'savings',
  },
]);

const payoutDetailKeys = computed(() => {
  if (draftMethod.value === 'aba') {
    return ['seller.setupPayout_abaDetail1', 'seller.setupPayout_abaDetail2', 'seller.setupPayout_abaDetail3'];
  }
  if (draftMethod.value === 'wing') {
    return ['seller.setupPayout_wingDetail1', 'seller.setupPayout_wingDetail2', 'seller.setupPayout_wingDetail3'];
  }
  return ['seller.setupPayout_bankDetail1', 'seller.setupPayout_bankDetail2', 'seller.setupPayout_bankDetail3'];
});

const payoutDetailsHint = computed(() => {
  if (draftMethod.value === 'aba') return t('seller.payoutDetailsAbaKhqr');
  if (draftMethod.value === 'wing') return t('seller.payoutDetailsWing');
  return t('seller.payoutDetailsBank');
});

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('read'));
    };
    reader.onerror = () => reject(new Error('read'));
    reader.readAsDataURL(file);
  });
}

async function onKhqrPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file?.type.startsWith('image/')) return;
  try {
    form.khqrImage = await readImage(file);
  } catch {
    Notify.create({ type: 'negative', message: t('seller.uploadFailed'), position: 'top' });
  }
  (e.target as HTMLInputElement).value = '';
}

function accountLabel(method: PayoutMethodId) {
  return method === 'bank' ? t('seller.payoutAccountNumber') : t('seller.payoutPhoneNumber');
}

function accountPlaceholder(method: PayoutMethodId) {
  return method === 'bank' ? t('seller.payoutAccountNumberPh') : t('seller.payoutPhoneNumberPh');
}

function accountHint(method: PayoutMethodId) {
  return method === 'bank' ? t('seller.payoutAccountNumberHint') : t('seller.payoutPhoneNumberHint');
}

function payoutMethodLabel(id: PayoutMethodId) {
  return payoutMethods.value.find((m) => m.id === id)?.label ?? id;
}

function payoutMethodIcon(id: PayoutMethodId) {
  return payoutMethods.value.find((m) => m.id === id)?.icon ?? 'payments';
}

function payoutTiming(id: PayoutMethodId) {
  if (id === 'aba') return t('seller.payoutTimingAba');
  if (id === 'wing') return t('seller.payoutTimingWing');
  return t('seller.payoutTimingBank');
}

function payinIcon(id: PayinSetupId) {
  const icons: Record<PayinSetupId, string> = {
    aba: 'qr_code_2',
    wing: 'phone_android',
    cod: 'local_shipping',
  };
  return icons[id];
}

function onSave() {
  if (savePayoutProfile()) emit('saved');
}
</script>
