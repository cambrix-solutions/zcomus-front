import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product } from 'src/data/mock-catalog';

export const useUiStore = defineStore('ui', () => {
  const quickviewProduct = ref<Product | null>(null);
  const mobileMenuOpen = ref(false);
  const cartPulse = ref(false);
  let pulseTimer: ReturnType<typeof setTimeout> | null = null;

  function openQuickview(product: Product) {
    quickviewProduct.value = product;
  }

  function closeQuickview() {
    quickviewProduct.value = null;
  }

  function pulseCart() {
    cartPulse.value = false;
    requestAnimationFrame(() => {
      cartPulse.value = true;
      if (pulseTimer) clearTimeout(pulseTimer);
      pulseTimer = setTimeout(() => {
        cartPulse.value = false;
      }, 700);
    });
  }

  return {
    quickviewProduct,
    mobileMenuOpen,
    cartPulse,
    openQuickview,
    closeQuickview,
    pulseCart,
  };
});
