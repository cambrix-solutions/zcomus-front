<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><router-link class="font-xs color-gray-500" to="/shop">Shop</router-link></li>
            <li>
              <span class="font-xs color-gray-500">{{ product?.name || 'Product' }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template mb-50">
      <div class="container">
        <div v-if="!product" class="py-50 text-center color-gray-500">
          {{ catalog.loading ? 'Loading…' : 'Product not found.' }}
        </div>

        <template v-else>
          <div class="row">
            <div class="col-lg-5">
              <div class="gallery-image">
                <div class="galleries">
                  <div class="detail-gallery">
                    <label v-if="product.badge" class="label">{{ product.badge }}</label>
                    <div class="product-image-slider pdp-main-image">
                      <figure class="border-radius-10">
                        <img :src="gallery[activeThumb]" :alt="product.name" />
                      </figure>
                    </div>
                  </div>
                  <div class="slider-nav-thumbnails pdp-thumbs">
                    <div
                      v-for="(img, i) in gallery"
                      :key="i"
                      class="item-thumb"
                      :class="{ active: activeThumb === i }"
                      @click="activeThumb = i"
                    >
                      <img :src="img" :alt="`${product.name} ${i + 1}`" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-7">
              <h3 class="color-brand-3 mb-25">{{ product.name }}</h3>
              <div class="row align-items-center">
                <div class="col-lg-4 col-md-4 col-sm-3 mb-mobile">
                  <ProductVendorMeta :product="product" vendor-slug="fasfox" />
                </div>
                <div class="col-lg-8 col-md-8 col-sm-9 text-start text-sm-end">
                  <a class="mr-20" href="#" @click.prevent="onWish">
                    <span class="btn btn-wishlist mr-5 opacity-100 transform-none" />
                    <span class="font-md color-gray-900">Add to Wish list</span>
                  </a>
                  <a href="#" @click.prevent="onCompare">
                    <span class="btn btn-compare mr-5 opacity-100 transform-none" />
                    <span class="font-md color-gray-900">Add to Compare</span>
                  </a>
                </div>
              </div>
              <div class="border-bottom pt-10 mb-20" />

              <div class="box-product-price">
                <h3 class="color-brand-3 price-main d-inline-block mr-10">
                  ${{ product.price.toFixed(2) }}
                </h3>
                <span
                  v-if="product.compare_at_price"
                  class="color-gray-500 price-line font-xl line-througt"
                >
                  ${{ product.compare_at_price.toFixed(2) }}
                </span>
              </div>

              <div class="product-description mt-20 color-gray-900">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <ul class="list-dot">
                      <li v-for="f in featuresLeft" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <ul class="list-dot">
                      <li v-for="f in featuresRight" :key="f">{{ f }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="box-product-color mt-20">
                <p class="font-sm color-gray-900">
                  Color:<span class="color-brand-2 nameColor">{{ selectedColor }}</span>
                </p>
                <ul class="list-colors">
                  <li
                    v-for="(c, i) in colors"
                    :key="c.name"
                    :class="{ active: selectedColor === c.name, disabled: c.disabled }"
                    :title="c.name"
                    @click="selectColor(c, i)"
                  >
                    <img :src="c.img" :alt="c.name" />
                  </li>
                </ul>
              </div>

              <div class="box-product-style-size mt-20">
                <div class="row">
                  <div class="col-lg-6 col-md-6 mb-20">
                    <p class="font-sm color-gray-900">
                      Style:<span class="color-brand-2 nameStyle">{{ selectedStyle }}</span>
                    </p>
                    <ul class="list-styles">
                      <li
                        v-for="s in styles"
                        :key="s"
                        :class="{ active: selectedStyle === s }"
                        :title="s"
                        @click="selectedStyle = s"
                      >
                        {{ s }}
                      </li>
                    </ul>
                  </div>
                  <div class="col-lg-6 col-md-6 mb-20">
                    <p class="font-sm color-gray-900">
                      Size:<span class="color-brand-2 nameSize">{{ selectedSize }}</span>
                    </p>
                    <ul class="list-sizes">
                      <li
                        v-for="s in sizes"
                        :key="s"
                        :class="{ active: selectedSize === s }"
                        :title="s"
                        @click="selectedSize = s"
                      >
                        {{ s }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="buy-product mt-30">
                <p class="font-sm mb-20">Quantity</p>
                <div class="box-quantity">
                  <div class="input-quantity">
                    <input class="font-xl color-brand-3" type="text" :value="qty" readonly />
                    <span class="minus-cart" @click="qty = Math.max(1, qty - 1)" />
                    <span class="plus-cart" @click="qty += 1" />
                  </div>
                  <div class="button-buy">
                    <a class="btn btn-cart" href="#" @click.prevent="onAdd">Add to cart</a>
                    <a class="btn btn-buy" href="#" @click.prevent="onBuy">Buy now</a>
                  </div>
                </div>
              </div>

              <div class="info-product mt-40">
                <div class="row align-items-end">
                  <div class="col-lg-4 col-md-4 mb-20">
                    <span class="font-sm font-medium color-gray-900">
                      SKU:<span class="color-gray-500"> zc-{{ product.id }}</span><br />
                      Category:<span class="color-gray-500"> {{ categoryName }}</span><br />
                      Tags:<span class="color-gray-500"> {{ product.brand }}, Marketplace</span>
                    </span>
                  </div>
                  <div class="col-lg-4 col-md-4 mb-20">
                    <span class="font-sm font-medium color-gray-900">
                      Free Delivery<br />
                      <span class="color-gray-500">Available nationwide in Cambodia.</span><br />
                      <span class="color-gray-500">Delivery Options & Info</span>
                    </span>
                  </div>
                  <div class="col-lg-4 col-md-4 mb-20 text-start text-md-end">
                    <div class="d-inline-block">
                      <div class="share-link">
                        <span class="font-md-bold color-brand-3 mr-15">Share</span>
                        <a class="facebook hover-up" href="#" @click.prevent />
                        <a class="printest hover-up" href="#" @click.prevent />
                        <a class="twitter hover-up" href="#" @click.prevent />
                        <a class="instagram hover-up" href="#" @click.prevent />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-bottom pt-30 mb-40" />
          <h4 class="color-brand-3 mb-20">Frequently Bought Together</h4>
          <div class="box-bought-together">
            <div class="box-product-bought">
              <div
                v-for="p in boughtTogether"
                :key="p.id"
                class="product-bought"
              >
                <img :src="p.image" :alt="p.name" />
              </div>
            </div>
            <div class="price-bought">
              <h3 class="color-brand-3 mr-10">${{ bundleTotal.toFixed(2) }}</h3>
              <span class="font-lg color-gray-900">({{ bundleChecked.length }} items)</span>
              <div class="box-btn-add-cart">
                <a class="btn btn-cart" href="#" @click.prevent="onAddBundle">Add To Cart</a>
              </div>
            </div>
          </div>
          <label
            v-for="p in boughtTogether"
            :key="`cb-${p.id}`"
            class="cb-container-2"
          >
            <input v-model="bundleIds" type="checkbox" :value="p.id" />
            <span class="font-md color-brand-3">
              <strong v-if="p.id === product.id">This item:</strong>
              {{ p.name }} - ${{ p.price.toFixed(2) }}
            </span>
            <span class="checkmark" />
          </label>
        </template>
      </div>
    </section>

    <section v-if="product" class="section-box shop-template mb-50">
      <div class="container">
        <div class="pt-10 mb-10">
          <ul class="nav nav-tabs nav-tabs-product">
            <li v-for="t in detailTabs" :key="t.id">
              <a
                href="#"
                :class="{ active: detailTab === t.id }"
                @click.prevent="detailTab = t.id"
              >
                {{ t.label }}
              </a>
            </li>
          </ul>
          <div class="tab-content pt-25">
            <div v-if="detailTab === 'description'" class="display-text-short">
              <p>
                {{ product.description || 'Premium marketplace product ready to ship.' }}
              </p>
              <ul class="list-dot mt-15">
                <li>Quality checked before dispatch</li>
                <li>Official accessory pack where applicable</li>
                <li>Secure packaging for marketplace delivery</li>
              </ul>
            </div>

            <div v-else-if="detailTab === 'specs'">
              <table class="table table-striped">
                <tbody>
                  <tr><td>Brand</td><td>{{ product.brand }}</td></tr>
                  <tr><td>SKU</td><td>zc-{{ product.id }}</td></tr>
                  <tr><td>Style</td><td>{{ selectedStyle }}</td></tr>
                  <tr><td>Size</td><td>{{ selectedSize }}</td></tr>
                  <tr><td>Color</td><td>{{ selectedColor }}</td></tr>
                  <tr><td>Availability</td><td>In stock</td></tr>
                  <tr><td>Warranty</td><td>12 months</td></tr>
                </tbody>
              </table>
            </div>

            <div v-else-if="detailTab === 'additional'">
              <p class="font-md color-gray-900">
                Package includes product, quick start guide, and warranty card. Colors and
                packaging may vary by region.
              </p>
            </div>

            <div v-else-if="detailTab === 'reviews'">
              <h5 class="mb-20">Customer reviews (2)</h5>
              <div v-for="r in reviews" :key="r.id" class="mb-25 pb-20 border-bottom">
                <strong class="font-md">{{ r.name }}</strong>
                <span class="font-xs color-gray-500 ms-2">{{ r.date }}</span>
                <div class="rating mt-5 mb-10">
                  <img v-for="n in 5" :key="n" :src="star" alt="" />
                </div>
                <p class="font-sm color-gray-900 mt-10 mb-0">{{ r.text }}</p>
              </div>
            </div>

            <div v-else>
              <h5 class="mb-15">Vendor</h5>
              <p class="font-md color-gray-900">
                Sold by
                <router-link class="color-brand-2" to="/vendors/fasfox">Fasfox Corporation</router-link>.
                Ships from regional warehouse · top-rated seller.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-40">
          <div class="head-main mb-20">
            <h4 class="mb-5">Related products</h4>
          </div>
          <div class="list-products-5">
            <ProductCard
              v-for="p in related"
              :key="p.id"
              :product="p"
              @add="(x) => cart.add(x)"
              @open="onOpenRelated"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import ProductCard from 'components/store/ProductCard.vue';
import ProductVendorMeta from 'components/shop/ProductVendorMeta.vue';
import { ecom } from 'src/helper/ecomAssets';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useWishlistStore } from 'stores/wishlist-store';
import { useCompareStore } from 'stores/compare-store';

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const catalog = useCatalogStore();
const wishlist = useWishlistStore();
const compare = useCompareStore();
const { currentProduct, products } = storeToRefs(catalog);

const star = ecom('imgs/template/icons/star.svg');
const product = computed(() => currentProduct.value);

const galleryAssets = [
  ecom('imgs/page/product/img-gallery-1.jpg'),
  ecom('imgs/page/product/img-gallery-2.jpg'),
  ecom('imgs/page/product/img-gallery-3.jpg'),
  ecom('imgs/page/product/img-gallery-4.jpg'),
  ecom('imgs/page/product/img-gallery-5.jpg'),
];

const gallery = computed(() => {
  if (!product.value) return galleryAssets;
  return [product.value.image, ...galleryAssets.filter((g) => g !== product.value!.image)].slice(
    0,
    5,
  );
});

const colors = computed(() =>
  gallery.value.map((img, i) => ({
    name: ['Pink', 'Gold', 'Pink Gold', 'Silver', 'Black'][i] ?? `Color ${i + 1}`,
    img,
    disabled: i === 0 || i === 4,
  })),
);

const styles = ['S22 Ultra', 'S22', 'S22 + Cover'];
const sizes = ['512 GB', '256 GB', '128 GB'];

const qty = ref(1);
const activeThumb = ref(0);
const selectedColor = ref('Pink Gold');
const selectedStyle = ref('S22');
const selectedSize = ref('512 GB');
const detailTab = ref<'description' | 'specs' | 'additional' | 'reviews' | 'vendor'>(
  'description',
);
const bundleIds = ref<number[]>([]);

const detailTabs = [
  { id: 'description' as const, label: 'Description' },
  { id: 'specs' as const, label: 'Specification' },
  { id: 'additional' as const, label: 'Additional information' },
  { id: 'reviews' as const, label: 'Reviews (2)' },
  { id: 'vendor' as const, label: 'Vendor' },
];

const featuresLeft = [
  '8k super steady video',
  'Nightography plus portrait mode',
  '50mp photo resolution plus bright display',
];
const featuresRight = [
  'Adaptive color contrast',
  'Premium design & craftmanship',
  'Long lasting battery plus fast charging',
];

const reviews = [
  {
    id: 1,
    name: 'Sopheak M.',
    date: '10 Aug 2026',
    text: 'Great quality and packaging. Arrived faster than expected.',
  },
  {
    id: 2,
    name: 'Dara K.',
    date: '02 Aug 2026',
    text: 'Matches the description. Would buy again from this seller.',
  },
];

const categoryName = computed(() => {
  const id = product.value?.category_id;
  return catalog.categories.find((c) => c.id === id)?.name ?? 'Marketplace';
});

const related = computed(() =>
  products.value.filter((p) => p.id !== product.value?.id).slice(0, 5),
);

const boughtTogether = computed(() => {
  if (!product.value) return [];
  const extras = products.value.filter((p) => p.id !== product.value!.id).slice(0, 2);
  return [product.value, ...extras];
});

const bundleChecked = computed(() =>
  boughtTogether.value.filter((p) => bundleIds.value.includes(p.id)),
);

const bundleTotal = computed(() =>
  bundleChecked.value.reduce((sum, p) => sum + p.price, 0),
);

watch(
  boughtTogether,
  (list) => {
    bundleIds.value = list.map((p) => p.id);
  },
  { immediate: true },
);

async function load() {
  await catalog.fetchProduct(String(route.params.slug));
  if (!products.value.length) await catalog.fetchProducts();
  activeThumb.value = 0;
  qty.value = 1;
}

function selectColor(c: { name: string; disabled?: boolean }, i: number) {
  if (c.disabled) return;
  selectedColor.value = c.name;
  activeThumb.value = i % gallery.value.length;
}

function onAdd() {
  if (!product.value) return;
  cart.add(product.value, qty.value);
  Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' });
}

function onBuy() {
  onAdd();
  void router.push('/checkout');
}

function onAddBundle() {
  for (const p of bundleChecked.value) cart.add(p, 1);
  Notify.create({
    type: 'positive',
    message: `Added ${bundleChecked.value.length} items to cart`,
    position: 'top',
  });
}

function onWish() {
  if (!product.value) return;
  const added = wishlist.toggle(product.value);
  Notify.create({
    type: 'positive',
    message: added ? 'Added to wishlist' : 'Removed from wishlist',
    position: 'top',
  });
}

function onCompare() {
  if (!product.value) return;
  const wasIn = compare.has(product.value.id);
  const ok = compare.toggle(product.value);
  Notify.create({
    type: ok ? 'positive' : 'warning',
    message: !ok
      ? `Compare full (max ${compare.MAX})`
      : wasIn
        ? 'Removed from compare'
        : 'Added to compare',
    position: 'top',
  });
}

function onOpenRelated(p: { slug: string }) {
  void router.push(`/product/${p.slug}`);
}

onMounted(() => void load());
watch(() => route.params.slug, () => void load());
</script>

<style scoped>
.pdp-main-image figure {
  margin: 0;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
}
.pdp-main-image img {
  max-height: 420px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}
.pdp-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}
.pdp-thumbs .item-thumb {
  width: 72px;
  height: 72px;
  border: 1px solid #d5dfe4;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  padding: 4px;
  background: #fff;
}
.pdp-thumbs .item-thumb.active {
  border-color: #fd9636;
}
.pdp-thumbs .item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.list-colors li,
.list-styles li,
.list-sizes li {
  cursor: pointer;
}
.list-colors li.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.input-quantity .minus-cart,
.input-quantity .plus-cart {
  cursor: pointer;
}
:deep(.list-products-5 .card-grid-style-3 .list-features) {
  display: none;
}
@media (max-width: 1199px) {
  :deep(.list-products-5 .card-grid-style-3) {
    width: 33.333%;
  }
}
@media (max-width: 767px) {
  :deep(.list-products-5 .card-grid-style-3) {
    width: 50%;
  }
}
</style>
