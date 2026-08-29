import type { ShopListing } from 'src/composables/useSellerShop';

export type VendorOrderTone = 'deal' | 'info' | 'ok';

export type VendorPayinMethod = 'aba' | 'wing' | 'cod';

export type VendorOrder = {
  id: string;
  buyer: string;
  /** Display date */
  date: string;
  /** YYYY-MM-DD for charts */
  dateKey: string;
  status: string;
  total: number;
  tone: VendorOrderTone;
  listingId: string;
  listingTitle: string;
  /** How the shopper paid Zcomus */
  payinMethod: VendorPayinMethod;
};

const DAY_MS = 86_400_000;

function isoDaysAgo(n: number) {
  const d = new Date(Date.now() - n * DAY_MS);
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(dateKey: string) {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Demo orders tied to live listings — scales with shop catalog. */
export function buildVendorOrders(listings: ShopListing[]): VendorOrder[] {
  const live = listings.filter((l) => l.status === 'listed');
  if (!live.length) return [];

  const primary = live[0]!;
  const secondary = live[1] ?? primary;

  const p1 = Number(primary.price) || 49;
  const p2 = Number(secondary.price) || 28.5;

  return [
    {
      id: 'S2001',
      buyer: 'Sokha P.',
      dateKey: isoDaysAgo(2),
      date: formatDisplayDate(isoDaysAgo(2)),
      status: 'New',
      total: Math.round(p1 * 100) / 100,
      tone: 'deal',
      listingId: primary.id,
      listingTitle: primary.title,
      payinMethod: 'aba',
    },
    {
      id: 'S2002',
      buyer: 'Vannak T.',
      dateKey: isoDaysAgo(3),
      date: formatDisplayDate(isoDaysAgo(3)),
      status: 'Packed',
      total: Math.round(p2 * 100) / 100,
      tone: 'info',
      listingId: secondary.id,
      listingTitle: secondary.title,
      payinMethod: 'wing',
    },
    {
      id: 'S2003',
      buyer: 'Dara M.',
      dateKey: isoDaysAgo(5),
      date: formatDisplayDate(isoDaysAgo(5)),
      status: 'Delivered',
      total: Math.round(p1 * 0.85 * 100) / 100,
      tone: 'ok',
      listingId: primary.id,
      listingTitle: primary.title,
      payinMethod: 'cod',
    },
  ];
}
