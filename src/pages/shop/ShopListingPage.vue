<template>
  <main class="main shop-page">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <template v-if="vendor">
              <li>
                <router-link class="font-xs color-gray-500" to="/vendors">Vendors</router-link>
              </li>
              <li><span class="font-xs color-gray-500">{{ vendor.name }}</span></li>
            </template>
            <li v-else><span class="font-xs color-gray-500">Shop</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section v-if="vendorSlug && !vendor" class="section-box shop-template mt-30 mb-50">
      <div class="container py-50 text-center">
        <h3 class="mb-15">Vendor not found</h3>
        <router-link class="btn btn-buy" to="/vendors">Back to vendors</router-link>
      </div>
    </section>

    <!-- Vendor storefront header -->
    <div v-if="vendor" class="section-box shop-template mt-30">
      <div class="container">
        <div class="d-flex box-banner-vendor">
          <div class="vendor-left">
            <div class="banner-vendor">
              <img :src="vendor.cover" :alt="vendor.name" />
              <div class="d-flex box-info-vendor">
                <div class="avarta">
                  <img class="mb-5" :src="vendor.logo" :alt="vendor.name" />
                  <span class="btn btn-buy font-xs">{{ sourceProducts.length }} Products</span>
                </div>
                <div class="info-vendor">
                  <h4 class="mb-5">{{ vendor.name }}</h4>
                  <span class="font-xs color-gray-500 mr-20">
                    Member since {{ vendor.memberSince }}
                  </span>
                  <div class="rating d-inline-block">
                    <img v-for="n in 5" :key="n" :src="star" alt="" />
                    <span class="font-xs color-gray-500"> ({{ vendor.reviews }})</span>
                  </div>
                </div>
                <div class="vendor-contact">
                  <div class="row">
                    <div class="col-xl-7 col-lg-12">
                      <div class="d-inline-block font-md color-gray-500 location mb-10">
                        {{ vendor.address }}
                      </div>
                    </div>
                    <div class="col-xl-5 col-lg-12">
                      <div class="d-inline-block font-md color-gray-500 phone">
                        {{ vendor.phone }}
                        <template v-if="vendor.phone2"><br />{{ vendor.phone2 }}</template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="vendor-right">
            <div class="box-featured-product">
              <div v-for="f in vendorFeatures" :key="f.title" class="item-featured">
                <div class="featured-icon">
                  <img :src="f.icon" :alt="f.title" />
                </div>
                <div class="featured-info">
                  <span class="font-sm-bold color-gray-1000">{{ f.title }}</span>
                  <p class="font-sm color-gray-500 font-medium">{{ f.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="font-md color-gray-500 mt-20 mb-0">{{ vendor.description }}</p>
        <div class="border-bottom mb-0 border-vendor mt-20" />
      </div>
    </div>

    <!-- Marketplace featured strip (global shop only) -->
    <div v-else-if="!vendorSlug" class="section-box shop-template mt-30">
      <div class="container">
        <div class="box-swiper slider-shop-2">
          <div class="shop-featured-row pt-5">
            <div
              v-for="product in featuredStrip"
              :key="`feat-${product.id}`"
              class="card-grid-style-2"
            >
              <span v-if="product.badge" class="label bg-brand-2">{{ product.badge }}</span>
              <div class="image-box">
                <a href="#" @click.prevent="onOpen(product)">
                  <img :src="product.image" :alt="product.name" />
                </a>
              </div>
              <div class="info-right">
                <span class="font-xs color-gray-500">{{ product.brand }}</span>
                <br />
                <a
                  class="color-brand-3 font-sm-bold shop-featured-title"
                  href="#"
                  @click.prevent="onOpen(product)"
                >
                  {{ product.name }}
                </a>
                <div class="rating">
                  <img v-for="n in 5" :key="n" :src="star" alt="" />
                  <span class="font-xs color-gray-500">(65)</span>
                </div>
                <div class="price-info">
                  <strong class="font-lg-bold color-brand-3 price-main">
                    ${{ product.price.toFixed(2) }}
                  </strong>
                  <span
                    v-if="product.compare_at_price"
                    class="color-gray-500 price-line"
                  >
                    ${{ product.compare_at_price.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!vendorSlug || vendor" class="section-box shop-template mt-30 mb-50">
      <div class="container">
        <!-- Promo row (global shop only) -->
        <div v-if="!vendor" class="row shop-promo-row align-items-stretch mb-25">
          <div class="col-lg-3 col-md-4 mb-20">
            <div class="sidebar-ads h-100">
              <div class="bg-electronic h-100">
                <span class="big-deal mb-5">Big deal</span>
                <h4 class="font-25">Electronic</h4>
                <p class="font-16 color-brand-3 mb-0">Hot devices, Latest trending</p>
              </div>
            </div>
          </div>
          <div class="col-lg-9 col-md-8 mb-20">
            <div class="banner-top-gray-100 h-100">
              <div class="banner-ads-top mb-0 h-100">
                <a href="#" @click.prevent>
                  <img :src="fullwidthBanner" alt="Shop banner" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Category chips -->
        <div class="shop-cat-chips mb-20">
          <button
            type="button"
            class="shop-chip"
            :class="{ active: category === 'all' }"
            @click="category = 'all'"
          >
            All
          </button>
          <button
            v-for="c in catalog.categories.slice(0, 8)"
            :key="c.id"
            type="button"
            class="shop-chip"
            :class="{ active: category === c.slug }"
            @click="category = c.slug"
          >
            {{ c.name }}
          </button>
        </div>

        <!-- Toolbar -->
        <div class="box-filters mt-0 pb-5 border-bottom">
          <div class="row align-items-center">
            <div class="col-xl-2 col-lg-3 mb-10 text-lg-start text-center">
              <button
                class="btn btn-filter font-sm color-brand-3 font-medium"
                type="button"
                @click="filtersOpen = true"
              >
                All Fillters
                <span v-if="activeFilterCount" class="shop-filter-badge">
                  {{ activeFilterCount }}
                </span>
              </button>
            </div>
            <div class="col-xl-10 col-lg-9 mb-10 text-lg-end text-center">
              <span class="font-sm color-gray-900 font-medium border-1-right span">
                Showing {{ rangeLabel }} of {{ filtered.length }} results
              </span>

              <div class="d-inline-block">
                <span class="font-sm color-gray-500 font-medium">Sort by:</span>
                <div class="dropdown dropdown-sort border-1-right" :class="{ show: sortOpen }">
                  <button
                    class="btn dropdown-toggle font-sm color-gray-900 font-medium"
                    type="button"
                    @click="toggleSort"
                  >
                    {{ sortLabel }}
                  </button>
                  <ul
                    class="dropdown-menu dropdown-menu-light"
                    :class="{ show: sortOpen }"
                    style="margin: 0"
                  >
                    <li v-for="opt in sortOptions" :key="opt.value">
                      <a
                        class="dropdown-item"
                        :class="{ active: sort === opt.value }"
                        href="#"
                        @click.prevent="setSort(opt.value)"
                      >
                        {{ opt.label }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="d-inline-block">
                <span class="font-sm color-gray-500 font-medium">Show</span>
                <div class="dropdown dropdown-sort border-1-right" :class="{ show: showOpen }">
                  <button
                    class="btn dropdown-toggle font-sm color-gray-900 font-medium"
                    type="button"
                    @click="toggleShow"
                  >
                    <span>{{ perPage }} items</span>
                  </button>
                  <ul
                    class="dropdown-menu dropdown-menu-light"
                    :class="{ show: showOpen }"
                    style="margin: 0"
                  >
                    <li v-for="n in perPageOptions" :key="n">
                      <a
                        class="dropdown-item"
                        :class="{ active: perPage === n }"
                        href="#"
                        @click.prevent="setPerPage(n)"
                      >
                        {{ n }} items
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="d-inline-block">
                <a
                  class="view-type-grid mr-5"
                  :class="{ active: layoutMode === 'grid' }"
                  href="#"
                  title="Grid"
                  @click.prevent="layoutMode = 'grid'"
                />
                <a
                  class="view-type-list"
                  :class="{ active: layoutMode === 'list' }"
                  href="#"
                  title="List"
                  @click.prevent="layoutMode = 'list'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Active filters -->
        <div v-if="activeFilterCount" class="shop-active-filters mt-15 mb-10">
          <span
            v-if="category !== 'all'"
            class="shop-active-chip"
          >
            {{ categoryLabel }}
            <button type="button" aria-label="Clear category" @click="category = 'all'">×</button>
          </span>
          <span
            v-if="priceBand !== 'all'"
            class="shop-active-chip"
          >
            {{ priceBandLabel }}
            <button type="button" aria-label="Clear price" @click="priceBand = 'all'">×</button>
          </span>
          <span
            v-for="b in selectedBrands"
            :key="b"
            class="shop-active-chip"
          >
            {{ b }}
            <button type="button" aria-label="Remove brand" @click="removeBrand(b)">×</button>
          </span>
          <button class="shop-clear-link" type="button" @click="resetFilters">
            Clear all
          </button>
        </div>

        <div v-if="!paged.length" class="shop-empty py-50 text-center">
          <p class="color-gray-500 mb-15">No products match these filters.</p>
          <button class="btn btn-buy" type="button" @click="resetFilters">
            Reset filters
          </button>
        </div>

        <div v-else-if="layoutMode === 'grid'" class="list-products-5 mt-20">
          <ProductCard
            v-for="product in paged"
            :key="product.id"
            :product="product"
            @add="onAdd"
            @open="onOpen"
          />
        </div>

        <div v-else class="row mt-20 display-list">
          <div v-for="product in paged" :key="product.id" class="col-lg-12">
            <ProductCard
              :product="product"
              :features="defaultProductFeatures"
              list-title
              @add="onAdd"
              @open="onOpen"
            />
          </div>
        </div>

        <nav v-if="pageCount > 1" class="mt-30">
          <ul class="pagination">
            <li class="page-item">
              <a
                class="page-link page-prev"
                href="#"
                @click.prevent="goPage(page - 1)"
              />
            </li>
            <li v-for="n in pageCount" :key="n" class="page-item">
              <a
                class="page-link"
                :class="{ active: page === n }"
                href="#"
                @click.prevent="goPage(n)"
              >
                {{ n }}
              </a>
            </li>
            <li class="page-item">
              <a
                class="page-link page-next"
                href="#"
                @click.prevent="goPage(page + 1)"
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div
      v-if="filtersOpen"
      class="shop-filters-modal"
      @click.self="filtersOpen = false"
    >
      <div class="shop-filters-dialog">
        <div class="d-flex justify-content-between align-items-center mb-20">
          <h5 class="color-gray-900 mb-0">All Fillters</h5>
          <button class="btn btn-border btn-sm" type="button" @click="filtersOpen = false">
            Close
          </button>
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
        <button
          class="btn btn-buy w-100 mt-10"
          type="button"
          @click="filtersOpen = false"
        >
          Show {{ filtered.length }} results
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import ShopFiltersPanel from 'components/shop/ShopFiltersPanel.vue';
import {
  defaultProductFeatures,
  type Product,
} from 'src/data/mock-catalog';
import { getVendorBySlug } from 'src/data/mock-vendors';
import { ecom } from 'src/helper/ecomAssets';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';

const props = defineProps<{
  vendorSlug?: string;
}>();

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const catalog = useCatalogStore();

const star = ecom('imgs/template/icons/star.svg');
const fullwidthBanner = ecom('imgs/page/shop/grid-2/banner.png');

const vendor = computed(() =>
  props.vendorSlug ? getVendorBySlug(props.vendorSlug) : undefined,
);

const vendorFeatures = [
  {
    title: 'Free Delivery',
    text: 'From all orders over $10',
    icon: ecom('imgs/page/product/delivery.svg'),
  },
  {
    title: 'Support 24/7',
    text: 'Shop with an expert',
    icon: ecom('imgs/page/product/support.svg'),
  },
  {
    title: 'Return & Refund',
    text: 'Free return over $200',
    icon: ecom('imgs/page/product/return.svg'),
  },
  {
    title: 'Secure payment',
    text: '100% Protected',
    icon: ecom('imgs/page/product/payment.svg'),
  },
];

/** Products available in this shop context (all catalog, or vendor subset). */
const sourceProducts = computed(() => {
  const list = catalog.products;
  if (!vendor.value) return list;
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
const sortOpen = ref(false);
const showOpen = ref(false);

const sortOptions = [
  { value: 'latest', label: 'Latest products' },
  { value: 'oldest', label: 'Oldest products' },
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

const sortLabel = computed(
  () => sortOptions.find((o) => o.value === sort.value)?.label ?? 'Latest products',
);

const categoryLabel = computed(
  () => catalog.categories.find((c) => c.slug === category.value)?.name ?? category.value,
);

const priceBandLabel = computed(
  () => priceBands.find((b) => b.id === priceBand.value)?.label ?? '',
);

const activeFilterCount = computed(() => {
  let n = 0;
  if (category.value !== 'all') n += 1;
  if (priceBand.value !== 'all') n += 1;
  n += selectedBrands.value.length;
  return n;
});

const brandRows = computed(() => {
  const counts = new Map<string, number>();
  for (const p of sourceProducts.value) {
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const featuredStrip = computed(() =>
  sourceProducts.value.filter((p) => p.is_trending || p.is_flash).slice(0, 4),
);

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
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }
  const band = priceBands.find((b) => b.id === priceBand.value) ?? priceBands[0]!;
  if (band.id !== 'all') {
    list = list.filter((p) => p.price >= band.min && p.price <= band.max);
  }
  if (selectedBrands.value.length) {
    list = list.filter((p) => selectedBrands.value.includes(p.brand));
  }
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

function toggleSort() {
  sortOpen.value = !sortOpen.value;
  showOpen.value = false;
}

function toggleShow() {
  showOpen.value = !showOpen.value;
  sortOpen.value = false;
}

function setSort(value: string) {
  sort.value = value;
  sortOpen.value = false;
  page.value = 1;
}

function setPerPage(n: number) {
  perPage.value = n;
  showOpen.value = false;
  page.value = 1;
}

function goPage(n: number) {
  page.value = Math.min(pageCount.value, Math.max(1, n));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removeBrand(name: string) {
  selectedBrands.value = selectedBrands.value.filter((b) => b !== name);
}

function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (!t?.closest('.dropdown-sort')) {
    sortOpen.value = false;
    showOpen.value = false;
  }
}

watch([filtered, perPage], () => {
  if (page.value > pageCount.value) page.value = 1;
});

watch(category, (val) => {
  page.value = 1;
  void router.replace({
    query: { ...route.query, category: val === 'all' ? undefined : val },
  });
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
  Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' });
}

function onOpen(product: Product) {
  void router.push(`/product/${product.slug || product.id}`);
}

onMounted(() => {
  void catalog.loadHomeCatalog();
  document.addEventListener('click', onDocClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocClick);
});
</script>

<style scoped>
.shop-featured-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.shop-featured-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.6em;
}
.shop-promo-row .banner-ads-top {
  height: 100%;
  min-height: 225px;
  display: flex;
  align-items: stretch;
}
.shop-promo-row .banner-ads-top a,
.shop-promo-row .banner-ads-top img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.shop-cat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.shop-chip {
  border: 1px solid #d5dfe4;
  background: #fff;
  color: #425a8b;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.shop-chip:hover {
  border-color: #fd9636;
  color: #fd9636;
}
.shop-chip.active {
  border-color: #fd9636;
  background: #fff7ef;
  color: #fd9636;
}
.shop-filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  margin-left: 6px;
  padding: 0 5px;
  border-radius: 9px;
  background: #fd9636;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}
.shop-active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.shop-active-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f2f4f7;
  color: #0e224d;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 4px;
}
.shop-active-chip button {
  border: 0;
  background: transparent;
  color: #8c9bb3;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.shop-clear-link {
  border: 0;
  background: transparent;
  color: #fd9636;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.dropdown-sort .dropdown-menu.show {
  display: block;
}
.shop-filters-modal {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(14, 34, 77, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  overflow: auto;
}
.shop-filters-dialog {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(14, 34, 77, 0.18);
}
.shop-page :deep(.list-products-5 .card-grid-style-3 .list-features) {
  display: none;
}
.shop-page :deep(.list-products-5 .card-grid-style-3 .font-sm-bold) {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.6em;
}
@media (max-width: 1199px) {
  .shop-featured-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .shop-page :deep(.list-products-5 .card-grid-style-3) {
    width: 33.333%;
  }
}
@media (max-width: 767px) {
  .shop-featured-row {
    grid-template-columns: 1fr;
  }
  .shop-page :deep(.list-products-5 .card-grid-style-3) {
    width: 50%;
  }
}
@media (max-width: 480px) {
  .shop-page :deep(.list-products-5 .card-grid-style-3) {
    width: 100%;
  }
}
</style>
