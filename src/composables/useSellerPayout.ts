import { computed, reactive, ref } from 'vue';
import { useSellerShop } from 'src/composables/useSellerShop';

export type PayoutMethodId = 'aba' | 'wing' | 'bank';
export type PayinSetupId = 'aba' | 'wing' | 'cod';
export type PaymentSetupTab = 'payin' | 'payout' | 'review';

export type PayoutProfile = {
  method: PayoutMethodId;
  accountName: string;
  accountRef: string;
  bankName: string;
  /** ABA KHQR image for payout transfers (data URL) */
  khqrImage: string;
  savedAt: string;
};

const PROFILE_KEY = 'zcomus-account-payout-profile';
const PAYIN_KEY = 'zcomus-account-payin-setup';
const METHOD_KEY = 'zcomus-seller-payout-method';

const PAYIN_METHODS = ['aba', 'wing', 'cod'] as const;

export type PayinSetup = Record<PayinSetupId, boolean>;

function readPayinSetup(): PayinSetup {
  try {
    const raw = localStorage.getItem(PAYIN_KEY);
    if (!raw) return { aba: true, wing: true, cod: false };
    const parsed = JSON.parse(raw) as Partial<PayinSetup>;
    return {
      aba: parsed.aba ?? true,
      wing: parsed.wing ?? true,
      cod: parsed.cod ?? false,
    };
  } catch {
    return { aba: true, wing: true, cod: false };
  }
}

export const payoutMethodMeta: Record<
  PayoutMethodId,
  { icon: string; settlement: string; processing: string }
> = {
  aba: { icon: 'account_balance', settlement: 'aba', processing: '1-2' },
  wing: { icon: 'phone_android', settlement: 'wing', processing: '1-2' },
  bank: { icon: 'savings', settlement: 'bank', processing: '2-3' },
};

function readProfile(): PayoutProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PayoutProfile>;
    if (!parsed.method || !parsed.accountName || !parsed.accountRef) return null;
    return {
      method: parsed.method,
      accountName: parsed.accountName,
      accountRef: parsed.accountRef,
      bankName: parsed.bankName || '',
      khqrImage: parsed.khqrImage || '',
      savedAt: parsed.savedAt || '',
    };
  } catch {
    return null;
  }
}

function maskRef(ref: string) {
  const clean = ref.replace(/\s/g, '');
  if (clean.length <= 4) return clean;
  return `•••• ${clean.slice(-4)}`;
}

const PAYOUT_METHODS = ['aba', 'wing', 'bank'] as const;

function isPayoutMethodId(value: string): value is PayoutMethodId {
  return (PAYOUT_METHODS as readonly string[]).includes(value);
}

function parsePayoutMethodId(value: string | null | undefined): PayoutMethodId {
  if (value && isPayoutMethodId(value)) return value;
  return 'aba';
}

export function useSellerPayout() {
  const { setPayout, payoutSet } = useSellerShop();

  const savedProfile = ref<PayoutProfile | null>(readProfile());
  if (savedProfile.value && !payoutSet.value) {
    setPayout();
  }
  const savedPayin = ref<PayinSetup>(readPayinSetup());
  const wizardOpen = ref(!savedProfile.value);
  const setupTab = ref<PaymentSetupTab>('payin');
  const step = computed(() => {
    if (setupTab.value === 'payin') return 1 as const;
    if (setupTab.value === 'payout') return 2 as const;
    return 3 as const;
  });
  const draftMethod = ref<PayoutMethodId>(
    parsePayoutMethodId(savedProfile.value?.method ?? localStorage.getItem(METHOD_KEY)),
  );
  const confirmChecked = ref(false);

  const payinDraft = reactive<PayinSetup>({ ...savedPayin.value });

  const form = reactive({
    accountName: savedProfile.value?.accountName || '',
    accountRef: savedProfile.value?.accountRef || '',
    bankName: savedProfile.value?.bankName || '',
    khqrImage: savedProfile.value?.khqrImage || '',
  });

  const isConfigured = computed(() => !!savedProfile.value && payoutSet.value);

  const payinValid = computed(() => PAYIN_METHODS.some((id) => payinDraft[id]));

  const maskedAccountRef = computed(() =>
    savedProfile.value ? maskRef(savedProfile.value.accountRef) : '',
  );

  function resetWizard() {
    wizardOpen.value = true;
    setupTab.value = 'payin';
    confirmChecked.value = false;
    Object.assign(payinDraft, savedPayin.value);
    if (savedProfile.value) {
      draftMethod.value = savedProfile.value.method;
      form.accountName = savedProfile.value.accountName;
      form.accountRef = savedProfile.value.accountRef;
      form.bankName = savedProfile.value.bankName;
      form.khqrImage = savedProfile.value.khqrImage;
    }
  }

  function clearKhqr() {
    form.khqrImage = '';
  }

  function abaPayoutValid() {
    const digits = form.accountRef.replace(/\D/g, '');
    const phoneOk = digits.length >= 8 && digits.length <= 12;
    return phoneOk || form.khqrImage.length > 0;
  }

  function togglePayin(id: PayinSetupId) {
    payinDraft[id] = !payinDraft[id];
  }

  function enabledPayinIds(source: PayinSetup = payinDraft) {
    return PAYIN_METHODS.filter((id) => source[id]);
  }

  function selectMethod(id: PayoutMethodId) {
    draftMethod.value = id;
    localStorage.setItem(METHOD_KEY, id);
  }

  function detailsValid() {
    const name = form.accountName.trim();
    const ref = form.accountRef.trim();
    if (name.length < 2) return false;
    if (draftMethod.value === 'bank') {
      return ref.length >= 6 && form.bankName.trim().length >= 2;
    }
    if (draftMethod.value === 'aba') {
      return abaPayoutValid();
    }
    const digits = ref.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 12;
  }

  function nextStep() {
    if (setupTab.value === 'payin' && payinValid.value) {
      setupTab.value = 'payout';
      return;
    }
    if (setupTab.value === 'payout' && detailsValid()) {
      setupTab.value = 'review';
    }
  }

  function prevStep() {
    if (setupTab.value === 'review') setupTab.value = 'payout';
    else if (setupTab.value === 'payout') setupTab.value = 'payin';
  }

  function goToSetupTab(tab: PaymentSetupTab) {
    if (tab === 'payout' && !payinValid.value) return;
    if (tab === 'review' && (!payinValid.value || !detailsValid())) return;
    setupTab.value = tab;
  }

  function savePayoutProfile() {
    if (!confirmChecked.value || !detailsValid() || !payinValid.value) return false;
    const payin: PayinSetup = {
      aba: payinDraft.aba,
      wing: payinDraft.wing,
      cod: payinDraft.cod,
    };
    const profile: PayoutProfile = {
      method: draftMethod.value,
      accountName: form.accountName.trim(),
      accountRef: form.accountRef.trim(),
      bankName: draftMethod.value === 'bank' ? form.bankName.trim() : '',
      khqrImage: draftMethod.value === 'aba' ? form.khqrImage : '',
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(PAYIN_KEY, JSON.stringify(payin));
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(METHOD_KEY, profile.method);
    savedPayin.value = payin;
    savedProfile.value = profile;
    setPayout();
    wizardOpen.value = false;
    setupTab.value = 'payin';
    confirmChecked.value = false;
    return true;
  }

  return {
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
    clearKhqr,
    abaPayoutValid,
    detailsValid,
    nextStep,
    prevStep,
    goToSetupTab,
    savePayoutProfile,
  };
}
