/** @deprecated Prefer `useCatalogStore` — kept as thin wrappers for convenience. */
import { useCatalogStore } from 'stores/catalog-store';
import type { Category, Product } from 'src/data/mock-catalog';

export async function fetchCategories(): Promise<Category[]> {
  return useCatalogStore().fetchCategories();
}

export async function fetchProducts(params?: Record<string, string>): Promise<Product[]> {
  return useCatalogStore().fetchProducts(params);
}

export async function fetchProduct(idOrSlug: string): Promise<Product | null> {
  return useCatalogStore().fetchProduct(idOrSlug);
}
