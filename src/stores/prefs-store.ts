import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { DisplayCurrency } from 'src/helper/money';

export type AppLocale = 'en-US' | 'km';

const LOCALE_KEY = 'zcomus-locale';
const CURRENCY_KEY = 'zcomus-currency';

/** EN: Plus Jakarta first · KM: Kantumruy first (Khmer glyphs) */
export function applySiteFont(locale: AppLocale) {
  const stack =
    locale === 'km'
      ? "'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif"
      : "'Plus Jakarta Sans', 'Kantumruy Pro', sans-serif";
  document.documentElement.style.setProperty('--z-font', stack);
  document.body.style.fontFamily = stack;
}

function loadLocale(): AppLocale {
  try {
    const raw = localStorage.getItem(LOCALE_KEY);
    return raw === 'km' ? 'km' : 'en-US';
  } catch {
    return 'en-US';
  }
}

function loadCurrency(): DisplayCurrency {
  try {
    const raw = localStorage.getItem(CURRENCY_KEY);
    return raw === 'KHR' ? 'KHR' : 'USD';
  } catch {
    return 'USD';
  }
}

export const usePrefsStore = defineStore('prefs', () => {
  const locale = ref<AppLocale>(loadLocale());
  const currency = ref<DisplayCurrency>(loadCurrency());

  watch(
    locale,
    (val) => {
      localStorage.setItem(LOCALE_KEY, val);
      document.documentElement.lang = val === 'km' ? 'km' : 'en';
      applySiteFont(val);
    },
    { immediate: true },
  );

  watch(currency, (val) => {
    localStorage.setItem(CURRENCY_KEY, val);
  });

  function setLocale(next: AppLocale) {
    locale.value = next;
  }

  function setCurrency(next: DisplayCurrency) {
    currency.value = next;
  }

  return { locale, currency, setLocale, setCurrency };
});
