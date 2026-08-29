/** Demo platform metrics for Admin / Super Admin dashboard (wire APIs later). */

export interface AdminKpi {
  id: string;
  labelKey: string;
  value: string;
  hintKey: string;
  icon: string;
  tone: 'default' | 'hot' | 'money' | 'ok';
  to: string;
}

export interface AdminOrderRow {
  id: string;
  customer: string;
  vendor: string;
  status: 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  fee: number;
  payin: 'aba' | 'wing' | 'cod';
  placedAt: string;
}

export interface AdminAttentionItem {
  id: string;
  titleKey: string;
  bodyKey: string;
  severity: 'warn' | 'info' | 'critical';
  to: string;
}

export interface AdminVendorRow {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'pending' | 'suspended';
  gmv: number;
  orders: number;
}

export const PLATFORM_FEE_RATE = 0.08;

export const adminKpis: AdminKpi[] = [
  {
    id: 'gmv',
    labelKey: 'admin.kpiGmv',
    value: '$48,920',
    hintKey: 'admin.kpiGmvHint',
    icon: 'trending_up',
    tone: 'money',
    to: '/admin/transactions',
  },
  {
    id: 'fees',
    labelKey: 'admin.kpiFees',
    value: '$3,913.60',
    hintKey: 'admin.kpiFeesHint',
    icon: 'payments',
    tone: 'ok',
    to: '/admin/transactions',
  },
  {
    id: 'orders',
    labelKey: 'admin.kpiOrders',
    value: '1,284',
    hintKey: 'admin.kpiOrdersHint',
    icon: 'receipt_long',
    tone: 'hot',
    to: '/admin/orders',
  },
  {
    id: 'vendors',
    labelKey: 'admin.kpiVendors',
    value: '64',
    hintKey: 'admin.kpiVendorsHint',
    icon: 'storefront',
    tone: 'default',
    to: '/admin/sellers',
  },
];

export const adminOrders: AdminOrderRow[] = [
  {
    id: '1042',
    customer: 'Sophea Chan',
    vendor: 'Phnom Penh Gadgets',
    status: 'paid',
    total: 86.5,
    fee: 6.92,
    payin: 'aba',
    placedAt: '2026-08-25 09:12',
  },
  {
    id: '1041',
    customer: 'Dara Kim',
    vendor: 'Siem Reap Crafts',
    status: 'packed',
    total: 42.0,
    fee: 3.36,
    payin: 'wing',
    placedAt: '2026-08-25 08:41',
  },
  {
    id: '1040',
    customer: 'Maya Ok',
    vendor: 'Battambang Fresh',
    status: 'shipped',
    total: 19.75,
    fee: 1.58,
    payin: 'cod',
    placedAt: '2026-08-24 21:05',
  },
  {
    id: '1039',
    customer: 'Rithy Meas',
    vendor: 'Phnom Penh Gadgets',
    status: 'delivered',
    total: 210.0,
    fee: 16.8,
    payin: 'aba',
    placedAt: '2026-08-24 16:22',
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
  },
];

export const adminAttention: AdminAttentionItem[] = [
  {
    id: 'a1',
    titleKey: 'admin.attnPayoutTitle',
    bodyKey: 'admin.attnPayoutBody',
    severity: 'warn',
    to: '/admin/transactions',
  },
  {
    id: 'a2',
    titleKey: 'admin.attnVendorTitle',
    bodyKey: 'admin.attnVendorBody',
    severity: 'info',
    to: '/admin/sellers',
  },
  {
    id: 'a3',
    titleKey: 'admin.attnDisputeTitle',
    bodyKey: 'admin.attnDisputeBody',
    severity: 'critical',
    to: '/admin/orders',
  },
];

export const adminVendors: AdminVendorRow[] = [
  { id: 'v1', name: 'Phnom Penh Gadgets', slug: 'pp-gadgets', status: 'active', gmv: 12400, orders: 186 },
  { id: 'v2', name: 'Siem Reap Crafts', slug: 'sr-crafts', status: 'active', gmv: 8200, orders: 94 },
  { id: 'v3', name: 'Battambang Fresh', slug: 'bb-fresh', status: 'pending', gmv: 0, orders: 0 },
  { id: 'v4', name: 'Kampot Pepper Co', slug: 'kampot-pepper', status: 'active', gmv: 5600, orders: 71 },
];

export const superAdminExtras = {
  feeRateLabel: '8%',
  staffCount: 3,
  pendingSettlements: '$12,480',
  escrowHeld: '$9,210',
};
