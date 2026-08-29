import { mockCategories, type Product } from 'src/data/mock-catalog';
import type { SellerShop, ShopListing } from 'src/composables/useSellerShop';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function shopSlug(shop: Pick<SellerShop, 'slug' | 'name'>): string {
  const custom = slugify(shop.slug || '');
  if (custom) return custom;
  return slugify(shop.name) || 'vendor';
}

/** Stable numeric id for seller listings (keeps Product.id as number). */
export function listingToProductId(listingId: string): number {
  const digits = listingId.replace(/\D/g, '');
  const n = Number(digits.slice(-9) || '0');
  return 900000000 + (n % 89999999);
}

export function listingToSlug(listing: ShopListing): string {
  const base = slugify(listing.title) || 'product';
  const tail = listing.id.replace(/\D/g, '').slice(-6) || '0';
  return `s-${base}-${tail}`;
}

function categoryIdFor(name: string): number {
  const found = mockCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (found) return found.id;
  if (/phone/i.test(name)) return 11;
  if (/electronic/i.test(name)) return 4;
  if (/fashion/i.test(name)) return 2;
  if (/food/i.test(name)) return 8;
  if (/home/i.test(name)) return 7;
  return 4; // Electronic
}

export function shopListingToProduct(listing: ShopListing, shop: SellerShop): Product {
  const images = (listing.images?.length ? listing.images : listing.image ? [listing.image] : []).filter(
    Boolean,
  );
  const shopSlugValue = shopSlug(shop);
  const product: Product = {
    id: listingToProductId(listing.id),
    name: listing.title,
    slug: listingToSlug(listing),
    brand: listing.brand || shop.name || 'Zcomus Seller',
    category_id: categoryIdFor(listing.category),
    price: Number(listing.price) || 0,
    compare_at_price: listing.compareAt ? Number(listing.compareAt) : null,
    image: images[0] || '',
    images,
    badge: listing.badge || null,
    colors: [...(listing.colors || [])],
    styles: [...(listing.styles || [])],
    sizes: [...(listing.sizes || [])],
    colorOptions: listing.colorOptions.map((o) => {
      const row: { name: string; available: boolean; imageIndex?: number } = {
        name: o.name,
        available: o.available,
      };
      if (typeof o.imageIndex === 'number') row.imageIndex = o.imageIndex;
      return row;
    }),
    styleOptions: listing.styleOptions.map((o) => ({ name: o.name, available: o.available })),
    sizeOptions: listing.sizeOptions.map((o) => ({ name: o.name, available: o.available })),
    variants: listing.variants.map((v) => {
      const row: {
        key: string;
        color: string;
        style: string;
        size: string;
        stock: number;
        price?: number;
      } = {
        key: v.key,
        color: v.color,
        style: v.style,
        size: v.size,
        stock: v.stock,
      };
      if (v.price) row.price = Number(v.price);
      return row;
    }),
    stock: listing.stock,
    vendor_name: shop.name || listing.brand || 'Seller',
    vendor_slug: shopSlugValue,
    seller_listing_id: listing.id,
    is_seller: true,
    is_trending: true,
  };
  if (listing.desc) {
    product.description = listing.desc;
    product.short_description = listing.desc;
  }
  if (listing.sku) product.sku = listing.sku;
  if (listing.warranty) product.warranty = listing.warranty;
  if (listing.specs) product.specs = listing.specs;
  if (shop.bio) product.vendor_bio = shop.bio;
  return product;
}

export function liveSellerProducts(listings: ShopListing[], shop: SellerShop): Product[] {
  if (!shop.active) return [];
  return listings
    .filter((item) => item.status === 'listed' && (item.images?.length || item.image))
    .map((item) => shopListingToProduct(item, shop));
}

export function mergeCatalogWithSeller(base: Product[], sellerProducts: Product[]): Product[] {
  const withoutSeller = base.filter((p) => !p.is_seller);
  return [...sellerProducts, ...withoutSeller];
}
