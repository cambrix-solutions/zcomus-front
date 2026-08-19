<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><router-link class="font-xs color-gray-500" to="/shop">Shop</router-link></li>
            <li><span class="font-xs color-gray-500">Wishlist</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template mb-50">
      <div class="container">
        <div v-if="!wishlist.items.length" class="text-center py-50">
          <h3 class="mb-15">Your wishlist is empty</h3>
          <p class="font-md color-gray-500 mb-25">
            Save products you like, then add them to cart when you’re ready.
          </p>
          <router-link class="btn btn-buy w-auto" to="/shop">Continue shopping</router-link>
        </div>

        <template v-else>
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-20">
            <div>
              <h3 class="mb-5">Wishlist</h3>
              <p class="font-base color-gray-500 mb-0">{{ wishlist.count }} items saved</p>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <button
                class="btn btn-buy w-auto"
                type="button"
                :disabled="!selectedIds.length"
                @click="addSelected"
              >
                Add selected to cart
              </button>
              <button class="btn btn-border w-auto" type="button" @click="wishlist.clear()">
                Clear all
              </button>
            </div>
          </div>

          <div class="box-wishlist">
            <div class="head-wishlist">
              <div class="item-wishlist">
                <div class="wishlist-cb">
                  <input
                    class="cb-layout cb-all"
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleSelectAll"
                  />
                </div>
                <div class="wishlist-product">
                  <span class="font-md-bold color-brand-3">Product</span>
                </div>
                <div class="wishlist-price">
                  <span class="font-md-bold color-brand-3">Price</span>
                </div>
                <div class="wishlist-status">
                  <span class="font-md-bold color-brand-3">Stock status</span>
                </div>
                <div class="wishlist-action">
                  <span class="font-md-bold color-brand-3">Action</span>
                </div>
                <div class="wishlist-remove">
                  <span class="font-md-bold color-brand-3">Remove</span>
                </div>
              </div>
            </div>

            <div class="content-wishlist">
              <div
                v-for="product in wishlist.items"
                :key="product.id"
                class="item-wishlist"
              >
                <div class="wishlist-cb">
                  <input
                    class="cb-layout cb-select"
                    type="checkbox"
                    :checked="selectedIds.includes(product.id)"
                    @change="toggleSelect(product.id)"
                  />
                </div>
                <div class="wishlist-product">
                  <div class="product-wishlist">
                    <div class="product-image">
                      <router-link :to="`/product/${product.slug}`">
                        <img :src="product.image" :alt="product.name" />
                      </router-link>
                    </div>
                    <div class="product-info">
                      <router-link :to="`/product/${product.slug}`">
                        <h6 class="color-brand-3">{{ product.name }}</h6>
                      </router-link>
                      <div class="rating">
                        <img v-for="n in 5" :key="n" :src="star" alt="" />
                        <span class="font-xs color-gray-500"> (65)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="wishlist-price">
                  <h4 class="color-brand-3">${{ product.price.toFixed(2) }}</h4>
                </div>
                <div class="wishlist-status">
                  <span class="btn btn-gray font-md-bold color-brand-3">In Stock</span>
                </div>
                <div class="wishlist-action">
                  <button
                    class="btn btn-cart font-sm-bold"
                    type="button"
                    @click="onAdd(product)"
                  >
                    Add to Cart
                  </button>
                </div>
                <div class="wishlist-remove">
                  <a
                    class="btn btn-delete"
                    href="#"
                    aria-label="Remove"
                    @click.prevent="onRemove(product.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <h4 class="color-brand-3 mt-40">You may also like</h4>
        <div class="list-products-5 mt-20 mb-40">
          <ProductCard
            v-for="p in suggested"
            :key="p.id"
            :product="p"
            :features="defaultProductFeatures"
            @add="onAdd"
            @open="goProduct"
          />
        </div>

        <h4 class="color-brand-3">Recently viewed items</h4>
        <div class="row mt-40">
          <div
            v-for="p in recent"
            :key="`r-${p.id}`"
            class="col-lg-3 col-md-6 col-sm-12"
          >
            <div class="card-grid-style-2 card-grid-none-border hover-up">
              <div class="image-box">
                <router-link :to="`/product/${p.slug}`">
                  <img :src="p.image" :alt="p.name" />
                </router-link>
              </div>
              <div class="info-right">
                <span class="font-xs color-gray-500">{{ p.brand }}</span>
                <br />
                <router-link class="color-brand-3 font-xs-bold" :to="`/product/${p.slug}`">
                  {{ p.name }}
                </router-link>
                <div class="rating">
                  <img v-for="n in 5" :key="n" :src="star" alt="" />
                  <span class="font-xs color-gray-500"> (65)</span>
                </div>
                <div class="price-info">
                  <strong class="font-lg-bold color-brand-3 price-main">
                    ${{ p.price.toFixed(2) }}
                  </strong>
                  <span v-if="p.compare_at_price" class="color-gray-500 price-line">
                    ${{ p.compare_at_price.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-box mt-50 mb-50">
      <div class="container">
        <ul class="list-col-5">
          <li v-for="f in features" :key="f.title">
            <div class="item-list">
              <div class="icon-left">
                <img :src="f.icon" :alt="f.title" />
              </div>
              <div class="info-right">
                <h5 class="font-lg-bold color-gray-100">{{ f.title }}</h5>
                <p class="font-sm color-gray-500">{{ f.text }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <HomeNewsletter />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import HomeNewsletter from 'components/home/HomeNewsletter.vue';
import { defaultProductFeatures, type Product } from 'src/data/mock-catalog';
import { ecom } from 'src/helper/ecomAssets';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useWishlistStore } from 'stores/wishlist-store';

const router = useRouter();
const wishlist = useWishlistStore();
const cart = useCartStore();
const catalog = useCatalogStore();

const star = ecom('imgs/template/icons/star.svg');
const selectedIds = ref<number[]>([]);

const features = [
  {
    title: 'Free Delivery',
    text: 'In Cambodia over $75',
    icon: ecom('imgs/template/delivery.svg'),
  },
  {
    title: 'Support 24/7',
    text: 'Shop with an expert',
    icon: ecom('imgs/template/support.svg'),
  },
  {
    title: 'Gift voucher',
    text: 'Refer a friend',
    icon: ecom('imgs/template/voucher.svg'),
  },
  {
    title: 'Return & Refund',
    text: 'Free return over $200',
    icon: ecom('imgs/template/return.svg'),
  },
  {
    title: 'Secure payment',
    text: '100% Protected',
    icon: ecom('imgs/template/secure.svg'),
  },
];

onMounted(() => {
  void catalog.loadHomeCatalog();
});

const suggested = computed(() => {
  const ids = new Set(wishlist.items.map((p) => p.id));
  return catalog.products.filter((p) => !ids.has(p.id)).slice(0, 5);
});

const recent = computed(() => {
  const ids = new Set(wishlist.items.map((p) => p.id));
  return catalog.products.filter((p) => !ids.has(p.id)).slice(5, 9);
});

const allSelected = computed(
  () =>
    wishlist.items.length > 0 &&
    wishlist.items.every((p) => selectedIds.value.includes(p.id)),
);

function toggleSelect(id: number) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  } else {
    selectedIds.value = [...selectedIds.value, id];
  }
}

function toggleSelectAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  selectedIds.value = checked ? wishlist.items.map((p) => p.id) : [];
}

function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' });
}

function addSelected() {
  const picked = wishlist.items.filter((p) => selectedIds.value.includes(p.id));
  picked.forEach((p) => cart.add(p));
  Notify.create({
    type: 'positive',
    message: `Added ${picked.length} item(s) to cart`,
    position: 'top',
  });
}

function onRemove(id: number) {
  wishlist.remove(id);
  selectedIds.value = selectedIds.value.filter((x) => x !== id);
}

function goProduct(product: Product) {
  void router.push(`/product/${product.slug}`);
}
</script>
