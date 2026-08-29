<template>
  <main class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('shop.title'), to: '/shop' }, { label: product?.name || 'Product' }]" />

    <div v-if="booting || catalog.loading" class="z-fade-item">
      <SkeletonPdp />
    </div>

    <div v-else-if="!product" class="z-empty">
      Product not found.
    </div>

    <template v-else>
      <div class="z-pdp z-fade-item">
        <div class="z-pdp__gallery">
          <img class="main" :src="gallery[activeThumb]" :alt="product.name" />
          <div class="z-thumbs">
            <button
              v-for="(img, i) in gallery"
              :key="i"
              type="button"
              :class="{ 'is-active': activeThumb === i }"
              @click="activeThumb = i"
            >
              <img :src="img" :alt="`${product.name} ${i + 1}`" />
            </button>
          </div>
        </div>

        <div class="z-pdp__buy">
          <h1 class="z-pdp__title">{{ product.name }}</h1>
          <ProductVendorMeta :product="product" :vendor-slug="product.vendor_slug || 'fasfox'" />
          <div class="z-pdp__price">
            <PriceDisplay :amount="displayPrice" :compare-at="product.compare_at_price" />
          </div>
          <p class="z-pdp__desc">{{ shortDesc }}</p>

          <div v-if="colors.length" class="z-pdp__option">
            <p class="z-label">Color: {{ selectedColor }}</p>
            <div class="z-swatch-row">
              <button
                v-for="c in colors"
                :key="c.name"
                class="z-swatch"
                :class="{ 'is-active': selectedColor === c.name }"
                :disabled="c.disabled"
                type="button"
                @click="selectColor(c)"
              >
                {{ c.name }}
              </button>
            </div>
          </div>
          <div v-if="styles.length" class="z-pdp__option">
            <p class="z-label">Style: {{ selectedStyle }}</p>
            <div class="z-swatch-row">
              <button
                v-for="s in styles"
                :key="s.name"
                class="z-swatch"
                :class="{ 'is-active': selectedStyle === s.name }"
                :disabled="s.disabled"
                type="button"
                @click="!s.disabled && (selectedStyle = s.name)"
              >
                {{ s.name }}
              </button>
            </div>
          </div>
          <div v-if="sizes.length" class="z-pdp__option">
            <p class="z-label">Size: {{ selectedSize }}</p>
            <div class="z-swatch-row">
              <button
                v-for="s in sizes"
                :key="s.name"
                class="z-swatch"
                :class="{ 'is-active': selectedSize === s.name }"
                :disabled="s.disabled"
                type="button"
                @click="!s.disabled && (selectedSize = s.name)"
              >
                {{ s.name }}
              </button>
            </div>
          </div>

          <div class="z-pdp__actions">
            <div class="z-qty">
              <button type="button" :disabled="maxQty < 1" @click="qty = Math.max(1, qty - 1)">−</button>
              <input :value="qty" readonly />
              <button type="button" :disabled="maxQty < 1" @click="qty = Math.min(maxQty, qty + 1)">+</button>
            </div>
            <button class="z-btn z-btn-primary" type="button" :disabled="!canPurchase" @click="onAdd">
              {{ canPurchase ? t('product.addCart') : t('product.outOfStock') }}
            </button>
            <button class="z-btn z-btn-deal" type="button" :disabled="!canPurchase" @click="onBuy">
              {{ t('product.buy') }}
            </button>
            <button class="z-btn z-btn-ghost" type="button" @click="onWish">{{ t('product.wishlist') }}</button>
            <button class="z-btn z-btn-ghost" type="button" @click="onCompare">{{ t('nav.compare') }}</button>
          </div>

          <p v-if="variantStockLabel" class="z-muted">{{ variantStockLabel }}</p>

          <p class="z-muted z-pdp__sku">
            SKU: {{ productSku }} · {{ categoryName }} · Ships nationwide in Cambodia
          </p>
        </div>
      </div>

      <div class="z-pdp-sticky">
        <button class="z-btn z-btn-primary" type="button" :disabled="!canPurchase" @click="onAdd">
          {{ canPurchase ? t('product.addCart') : t('product.outOfStock') }}
        </button>
        <button class="z-btn z-btn-deal" type="button" :disabled="!canPurchase" @click="onBuy">
          {{ t('product.buy') }}
        </button>
      </div>

      <section class="z-pdp-panel">
        <h3>Frequently bought together</h3>
        <div class="z-pdp-bundle">
          <label v-for="p in boughtTogether" :key="p.id" class="z-pdp-bundle__item">
            <input v-model="bundleIds" type="checkbox" :value="p.id" />
            <span>{{ p.name }}</span>
            <PriceDisplay :amount="p.price" :alt="false" />
          </label>
        </div>
        <p><strong><PriceDisplay :amount="bundleTotal" /></strong></p>
        <button class="z-btn z-btn-primary" type="button" @click="onAddBundle">{{ t('product.addCart') }}</button>
      </section>

      <section class="z-pdp-panel">
        <div class="z-tabs">
          <button
            v-for="tab in detailTabs"
            :key="tab.id"
            type="button"
            :class="{ 'is-active': detailTab === tab.id }"
            @click="detailTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <div v-if="detailTab === 'description'">
          <p>{{ longDesc }}</p>
        </div>
        <table v-else-if="detailTab === 'specs'" class="z-table">
          <tbody>
            <tr><td>Brand</td><td>{{ product.brand }}</td></tr>
            <tr><td>SKU</td><td>{{ productSku }}</td></tr>
            <tr v-if="selectedStyle"><td>Style</td><td>{{ selectedStyle }}</td></tr>
            <tr v-if="selectedSize"><td>Size</td><td>{{ selectedSize }}</td></tr>
            <tr v-if="selectedColor"><td>Color</td><td>{{ selectedColor }}</td></tr>
            <tr v-for="row in specRows" :key="row.label">
              <td>{{ row.label }}</td>
              <td>{{ row.value }}</td>
            </tr>
            <tr><td>Warranty</td><td>{{ product.warranty || '12 months' }}</td></tr>
          </tbody>
        </table>
        <div v-else-if="detailTab === 'reviews'">
          <div v-for="r in reviews" :key="r.id" class="z-pdp-review">
            <strong>{{ r.name }}</strong>
            <span class="z-muted"> {{ r.date }}</span>
            <p>{{ r.text }}</p>
          </div>
        </div>
        <p v-else>
          Sold by
          <router-link :to="`/vendors/${product.vendor_slug || 'fasfox'}`">
            {{ product.vendor_name || product.brand }}
          </router-link>.
          {{ product.vendor_bio || 'Ships from Cambodia warehouse.' }}
        </p>
      </section>

      <section class="z-section">
        <div class="z-section-head">
          <h2>Related products</h2>
        </div>
        <div class="z-products">
          <ProductCard
            v-for="p in related"
            :key="p.id"
            :product="p"
            @add="(x) => cart.add(x)"
            @open="onOpenRelated"
            @quickview="onQuickviewRelated"
          />
        </div>
      </section>

      <TrustStrip />
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import ProductCard from 'components/store/ProductCard.vue';
import ProductVendorMeta from 'components/shop/ProductVendorMeta.vue';
import PriceDisplay from 'components/store/PriceDisplay.vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import SkeletonPdp from 'components/store/SkeletonPdp.vue';
import { ecom } from 'src/helper/ecomAssets';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useWishlistStore } from 'stores/wishlist-store';
import { useCompareStore } from 'stores/compare-store';
import { useUiStore } from 'stores/ui-store';
import type { Product } from 'src/data/mock-catalog';
import type { CartOptions } from 'stores/cart-store';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const catalog = useCatalogStore();
const wishlist = useWishlistStore();
const compare = useCompareStore();
const ui = useUiStore();
const booting = ref(true);
const { currentProduct, products } = storeToRefs(catalog);
const product = computed(() => currentProduct.value);

const legacyGalleryAssets = [
  ecom('imgs/page/product/img-gallery-1.jpg'),
  ecom('imgs/page/product/img-gallery-2.jpg'),
  ecom('imgs/page/product/img-gallery-3.jpg'),
  ecom('imgs/page/product/img-gallery-4.jpg'),
  ecom('imgs/page/product/img-gallery-5.jpg'),
];

const gallery = computed(() => {
  if (!product.value) return [];
  const own = (product.value.images?.length ? product.value.images : [product.value.image]).filter(Boolean);
  if (product.value.is_seller || own.length > 1) return own.slice(0, 5);
  return [product.value.image, ...legacyGalleryAssets.filter((g) => g !== product.value!.image)].slice(0, 5);
});

function optionDisabled(
  name: string,
  kind: 'color' | 'style' | 'size',
  available: boolean,
): boolean {
  if (!available) return true;
  const variants = product.value?.variants;
  if (!variants?.length) return false;
  return !variants.some((v) => {
    if (kind === 'color' && v.color !== name) return false;
    if (kind === 'style' && v.style !== name) return false;
    if (kind === 'size' && v.size !== name) return false;
    return v.stock > 0;
  });
}

type PdpColor = {
  name: string;
  imageIndex?: number;
  disabled: boolean;
  fallbackIndex?: number;
};

const colors = computed((): PdpColor[] => {
  if (!product.value) return [];
  if (product.value.colorOptions?.length) {
    return product.value.colorOptions.map((o, i) => {
      const row: PdpColor = {
        name: o.name,
        disabled: optionDisabled(o.name, 'color', o.available),
        fallbackIndex: i,
      };
      if (typeof o.imageIndex === 'number') row.imageIndex = o.imageIndex;
      return row;
    });
  }
  if (product.value.colors?.length) {
    return product.value.colors.map((name, i) => ({
      name,
      disabled: false,
      fallbackIndex: i,
    }));
  }
  if (product.value.is_seller) return [];
  return gallery.value.map((_img, i) => ({
    name: ['Pink', 'Gold', 'Pink Gold', 'Silver', 'Black'][i] ?? `Color ${i + 1}`,
    imageIndex: i,
    disabled: i === 0 || i === 4,
    fallbackIndex: i,
  }));
});

const styles = computed(() => {
  if (!product.value) return [] as { name: string; disabled: boolean }[];
  if (product.value.styleOptions?.length) {
    return product.value.styleOptions.map((o) => ({
      name: o.name,
      disabled: optionDisabled(o.name, 'style', o.available),
    }));
  }
  if (product.value.styles?.length) {
    return product.value.styles.map((name) => ({ name, disabled: false }));
  }
  if (product.value.is_seller) return [];
  return ['S22 Ultra', 'S22', 'S22 + Cover'].map((name) => ({ name, disabled: false }));
});

const sizes = computed(() => {
  if (!product.value) return [] as { name: string; disabled: boolean }[];
  if (product.value.sizeOptions?.length) {
    return product.value.sizeOptions.map((o) => ({
      name: o.name,
      disabled: optionDisabled(o.name, 'size', o.available),
    }));
  }
  if (product.value.sizes?.length) {
    return product.value.sizes.map((name) => ({ name, disabled: false }));
  }
  if (product.value.is_seller) return [];
  return ['512 GB', '256 GB', '128 GB'].map((name) => ({ name, disabled: false }));
});

const qty = ref(1);
const activeThumb = ref(0);
const selectedColor = ref('');
const selectedStyle = ref('');
const selectedSize = ref('');
const detailTab = ref<'description' | 'specs' | 'reviews' | 'vendor'>('description');
const bundleIds = ref<number[]>([]);
const detailTabs = [
  { id: 'description' as const, label: 'Description' },
  { id: 'specs' as const, label: 'Specs' },
  { id: 'reviews' as const, label: 'Reviews' },
  { id: 'vendor' as const, label: 'Vendor' },
];
const reviews = [
  { id: 1, name: 'Sopheak M.', date: '10 Aug 2026', text: 'Great quality. Arrived faster than expected.' },
  { id: 2, name: 'Dara K.', date: '02 Aug 2026', text: 'Matches the description. Would buy again.' },
];
const categoryName = computed(() => {
  const id = product.value?.category_id;
  return catalog.categories.find((c) => c.id === id)?.name ?? 'Marketplace';
});
const productSku = computed(() => product.value?.sku || `zc-${product.value?.id ?? ''}`);
const shortDesc = computed(
  () =>
    product.value?.short_description ||
    product.value?.description ||
    'Ships across Cambodia. Quality checked before dispatch.',
);
const longDesc = computed(
  () => product.value?.description || 'Premium marketplace product ready to ship.',
);

const activeVariant = computed(() => {
  const variants = product.value?.variants;
  if (!variants?.length) return null;
  const key = `${selectedColor.value || ''}|${selectedStyle.value || ''}|${selectedSize.value || ''}`;
  return variants.find((v) => v.key === key) || null;
});

const displayPrice = computed(() => {
  if (activeVariant.value?.price && activeVariant.value.price > 0) return activeVariant.value.price;
  return product.value?.price || 0;
});

const maxQty = computed(() => {
  if (activeVariant.value) return Math.max(0, activeVariant.value.stock);
  const stock = product.value?.stock;
  if (typeof stock === 'number') return Math.max(0, stock);
  return 99;
});

const canPurchase = computed(() => maxQty.value > 0);

const variantStockLabel = computed(() => {
  if (!product.value?.variants?.length) return '';
  if (!activeVariant.value) return '';
  return activeVariant.value.stock > 0
    ? `${activeVariant.value.stock} in stock for this option`
    : 'Out of stock for this option';
});

watch(maxQty, (cap) => {
  if (qty.value > cap) qty.value = Math.max(1, cap) || 1;
  if (cap < 1) qty.value = 1;
});

const specRows = computed(() => {
  const raw = product.value?.specs?.trim();
  if (!raw) return [] as { label: string; value: string }[];
  return raw
    .split(/\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.includes(':') ? ':' : line.includes('=') ? '=' : null;
      if (!sep) return { label: 'Spec', value: line };
      const [label, ...rest] = line.split(sep);
      return { label: (label ?? '').trim() || 'Spec', value: rest.join(sep).trim() };
    });
});
const selectedOptions = computed((): CartOptions | undefined => {
  const opts: CartOptions = {};
  if (selectedColor.value) opts.color = selectedColor.value;
  if (selectedStyle.value) opts.style = selectedStyle.value;
  if (selectedSize.value) opts.size = selectedSize.value;
  return opts.color || opts.style || opts.size ? opts : undefined;
});
const related = computed(() =>
  products.value
    .filter((p) => p.id !== product.value?.id && p.category_id === product.value?.category_id)
    .concat(products.value.filter((p) => p.id !== product.value?.id))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 5),
);
const boughtTogether = computed(() => {
  if (!product.value) return [];
  const extras = products.value.filter((p) => p.id !== product.value!.id).slice(0, 2);
  return [product.value, ...extras];
});
const bundleChecked = computed(() => boughtTogether.value.filter((p) => bundleIds.value.includes(p.id)));
const bundleTotal = computed(() => bundleChecked.value.reduce((sum, p) => sum + p.price, 0));

watch(boughtTogether, (list) => {
  bundleIds.value = list.map((p) => p.id);
}, { immediate: true });

function syncSelections() {
  selectedColor.value = colors.value.find((c) => !c.disabled)?.name || colors.value[0]?.name || '';
  selectedStyle.value = styles.value.find((s) => !s.disabled)?.name || styles.value[0]?.name || '';
  selectedSize.value = sizes.value.find((s) => !s.disabled)?.name || sizes.value[0]?.name || '';
  const firstColor = colors.value.find((c) => c.name === selectedColor.value);
  if (firstColor && typeof firstColor.imageIndex === 'number' && firstColor.imageIndex >= 0) {
    activeThumb.value = firstColor.imageIndex % Math.max(gallery.value.length, 1);
  } else {
    activeThumb.value = 0;
  }
  qty.value = 1;
}

async function load() {
  booting.value = true;
  const started = Date.now();
  await catalog.fetchProduct(String(route.params.slug));
  if (!products.value.length) await catalog.fetchProducts();
  syncSelections();
  const wait = Math.max(0, 350 - (Date.now() - started));
  if (wait) await new Promise((r) => setTimeout(r, wait));
  booting.value = false;
}
function selectColor(c: { name: string; disabled?: boolean; imageIndex?: number; fallbackIndex?: number }) {
  if (c.disabled) return;
  selectedColor.value = c.name;
  if (typeof c.imageIndex === 'number' && c.imageIndex >= 0) {
    activeThumb.value = c.imageIndex % Math.max(gallery.value.length, 1);
  } else if (typeof c.fallbackIndex === 'number') {
    activeThumb.value = c.fallbackIndex % Math.max(gallery.value.length, 1);
  }
}
function cartProduct(): Product | null {
  if (!product.value) return null;
  if (displayPrice.value === product.value.price) return product.value;
  return { ...product.value, price: displayPrice.value };
}
function onAdd() {
  const p = cartProduct();
  if (!p || !canPurchase.value) return;
  cart.add(p, qty.value, selectedOptions.value);
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}
function onBuy() {
  onAdd();
  if (canPurchase.value) void router.push('/checkout');
}
function onAddBundle() {
  for (const p of bundleChecked.value) {
    cart.add(p, 1, p.id === product.value?.id ? selectedOptions.value : undefined);
  }
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}
function onWish() {
  if (!product.value) return;
  wishlist.toggle(product.value);
  Notify.create({ type: 'positive', message: t('product.wishlist'), position: 'top' });
}
function onCompare() {
  if (!product.value) return;
  const ok = compare.toggle(product.value);
  Notify.create({ type: ok ? 'positive' : 'warning', message: t('nav.compare'), position: 'top' });
}
function onOpenRelated(p: { slug: string }) {
  void router.push(`/product/${p.slug}`);
}
function onQuickviewRelated(p: Product) {
  ui.openQuickview(p);
}
onMounted(() => void load());
watch(() => route.params.slug, () => void load());
</script>
