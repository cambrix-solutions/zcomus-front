import type { SellerShop } from 'src/composables/useSellerShop';
import { normalizeShopCover } from 'src/helper/shopCover';
import { shopSlug } from 'src/data/seller-catalog';
import { mockVendors, type Vendor } from 'src/data/mock-vendors';

const SHOP_KEY = 'zcomus-account-shop';

function readLiveShop(): SellerShop | null {
  try {
    const raw = localStorage.getItem(SHOP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SellerShop>;
    if (!parsed.active || !parsed.name?.trim()) return null;
    return parsed as SellerShop;
  } catch {
    return null;
  }
}

export function liveShopToVendor(shop: SellerShop, productCount = 0): Vendor {
  const vendor: Vendor = {
    slug: shopSlug(shop),
    name: shop.name,
    logo: shop.logo || '',
    cover: normalizeShopCover(shop.cover),
    products: productCount,
    reviews: 0,
    memberSince: new Date().getFullYear(),
    address: shop.address || 'Cambodia',
    phone: shop.phone,
    industry: 'other',
    description: shop.bio || shop.tagline || '',
    accentColor: shop.accentColor,
    theme: shop.theme,
    isLive: true,
  };
  if (shop.tagline) vendor.tagline = shop.tagline;
  if (shop.announcement) vendor.announcement = shop.announcement;
  return vendor;
}

export function resolveVendor(slug: string, productCount = 0): Vendor | undefined {
  const live = readLiveShop();
  if (live && shopSlug(live) === slug) {
    return liveShopToVendor(live, productCount);
  }
  return mockVendors.find((v) => v.slug === slug);
}

export function liveVendorForList(productCount = 0): Vendor | null {
  const live = readLiveShop();
  if (!live) return null;
  return liveShopToVendor(live, productCount);
}
