import { ecom } from 'src/helper/ecomAssets';

export interface Vendor {
  slug: string;
  name: string;
  logo: string;
  cover: string;
  products: number;
  reviews: number;
  memberSince: number;
  address: string;
  phone: string;
  phone2?: string;
  industry: string;
  description: string;
}

export const vendorIndustries = [
  { id: 'all', name: 'All industries', count: 0 },
  { id: 'computers', name: 'Computers & Laptop', count: 9 },
  { id: 'electric', name: 'Electric accessories', count: 12 },
  { id: 'fashion', name: 'Fashion & Beauty', count: 24 },
  { id: 'furniture', name: 'Furniture & Appliances', count: 34 },
  { id: 'sports', name: 'Sports and Outdoors', count: 65 },
  { id: 'food', name: 'Food, condiments', count: 15 },
  { id: 'books', name: 'Book, Office supplies', count: 76 },
  { id: 'children', name: 'Children and mothers', count: 89 },
  { id: 'cars', name: 'Cars, motorbikes', count: 23 },
  { id: 'other', name: 'Other', count: 98 },
];

export const mockVendors: Vendor[] = [
  {
    slug: 'futur',
    name: 'Futur Store',
    logo: ecom('imgs/page/vendor/futur.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 128,
    reviews: 65,
    memberSince: 2012,
    address: '#45, St. 271, Sangkat Boeung Keng Kang I, Khan Chamkarmorn, Phnom Penh',
    phone: '(+855) - 23-555-0201',
    industry: 'computers',
    description: 'Premium electronics and computer accessories from a trusted Phnom Penh seller.',
  },
  {
    slug: 'elmado',
    name: 'Elmado Shop',
    logo: ecom('imgs/page/vendor/elmado.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 96,
    reviews: 48,
    memberSince: 2014,
    address: 'Sivatha Blvd, Mondul 1, Siem Reap City, Siem Reap',
    phone: '(+855) - 63-555-0302',
    industry: 'electric',
    description: 'Electric accessories and smart gadgets for everyday life in Cambodia.',
  },
  {
    slug: 'costctrl',
    name: 'Costctrl',
    logo: ecom('imgs/page/vendor/costctrl.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 210,
    reviews: 112,
    memberSince: 2011,
    address: 'Street 289, Sangkat Boeung Kak I, Khan Toul Kork, Phnom Penh',
    phone: '(+855) - 12-555-0403',
    industry: 'computers',
    description: 'Budget-friendly tech with reliable delivery across Cambodia.',
  },
  {
    slug: 'fasfox',
    name: 'Fasfox Corporation',
    logo: ecom('imgs/page/vendor/fasfox.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 360,
    reviews: 65,
    memberSince: 2012,
    address: 'Russian Blvd, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
    phone: '(+855) - 23-555-0504',
    phone2: '(+855) - 12-555-0505',
    industry: 'electric',
    description: 'Official Fasfox marketplace store for phones, audio, and accessories.',
  },
  {
    slug: 'tropper',
    name: 'Tropper',
    logo: ecom('imgs/page/vendor/tropper.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 74,
    reviews: 33,
    memberSince: 2016,
    address: 'Ekareach Street, Preah Sihanouk Province',
    phone: '(+855) - 34-555-0606',
    industry: 'sports',
    description: 'Outdoor gear and sports electronics for active lifestyles.',
  },
  {
    slug: 'asembly',
    name: 'Asembly',
    logo: ecom('imgs/page/vendor/asembly.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 152,
    reviews: 89,
    memberSince: 2013,
    address: 'Street 3, Kammeeng, Battambang City, Battambang',
    phone: '(+855) - 53-555-0707',
    industry: 'furniture',
    description: 'Home appliances and smart furniture accessories.',
  },
  {
    slug: 'aslan',
    name: 'Aslan Tech',
    logo: ecom('imgs/page/vendor/aslan.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 188,
    reviews: 77,
    memberSince: 2015,
    address: 'National Road 7, Kampong Cham City, Kampong Cham',
    phone: '(+855) - 42-555-0808',
    industry: 'computers',
    description: 'Gaming gear, laptops, and PC components.',
  },
  {
    slug: 'market',
    name: 'Market Hub',
    logo: ecom('imgs/page/vendor/market.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 245,
    reviews: 140,
    memberSince: 2010,
    address: 'National Road 1, Ta Khmau, Kandal',
    phone: '(+855) - 24-555-0909',
    industry: 'fashion',
    description: 'Multi-category marketplace seller with fast shipping across Cambodia.',
  },
  {
    slug: 'demo-store',
    name: 'Demo Store',
    logo: ecom('imgs/page/vendor/fasfox.png'),
    cover: ecom('imgs/page/vendor/featured.png'),
    products: 64,
    reviews: 28,
    memberSince: 2018,
    address: '#12, St. 168, Sangkat Veal Vong, Khan 7 Makara, Phnom Penh',
    phone: '(+855) - 23-555-0100',
    industry: 'other',
    description: 'Sample vendor store used for storefront demos.',
  },
];

export function getVendorBySlug(slug: string): Vendor | undefined {
  return mockVendors.find((v) => v.slug === slug);
}
