/** Demo ops data for Admin Center sections (wire Laravel APIs later). */

export type OrderStatus = 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'disputed';
export type VendorStatus = 'active' | 'pending' | 'suspended';
export type ProductModeration = 'live' | 'flagged' | 'hidden';
export type TxType = 'fee' | 'payout' | 'refund' | 'escrow';
export type StaffRole = 'admin' | 'super_admin' | 'support';

export interface AdminOpsOrder {
  id: string;
  customer: string;
  vendor: string;
  status: OrderStatus;
  total: number;
  fee: number;
  payin: 'aba' | 'wing' | 'cod' | 'khqr';
  placedAt: string;
  items: number;
}

export interface AdminOpsVendor {
  id: string;
  name: string;
  slug: string;
  owner: string;
  city: string;
  status: VendorStatus;
  gmv: number;
  orders: number;
  listings: number;
  joinedAt: string;
}

export interface AdminOpsProduct {
  id: string;
  name: string;
  vendor: string;
  category: string;
  price: number;
  stock: number;
  status: ProductModeration;
  updatedAt: string;
}

export interface AdminOpsCategory {
  id: string;
  name: string;
  slug: string;
  products: number;
  featured: boolean;
  sort: number;
}

export interface AdminOpsTx {
  id: string;
  type: TxType;
  party: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  at: string;
}

export interface AdminOpsUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  lastActive: string;
  status: 'active' | 'invited' | 'disabled';
}

export interface AdminFeeTier {
  id: string;
  name: string;
  rate: number;
  minOrders: number;
  vendors: number;
}

export const adminOpsOrders: AdminOpsOrder[] = [
  {
    id: '1042',
    customer: 'Sophea Chan',
    vendor: 'Phnom Penh Gadgets',
    status: 'paid',
    total: 86.5,
    fee: 3.46,
    payin: 'aba',
    placedAt: '2026-08-25 09:12',
    items: 2,
  },
  {
    id: '1041',
    customer: 'Dara Kim',
    vendor: 'Siem Reap Crafts',
    status: 'packed',
    total: 42.0,
    fee: 1.68,
    payin: 'wing',
    placedAt: '2026-08-25 08:41',
    items: 1,
  },
  {
    id: '1040',
    customer: 'Maya Ok',
    vendor: 'Battambang Fresh',
    status: 'shipped',
    total: 19.75,
    fee: 0.79,
    payin: 'cod',
    placedAt: '2026-08-24 21:05',
    items: 3,
  },
  {
    id: '1039',
    customer: 'Rithy Meas',
    vendor: 'Phnom Penh Gadgets',
    status: 'delivered',
    total: 210.0,
    fee: 8.4,
    payin: 'khqr',
    placedAt: '2026-08-24 16:22',
    items: 1,
  },
  {
    id: '1038',
    customer: 'Linna Sok',
    vendor: 'Kampot Pepper Co',
    status: 'cancelled',
    total: 28.0,
    fee: 0,
    payin: 'aba',
    placedAt: '2026-08-24 14:08',
    items: 1,
  },
  {
    id: '1035',
    customer: 'Vichea Lim',
    vendor: 'Siem Reap Crafts',
    status: 'disputed',
    total: 54.0,
    fee: 0,
    payin: 'wing',
    placedAt: '2026-08-23 11:40',
    items: 2,
  },
  {
    id: '1034',
    customer: 'Sokha Nhem',
    vendor: 'Phnom Penh Gadgets',
    status: 'paid',
    total: 129.0,
    fee: 5.16,
    payin: 'aba',
    placedAt: '2026-08-23 10:05',
    items: 1,
  },
  {
    id: '1033',
    customer: 'Chenda Pov',
    vendor: 'Kampot Pepper Co',
    status: 'shipped',
    total: 31.5,
    fee: 1.26,
    payin: 'cod',
    placedAt: '2026-08-22 19:18',
    items: 4,
  },
];

export const adminOpsVendors: AdminOpsVendor[] = [
  {
    id: 'v1',
    name: 'Phnom Penh Gadgets',
    slug: 'pp-gadgets',
    owner: 'Sokha Meas',
    city: 'Phnom Penh',
    status: 'active',
    gmv: 12400,
    orders: 186,
    listings: 48,
    joinedAt: '2025-11-02',
  },
  {
    id: 'v2',
    name: 'Siem Reap Crafts',
    slug: 'sr-crafts',
    owner: 'Dara Vann',
    city: 'Siem Reap',
    status: 'active',
    gmv: 8200,
    orders: 94,
    listings: 32,
    joinedAt: '2026-01-14',
  },
  {
    id: 'v3',
    name: 'Battambang Fresh',
    slug: 'bb-fresh',
    owner: 'Sreypov Chhim',
    city: 'Battambang',
    status: 'pending',
    gmv: 0,
    orders: 0,
    listings: 6,
    joinedAt: '2026-08-20',
  },
  {
    id: 'v4',
    name: 'Kampot Pepper Co',
    slug: 'kampot-pepper',
    owner: 'Rithy Hang',
    city: 'Kampot',
    status: 'active',
    gmv: 5600,
    orders: 71,
    listings: 18,
    joinedAt: '2026-03-08',
  },
  {
    id: 'v5',
    name: 'Tonle Fashion',
    slug: 'tonle-fashion',
    owner: 'Linna Sok',
    city: 'Phnom Penh',
    status: 'suspended',
    gmv: 2100,
    orders: 29,
    listings: 12,
    joinedAt: '2026-02-19',
  },
];

export const adminOpsProducts: AdminOpsProduct[] = [
  {
    id: 'p1',
    name: 'Wireless earbuds Pro',
    vendor: 'Phnom Penh Gadgets',
    category: 'Electronics',
    price: 24.9,
    stock: 84,
    status: 'live',
    updatedAt: '2026-08-24',
  },
  {
    id: 'p2',
    name: 'Handwoven scarf',
    vendor: 'Siem Reap Crafts',
    category: 'Fashion',
    price: 18.0,
    stock: 22,
    status: 'live',
    updatedAt: '2026-08-23',
  },
  {
    id: 'p3',
    name: 'Kampot pepper 250g',
    vendor: 'Kampot Pepper Co',
    category: 'Grocery',
    price: 9.5,
    stock: 140,
    status: 'live',
    updatedAt: '2026-08-22',
  },
  {
    id: 'p4',
    name: 'Replica branded bag',
    vendor: 'Tonle Fashion',
    category: 'Fashion',
    price: 45.0,
    stock: 8,
    status: 'flagged',
    updatedAt: '2026-08-21',
  },
  {
    id: 'p5',
    name: 'Organic mango box',
    vendor: 'Battambang Fresh',
    category: 'Grocery',
    price: 12.0,
    stock: 0,
    status: 'hidden',
    updatedAt: '2026-08-20',
  },
  {
    id: 'p6',
    name: 'USB-C hub 7-in-1',
    vendor: 'Phnom Penh Gadgets',
    category: 'Electronics',
    price: 32.0,
    stock: 41,
    status: 'live',
    updatedAt: '2026-08-19',
  },
];

export const adminOpsCategories: AdminOpsCategory[] = [
  { id: 'c1', name: 'Electronics', slug: 'electronics', products: 312, featured: true, sort: 1 },
  { id: 'c2', name: 'Fashion', slug: 'fashion', products: 248, featured: true, sort: 2 },
  { id: 'c3', name: 'Grocery', slug: 'grocery', products: 186, featured: true, sort: 3 },
  { id: 'c4', name: 'Home & living', slug: 'home', products: 154, featured: false, sort: 4 },
  { id: 'c5', name: 'Beauty', slug: 'beauty', products: 98, featured: false, sort: 5 },
  { id: 'c6', name: 'Sports', slug: 'sports', products: 67, featured: false, sort: 6 },
];

export const adminOpsTransactions: AdminOpsTx[] = [
  {
    id: 'tx-901',
    type: 'fee',
    party: 'Order #1039',
    amount: 8.4,
    status: 'completed',
    method: 'Platform',
    at: '2026-08-24 17:01',
  },
  {
    id: 'tx-900',
    type: 'payout',
    party: 'Phnom Penh Gadgets',
    amount: 1840.0,
    status: 'pending',
    method: 'ABA',
    at: '2026-08-25 07:00',
  },
  {
    id: 'tx-899',
    type: 'escrow',
    party: 'Order #1042',
    amount: 86.5,
    status: 'pending',
    method: 'ABA',
    at: '2026-08-25 09:12',
  },
  {
    id: 'tx-898',
    type: 'refund',
    party: 'Order #1038',
    amount: 28.0,
    status: 'completed',
    method: 'ABA',
    at: '2026-08-24 15:40',
  },
  {
    id: 'tx-897',
    type: 'payout',
    party: 'Kampot Pepper Co',
    amount: 620.0,
    status: 'pending',
    method: 'Wing',
    at: '2026-08-25 07:00',
  },
  {
    id: 'tx-896',
    type: 'fee',
    party: 'Order #1040',
    amount: 0.79,
    status: 'completed',
    method: 'Platform',
    at: '2026-08-24 21:10',
  },
  {
    id: 'tx-895',
    type: 'payout',
    party: 'Siem Reap Crafts',
    amount: 980.0,
    status: 'failed',
    method: 'Wing',
    at: '2026-08-18 07:00',
  },
];

export const adminOpsUsers: AdminOpsUser[] = [
  {
    id: 'u1',
    name: 'Platform Admin',
    email: 'admin@zcomus.test',
    role: 'admin',
    lastActive: '2026-08-25 10:02',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Super Admin',
    email: 'super@zcomus.test',
    role: 'super_admin',
    lastActive: '2026-08-25 09:55',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'Support Desk',
    email: 'support@zcomus.test',
    role: 'support',
    lastActive: '2026-08-24 18:20',
    status: 'active',
  },
  {
    id: 'u4',
    name: 'Ops Analyst',
    email: 'ops@zcomus.test',
    role: 'admin',
    lastActive: '—',
    status: 'invited',
  },
];

export const adminFeeTiers: AdminFeeTier[] = [
  { id: 'f1', name: 'Starter', rate: 0.05, minOrders: 0, vendors: 28 },
  { id: 'f2', name: 'Growth', rate: 0.04, minOrders: 50, vendors: 24 },
  { id: 'f3', name: 'Partner', rate: 0.02, minOrders: 200, vendors: 12 },
];

export const adminNavBadges = {
  orders: adminOpsOrders.filter((o) => o.status === 'paid' || o.status === 'disputed').length,
  vendors: adminOpsVendors.filter((v) => v.status === 'pending').length,
  products: adminOpsProducts.filter((p) => p.status === 'flagged').length,
  transactions: adminOpsTransactions.filter((t) => t.status === 'pending').length,
  withdrawals: adminOpsTransactions.filter((t) => t.type === 'payout' && t.status === 'pending')
    .length,
};
