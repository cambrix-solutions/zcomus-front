import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { Product } from 'src/data/mock-catalog';

const STORAGE_KEY = 'zcomus-wishlist';

function load(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<Product[]>(load());
  const count = computed(() => items.value.length);

  watch(
    items,
    (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
    { deep: true },
  );

  function has(id: number) {
    return items.value.some((p) => p.id === id);
  }

  function toggle(product: Product) {
    if (has(product.id)) {
      items.value = items.value.filter((p) => p.id !== product.id);
      return false;
    }
    items.value.push(product);
    return true;
  }

  function remove(id: number) {
    items.value = items.value.filter((p) => p.id !== id);
  }

  function clear() {
    items.value = [];
  }

  return { items, count, has, toggle, remove, clear };
});
