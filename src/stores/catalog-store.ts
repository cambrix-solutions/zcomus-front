import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  mockBrands,
  mockCategories,
  mockProducts,
  type Category,
  type Product,
} from 'src/data/mock-catalog';
import { liveSellerProducts, mergeCatalogWithSeller } from 'src/data/seller-catalog';
import { useSellerShop } from 'src/composables/useSellerShop';
import {
  apiRequest,
  FAST_TIMEOUT_MS,
  getApiErrorMessage,
  unwrapData,
  unwrapList,
} from 'src/helper/api/apiClient';
import { endpoints } from 'src/helper/api/apiConfig';

export const useCatalogStore = defineStore('catalog', () => {
  const categories = ref<Category[]>([]);
  const baseProducts = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const brands = ref<string[]>([...mockBrands]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const usingMock = ref(true);

  function sellerOverlay(): Product[] {
    const { listings, shop } = useSellerShop();
    return liveSellerProducts(listings.value, shop);
  }

  const products = computed(() => mergeCatalogWithSeller(baseProducts.value, sellerOverlay()));

  const flashProducts = computed(() => products.value.filter((p) => p.is_flash));
  const trendingProducts = computed(() => products.value.filter((p) => p.is_trending));
  const topSellingProducts = computed(() => products.value.filter((p) => p.is_top_selling));

  function applyMockCatalog() {
    categories.value = mockCategories;
    baseProducts.value = mockProducts;
    brands.value = [...mockBrands];
    usingMock.value = true;
  }

  async function fetchCategories() {
    try {
      // Bounded tightly: the homepage blocks on this and mocks stand in for it.
      const payload = await apiRequest<Category[]>(endpoints.categories, {
        timeoutMs: FAST_TIMEOUT_MS,
      });
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
      const payload = await apiRequest<Product[]>(endpoints.products, {
        timeoutMs: FAST_TIMEOUT_MS,
        ...(params ? { params } : {}),
      });
      const list = unwrapList(payload);
      if (list.length) {
        baseProducts.value = list;
        usingMock.value = false;
        return products.value;
      }
    } catch {
      /* fall through to mock */
    }
    if (!baseProducts.value.length) {
      baseProducts.value = mockProducts;
      usingMock.value = true;
    }
    return products.value;
  }

  async function fetchProduct(idOrSlug: string) {
    loading.value = true;
    error.value = null;
    try {
      try {
        const payload = await apiRequest<Product>(endpoints.product(idOrSlug), {
          timeoutMs: FAST_TIMEOUT_MS,
        });
        const product = unwrapData(payload);
        if (product?.id) {
          currentProduct.value = product;
          usingMock.value = false;
          return product;
        }
      } catch {
        /* try local list / mock */
      }

      if (!baseProducts.value.length) {
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

  /**
   * Paints the local catalogue immediately, then refreshes from the API in the
   * background. Awaiting the network first meant an unreachable backend held
   * static data hostage behind a connection timeout, so the homepage sat on
   * skeletons for seconds with content already in memory. Resolves as soon as
   * something is renderable; real data swaps in when (and if) it lands.
   */
  async function loadHomeCatalog() {
    error.value = null;

    if (!categories.value.length || !baseProducts.value.length) {
      applyMockCatalog();
    }

    loading.value = true;
    void Promise.all([fetchCategories(), fetchProducts()])
      .catch((e: unknown) => {
        error.value = getApiErrorMessage(e, 'Failed to load catalog');
      })
      .finally(() => {
        loading.value = false;
      });

    return Promise.resolve();
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
