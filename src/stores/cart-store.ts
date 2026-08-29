import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { Product } from 'src/data/mock-catalog';
import { useUiStore } from 'stores/ui-store';

export type CartOptions = {
  color?: string;
  style?: string;
  size?: string;
};

export interface CartLine {
  product: Product;
  qty: number;
  options?: CartOptions;
}

const STORAGE_KEY = 'zcomus-cart';

function optionsKey(options?: CartOptions) {
  return JSON.stringify({
    color: options?.color || '',
    style: options?.style || '',
    size: options?.size || '',
  });
}

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

  function add(product: Product, qty = 1, options?: CartOptions) {
    const key = optionsKey(options);
    const existing = items.value.find(
      (i) => i.product.id === product.id && optionsKey(i.options) === key,
    );
    if (existing) {
      existing.qty += qty;
    } else {
      const line: CartLine = { product, qty };
      if (options && (options.color || options.style || options.size)) {
        line.options = {
          ...(options.color ? { color: options.color } : {}),
          ...(options.style ? { style: options.style } : {}),
          ...(options.size ? { size: options.size } : {}),
        };
      }
      items.value.push(line);
    }
    useUiStore().pulseCart();
  }

  function setQty(productId: number, qty: number, options?: CartOptions) {
    const key = optionsKey(options);
    const line = items.value.find(
      (i) => i.product.id === productId && optionsKey(i.options) === key,
    );
    if (!line) {
      const fallback = items.value.find((i) => i.product.id === productId);
      if (!fallback) return;
      if (qty <= 0) {
        remove(productId, fallback.options);
        return;
      }
      fallback.qty = qty;
      return;
    }
    if (qty <= 0) {
      remove(productId, options);
      return;
    }
    line.qty = qty;
  }

  function remove(productId: number, options?: CartOptions) {
    if (options) {
      const key = optionsKey(options);
      items.value = items.value.filter(
        (i) => !(i.product.id === productId && optionsKey(i.options) === key),
      );
      return;
    }
    items.value = items.value.filter((i) => i.product.id !== productId);
  }

  function clear() {
    items.value = [];
  }

  return { items, count, subtotal, add, setQty, remove, clear };
});
