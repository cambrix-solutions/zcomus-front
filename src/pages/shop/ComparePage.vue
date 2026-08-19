<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><router-link class="font-xs color-gray-500" to="/shop">Shop</router-link></li>
            <li><span class="font-xs color-gray-500">Compare</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template mb-50">
      <div class="container">
        <div v-if="!compare.items.length" class="text-center py-50">
          <h3 class="mb-15">No products to compare</h3>
          <p class="font-md color-gray-500 mb-25">
            Add up to {{ compare.MAX }} products from the shop, then compare side by side.
          </p>
          <router-link class="btn btn-buy w-auto" to="/shop">Browse shop</router-link>
        </div>

        <template v-else>
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-30">
            <div>
              <h3 class="mb-5">Compare</h3>
              <p class="font-base color-gray-500 mb-0">
                {{ compare.count }} / {{ compare.MAX }} products
              </p>
            </div>
            <button class="btn btn-border w-auto" type="button" @click="compare.clear()">
              Clear all
            </button>
          </div>

          <div class="row mb-80">
            <div class="col-lg-1" />
            <div class="col-lg-10">
              <div class="box-compare-products">
                <div class="table-responsive">
                  <table>
                    <tbody>
                      <tr>
                        <td><span>Products</span></td>
                        <td v-for="p in compare.items" :key="`img-${p.id}`">
                          <img :src="p.image" :alt="p.name" />
                          <h6>
                            <router-link class="text-brand-3" :to="`/product/${p.slug}`">
                              {{ p.name }}
                            </router-link>
                          </h6>
                        </td>
                      </tr>
                      <tr>
                        <td><span>Review</span></td>
                        <td v-for="p in compare.items" :key="`rev-${p.id}`">
                          <div class="rating">
                            <img v-for="n in 5" :key="n" :src="star" alt="" />
                            <span class="font-xs color-gray-500"> (65)</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><span>Brand</span></td>
                        <td v-for="p in compare.items" :key="`brand-${p.id}`">
                          <span>{{ p.brand }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td><span>Category</span></td>
                        <td v-for="p in compare.items" :key="`cat-${p.id}`">
                          <span>{{ categoryName(p.category_id) }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td><span>Price</span></td>
                        <td v-for="p in compare.items" :key="`price-${p.id}`">
                          <span class="font-sm-bold color-brand-3">
                            ${{ p.price.toFixed(2) }}
                          </span>
                          <span
                            v-if="p.compare_at_price"
                            class="font-xs color-gray-500 d-block text-decoration-line-through"
                          >
                            ${{ p.compare_at_price.toFixed(2) }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td><span>Stock status</span></td>
                        <td v-for="p in compare.items" :key="`stock-${p.id}`">
                          <span class="btn btn-gray font-sm-bold">In Stock</span>
                        </td>
                      </tr>
                      <tr>
                        <td><span>Buy now</span></td>
                        <td v-for="p in compare.items" :key="`buy-${p.id}`">
                          <button
                            class="btn btn-buy w-auto"
                            type="button"
                            @click="onAdd(p)"
                          >
                            Add to Cart
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><span>Remove</span></td>
                        <td v-for="p in compare.items" :key="`rm-${p.id}`">
                          <a
                            class="btn btn-delete"
                            href="#"
                            aria-label="Remove"
                            @click.prevent="compare.remove(p.id)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </template>

        <h4 class="color-brand-3">Recently viewed items</h4>
        <div class="row mt-40 mb-40">
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

        <h4 class="color-brand-3">You may also like</h4>
        <div class="list-products-5 mt-20">
          <ProductCard
            v-for="p in suggested"
            :key="p.id"
            :product="p"
            :features="defaultProductFeatures"
            @add="onAdd"
            @open="goProduct"
          />
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
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import HomeNewsletter from 'components/home/HomeNewsletter.vue';
import { defaultProductFeatures, type Product } from 'src/data/mock-catalog';
import { ecom } from 'src/helper/ecomAssets';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';
import { useCompareStore } from 'stores/compare-store';

const router = useRouter();
const compare = useCompareStore();
const cart = useCartStore();
const catalog = useCatalogStore();

const star = ecom('imgs/template/icons/star.svg');

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
  const ids = new Set(compare.items.map((p) => p.id));
  return catalog.products.filter((p) => !ids.has(p.id)).slice(0, 5);
});

const recent = computed(() => {
  const ids = new Set(compare.items.map((p) => p.id));
  return catalog.products.filter((p) => !ids.has(p.id)).slice(5, 9);
});

function categoryName(id: number) {
  return catalog.categories.find((c) => c.id === id)?.name ?? 'General';
}

function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' });
}

function goProduct(product: Product) {
  void router.push(`/product/${product.slug}`);
}
</script>
