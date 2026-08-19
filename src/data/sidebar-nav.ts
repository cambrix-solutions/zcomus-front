import { ecom } from 'src/helper/ecomAssets';

export interface NavSubCategory {
  name: string;
  slug: string;
}

export interface NavCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  children: NavSubCategory[];
}

export const sidebarCategories: NavCategory[] = [
  {
    id: 'computers',
    name: 'Computers & Accessories',
    slug: 'computers-accessories',
    icon: ecom('imgs/template/monitor.svg'),
    children: [
      { name: 'Computer Accessories', slug: 'computer-accessories' },
      { name: 'Computer Cases', slug: 'computer-cases' },
      { name: 'Laptop', slug: 'laptop' },
      { name: 'HDD', slug: 'hdd' },
      { name: 'RAM', slug: 'ram' },
      { name: 'Headphone', slug: 'headphone' },
    ],
  },
  {
    id: 'phones',
    name: 'Cell Phones',
    slug: 'cell-phones',
    icon: ecom('imgs/template/mobile.svg'),
    children: [
      { name: 'Phone Accessories', slug: 'phone-accessories' },
      { name: 'Phone Cases', slug: 'phone-cases' },
      { name: 'Postpaid Phones', slug: 'postpaid-phones' },
      { name: 'Unlocked Phones', slug: 'unlocked-phones' },
      { name: 'Prepaid Phones', slug: 'prepaid-phones' },
      { name: 'iPhone', slug: 'iphone' },
      { name: 'Samsung Galaxy', slug: 'samsung-galaxy' },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming Gadgets',
    slug: 'gaming-gadgets',
    icon: ecom('imgs/template/game.svg'),
    children: [
      { name: 'Wireless Routers', slug: 'wireless-routers' },
      { name: 'Cool New Gadgets', slug: 'cool-gadgets' },
      { name: 'Xbox Accessories', slug: 'xbox-accessories' },
      { name: 'PlayStation Accessories', slug: 'playstation-accessories' },
    ],
  },
  {
    id: 'watches',
    name: 'Smart watches',
    slug: 'smart-watches',
    icon: ecom('imgs/template/clock.svg'),
    children: [
      { name: 'Smart Watches', slug: 'smart-watches' },
      { name: 'Fashion Smart Watches', slug: 'fashion-smart-watches' },
      { name: 'Smart Bracelets', slug: 'smart-bracelets' },
      { name: 'Smart Rings', slug: 'smart-rings' },
    ],
  },
  {
    id: 'headphones',
    name: 'Wired Headphone',
    slug: 'wired-headphone',
    icon: ecom('imgs/template/airpods.svg'),
    children: [
      { name: 'On-Ear Headphones', slug: 'on-ear' },
      { name: 'In-Ear Headphones', slug: 'in-ear' },
      { name: 'Over-Ear Headphones', slug: 'over-ear' },
    ],
  },
  {
    id: 'mouse',
    name: 'Mouse & Keyboard',
    slug: 'mouse-keyboard',
    icon: ecom('imgs/template/mouse.svg'),
    children: [
      { name: 'Gaming Mouse', slug: 'gaming-mouse' },
      { name: 'Wireless Mouse', slug: 'wireless-mouse' },
      { name: 'Mechanical Keyboard', slug: 'mechanical-keyboard' },
    ],
  },
  {
    id: 'bluetooth',
    name: 'Bluetooth devices',
    slug: 'bluetooth-devices',
    icon: ecom('imgs/template/bluetooth.svg'),
    children: [
      { name: 'Bluetooth Speakers', slug: 'bluetooth-speakers' },
      { name: 'Bluetooth Earphones', slug: 'bluetooth-earphones' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud Software',
    slug: 'cloud-software',
    icon: ecom('imgs/template/clound.svg'),
    children: [
      { name: 'Antivirus', slug: 'antivirus' },
      { name: 'Office Suites', slug: 'office-suites' },
      { name: 'Cloud Storage', slug: 'cloud-storage' },
    ],
  },
];

export const sidebarIconOnly = [
  ecom('imgs/template/monitor.svg'),
  ecom('imgs/template/mobile.svg'),
  ecom('imgs/template/game.svg'),
  ecom('imgs/template/clock.svg'),
  ecom('imgs/template/airpod.svg'),
  ecom('imgs/template/airpods.svg'),
  ecom('imgs/template/mouse.svg'),
  ecom('imgs/template/music-play.svg'),
  ecom('imgs/template/bluetooth.svg'),
  ecom('imgs/template/clound.svg'),
  ecom('imgs/template/electricity.svg'),
  ecom('imgs/template/cpu.svg'),
  ecom('imgs/template/devices.svg'),
  ecom('imgs/template/driver.svg'),
  ecom('imgs/template/lamp.svg'),
];
