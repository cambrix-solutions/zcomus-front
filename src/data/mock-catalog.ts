import { ecom } from 'src/helper/ecomAssets';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category_id: number;
  price: number;
  compare_at_price?: number | null;
  image: string;
  images?: string[];
  description?: string;
  short_description?: string;
  badge?: string | null;
  sku?: string;
  warranty?: string;
  specs?: string;
  colors?: string[];
  styles?: string[];
  sizes?: string[];
  colorOptions?: { name: string; available: boolean; imageIndex?: number }[];
  styleOptions?: { name: string; available: boolean }[];
  sizeOptions?: { name: string; available: boolean }[];
  variants?: {
    key: string;
    color: string;
    style: string;
    size: string;
    stock: number;
    price?: number;
  }[];
  stock?: number;
  vendor_name?: string;
  vendor_slug?: string;
  vendor_bio?: string;
  seller_listing_id?: string;
  is_seller?: boolean;
  is_flash?: boolean;
  is_trending?: boolean;
  is_top_selling?: boolean;
}

export const mockCategories: Category[] = [
  { id: 1, name: 'Air Purifier', slug: 'air-purifier', image: ecom('imgs/page/homepage2/cat-img-1.png'), products_count: 1025 },
  { id: 2, name: 'Women Bags', slug: 'women-bags', image: ecom('imgs/page/homepage2/cat-img-2.png'), products_count: 125 },
  { id: 3, name: 'Bluetooth', slug: 'bluetooth', image: ecom('imgs/page/homepage2/cat-img-3.png'), products_count: 625 },
  { id: 4, name: 'Electronic', slug: 'electronic', image: ecom('imgs/page/homepage2/cat-img-4.png'), products_count: 1025 },
  { id: 5, name: 'Gaming Gear', slug: 'gaming-gear', image: ecom('imgs/page/homepage2/cat-img-5.png'), products_count: 1025 },
  { id: 6, name: 'Gaming Chair', slug: 'gaming-chair', image: ecom('imgs/page/homepage2/cat-img-6.png'), products_count: 1025 },
  { id: 7, name: 'Home App', slug: 'home-app', image: ecom('imgs/page/homepage2/cat-img-7.png'), products_count: 1025 },
  { id: 8, name: 'Kitchen', slug: 'kitchen', image: ecom('imgs/page/homepage2/cat-img-8.png'), products_count: 1025 },
  { id: 9, name: 'Mobile Gadgets', slug: 'mobile-gadgets', image: ecom('imgs/page/homepage2/cat-img-9.png'), products_count: 1025 },
  { id: 10, name: 'Smart watches', slug: 'smart-watches', image: ecom('imgs/page/homepage2/cat-img-1.png'), products_count: 89 },
  { id: 11, name: 'Cell Phones', slug: 'cell-phones', image: ecom('imgs/page/homepage2/cat-img-3.png'), products_count: 23 },
  { id: 12, name: 'Headphone', slug: 'headphone', image: ecom('imgs/page/homepage2/cat-img-5.png'), products_count: 98 },
];

/** Assets matched to real product photos in the Ecom pack */
const img = {
  watchSilver: ecom('imgs/page/homepage1/imgsp2.png'),
  surfaceStudio: ecom('imgs/page/homepage1/imgsp3.png'),
  headphonesBo: ecom('imgs/page/homepage1/imgsp4.png'),
  laptop: ecom('imgs/page/homepage1/imgsp5.png'),
  watchWhite: ecom('imgs/page/homepage1/imgsp6.png'),
  camera360: ecom('imgs/page/homepage2/camera.png'),
  airpods: ecom('imgs/page/homepage2/airpod.png'),
  fitnessWatch: ecom('imgs/page/homepage2/clock.png'),
};

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Apple Watch Series 8 [GPS 45mm] Silver Aluminum',
    slug: 'apple-watch-s8-silver',
    brand: 'Apple',
    category_id: 10,
    price: 399.0,
    compare_at_price: 429.0,
    image: img.watchSilver,
    description: 'Advanced health features in a sleek aluminum case with Sport Band.',
    badge: '-7%',
    is_flash: true,
    is_trending: true,
    is_top_selling: true,
  },
  {
    id: 2,
    name: 'Microsoft Surface Studio 2+ All-in-One Desktop',
    slug: 'surface-studio-2',
    brand: 'Microsoft',
    category_id: 4,
    price: 2556.3,
    compare_at_price: 3225.6,
    image: img.surfaceStudio,
    description: 'Creative desktop with Zero Gravity hinge and PixelSense display.',
    badge: '-21%',
    is_flash: true,
    is_trending: true,
  },
  {
    id: 3,
    name: 'Bang & Olufsen Beoplay H95 Wireless Headphones',
    slug: 'bo-beoplay-h95',
    brand: 'B&O',
    category_id: 12,
    price: 799.0,
    compare_at_price: 999.0,
    image: img.headphonesBo,
    description: 'Premium over-ear headphones with adaptive active noise cancellation.',
    badge: '-20%',
    is_trending: true,
    is_top_selling: true,
  },
  {
    id: 4,
    name: 'Samsung Gear 360 Spherical Camera',
    slug: 'samsung-gear-360',
    brand: 'SAMSUNG',
    category_id: 9,
    price: 159.99,
    compare_at_price: 199.99,
    image: img.camera360,
    description: 'Capture 360° video and photos with dual lenses.',
    badge: '-20%',
    is_flash: true,
    is_top_selling: true,
  },
  {
    id: 5,
    name: 'Apple AirPods Pro with MagSafe Charging Case',
    slug: 'airpods-pro',
    brand: 'Apple',
    category_id: 12,
    price: 219.0,
    compare_at_price: 249.0,
    image: img.airpods,
    description: 'Active Noise Cancellation and Adaptive Transparency.',
    badge: '-12%',
    is_trending: true,
    is_top_selling: true,
  },
  {
    id: 6,
    name: 'Apple MacBook Air 13" M2 Chip 256GB',
    slug: 'macbook-air-m2',
    brand: 'Apple',
    category_id: 4,
    price: 1099.0,
    compare_at_price: 1299.0,
    image: img.laptop,
    description: 'Thin and light laptop with Liquid Retina display.',
    badge: '-15%',
    is_flash: true,
    is_trending: true,
  },
  {
    id: 7,
    name: 'Fitbit Sense 2 Advanced Health Smartwatch',
    slug: 'fitbit-sense-2',
    brand: 'Fitbit',
    category_id: 10,
    price: 249.0,
    compare_at_price: 299.0,
    image: img.fitnessWatch,
    description: 'ECG app, stress management, and all-day activity tracking.',
    badge: '-17%',
    is_top_selling: true,
  },
  {
    id: 8,
    name: 'Apple Watch SE GPS 40mm Starlight Aluminum',
    slug: 'apple-watch-se',
    brand: 'Apple',
    category_id: 10,
    price: 249.0,
    compare_at_price: 279.0,
    image: img.watchWhite,
    description: 'Essential Apple Watch features at a great value.',
    badge: '-11%',
    is_trending: true,
  },
  {
    id: 9,
    name: 'Microsoft Surface Studio Creative Bundle',
    slug: 'surface-studio-bundle',
    brand: 'Microsoft',
    category_id: 4,
    price: 2899.0,
    compare_at_price: 3299.0,
    image: img.surfaceStudio,
    description: 'Studio desktop with keyboard and mouse included.',
    badge: '-12%',
    is_trending: true,
  },
  {
    id: 10,
    name: 'B&O Beoplay Over-Ear Noise Cancelling',
    slug: 'bo-beoplay-overear',
    brand: 'B&O',
    category_id: 12,
    price: 549.0,
    compare_at_price: 649.0,
    image: img.headphonesBo,
    description: 'Comfortable cushions and long battery life for travel.',
    badge: '-15%',
    is_top_selling: true,
  },
  {
    id: 11,
    name: 'Acer Swift Slim Laptop 14" Intel Core i5',
    slug: 'acer-swift-14',
    brand: 'Acer',
    category_id: 4,
    price: 649.0,
    compare_at_price: 749.0,
    image: img.laptop,
    description: 'Everyday productivity laptop with all-day battery.',
    badge: '-13%',
  },
  {
    id: 12,
    name: 'Apple Watch Series 8 GPS Midnight Aluminum',
    slug: 'apple-watch-s8-midnight',
    brand: 'Apple',
    category_id: 10,
    price: 399.0,
    compare_at_price: 429.0,
    image: img.watchSilver,
    description: 'Crash Detection, temperature sensing, and always-on display.',
    badge: '-7%',
  },
  {
    id: 13,
    name: 'Apple AirPods Pro 2nd Generation',
    slug: 'airpods-pro-2',
    brand: 'Apple',
    category_id: 12,
    price: 229.0,
    compare_at_price: 249.0,
    image: img.airpods,
    description: 'Personalized Spatial Audio and MagSafe charging.',
    badge: '-8%',
    is_trending: true,
  },
  {
    id: 14,
    name: 'Samsung Gear 360 Action Camera Kit',
    slug: 'samsung-gear-360-kit',
    brand: 'SAMSUNG',
    category_id: 9,
    price: 189.0,
    compare_at_price: 229.0,
    image: img.camera360,
    description: 'Bundle with mount and carrying case for travel.',
    badge: '-17%',
    is_flash: true,
    is_top_selling: true,
  },
  {
    id: 15,
    name: 'Fitbit Charge Health & Fitness Tracker',
    slug: 'fitbit-charge',
    brand: 'Fitbit',
    category_id: 10,
    price: 129.0,
    compare_at_price: 149.0,
    image: img.fitnessWatch,
    description: 'Built-in GPS and heart-rate tracking on your wrist.',
    badge: '-13%',
    is_trending: true,
  },
  {
    id: 16,
    name: 'Apple MacBook Pro 14" M3 Chip 512GB',
    slug: 'macbook-pro-14',
    brand: 'Apple',
    category_id: 4,
    price: 1999.0,
    compare_at_price: 2199.0,
    image: img.laptop,
    description: 'Pro performance for creative and developer workflows.',
    badge: '-9%',
  },
  {
    id: 17,
    name: 'Acer Nitro Gaming Laptop 15.6" RTX',
    slug: 'acer-nitro-15',
    brand: 'Acer',
    category_id: 5,
    price: 799.0,
    compare_at_price: 949.0,
    image: img.laptop,
    description: 'High-refresh display and dedicated graphics for gaming.',
    badge: '-16%',
    is_flash: true,
  },
  {
    id: 18,
    name: 'Apple Watch SE Starlight Sport Band',
    slug: 'apple-watch-se-starlight',
    brand: 'Apple',
    category_id: 10,
    price: 249.0,
    compare_at_price: 279.0,
    image: img.watchWhite,
    description: 'Stay connected with notifications and activity rings.',
    badge: '-11%',
  },
  {
    id: 19,
    name: 'Microsoft Surface Studio All-in-One',
    slug: 'surface-studio-aio',
    brand: 'Microsoft',
    category_id: 4,
    price: 2399.0,
    compare_at_price: 2799.0,
    image: img.surfaceStudio,
    description: 'Large touchscreen desktop for design and productivity.',
    badge: '-14%',
  },
  {
    id: 20,
    name: 'B&O Beoplay HX Comfort Headphones',
    slug: 'bo-beoplay-hx',
    brand: 'B&O',
    category_id: 12,
    price: 499.0,
    compare_at_price: 599.0,
    image: img.headphonesBo,
    description: 'Soft ear cushions and clear wireless sound.',
    badge: '-17%',
    is_trending: true,
  },
];

export const mockBrands = [
  'Apple',
  'Microsoft',
  'B&O',
  'Acer',
  'Fitbit',
  'SAMSUNG',
  'Sony',
  'HP',
  'Dell',
];

export const defaultProductFeatures = [
  'Free delivery across Cambodia on orders over $75',
  'Verified seller with local warranty support',
  'Pay with KHQR, ABA, Wing, or cash on delivery',
];
