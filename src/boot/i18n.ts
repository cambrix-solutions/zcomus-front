import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';
import { applySiteFont } from 'stores/prefs-store';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)['en-US'];

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

function initialLocale(): MessageLanguages {
  try {
    const raw = localStorage.getItem('zcomus-locale');
    return raw === 'km' ? 'km' : 'en-US';
  } catch {
    return 'en-US';
  }
}

export default defineBoot(({ app }) => {
  const locale = initialLocale();
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale,
    fallbackLocale: 'en-US',
    legacy: false,
    messages,
  });

  document.documentElement.lang = locale === 'km' ? 'km' : 'en';
  applySiteFont(locale === 'km' ? 'km' : 'en-US');
  app.use(i18n);
});
