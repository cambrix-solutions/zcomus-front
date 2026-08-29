import type { RouteLocationNormalized } from 'vue-router';

/** Canonical origin — must match the deployed domain, no trailing slash. */
export const SITE_URL = 'https://zcomus.site';
export const SITE_NAME = 'Zcomus';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/og-image.png`;
export const TWITTER_HANDLE = '';

type Translate = (key: string) => string;

let translate: Translate | null = null;

/** Called from the i18n boot file once vue-i18n exists. */
export function setSeoTranslator(fn: Translate): void {
  translate = fn;
}

function t(key: string | undefined, fallback: string): string {
  if (!key) return fallback;
  if (!translate) return fallback;
  const value = translate(key);
  // vue-i18n echoes the key back when a message is missing
  return value && value !== key ? value : fallback;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export interface SeoInput {
  /** Page title; the brand is appended unless `exactTitle` is set. */
  title?: string;
  /** Use `title` verbatim — for the homepage, which carries the brand itself. */
  exactTitle?: boolean;
  description?: string;
  /** Route path used to build the canonical URL. */
  path?: string;
  /** Absolute image URL for social cards. */
  image?: string;
  noindex?: boolean;
  /** `article` for blog posts, `product` for PDPs, otherwise `website`. */
  type?: 'website' | 'article' | 'product';
}

/** Writes title, description, canonical, robots, Open Graph and Twitter tags. */
export function applySeo(input: SeoInput): void {
  if (typeof document === 'undefined') return;

  const description = input.description ?? '';
  const title = input.title
    ? input.exactTitle
      ? input.title
      : `${input.title} | ${SITE_NAME}`
    : SITE_NAME;
  const path = input.path ?? '/';
  // strip query and hash so canonicals don't fragment
  const canonical = `${SITE_URL}${path.split('?')[0]?.split('#')[0] ?? '/'}`;
  const image = input.image ?? DEFAULT_OG_IMAGE;
  const locale = document.documentElement.lang === 'km' ? 'km_KH' : 'en_US';

  document.title = title;
  if (description) upsertMeta('name', 'description', description);
  upsertLink('canonical', canonical);
  upsertMeta(
    'name',
    'robots',
    input.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
  );

  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:type', input.type ?? 'website');
  upsertMeta('property', 'og:title', title);
  if (description) upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:locale', locale);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  if (description) upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);
  if (TWITTER_HANDLE) upsertMeta('name', 'twitter:site', TWITTER_HANDLE);
}

/** Route-driven entry point, called from the router's `afterEach`. */
export function applyRouteSeo(to: RouteLocationNormalized): void {
  // deepest matched record wins, so child routes can override a section default
  let titleKey: string | undefined;
  let descKey: string | undefined;
  let noindex = false;
  let type: SeoInput['type'];

  for (const record of to.matched) {
    const meta = record.meta as {
      titleKey?: string;
      descKey?: string;
      noindex?: boolean;
      ogType?: SeoInput['type'];
    };
    if (meta.titleKey) titleKey = meta.titleKey;
    if (meta.descKey) descKey = meta.descKey;
    if (meta.noindex !== undefined) noindex = meta.noindex;
    if (meta.ogType) type = meta.ogType;
  }

  // The homepage title already contains the brand, so it is used verbatim.
  const isHome = to.path === '/';
  applySeo({
    title: t(titleKey, SITE_NAME),
    exactTitle: isHome,
    description: t(descKey, t('seo.home.desc', '')),
    path: to.fullPath,
    noindex,
    ...(type ? { type } : {}),
  });
}
