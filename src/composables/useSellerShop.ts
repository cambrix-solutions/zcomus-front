import { computed, reactive, ref } from 'vue';
import { shopSlug } from 'src/data/seller-catalog';
import { DEFAULT_SHOP_COVER, normalizeShopCover } from 'src/helper/shopCover';

export type ListingStatus = 'listed' | 'draft' | 'paused';

export type ListingOptionValue = {
  name: string;
  available: boolean;
  /** Gallery index this color jumps to (colors only). */
  imageIndex?: number;
};

export type ListingVariant = {
  key: string;
  color: string;
  style: string;
  size: string;
  stock: number;
  /** Empty string = use listing base price. */
  price: string;
};

export type ShopListing = {
  id: string;
  title: string;
  brand: string;
  price: string;
  compareAt: string;
  stock: number;
  desc: string;
  image: string;
  images: string[];
  category: string;
  sku: string;
  warranty: string;
  badge: string;
  status: ListingStatus;
  /** Derived name lists (kept for cards / legacy). */
  colors: string[];
  styles: string[];
  sizes: string[];
  colorOptions: ListingOptionValue[];
  styleOptions: ListingOptionValue[];
  sizeOptions: ListingOptionValue[];
  variants: ListingVariant[];
  specs: string;
  createdAt: string;
  updatedAt: string;
};

export type StoreTheme = 'classic' | 'minimal' | 'bold';

export type SellerShop = {
  active: boolean;
  name: string;
  category: string;
  phone: string;
  bio: string;
  slug: string;
  logo: string;
  cover: string;
  address: string;
  tagline: string;
  accentColor: string;
  announcement: string;
  theme: StoreTheme;
};

export type ListingInput = {
  title: string;
  brand: string;
  price: string;
  compareAt: string;
  stock: number;
  desc: string;
  images: string[];
  category: string;
  sku: string;
  warranty: string;
  badge: string;
  status: ListingStatus;
  colorOptions: ListingOptionValue[];
  styleOptions: ListingOptionValue[];
  sizeOptions: ListingOptionValue[];
  variants: ListingVariant[];
  specs: string;
};

export const listingCategories = [
  'Electronics',
  'Phones',
  'Fashion',
  'Home & Living',
  'Food',
  'Other',
] as const;

export const listingBadges = ['', 'Sale', 'New', 'Hot'] as const;

export const MAX_LISTING_IMAGES = 5;

export function variantKey(parts: { color?: string; style?: string; size?: string }) {
  return `${parts.color || ''}|${parts.style || ''}|${parts.size || ''}`;
}

export function hasOptionGroups(
  colors: ListingOptionValue[],
  styles: ListingOptionValue[],
  sizes: ListingOptionValue[],
) {
  return colors.length > 0 || styles.length > 0 || sizes.length > 0;
}

export function buildVariantMatrix(
  colors: ListingOptionValue[],
  styles: ListingOptionValue[],
  sizes: ListingOptionValue[],
  previous: ListingVariant[] = [],
  defaultStock = 0,
): ListingVariant[] {
  if (!hasOptionGroups(colors, styles, sizes)) return [];
  const cList = colors.length ? colors.map((o) => o.name) : [''];
  const sList = styles.length ? styles.map((o) => o.name) : [''];
  const zList = sizes.length ? sizes.map((o) => o.name) : [''];
  const prevMap = new Map(previous.map((v) => [v.key, v]));
  const next: ListingVariant[] = [];
  for (const color of cList) {
    for (const style of sList) {
      for (const size of zList) {
        const key = variantKey({ color, style, size });
        const prev = prevMap.get(key);
        next.push({
          key,
          color,
          style,
          size,
          stock: prev ? prev.stock : defaultStock,
          price: prev?.price || '',
        });
      }
    }
  }
  return next;
}

export function totalVariantStock(variants: ListingVariant[]) {
  return variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
}

function normalizeImages(item: Partial<ShopListing>): string[] {
  const fromGallery = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  if (fromGallery.length) return fromGallery.slice(0, MAX_LISTING_IMAGES);
  if (item.image) return [item.image];
  return [];
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

function normalizeOptionValues(
  rich: unknown,
  legacyNames?: unknown,
): ListingOptionValue[] {
  if (Array.isArray(rich) && rich.length) {
    if (typeof rich[0] === 'object' && rich[0] !== null) {
      return (rich as Partial<ListingOptionValue>[])
        .map((row) => {
          const name = String(row.name || '').trim();
          if (!name) return null;
          const value: ListingOptionValue = {
            name,
            available: row.available !== false,
          };
          if (typeof row.imageIndex === 'number' && row.imageIndex >= 0) {
            value.imageIndex = row.imageIndex;
          }
          return value;
        })
        .filter((v): v is ListingOptionValue => !!v);
    }
    return normalizeList(rich).map((name) => ({ name, available: true }));
  }
  return normalizeList(legacyNames).map((name) => ({ name, available: true }));
}

function normalizeVariants(raw: unknown): ListingVariant[] {
  if (!Array.isArray(raw)) return [];
  return (raw as Partial<ListingVariant>[])
    .map((row) => {
      const color = String(row.color || '');
      const style = String(row.style || '');
      const size = String(row.size || '');
      return {
        key: row.key || variantKey({ color, style, size }),
        color,
        style,
        size,
        stock: Number(row.stock) || 0,
        price: row.price ? String(row.price) : '',
      };
    })
    .filter((v) => v.key !== '||' || v.stock > 0 || v.price);
}

function normalizeListing(item: Partial<ShopListing>): ShopListing {
  const images = normalizeImages(item);
  const colorOptions = normalizeOptionValues(item.colorOptions, item.colors);
  const styleOptions = normalizeOptionValues(item.styleOptions, item.styles);
  const sizeOptions = normalizeOptionValues(item.sizeOptions, item.sizes);
  let variants = normalizeVariants(item.variants);
  if (hasOptionGroups(colorOptions, styleOptions, sizeOptions)) {
    variants = buildVariantMatrix(
      colorOptions,
      styleOptions,
      sizeOptions,
      variants,
      Number(item.stock) || 0,
    );
  } else {
    variants = [];
  }
  const stock = hasOptionGroups(colorOptions, styleOptions, sizeOptions)
    ? totalVariantStock(variants)
    : Number(item.stock) || 0;
  let status: ListingStatus =
    item.status === 'draft' || item.status === 'paused' ? item.status : 'listed';
  if (status === 'listed' && stock <= 0) status = 'paused';
  return {
    id: item.id || `L${Date.now()}`,
    title: item.title || '',
    brand: item.brand || '',
    price: item.price || '0.00',
    compareAt: item.compareAt || '',
    stock,
    desc: item.desc || '',
    images,
    image: images[0] || '',
    category: item.category || 'Electronics',
    sku: item.sku || '',
    warranty: item.warranty || '',
    badge: item.badge || '',
    status,
    colorOptions,
    styleOptions,
    sizeOptions,
    colors: colorOptions.map((o) => o.name),
    styles: styleOptions.map((o) => o.name),
    sizes: sizeOptions.map((o) => o.name),
    variants,
    specs: item.specs || '',
    createdAt: item.createdAt || new Date().toISOString().slice(0, 10),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString().slice(0, 10),
  };
}

const SHOP_KEY = 'zcomus-account-shop';
const LIST_KEY = 'zcomus-account-listings';
const PAYOUT_KEY = 'zcomus-account-payout';

const DEFAULT_COVER = DEFAULT_SHOP_COVER;
const DEFAULT_ACCENT = '#A6704D';

function emptyShop(): SellerShop {
  return {
    active: false,
    name: '',
    category: '',
    phone: '',
    bio: '',
    slug: '',
    logo: '',
    cover: DEFAULT_COVER,
    address: '',
    tagline: '',
    accentColor: DEFAULT_ACCENT,
    announcement: '',
    theme: 'classic',
  };
}

function normalizeShop(parsed: Partial<SellerShop>): SellerShop {
  const base = emptyShop();
  const legacyAccents = new Set([
    '#0ba9ed',
    '#0BA9ED',
    '#0890cb',
    '#fd9636',
    '#FD9636',
    '#a86947',
    '#A86947',
  ]);
  const accent =
    parsed.accentColor && !legacyAccents.has(parsed.accentColor)
      ? parsed.accentColor
      : DEFAULT_ACCENT;
  return {
    ...base,
    active: !!parsed.active,
    name: parsed.name || base.name,
    category: parsed.category || base.category,
    phone: parsed.phone || base.phone,
    bio: parsed.bio || base.bio,
    slug: parsed.slug || base.slug,
    logo: parsed.logo || base.logo,
    cover: normalizeShopCover(parsed.cover),
    address: parsed.address || base.address,
    tagline: parsed.tagline || base.tagline,
    accentColor: accent,
    announcement: parsed.announcement || base.announcement,
    theme: parsed.theme === 'minimal' || parsed.theme === 'bold' ? parsed.theme : base.theme,
  };
}

function readShop(): SellerShop {
  try {
    const raw = localStorage.getItem(SHOP_KEY);
    if (raw) return normalizeShop(JSON.parse(raw) as Partial<SellerShop>);
  } catch {
    /* ignore */
  }
  return emptyShop();
}

function readListings(): ShopListing[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ShopListing>[];
      return parsed.map((item) => normalizeListing(item));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function fromInput(payload: ListingInput, base?: ShopListing): ShopListing {
  const images = payload.images.filter(Boolean).slice(0, MAX_LISTING_IMAGES);
  const colorOptions = payload.colorOptions.map((o) => ({ ...o, name: o.name.trim() })).filter((o) => o.name);
  const styleOptions = payload.styleOptions.map((o) => ({ ...o, name: o.name.trim() })).filter((o) => o.name);
  const sizeOptions = payload.sizeOptions.map((o) => ({ ...o, name: o.name.trim() })).filter((o) => o.name);
  const variants = hasOptionGroups(colorOptions, styleOptions, sizeOptions)
    ? buildVariantMatrix(colorOptions, styleOptions, sizeOptions, payload.variants, payload.stock)
    : [];
  const stock = hasOptionGroups(colorOptions, styleOptions, sizeOptions)
    ? totalVariantStock(variants)
    : payload.stock;
  let status = payload.status;
  if (status === 'listed' && stock <= 0) status = 'paused';
  const next: Partial<ShopListing> = {
    ...base,
    title: payload.title.trim(),
    brand: payload.brand.trim(),
    price: Number(payload.price).toFixed(2),
    compareAt: payload.compareAt ? Number(payload.compareAt).toFixed(2) : '',
    stock,
    desc: payload.desc.trim(),
    images,
    image: images[0] || '',
    category: payload.category || 'Electronics',
    sku: payload.sku.trim(),
    warranty: payload.warranty.trim(),
    badge: payload.badge,
    status,
    colorOptions,
    styleOptions,
    sizeOptions,
    variants,
    specs: payload.specs.trim(),
    createdAt: base?.createdAt || today(),
    updatedAt: today(),
  };
  if (base?.id) next.id = base.id;
  return normalizeListing(next);
}

const shop = reactive(readShop());
const listings = ref<ShopListing[]>(readListings());
const payoutSet = ref(localStorage.getItem(PAYOUT_KEY) === '1');

export function useSellerShop() {
  const listingCount = computed(() => listings.value.filter((l) => l.status === 'listed').length);
  const allListingCount = computed(() => listings.value.length);
  const lowStockCount = computed(
    () => listings.value.filter((l) => l.status !== 'draft' && l.stock > 0 && l.stock <= 2).length,
  );
  const views = computed(() => listingCount.value * 42 + (shop.active ? 18 : 0));
  const revenue = computed(() =>
    listings.value
      .filter((l) => l.status === 'listed')
      .reduce((sum, item) => sum + Number(item.price) * 0.15, 0)
      .toFixed(2),
  );

  function persistShop() {
    localStorage.setItem(SHOP_KEY, JSON.stringify(shop));
  }

  function persistListings() {
    localStorage.setItem(LIST_KEY, JSON.stringify(listings.value));
  }

  function activate(payload: { name: string; category: string; phone: string }) {
    shop.active = true;
    shop.name = payload.name.trim();
    shop.category = payload.category;
    shop.phone = payload.phone.trim();
    persistShop();
  }

  function deactivate() {
    Object.assign(shop, emptyShop());
    listings.value = [];
    payoutSet.value = false;
    localStorage.removeItem(LIST_KEY);
    localStorage.removeItem(PAYOUT_KEY);
    localStorage.removeItem('zcomus-account-payout-profile');
    localStorage.removeItem('zcomus-seller-payout-method');
    persistShop();
  }

  function saveProfile(payload: Partial<SellerShop>) {
    if (payload.name !== undefined) shop.name = payload.name.trim();
    if (payload.category !== undefined) shop.category = payload.category;
    if (payload.phone !== undefined) shop.phone = payload.phone.trim();
    if (payload.bio !== undefined) shop.bio = payload.bio.trim();
    if (payload.slug !== undefined) shop.slug = payload.slug.trim();
    if (payload.logo !== undefined) shop.logo = payload.logo;
    if (payload.cover !== undefined) shop.cover = payload.cover || DEFAULT_COVER;
    if (payload.address !== undefined) shop.address = payload.address.trim();
    if (payload.tagline !== undefined) shop.tagline = payload.tagline.trim();
    if (payload.accentColor !== undefined) shop.accentColor = payload.accentColor || DEFAULT_ACCENT;
    if (payload.announcement !== undefined) shop.announcement = payload.announcement.trim();
    if (payload.theme !== undefined) shop.theme = payload.theme;
    persistShop();
  }

  const storeUrl = computed(() => {
    if (!shop.active || !shop.name.trim()) return '';
    return `/vendors/${shopSlug(shop)}`;
  });

  function addListing(payload: ListingInput) {
    listings.value.unshift(fromInput(payload, { id: `L${Date.now()}` } as ShopListing));
    persistListings();
  }

  function updateListing(id: string, payload: ListingInput) {
    const idx = listings.value.findIndex((item) => item.id === id);
    if (idx < 0) return;
    listings.value[idx] = fromInput(payload, listings.value[idx]);
    persistListings();
  }

  function setListingStatus(id: string, status: ListingStatus) {
    const item = listings.value.find((entry) => entry.id === id);
    if (!item) return;
    item.status = status;
    item.updatedAt = today();
    persistListings();
  }

  function duplicateListing(id: string) {
    const item = listings.value.find((entry) => entry.id === id);
    if (!item) return;
    const copy = normalizeListing({
      ...item,
      id: `L${Date.now()}`,
      title: `${item.title} (copy)`,
      status: 'draft',
      sku: item.sku ? `${item.sku}-COPY` : '',
      createdAt: today(),
      updatedAt: today(),
    });
    listings.value.unshift(copy);
    persistListings();
    return copy.id;
  }

  function removeListing(id: string) {
    listings.value = listings.value.filter((item) => item.id !== id);
    persistListings();
  }

  function setPayout() {
    payoutSet.value = true;
    localStorage.setItem(PAYOUT_KEY, '1');
  }

  return {
    shop,
    listings,
    payoutSet,
    listingCount,
    allListingCount,
    lowStockCount,
    views,
    revenue,
    activate,
    deactivate,
    saveProfile,
    addListing,
    updateListing,
    setListingStatus,
    duplicateListing,
    removeListing,
    setPayout,
    storeUrl,
  };
}
