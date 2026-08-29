<template>
  <div
    v-if="showListingForm"
    class="z-modal z-seller-listing-modal"
    @click.self="onCancel"
    @keydown.esc="onCancel"
  >
    <div
      class="z-modal__panel z-seller-listing-dialog is-rich"
      role="dialog"
      aria-modal="true"
      :aria-label="dialogTitle"
    >
      <header class="z-seller-listing-dialog__head">
        <div>
          <p class="z-listing-dialog__step">{{ t('seller.stepOf', { n: tabIndex + 1 }) }}</p>
          <h2>{{ dialogTitle }}</h2>
          <p>{{ t('seller.composeModernHint') }}</p>
        </div>
        <button
          class="z-seller-listing-dialog__close"
          type="button"
          :aria-label="t('seller.cancel')"
          @click="onCancel"
        >
          <i class="material-icons">close</i>
        </button>
      </header>

      <div class="z-listing-dialog__progress" aria-hidden="true">
        <i
          v-for="(tab, i) in tabs"
          :key="tab.id"
          :class="{ 'is-done': i < tabIndex, 'is-active': i === tabIndex }"
        />
      </div>

      <div class="z-seller-dialog-tabs z-listing-dialog__tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :class="{ 'is-active': activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          <i class="material-icons" aria-hidden="true">{{ tab.icon }}</i>
          <span class="z-listing-dialog__tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <form class="z-seller-listing-dialog__body" @submit.prevent="onPublish">
        <!-- PHOTOS -->
        <section v-show="activeTab === 'photos'" class="z-seller-dialog-pane z-listing-photos">
          <label v-if="!form.images.length" class="z-seller-gallery__drop z-listing-photos__drop">
            <i class="material-icons">cloud_upload</i>
            <strong>{{ t('seller.uploadPhoto') }}</strong>
            <span>{{ t('seller.multiPhotoHint') }}</span>
            <em>{{ t('seller.photoCount', { n: 0, max: MAX_LISTING_IMAGES }) }}</em>
            <input class="z-seller-photo__input" type="file" accept="image/*" multiple @change="onPickImages" />
          </label>

          <div v-else class="z-listing-photos__grid">
            <div class="z-listing-photos__preview">
              <div class="z-seller-gallery__main">
                <div class="z-seller-gallery__main-frame">
                  <img :src="coverImage" :alt="form.title || 'Product'" />
                </div>
                <span class="z-seller-gallery__cover-tag">{{ t('seller.coverPhoto') }}</span>
              </div>
              <p class="z-listing-photos__tip">{{ t('seller.multiPhotoHint') }}</p>
            </div>

            <div class="z-listing-photos__strip">
              <div class="z-listing-photos__strip-head">
                <strong>{{ t('seller.photosLabel') }}</strong>
                <span>{{ t('seller.photoCount', { n: form.images.length, max: MAX_LISTING_IMAGES }) }}</span>
              </div>

              <div class="z-seller-gallery__thumbs z-listing-photos__thumbs">
                <div
                  v-for="(img, i) in form.images"
                  :key="`${img.slice(0, 24)}-${i}`"
                  class="z-seller-gallery__thumb"
                  :class="{ 'is-cover': i === 0, 'is-dragging': dragFrom === i }"
                  draggable="true"
                  @dragstart="onDragStart(i)"
                  @dragover.prevent="onDragOver"
                  @drop.prevent="onDrop(i)"
                  @dragend="dragFrom = -1"
                >
                  <button type="button" class="z-seller-gallery__thumb-btn" @click="setCover(i)">
                    <img :src="img" alt="" />
                  </button>
                  <span class="z-seller-gallery__badge">{{ i === 0 ? t('seller.coverShort') : i + 1 }}</span>
                  <div class="z-seller-gallery__thumb-tools">
                    <button type="button" :disabled="i === 0" :title="t('seller.moveLeft')" @click="moveImage(i, i - 1)">
                      <i class="material-icons">chevron_left</i>
                    </button>
                    <button
                      type="button"
                      :disabled="i >= form.images.length - 1"
                      :title="t('seller.moveRight')"
                      @click="moveImage(i, i + 1)"
                    >
                      <i class="material-icons">chevron_right</i>
                    </button>
                  </div>
                  <button type="button" class="z-seller-gallery__remove" @click="removeImage(i)">
                    <i class="material-icons">close</i>
                  </button>
                </div>

                <label v-if="form.images.length < MAX_LISTING_IMAGES" class="z-seller-gallery__add">
                  <i class="material-icons">add_photo_alternate</i>
                  <span>{{ t('seller.addPhotos') }}</span>
                  <input class="z-seller-photo__input" type="file" accept="image/*" multiple @change="onPickImages" />
                </label>
              </div>
            </div>
          </div>

          <div class="z-seller-photo-samples-wrap z-listing-photos__samples">
            <p class="z-seller-photo-samples__label">{{ t('seller.trySamples') }}</p>
            <div class="z-seller-photo-samples">
              <button
                v-for="sample in sampleImages"
                :key="sample"
                type="button"
                class="z-seller-photo-sample"
                :class="{ 'is-active': form.images.includes(sample) }"
                :disabled="form.images.includes(sample) || form.images.length >= MAX_LISTING_IMAGES"
                @click="addSample(sample)"
              >
                <img :src="sample" alt="" />
              </button>
            </div>
          </div>
        </section>

        <!-- DETAILS -->
        <section v-show="activeTab === 'details'" class="z-seller-dialog-pane">
          <div class="z-seller-form-row">
            <div class="z-field" style="grid-column: 1 / -1">
              <label class="z-label" for="list-title">{{ t('seller.listingTitle') }}</label>
              <input id="list-title" v-model="form.title" class="z-input" required :placeholder="t('seller.listingTitlePh')" />
            </div>
            <div class="z-field">
              <label class="z-label" for="list-brand">{{ t('seller.listingBrand') }}</label>
              <input id="list-brand" v-model="form.brand" class="z-input" :placeholder="t('seller.listingBrandPh')" />
            </div>
            <div class="z-field">
              <label class="z-label" for="list-cat">{{ t('seller.listingCategory') }}</label>
              <select id="list-cat" v-model="form.category" class="z-input" required>
                <option v-for="c in listingCategories" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="z-field">
              <label class="z-label" for="list-sku">{{ t('seller.listingSku') }}</label>
              <input id="list-sku" v-model="form.sku" class="z-input" :placeholder="t('seller.listingSkuPh')" />
            </div>
            <div class="z-field">
              <label class="z-label" for="list-status">{{ t('seller.listingStatus') }}</label>
              <select id="list-status" v-model="form.status" class="z-input">
                <option value="listed">{{ t('seller.statusListed') }}</option>
                <option value="draft">{{ t('seller.statusDraft') }}</option>
                <option value="paused">{{ t('seller.statusPaused') }}</option>
              </select>
            </div>
          </div>
          <div class="z-field">
            <label class="z-label" for="list-desc">{{ t('seller.listingDesc') }}</label>
            <textarea
              id="list-desc"
              v-model="form.desc"
              class="z-input z-textarea"
              rows="4"
              :placeholder="t('seller.listingDescPh')"
            />
          </div>
        </section>

        <!-- PRICING -->
        <section v-show="activeTab === 'pricing'" class="z-seller-dialog-pane">
          <div class="z-seller-form-row">
            <div class="z-field">
              <label class="z-label" for="list-price">{{ t('seller.listingPrice') }}</label>
              <input id="list-price" v-model="form.price" class="z-input" type="number" min="0.01" step="0.01" required />
            </div>
            <div class="z-field">
              <label class="z-label" for="list-compare">{{ t('seller.listingCompare') }}</label>
              <input
                id="list-compare"
                v-model="form.compareAt"
                class="z-input"
                type="number"
                min="0"
                step="0.01"
                :placeholder="t('seller.listingComparePh')"
              />
            </div>
            <div class="z-field">
              <label class="z-label" for="list-stock">
                {{ hasOptions ? t('seller.listingStockBase') : t('seller.listingStock') }}
              </label>
              <input
                id="list-stock"
                v-model="form.stock"
                class="z-input"
                type="number"
                min="0"
                required
                :disabled="hasOptions"
              />
            </div>
            <div class="z-field">
              <label class="z-label" for="list-badge">{{ t('seller.listingBadge') }}</label>
              <select id="list-badge" v-model="form.badge" class="z-input">
                <option v-for="b in listingBadges" :key="b || 'none'" :value="b">
                  {{ b || t('seller.badgeNone') }}
                </option>
              </select>
            </div>
          </div>
          <p v-if="discountLabel" class="z-seller-discount-hint">{{ discountLabel }}</p>
        </section>

        <!-- OPTIONS -->
        <section v-show="activeTab === 'options'" class="z-seller-dialog-pane">
          <p class="z-muted z-seller-gallery__hint">{{ t('seller.optionsHintRich') }}</p>
          <div class="z-seller-option-editor">
            <div class="z-field">
              <label class="z-label">{{ t('seller.optionColors') }}</label>
              <div class="z-seller-opt-rows">
                <div v-for="(c, i) in form.colorOptions" :key="`c-${c.name}-${i}`" class="z-seller-opt-row">
                  <span class="z-seller-opt-row__name" :class="{ 'is-off': !c.available }">{{ c.name }}</span>
                  <label class="z-seller-opt-row__toggle">
                    <input v-model="c.available" type="checkbox" />
                    {{ t('seller.optionAvailable') }}
                  </label>
                  <select
                    v-model.number="c.imageIndex"
                    class="z-input z-seller-opt-row__photo"
                    :disabled="!form.images.length"
                  >
                    <option :value="-1">{{ t('seller.colorNoPhoto') }}</option>
                    <option v-for="(_, pi) in form.images" :key="pi" :value="pi">
                      {{ t('seller.colorPhotoN', { n: pi + 1 }) }}
                    </option>
                  </select>
                  <button type="button" class="z-btn z-btn-sm z-btn-ghost" @click="form.colorOptions.splice(i, 1)">
                    ×
                  </button>
                </div>
              </div>
              <div class="z-seller-chips">
                <input
                  v-model="colorDraft"
                  class="z-input z-seller-chip-input"
                  :placeholder="t('seller.optionAddPh')"
                  @keydown.enter.prevent="pushOption('color')"
                />
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="pushOption('color')">
                  {{ t('seller.addOption') }}
                </button>
              </div>
              <div class="z-seller-quick-opts">
                <button
                  v-for="c in colorPresets"
                  :key="c"
                  type="button"
                  :disabled="form.colorOptions.some((o) => o.name === c)"
                  @click="pushOption('color', c)"
                >
                  {{ c }}
                </button>
              </div>
            </div>

            <div class="z-field">
              <label class="z-label">{{ t('seller.optionStyles') }}</label>
              <div class="z-seller-opt-rows">
                <div v-for="(s, i) in form.styleOptions" :key="`s-${s.name}-${i}`" class="z-seller-opt-row">
                  <span class="z-seller-opt-row__name" :class="{ 'is-off': !s.available }">{{ s.name }}</span>
                  <label class="z-seller-opt-row__toggle">
                    <input v-model="s.available" type="checkbox" />
                    {{ t('seller.optionAvailable') }}
                  </label>
                  <button type="button" class="z-btn z-btn-sm z-btn-ghost" @click="form.styleOptions.splice(i, 1)">
                    ×
                  </button>
                </div>
              </div>
              <div class="z-seller-chips">
                <input
                  v-model="styleDraft"
                  class="z-input z-seller-chip-input"
                  :placeholder="t('seller.optionAddPh')"
                  @keydown.enter.prevent="pushOption('style')"
                />
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="pushOption('style')">
                  {{ t('seller.addOption') }}
                </button>
              </div>
            </div>

            <div class="z-field">
              <label class="z-label">{{ t('seller.optionSizes') }}</label>
              <div class="z-seller-opt-rows">
                <div v-for="(s, i) in form.sizeOptions" :key="`z-${s.name}-${i}`" class="z-seller-opt-row">
                  <span class="z-seller-opt-row__name" :class="{ 'is-off': !s.available }">{{ s.name }}</span>
                  <label class="z-seller-opt-row__toggle">
                    <input v-model="s.available" type="checkbox" />
                    {{ t('seller.optionAvailable') }}
                  </label>
                  <button type="button" class="z-btn z-btn-sm z-btn-ghost" @click="form.sizeOptions.splice(i, 1)">
                    ×
                  </button>
                </div>
              </div>
              <div class="z-seller-chips">
                <input
                  v-model="sizeDraft"
                  class="z-input z-seller-chip-input"
                  :placeholder="t('seller.optionAddPh')"
                  @keydown.enter.prevent="pushOption('size')"
                />
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="pushOption('size')">
                  {{ t('seller.addOption') }}
                </button>
              </div>
              <div class="z-seller-quick-opts">
                <button
                  v-for="s in sizePresets"
                  :key="s"
                  type="button"
                  :disabled="form.sizeOptions.some((o) => o.name === s)"
                  @click="pushOption('size', s)"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <div v-if="hasOptions" class="z-seller-variants">
              <div class="z-seller-variants__head">
                <strong>{{ t('seller.variantsTitle') }}</strong>
                <span class="z-muted">{{ t('seller.variantsHint', { n: form.variants.length, stock: variantsStockTotal }) }}</span>
              </div>
              <div class="z-seller-variants__table">
                <div class="z-seller-variants__row is-head">
                  <span>{{ t('seller.variantCombo') }}</span>
                  <span>{{ t('seller.listingStock') }}</span>
                  <span>{{ t('seller.variantPrice') }}</span>
                </div>
                <div v-for="v in form.variants" :key="v.key" class="z-seller-variants__row">
                  <span class="z-seller-variants__combo">{{ variantLabel(v) }}</span>
                  <input v-model.number="v.stock" class="z-input" type="number" min="0" />
                  <input
                    v-model="v.price"
                    class="z-input"
                    type="number"
                    min="0"
                    step="0.01"
                    :placeholder="form.price || t('seller.variantPricePh')"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- MORE -->
        <section v-show="activeTab === 'more'" class="z-seller-dialog-pane">
          <div class="z-field">
            <label class="z-label" for="list-warranty">{{ t('seller.listingWarranty') }}</label>
            <input
              id="list-warranty"
              v-model="form.warranty"
              class="z-input"
              :placeholder="t('seller.listingWarrantyPh')"
            />
          </div>
          <div class="z-field">
            <label class="z-label" for="list-specs">{{ t('seller.listingSpecs') }}</label>
            <textarea
              id="list-specs"
              v-model="form.specs"
              class="z-input z-textarea"
              rows="4"
              :placeholder="t('seller.listingSpecsPh')"
            />
          </div>
        </section>

        <footer
          class="z-seller-listing-dialog__foot"
          :class="{ 'is-last-step': tabIndex >= tabs.length - 1 }"
        >
          <div class="z-seller-dialog-nav">
            <button v-if="tabIndex > 0" class="z-btn z-btn-ghost" type="button" @click="prevTab">
              {{ t('seller.back') }}
            </button>
            <button v-if="tabIndex < tabs.length - 1" class="z-btn z-btn-ghost" type="button" @click="nextTab">
              {{ t('seller.continue') }}
            </button>
          </div>
          <div class="z-seller-dialog-publish">
            <button class="z-btn z-btn-ghost" type="button" @click="onCancel">{{ t('seller.cancel') }}</button>
            <button class="z-btn z-btn-deal" type="submit" :disabled="!canSave">
              {{ publishLabel }}
            </button>
          </div>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import { mockProducts } from 'src/data/mock-catalog';
import {
  buildVariantMatrix,
  hasOptionGroups,
  listingBadges,
  listingCategories,
  MAX_LISTING_IMAGES,
  totalVariantStock,
  type ListingOptionValue,
  type ListingStatus,
  type ListingVariant,
  useSellerShop,
} from 'src/composables/useSellerShop';
import { useSellerUi } from 'src/composables/useSellerUi';

type TabId = 'photos' | 'details' | 'pricing' | 'options' | 'more';
type OptionKind = 'color' | 'style' | 'size';

type FormOption = ListingOptionValue & { imageIndex: number };

type ListingFormState = {
  title: string;
  brand: string;
  price: string;
  compareAt: string;
  stock: string;
  desc: string;
  images: string[];
  category: string;
  sku: string;
  warranty: string;
  badge: string;
  status: ListingStatus;
  colorOptions: FormOption[];
  styleOptions: ListingOptionValue[];
  sizeOptions: ListingOptionValue[];
  variants: ListingVariant[];
  specs: string;
};

const { t } = useI18n();
const { shop, listings, addListing, updateListing } = useSellerShop();
const { showListingForm, editingListingId, isEditingListing, closeListingForm } = useSellerUi();

const sampleImages = mockProducts.slice(0, 6).map((p) => p.image);
const colorPresets = ['Black', 'White', 'Silver', 'Gold', 'Blue'];
const sizePresets = ['S', 'M', 'L', 'XL', '128GB', '256GB', '512GB'];
const activeTab = ref<TabId>('photos');
const colorDraft = ref('');
const styleDraft = ref('');
const sizeDraft = ref('');
const dragFrom = ref(-1);

const tabs = computed(() => [
  { id: 'photos' as const, label: t('seller.tabPhotos'), icon: 'photo_library' },
  { id: 'details' as const, label: t('seller.tabDetails'), icon: 'edit_note' },
  { id: 'pricing' as const, label: t('seller.tabPricing'), icon: 'sell' },
  { id: 'options' as const, label: t('seller.tabOptions'), icon: 'tune' },
  { id: 'more' as const, label: t('seller.tabMore'), icon: 'more_horiz' },
]);

const tabIndex = computed(() => tabs.value.findIndex((tab) => tab.id === activeTab.value));

const form = reactive<ListingFormState>({
  title: '',
  brand: '',
  price: '',
  compareAt: '',
  stock: '1',
  desc: '',
  images: [],
  category: shop.category || 'Electronics',
  sku: '',
  warranty: '',
  badge: '',
  status: 'listed',
  colorOptions: [],
  styleOptions: [],
  sizeOptions: [],
  variants: [],
  specs: '',
});

const dialogTitle = computed(() =>
  isEditingListing.value ? t('seller.editListing') : t('seller.newListing'),
);

const coverImage = computed(() => form.images[0] || '');

const hasOptions = computed(() =>
  hasOptionGroups(form.colorOptions, form.styleOptions, form.sizeOptions),
);

const variantsStockTotal = computed(() => totalVariantStock(form.variants));

const publishLabel = computed(() => {
  if (isEditingListing.value) return t('seller.saveListing');
  if (form.status === 'draft') return t('seller.saveDraft');
  return t('seller.publish');
});

const discountLabel = computed(() => {
  const price = Number(form.price);
  const compare = Number(form.compareAt);
  if (!price || !compare || compare <= price) return '';
  const pct = Math.round(((compare - price) / compare) * 100);
  return t('seller.discountPreview', { n: pct });
});

const effectiveStock = computed(() =>
  hasOptions.value ? variantsStockTotal.value : Number(form.stock) || 0,
);

const canSave = computed(
  () =>
    form.title.trim().length > 1 &&
    Number(form.price) > 0 &&
    effectiveStock.value >= 0 &&
    form.images.length > 0 &&
    !!form.category,
);

function toFormColor(o: ListingOptionValue): FormOption {
  return {
    name: o.name,
    available: o.available !== false,
    imageIndex: typeof o.imageIndex === 'number' ? o.imageIndex : -1,
  };
}

function syncVariants() {
  form.variants = buildVariantMatrix(
    form.colorOptions,
    form.styleOptions,
    form.sizeOptions,
    form.variants,
    Number(form.stock) || 0,
  );
  if (hasOptions.value) {
    form.stock = String(totalVariantStock(form.variants));
  }
}

watch(
  () => [
    form.colorOptions.map((o) => o.name).join('|'),
    form.styleOptions.map((o) => o.name).join('|'),
    form.sizeOptions.map((o) => o.name).join('|'),
  ],
  () => syncVariants(),
);

watch(
  () => form.variants.map((v) => v.stock).join(','),
  () => {
    if (hasOptions.value) form.stock = String(totalVariantStock(form.variants));
  },
);

function resetForm() {
  form.title = '';
  form.brand = '';
  form.price = '';
  form.compareAt = '';
  form.stock = '1';
  form.desc = '';
  form.images = [];
  form.category = shop.category || 'Electronics';
  form.sku = '';
  form.warranty = '12 months';
  form.badge = '';
  form.status = 'listed';
  form.colorOptions = [];
  form.styleOptions = [];
  form.sizeOptions = [];
  form.variants = [];
  form.specs = '';
  activeTab.value = 'photos';
  colorDraft.value = '';
  styleDraft.value = '';
  sizeDraft.value = '';
  dragFrom.value = -1;
}

function loadFormFromListing(id: string) {
  const item = listings.value.find((entry) => entry.id === id);
  if (!item) {
    resetForm();
    return;
  }
  form.title = item.title;
  form.brand = item.brand || '';
  form.price = item.price;
  form.compareAt = item.compareAt || '';
  form.stock = String(item.stock);
  form.desc = item.desc || '';
  form.images = [...(item.images?.length ? item.images : item.image ? [item.image] : [])];
  form.category = item.category || shop.category || 'Electronics';
  form.sku = item.sku || '';
  form.warranty = item.warranty || '';
  form.badge = item.badge || '';
  form.status = item.status || 'listed';
  form.colorOptions = (item.colorOptions || []).map(toFormColor);
  form.styleOptions = (item.styleOptions || []).map((o) => ({ ...o }));
  form.sizeOptions = (item.sizeOptions || []).map((o) => ({ ...o }));
  form.variants = (item.variants || []).map((v) => ({ ...v }));
  form.specs = item.specs || '';
  syncVariants();
  activeTab.value = 'photos';
}

watch(
  () => [showListingForm.value, editingListingId.value] as const,
  ([open, editId]) => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    if (editId) loadFormFromListing(editId);
    else resetForm();
  },
);

function prevTab() {
  if (tabIndex.value > 0) activeTab.value = tabs.value[tabIndex.value - 1]!.id;
}

function nextTab() {
  if (tabIndex.value < tabs.value.length - 1) activeTab.value = tabs.value[tabIndex.value + 1]!.id;
}

function pushOption(kind: OptionKind, raw?: string) {
  const draft =
    kind === 'color' ? colorDraft : kind === 'style' ? styleDraft : sizeDraft;
  const value = (raw ?? draft.value).trim();
  if (!value) return;
  if (kind === 'color') {
    if (form.colorOptions.some((o) => o.name === value)) return;
    form.colorOptions.push({ name: value, available: true, imageIndex: -1 });
    colorDraft.value = '';
  } else if (kind === 'style') {
    if (form.styleOptions.some((o) => o.name === value)) return;
    form.styleOptions.push({ name: value, available: true });
    styleDraft.value = '';
  } else {
    if (form.sizeOptions.some((o) => o.name === value)) return;
    form.sizeOptions.push({ name: value, available: true });
    sizeDraft.value = '';
  }
}

function variantLabel(v: ListingVariant) {
  return [v.color, v.style, v.size].filter(Boolean).join(' · ') || '—';
}

function onCancel() {
  resetForm();
  closeListingForm();
}

function payloadFromForm() {
  return {
    title: form.title,
    brand: form.brand,
    price: form.price,
    compareAt: form.compareAt,
    stock: effectiveStock.value,
    desc: form.desc,
    images: [...form.images],
    category: form.category,
    sku: form.sku,
    warranty: form.warranty,
    badge: form.badge,
    status: form.status,
    colorOptions: form.colorOptions.map((o) => {
      const row: ListingOptionValue = { name: o.name, available: o.available };
      if (o.imageIndex >= 0) row.imageIndex = o.imageIndex;
      return row;
    }),
    styleOptions: form.styleOptions.map((o) => ({ name: o.name, available: o.available })),
    sizeOptions: form.sizeOptions.map((o) => ({ name: o.name, available: o.available })),
    variants: form.variants.map((v) => ({ ...v })),
    specs: form.specs,
  };
}

function onPublish() {
  if (!canSave.value) {
    if (!form.images.length) {
      activeTab.value = 'photos';
      Notify.create({ type: 'warning', message: t('seller.needPhoto'), position: 'top' });
    }
    return;
  }
  const payload = payloadFromForm();
  if (editingListingId.value) {
    updateListing(editingListingId.value, payload);
    resetForm();
    closeListingForm();
    Notify.create({ type: 'positive', message: t('seller.updated'), position: 'top' });
    return;
  }
  addListing(payload);
  resetForm();
  closeListingForm();
  Notify.create({
    type: 'positive',
    message: payload.status === 'draft' ? t('seller.draftSaved') : t('seller.published'),
    position: 'top',
  });
}

function removeImage(index: number) {
  form.images.splice(index, 1);
  for (const c of form.colorOptions) {
    if (typeof c.imageIndex === 'number' && c.imageIndex >= form.images.length) {
      c.imageIndex = -1;
    } else if (typeof c.imageIndex === 'number' && c.imageIndex > index) {
      c.imageIndex -= 1;
    }
  }
}

function setCover(index: number) {
  if (index <= 0 || index >= form.images.length) return;
  moveImage(index, 0);
}

function moveImage(from: number, to: number) {
  if (from < 0 || to < 0 || from >= form.images.length || to >= form.images.length || from === to) return;
  const [picked] = form.images.splice(from, 1);
  if (!picked) return;
  form.images.splice(to, 0, picked);
  for (const c of form.colorOptions) {
    if (c.imageIndex === from) c.imageIndex = to;
    else if (from < to && c.imageIndex > from && c.imageIndex <= to) c.imageIndex -= 1;
    else if (to < from && c.imageIndex >= to && c.imageIndex < from) c.imageIndex += 1;
  }
}

function onDragStart(index: number) {
  dragFrom.value = index;
}

function onDragOver() {
  /* allow drop */
}

function onDrop(to: number) {
  if (dragFrom.value < 0) return;
  moveImage(dragFrom.value, to);
  dragFrom.value = -1;
}

function addSample(sample: string) {
  if (form.images.includes(sample) || form.images.length >= MAX_LISTING_IMAGES) return;
  form.images.push(sample);
}

async function onPickImages(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  input.value = '';
  if (!files.length) return;
  const room = MAX_LISTING_IMAGES - form.images.length;
  if (room <= 0) {
    Notify.create({ type: 'warning', message: t('seller.photoMax', { max: MAX_LISTING_IMAGES }), position: 'top' });
    return;
  }
  const selected = files.slice(0, room);
  let skipped = files.length - selected.length;
  for (const file of selected) {
    if (!file.type.startsWith('image/')) {
      skipped += 1;
      continue;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      form.images.push(await resizeImage(dataUrl, 640));
    } catch {
      skipped += 1;
    }
  }
  if (skipped > 0) {
    Notify.create({ type: 'warning', message: t('seller.photoSomeSkipped', { n: skipped }), position: 'top' });
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
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

function resizeImage(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => reject(new Error('image'));
    img.src = dataUrl;
  });
}
</script>
