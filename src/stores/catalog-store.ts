import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  mockBrands,
  mockCategories,
  mockProducts,
  type Category,
  type Product,
} from 'src/data/mock-catalog';
import {
  apiRequest,
  getApiErrorMessage,
  unwrapData,
  unwrapList,
} from 'src/helper/api/apiClient';
import { endpoints } from 'src/helper/api/apiConfig';

export const useCatalogStore = defineStore('catalog', () => {
  const categories = ref<Category[]>([]);
  const products = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const brands = ref<string[]>([...mockBrands]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const usingMock = ref(true);

  const flashProducts = computed(() => products.value.filter((p) => p.is_flash));
  const trendingProducts = computed(() => products.value.filter((p) => p.is_trending));
  const topSellingProducts = computed(() => products.value.filter((p) => p.is_top_selling));

  function applyMockCatalog() {
    categories.value = mockCategories;
    products.value = mockProducts;
    brands.value = [...mockBrands];
    usingMock.value = true;
  }

  async function fetchCategories() {
    try {
      const payload = await apiRequest<Category[]>(endpoints.categories);
      const list = unwrapList(payload);
      if (list.length) {
        categories.value = list;
        usingMock.value = false;
        return list;
      }
    } catch {
      /* fall through to mock */
    }
    if (!categories.value.length) {
      categories.value = mockCategories;
      usingMock.value = true;
    }
    return categories.value;
  }

  async function fetchProducts(params?: Record<string, string>) {
    try {
      const payload = await apiRequest<Product[]>(
        endpoints.products,
        params ? { params } : {},
      );
      const list = unwrapList(payload);
      if (list.length) {
        products.value = list;
        usingMock.value = false;
        return list;
      }
    } catch {
      /* fall through to mock */
    }
    if (!products.value.length) {
      products.value = mockProducts;
      usingMock.value = true;
    }
    return products.value;
  }

  async function fetchProduct(idOrSlug: string) {
    loading.value = true;
    error.value = null;
    try {
      try {
        const payload = await apiRequest<Product>(endpoints.product(idOrSlug));
        const product = unwrapData(payload);
        if (product?.id) {
          currentProduct.value = product;
          usingMock.value = false;
          return product;
        }
      } catch {
        /* try local list / mock */
      }

      if (!products.value.length) {
        await fetchProducts();
      }

      const found =
        products.value.find((p) => p.slug === idOrSlug || String(p.id) === idOrSlug) ??
        mockProducts.find((p) => p.slug === idOrSlug || String(p.id) === idOrSlug) ??
        null;

      currentProduct.value = found;
      return found;
    } catch (e: unknown) {
      error.value = getApiErrorMessage(e, 'Failed to load product');
      currentProduct.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function loadHomeCatalog() {
    loading.value = true;
    error.value = null;
    try {
      await Promise.all([fetchCategories(), fetchProducts()]);
      if (!categories.value.length || !products.value.length) {
        applyMockCatalog();
      }
    } catch (e: unknown) {
      error.value = getApiErrorMessage(e, 'Failed to load catalog');
      applyMockCatalog();
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    products,
    currentProduct,
    brands,
    loading,
    error,
    usingMock,
    flashProducts,
    trendingProducts,
    topSellingProducts,
    fetchCategories,
    fetchProducts,
    fetchProduct,
    loadHomeCatalog,
  };
});
