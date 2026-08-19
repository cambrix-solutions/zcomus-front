import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { Product } from 'src/data/mock-catalog';

export interface CartLine {
  product: Product;
  qty: number;
}

const STORAGE_KEY = 'zcomus-cart';

function loadLocal(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartLine[]>(loadLocal());

  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0));
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.qty, 0),
  );

  watch(
    items,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    },
    { deep: true },
  );

  function add(product: Product, qty = 1) {
    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.value.push({ product, qty });
    }
  }

  function setQty(productId: number, qty: number) {
    const line = items.value.find((i) => i.product.id === productId);
    if (!line) return;
    if (qty <= 0) {
      remove(productId);
      return;
    }
    line.qty = qty;
  }

  function remove(productId: number) {
    items.value = items.value.filter((i) => i.product.id !== productId);
  }

  function clear() {
    items.value = [];
  }

  return { items, count, subtotal, add, setQty, remove, clear };
});
