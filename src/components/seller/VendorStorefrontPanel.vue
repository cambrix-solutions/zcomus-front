<template>
  <div class="z-storefront-editor">
    <header class="z-storefront-hero-card">
      <div class="z-storefront-hero-card__row">
        <div class="z-storefront-hero-card__intro">
          <p class="z-storefront-editor__kicker">{{ t('seller.storefront') }}</p>
          <h1>{{ shop.name }}</h1>
          <p class="z-storefront-hero-card__sub">{{ t('seller.storefrontSub') }}</p>
        </div>
        <div class="z-storefront-hero-card__actions">
          <span v-if="isDirty" class="z-storefront-editor__dirty">{{ t('seller.storeUnsaved') }}</span>
          <router-link v-if="storeUrl" class="z-btn z-btn-ghost" :to="storeUrl" target="_blank">
            <i class="material-icons">open_in_new</i>
            {{ t('seller.previewStore') }}
          </router-link>
          <button class="z-btn z-btn-deal" type="button" @click="onSave">
            <i class="material-icons">publish</i>
            {{ t('seller.saveStorefront') }}
          </button>
        </div>
      </div>

      <div class="z-storefront-score" role="status">
        <div class="z-storefront-score__head">
          <div class="z-storefront-score__ring" aria-hidden="true">
            <svg viewBox="0 0 36 36">
              <path
                class="z-storefront-score__ring-track"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="z-storefront-score__ring-fill"
                :stroke-dasharray="`${completeness}, 100`"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <b>{{ completeness }}%</b>
          </div>
          <div class="z-storefront-score__copy">
            <strong>{{ t('seller.storeCompleteness', { n: completeness }) }}</strong>
            <span>{{ nextStepHint }}</span>
          </div>
        </div>
        <div class="z-storefront-score__bar" aria-hidden="true">
          <i :style="{ width: `${Math.max(completeness, 4)}%` }" />
        </div>
        <ul class="z-storefront-score__tips">
          <li
            v-for="tip in setupTips"
            :key="tip.id"
            :class="{ 'is-done': tip.done, 'is-next': tip.id === nextTipId && !tip.done }"
          >
            <i class="material-icons">{{ tip.done ? 'check_circle' : tip.id === nextTipId ? 'arrow_forward' : 'radio_button_unchecked' }}</i>
            {{ tip.label }}
          </li>
        </ul>
      </div>
    </header>

    <div class="z-storefront-editor__grid">
      <div class="z-storefront-editor__form">
        <!-- Visual -->
        <section class="z-studio-block z-storefront-section">
          <header class="z-storefront-section__head">
            <em>1</em>
            <div>
              <h2>{{ t('seller.storeSectionVisual') }}</h2>
              <p>{{ t('seller.storeSectionVisualHint') }}</p>
            </div>
          </header>

          <div
            class="z-storefront-hero-compose"
            :class="[`z-vendor-hero--${draft.theme}`]"
            :style="previewStyle"
          >
            <p v-if="draft.announcement" class="z-vendor-hero__announce">{{ draft.announcement }}</p>
            <div
              class="z-storefront-hero-compose__media"
              role="button"
              tabindex="0"
              @click="coverInput?.click()"
              @keydown.enter="coverInput?.click()"
            >
              <img class="z-vendor-hero__cover" :src="draft.cover" :alt="draft.name" />
              <div class="z-vendor-hero__shade" />
              <div class="z-storefront-hero-compose__overlay">
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click.stop="coverInput?.click()">
                  <i class="material-icons">photo_camera</i>
                  {{ t('seller.changeCover') }}
                </button>
                <button
                  v-if="hasCustomCover"
                  class="z-btn z-btn-sm z-btn-ghost"
                  type="button"
                  @click.stop="resetCover"
                >
                  {{ t('seller.resetCover') }}
                </button>
              </div>
              <button
                type="button"
                class="z-storefront-hero-compose__logo"
                :aria-label="t('seller.changeLogo')"
                @click.stop="logoInput?.click()"
              >
                <img v-if="draft.logo" :src="draft.logo" :alt="draft.name" />
                <em v-else>{{ shopInitial }}</em>
                <i class="material-icons z-storefront-hero-compose__logo-edit" aria-hidden="true">edit</i>
              </button>
            </div>
            <input ref="coverInput" type="file" accept="image/*" hidden @change="onCoverPick" />
            <input ref="logoInput" type="file" accept="image/*" hidden @change="onLogoPick" />
          </div>

          <div class="z-storefront-presets">
            <span class="z-label">{{ t('seller.coverPresets') }}</span>
            <div class="z-storefront-presets__row">
              <button
                v-for="preset in coverPresets"
                :key="preset.id"
                type="button"
                class="z-storefront-preset"
                :style="{ background: preset.css }"
                :title="preset.label"
                @click="applyCoverPreset(preset)"
              />
            </div>
          </div>

          <div class="z-field">
            <label class="z-label" for="sf-announce">{{ t('seller.storeAnnouncement') }}</label>
            <input
              id="sf-announce"
              v-model="draft.announcement"
              class="z-input"
              maxlength="120"
              :placeholder="t('seller.storeAnnouncementPh')"
            />
            <small class="z-storefront-char">{{ draft.announcement.length }}/120</small>
          </div>
        </section>

        <!-- Story -->
        <section class="z-studio-block z-storefront-section">
          <header class="z-storefront-section__head">
            <em>2</em>
            <div>
              <h2>{{ t('seller.storeSectionStory') }}</h2>
              <p>{{ t('seller.storeSectionStoryHint') }}</p>
            </div>
          </header>

          <div class="z-field">
            <label class="z-label" for="sf-tagline">{{ t('seller.storeTagline') }}</label>
            <input
              id="sf-tagline"
              v-model="draft.tagline"
              class="z-input"
              maxlength="80"
              :placeholder="t('seller.storeTaglinePh')"
            />
            <small class="z-storefront-char">{{ draft.tagline.length }}/80</small>
          </div>

          <div class="z-field">
            <label class="z-label" for="sf-bio">{{ t('seller.bio') }}</label>
            <textarea
              id="sf-bio"
              v-model="draft.bio"
              class="z-input z-textarea"
              rows="4"
              maxlength="320"
              :placeholder="t('seller.bioPh')"
            />
            <small class="z-storefront-char">{{ draft.bio.length }}/320</small>
          </div>
        </section>

        <!-- Contact & URL -->
        <section class="z-studio-block z-storefront-section">
          <header class="z-storefront-section__head">
            <em>3</em>
            <div>
              <h2>{{ t('seller.storeSectionContact') }}</h2>
              <p>{{ t('seller.storeSectionContactHint') }}</p>
            </div>
          </header>

          <div class="z-seller-form-row">
            <div class="z-field">
              <label class="z-label" for="sf-address">{{ t('seller.storeAddress') }}</label>
              <input id="sf-address" v-model="draft.address" class="z-input" :placeholder="t('seller.storeAddressPh')" />
            </div>
            <div class="z-field">
              <label class="z-label" for="sf-phone">{{ t('seller.phone') }}</label>
              <input id="sf-phone" v-model="draft.phone" class="z-input" />
            </div>
          </div>

          <div class="z-field">
            <label class="z-label" for="sf-slug">{{ t('seller.storeUrl') }}</label>
            <div class="z-storefront-slug">
              <span>{{ origin }}/vendors/</span>
              <input
                id="sf-slug"
                v-model="draft.slug"
                class="z-input"
                :placeholder="slugPreview"
                @blur="normalizeSlug"
              />
            </div>
            <small class="z-muted">{{ t('seller.storeUrlHint') }}</small>
          </div>
        </section>

        <!-- Style -->
        <section class="z-studio-block z-storefront-section">
          <header class="z-storefront-section__head">
            <em>4</em>
            <div>
              <h2>{{ t('seller.storeSectionStyle') }}</h2>
              <p>{{ t('seller.storeSectionStyleHint') }}</p>
            </div>
          </header>

          <div class="z-field">
            <span class="z-label">{{ t('seller.storeAccent') }}</span>
            <div class="z-storefront-swatches">
              <button
                v-for="swatch in accentSwatches"
                :key="swatch"
                type="button"
                class="z-storefront-swatch"
                :class="{ 'is-active': draft.accentColor === swatch }"
                :style="{ background: swatch }"
                @click="draft.accentColor = swatch"
              />
              <div class="z-storefront-accent">
                <input v-model="draft.accentColor" type="color" aria-label="Custom accent" />
                <input v-model="draft.accentColor" class="z-input" maxlength="7" />
              </div>
            </div>
          </div>

          <div class="z-field">
            <span class="z-label">{{ t('seller.storeTheme') }}</span>
            <div class="z-storefront-themes">
              <button
                v-for="opt in themeOptions"
                :key="opt.id"
                type="button"
                class="z-storefront-theme"
                :class="{ 'is-active': draft.theme === opt.id, [`is-${opt.id}`]: true }"
                @click="draft.theme = opt.id"
              >
                <span class="z-storefront-theme__mock" aria-hidden="true" />
                <strong>{{ opt.label }}</strong>
                <small>{{ opt.hint }}</small>
              </button>
            </div>
          </div>
        </section>
      </div>

      <aside class="z-storefront-editor__preview">
        <div class="z-storefront-browser">
          <div class="z-storefront-browser__chrome">
            <span /><span /><span />
            <em>{{ previewUrl }}</em>
          </div>
          <div class="z-storefront-browser__body">
            <VendorStoreHero :vendor="previewVendor" class="z-storefront-preview-hero" />

            <div v-if="previewListings.length" class="z-storefront-preview-grid">
              <article v-for="item in previewListings" :key="item.id">
                <img v-if="item.image" :src="item.image" :alt="item.title" />
                <i v-else class="material-icons">inventory_2</i>
                <strong>{{ item.title }}</strong>
                <span>${{ item.price }}</span>
              </article>
            </div>
            <p v-else class="z-storefront-preview-empty">{{ t('seller.previewNoListings') }}</p>
          </div>
        </div>

        <div class="z-storefront-editor__share">
          <button class="z-btn z-btn-ghost" type="button" @click="onCopyLink">
            <i class="material-icons">link</i>
            {{ t('seller.copyStoreLink') }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { slugify, shopSlug } from 'src/data/seller-catalog';
import {
  DEFAULT_SHOP_COVER,
  isCustomShopCover,
  normalizeShopCover,
} from 'src/helper/shopCover';
import { useSellerShop } from 'src/composables/useSellerShop';
import VendorStoreHero from 'components/store/VendorStoreHero.vue';
import type { Vendor } from 'src/data/mock-vendors';

const emit = defineEmits<{ saved: [] }>();

const { t } = useI18n();
const { shop, listings, listingCount, saveProfile, storeUrl } = useSellerShop();

const DEFAULT_COVER = DEFAULT_SHOP_COVER;
const accentSwatches = ['#A6704D', '#F9F7F2', '#2D2A27'];

const coverInput = ref<HTMLInputElement | null>(null);
const logoInput = ref<HTMLInputElement | null>(null);
const origin = typeof window !== 'undefined' ? window.location.origin : '';

const draft = reactive({
  name: shop.name,
  slug: shop.slug,
  logo: shop.logo,
  cover: normalizeShopCover(shop.cover),
  address: shop.address,
  phone: shop.phone,
  bio: shop.bio,
  tagline: shop.tagline,
  accentColor: shop.accentColor,
  announcement: shop.announcement,
  theme: shop.theme,
});

watch(
  () => [
    shop.name,
    shop.slug,
    shop.logo,
    shop.cover,
    shop.address,
    shop.phone,
    shop.bio,
    shop.tagline,
    shop.accentColor,
    shop.announcement,
    shop.theme,
  ],
  () => {
    draft.name = shop.name;
    draft.slug = shop.slug;
    draft.logo = shop.logo;
    draft.cover = normalizeShopCover(shop.cover);
    draft.address = shop.address;
    draft.phone = shop.phone;
    draft.bio = shop.bio;
    draft.tagline = shop.tagline;
    draft.accentColor = shop.accentColor;
    draft.announcement = shop.announcement;
    draft.theme = shop.theme;
  },
);

const slugPreview = computed(() => slugify(shop.name) || 'your-shop');
const shopInitial = computed(() => (draft.name?.trim()?.[0] || 'V').toUpperCase());
const previewUrl = computed(() => `/vendors/${slugify(draft.slug) || slugify(draft.name) || 'your-shop'}`);
const previewListings = computed(() => listings.value.filter((l) => l.status === 'listed').slice(0, 4));
const hasCustomCover = computed(() => isCustomShopCover(draft.cover));

const previewStyle = computed(() => ({
  '--z-vendor-accent': draft.accentColor || '#A6704D',
}));

const previewVendor = computed((): Vendor => {
  const vendor: Vendor = {
    slug: slugify(draft.slug) || slugify(draft.name) || 'shop',
    name: draft.name || shop.name || 'Shop',
    logo: draft.logo,
    cover: draft.cover,
    products: listingCount.value,
    reviews: 0,
    memberSince: new Date().getFullYear(),
    address: draft.address || 'Cambodia',
    phone: draft.phone,
    industry: 'other',
    description: draft.bio,
    accentColor: draft.accentColor,
    theme: draft.theme,
  };
  if (draft.tagline) vendor.tagline = draft.tagline;
  if (draft.announcement) vendor.announcement = draft.announcement;
  return vendor;
});

const isDirty = computed(
  () =>
    draft.slug !== shop.slug ||
    draft.logo !== shop.logo ||
    draft.cover !== shop.cover ||
    draft.address !== shop.address ||
    draft.phone !== shop.phone ||
    draft.bio !== shop.bio ||
    draft.tagline !== shop.tagline ||
    draft.accentColor !== shop.accentColor ||
    draft.announcement !== shop.announcement ||
    draft.theme !== shop.theme,
);

const completeness = computed(() => {
  let score = 0;
  if (isCustomShopCover(draft.cover)) score += 20;
  if (draft.logo) score += 15;
  if (draft.tagline.trim()) score += 15;
  if (draft.bio.trim()) score += 20;
  if (draft.address.trim()) score += 15;
  if (draft.phone.trim()) score += 15;
  return Math.min(100, score);
});

const setupTips = computed(() => [
  { id: 'cover', done: hasCustomCover.value, label: t('seller.tipCover') },
  { id: 'logo', done: !!draft.logo, label: t('seller.tipLogo') },
  { id: 'story', done: !!(draft.tagline.trim() && draft.bio.trim()), label: t('seller.tipStory') },
  { id: 'contact', done: !!(draft.address.trim() && draft.phone.trim()), label: t('seller.tipContact') },
]);

const nextTipId = computed(() => setupTips.value.find((tip) => !tip.done)?.id ?? '');

const nextStepHint = computed(() => {
  if (completeness.value >= 85) return t('seller.storeCompletenessGreat');
  const next = setupTips.value.find((tip) => !tip.done);
  if (!next) return t('seller.storeCompletenessGood');
  if (next.id === 'cover') return t('seller.nextStepCover');
  if (next.id === 'logo') return t('seller.nextStepLogo');
  if (next.id === 'story') return t('seller.nextStepStory');
  return t('seller.nextStepContact');
});

const themeOptions = computed(() => [
  { id: 'classic' as const, label: t('seller.themeClassic'), hint: t('seller.themeClassicHint') },
  { id: 'minimal' as const, label: t('seller.themeMinimal'), hint: t('seller.themeMinimalHint') },
  { id: 'bold' as const, label: t('seller.themeBold'), hint: t('seller.themeBoldHint') },
]);

const coverPresets = [
  { id: 'ocean', label: 'Ocean', css: 'linear-gradient(135deg, #A6704D 0%, #3A322E 100%)', stops: ['#A6704D', '#3A322E'] as [string, string] },
  { id: 'sunset', label: 'Sunset', css: 'linear-gradient(135deg, #A6704D 0%, #3A322E 100%)', stops: ['#A6704D', '#3A322E'] as [string, string] },
  { id: 'mint', label: 'Mint', css: 'linear-gradient(135deg, #22c55e 0%, #3A322E 100%)', stops: ['#22c55e', '#3A322E'] as [string, string] },
  { id: 'violet', label: 'Violet', css: 'linear-gradient(135deg, #8b5cf6 0%, #3A322E 100%)', stops: ['#8b5cf6', '#3A322E'] as [string, string] },
  { id: 'rose', label: 'Rose', css: 'linear-gradient(135deg, #ec4899 0%, #3A322E 100%)', stops: ['#ec4899', '#3A322E'] as [string, string] },
];

function normalizeSlug() {
  draft.slug = slugify(draft.slug);
}

function gradientDataUrl(colors: [string, string]): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');
  if (!ctx) return DEFAULT_COVER;
  const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grd.addColorStop(0, colors[0]);
  grd.addColorStop(1, colors[1]);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.88);
}

function applyCoverPreset(preset: (typeof coverPresets)[number]) {
  draft.cover = gradientDataUrl(preset.stops);
}

function resetCover() {
  draft.cover = DEFAULT_COVER;
}

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

async function onCoverPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file?.type.startsWith('image/')) return;
  try {
    draft.cover = await readImage(file);
  } catch {
    Notify.create({ type: 'negative', message: t('seller.uploadFailed'), position: 'top' });
  }
  (e.target as HTMLInputElement).value = '';
}

async function onLogoPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file?.type.startsWith('image/')) return;
  try {
    draft.logo = await readImage(file);
  } catch {
    Notify.create({ type: 'negative', message: t('seller.uploadFailed'), position: 'top' });
  }
  (e.target as HTMLInputElement).value = '';
}

function onSave() {
  saveProfile({
    slug: slugify(draft.slug),
    logo: draft.logo,
    cover: draft.cover,
    address: draft.address.trim(),
    phone: draft.phone.trim(),
    bio: draft.bio.trim(),
    tagline: draft.tagline.trim(),
    accentColor: draft.accentColor,
    announcement: draft.announcement.trim(),
    theme: draft.theme,
  });
  Notify.create({ type: 'positive', message: t('seller.storefrontSaved'), position: 'top' });
  emit('saved');
}

function onCopyLink() {
  const slug = shopSlug({ slug: slugify(draft.slug), name: draft.name || shop.name });
  const url = `${window.location.origin}/vendors/${slug}`;
  void navigator.clipboard?.writeText(url).catch(() => undefined);
  Notify.create({ type: 'positive', message: t('seller.shareReady', { name: draft.name || shop.name }), position: 'top' });
}
</script>
