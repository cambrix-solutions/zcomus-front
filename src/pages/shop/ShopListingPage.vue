<template>
  <main class="z-container z-page">
    <StoreCrumbs :crumbs="crumbs" />

    <div v-if="vendorSlug && !vendor" class="z-empty">
      <h3>Vendor not found</h3>
      <router-link class="z-btn z-btn-primary" to="/vendors">{{ t('nav.vendors') }}</router-link>
    </div>

    <VendorStoreHero
      v-else-if="vendor"
      :vendor="vendor"
      :followed="followed"
      @follow="onFollow"
    />

    <div v-if="!vendorSlug || vendor" class="z-shop-layout">
      <aside class="z-shop-layout__side d-none-xs">
        <ShopFiltersPanel
          v-model:category="category"
          v-model:price-band="priceBand"
          v-model:selected-brands="selectedBrands"
          v-model:selected-color="selectedColor"
          :categories="catalog.categories"
          :price-bands="priceBands"
          :brand-rows="brandRows"
          :total-count="sourceProducts.length"
          :count-in-category="countInCategory"
          :count-in-price="countInPrice"
          @reset="resetFilters"
        />
      </aside>

      <div class="z-shop-layout__main">
        <div v-if="!vendorSlug" class="z-shop-banner">
          <h2>{{ t('shop.bannerTitle') }}</h2>
          <p class="z-muted">{{ t('shop.bannerSub') }}</p>
        </div>

        <div class="z-shop-toolbar">
          <button class="z-shop-toolbar__filter" type="button" @click="filtersOpen = true">
            <i class="material-icons" aria-hidden="true">tune</i>
            <span>{{ t('shop.filters') }}</span>
            <em v-if="activeFilterCount">{{ activeFilterCount }}</em>
          </button>

          <p class="z-shop-toolbar__count">
            <strong>{{ rangeLabel }}</strong>
            <span>/ {{ filtered.length }}</span>
          </p>

          <div class="z-shop-toolbar__controls">
            <label class="z-shop-toolbar__control">
              <span>{{ t('shop.sortBy') }}</span>
              <select v-model="sort">
                <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </label>

            <label class="z-shop-toolbar__control">
              <span>{{ t('shop.show') }}</span>
              <select v-model.number="perPage">
                <option v-for="n in perPageOptions" :key="n" :value="n">{{ n }}</option>
              </select>
            </label>
          </div>

          <div class="z-shop-toolbar__views" role="group" :aria-label="t('shop.view')">
            <button
              type="button"
              :class="{ 'is-active': layoutMode === 'grid' }"
              :aria-pressed="layoutMode === 'grid'"
              :title="t('shop.grid')"
              @click="layoutMode = 'grid'"
            >
              <i class="material-icons" aria-hidden="true">grid_view</i>
            </button>
            <button
              type="button"
              :class="{ 'is-active': layoutMode === 'list' }"
              :aria-pressed="layoutMode === 'list'"
              :title="t('shop.list')"
              @click="layoutMode = 'list'"
            >
              <i class="material-icons" aria-hidden="true">view_list</i>
            </button>
          </div>
        </div>

        <div v-if="activeFilterCount" class="z-chip-row" style="flex-wrap:wrap;margin-bottom:12px">
          <span v-if="category !== 'all'" class="z-chip is-active">
            {{ categoryLabel }}
            <button type="button" @click="category = 'all'">×</button>
          </span>
          <span v-if="priceBand !== 'all'" class="z-chip is-active">
            {{ priceBandLabel }}
            <button type="button" @click="priceBand = 'all'">×</button>
          </span>
          <span v-for="b in selectedBrands" :key="b" class="z-chip is-active">
            {{ b }}
            <button type="button" @click="removeBrand(b)">×</button>
          </span>
          <button class="z-btn z-btn-text" type="button" @click="resetFilters">{{ t('shop.clear') }}</button>
        </div>

        <div v-if="booting" class="z-products z-products--skel">
          <SkeletonProductCard v-for="n in 8" :key="n" />
        </div>
        <div v-else-if="!paged.length" class="z-empty">
          <p>{{ t('shop.empty') }}</p>
          <button class="z-btn z-btn-primary" type="button" @click="resetFilters">{{ t('shop.reset') }}</button>
        </div>
        <div v-else class="z-products" :class="{ 'z-products--list': layoutMode === 'list' }">
          <ProductCard
            v-for="(product, i) in paged"
            :key="product.id"
            class="z-fade-item"
            :style="{ '--i': Math.min(i, 11) }"
            :product="product"
            :list-title="layoutMode === 'list'"
            @add="onAdd"
            @open="onOpen"
            @quickview="onQuickview"
          />
        </div>

        <nav v-if="pageCount > 1" class="z-pager">
          <button type="button" @click="goPage(page - 1)">‹</button>
          <button
            v-for="n in pageCount"
            :key="n"
            type="button"
            :class="{ 'is-active': page === n }"
            @click="goPage(n)"
          >
            {{ n }}
          </button>
          <button type="button" @click="goPage(page + 1)">›</button>
        </nav>
      </div>
    </div>

    <TrustStrip />

    <div v-if="filtersOpen" class="z-sheet" @click.self="filtersOpen = false">
      <div class="z-sheet__panel">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <h5>{{ t('shop.filters') }}</h5>
          <button class="z-btn z-btn-ghost z-btn-sm" type="button" @click="filtersOpen = false">×</button>
        </div>
        <ShopFiltersPanel
          v-model:category="category"
          v-model:price-band="priceBand"
          v-model:selected-brands="selectedBrands"
          v-model:selected-color="selectedColor"
          :categories="catalog.categories"
          :price-bands="priceBands"
          :brand-rows="brandRows"
          :total-count="sourceProducts.length"
          :count-in-category="countInCategory"
          :count-in-price="countInPrice"
          @reset="resetFilters"
        />
        <button class="z-btn z-btn-primary z-btn-block" style="margin-top:12px" type="button" @click="filtersOpen = false">
          {{ t('shop.results', { n: filtered.length }) }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import SkeletonProductCard from 'components/store/SkeletonProductCard.vue';
import ShopFiltersPanel from 'components/shop/ShopFiltersPanel.vue';
import VendorStoreHero from 'components/store/VendorStoreHero.vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import { type Product } from 'src/data/mock-catalog';
import { resolveVendor } from 'src/data/vendor-store';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useUiStore } from 'stores/ui-store';

const props = defineProps<{ vendorSlug?: string }>();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const catalog = useCatalogStore();
const ui = useUiStore();
const followed = ref(false);
const booting = ref(true);

function onFollow() {
  followed.value = !followed.value;
  Notify.create({
    type: 'positive',
    message: followed.value ? 'Following this shop' : 'Unfollowed',
    position: 'top',
  });
}

const vendor = computed(() => {
  if (!props.vendorSlug) return undefined;
  const liveCount = catalog.products.filter((p) => p.vendor_slug === props.vendorSlug && p.is_seller).length;
  return resolveVendor(props.vendorSlug, liveCount);
});

const crumbs = computed(() =>
  vendor.value
    ? [
        { label: t('nav.vendors'), to: '/vendors' },
        { label: vendor.value.name },
      ]
    : [{ label: t('shop.title') }],
);

const sourceProducts = computed(() => {
  const list = catalog.products;
  if (!vendor.value) return list;
  if (vendor.value.isLive) {
    return list.filter((p) => p.vendor_slug === vendor.value!.slug);
  }
  if (!list.length) return [];
  const seed = [...vendor.value.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const start = seed % Math.max(1, list.length);
  const count = Math.min(list.length, 12 + (seed % 8));
  const out: Product[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(list[(start + i) % list.length]!);
  }
  return out;
});

const layoutMode = ref<'grid' | 'list'>('grid');
const search = ref(String(route.query.q ?? ''));
const category = ref(String(route.query.category ?? 'all'));
const sort = ref('latest');
const perPage = ref(16);
const page = ref(1);
const priceBand = ref('all');
const selectedBrands = ref<string[]>([]);
const selectedColor = ref('');
const filtersOpen = ref(false);

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];
const perPageOptions = [12, 16, 30, 50];
const priceBands = [
  { id: 'all', label: 'All prices', min: 0, max: Infinity },
  { id: '0-100', label: 'Free - $100', min: 0, max: 100 },
  { id: '100-200', label: '$100 - $200', min: 100, max: 200 },
  { id: '200-400', label: '$200 - $400', min: 200, max: 400 },
  { id: '400-600', label: '$400 - $600', min: 400, max: 600 },
  { id: '600-800', label: '$600 - $800', min: 600, max: 800 },
  { id: '1000+', label: 'Over $1000', min: 1000, max: Infinity },
];

const categoryLabel = computed(
  () => catalog.categories.find((c) => c.slug === category.value)?.name ?? category.value,
);
const priceBandLabel = computed(() => priceBands.find((b) => b.id === priceBand.value)?.label ?? '');
const activeFilterCount = computed(() => {
  let n = 0;
  if (category.value !== 'all') n += 1;
  if (priceBand.value !== 'all') n += 1;
  n += selectedBrands.value.length;
  return n;
});
const brandRows = computed(() => {
  const counts = new Map<string, number>();
  for (const p of sourceProducts.value) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
});

function countInCategory(id: number) {
  return sourceProducts.value.filter((p) => p.category_id === id).length;
}
function countInPrice(bandId: string) {
  const band = priceBands.find((b) => b.id === bandId);
  if (!band || bandId === 'all') return sourceProducts.value.length;
  return sourceProducts.value.filter((p) => p.price >= band.min && p.price <= band.max).length;
}

const filtered = computed(() => {
  let list = [...sourceProducts.value];
  if (route.query.tab === 'flash') list = list.filter((p) => p.is_flash);
  if (route.query.tab === 'trending') list = list.filter((p) => p.is_trending);
  if (category.value !== 'all') {
    const cat = catalog.categories.find((c) => c.slug === category.value);
    if (cat) list = list.filter((p) => p.category_id === cat.id);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }
  const band = priceBands.find((b) => b.id === priceBand.value) ?? priceBands[0]!;
  if (band.id !== 'all') list = list.filter((p) => p.price >= band.min && p.price <= band.max);
  if (selectedBrands.value.length) list = list.filter((p) => selectedBrands.value.includes(p.brand));
  switch (sort.value) {
    case 'oldest':
      list.sort((a, b) => a.id - b.id);
      break;
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list.sort((a, b) => b.id - a.id);
  }
  return list;
});

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)));
const paged = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filtered.value.slice(start, start + perPage.value);
});
const rangeLabel = computed(() => {
  if (!filtered.value.length) return '0–0';
  const start = (page.value - 1) * perPage.value + 1;
  const end = Math.min(page.value * perPage.value, filtered.value.length);
  return `${start}–${end}`;
});

function goPage(n: number) {
  page.value = Math.min(pageCount.value, Math.max(1, n));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function removeBrand(name: string) {
  selectedBrands.value = selectedBrands.value.filter((b) => b !== name);
}
watch([filtered, perPage], () => {
  if (page.value > pageCount.value) page.value = 1;
});
watch(category, (val) => {
  page.value = 1;
  void router.replace({ query: { ...route.query, category: val === 'all' ? undefined : val } });
});
watch([priceBand, selectedBrands], () => {
  page.value = 1;
});
watch(
  () => route.query.q,
  (q) => {
    search.value = String(q ?? '');
    page.value = 1;
  },
);
watch(
  () => route.query.category,
  (c) => {
    category.value = String(c ?? 'all');
  },
);
watch(
  () => props.vendorSlug,
  () => {
    resetFilters();
  },
);

function resetFilters() {
  category.value = 'all';
  search.value = '';
  priceBand.value = 'all';
  selectedBrands.value = [];
  selectedColor.value = '';
  sort.value = 'latest';
  page.value = 1;
}
function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}
function onOpen(product: Product) {
  void router.push(`/product/${product.slug || product.id}`);
}
function onQuickview(product: Product) {
  ui.openQuickview(product);
}
onMounted(async () => {
  await catalog.loadHomeCatalog();
  booting.value = false;
});
</script>
