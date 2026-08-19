import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product } from 'src/data/mock-catalog';

export const useUiStore = defineStore('ui', () => {
  const quickviewProduct = ref<Product | null>(null);
  const mobileMenuOpen = ref(false);

  function openQuickview(product: Product) {
    quickviewProduct.value = product;
  }

  function closeQuickview() {
    quickviewProduct.value = null;
  }

  return { quickviewProduct, mobileMenuOpen, openQuickview, closeQuickview };
});
