<template>
  <div class="home-page home-2">
    <HeroBanner />
    <BrandStrip />
    <FeaturedCategories :categories="catalog.categories" />
    <ProductTabsSection
      title="Flash Deals"
      subtitle="Special products in this month."
      :products="catalog.flashProducts"
      flash
      @add="onAdd"
      @open="onOpen"
    />
    <ProductTabsSection
      title="Trending Products"
      subtitle="Special products in this month."
      :products="catalog.trendingProducts"
      class="pt-70"
      @add="onAdd"
      @open="onOpen"
    />
    <PromoBanners />
    <TopSelling
      :products="catalog.topSellingProducts"
      @add="onAdd"
      @open="onOpen"
    />
    <TopBrands :brands="catalog.brands" />
    <ProductColumns :columns="columns" @open="onOpen" />
    <AdBanner />
    <HomeNewsletter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import HeroBanner from 'components/home/HeroBanner.vue';
import BrandStrip from 'components/home/BrandStrip.vue';
import FeaturedCategories from 'components/home/FeaturedCategories.vue';
import ProductTabsSection from 'components/home/ProductTabsSection.vue';
import PromoBanners from 'components/home/PromoBanners.vue';
import TopSelling from 'components/home/TopSelling.vue';
import TopBrands from 'components/home/TopBrands.vue';
import ProductColumns from 'components/home/ProductColumns.vue';
import AdBanner from 'components/home/AdBanner.vue';
import HomeNewsletter from 'components/home/HomeNewsletter.vue';
import type { Product } from 'src/data/mock-catalog';
import { useCartStore } from 'stores/cart-store';
import { useCatalogStore } from 'stores/catalog-store';

const router = useRouter();
const cart = useCartStore();
const catalog = useCatalogStore();
const { topSellingProducts, trendingProducts, products } = storeToRefs(catalog);

const columns = computed(() => [
  { title: 'Best seller', products: topSellingProducts.value.slice(0, 3) },
  { title: 'Featured products', products: products.value.slice(0, 3) },
  { title: 'New arrivals', products: trendingProducts.value.slice(0, 3) },
  { title: 'Top rated', products: topSellingProducts.value.slice(0, 3).reverse() },
]);

function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' });
}

function onOpen(product: Product) {
  void router.push(`/product/${product.slug || product.id}`);
}

onMounted(() => {
  void catalog.loadHomeCatalog();
});
</script>
