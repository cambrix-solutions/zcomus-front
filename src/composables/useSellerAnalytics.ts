import { computed, type Ref } from 'vue';
import type { ShopListing } from 'src/composables/useSellerShop';
import type { VendorOrder } from 'src/data/vendor-orders';

const WEEKDAY_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const WEEKDAY_FULL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Weekend-heavy traffic shape for the last 7 days (index 0 = 6 days ago). */
const VIEW_SHAPE = [0.1, 0.11, 0.12, 0.13, 0.15, 0.19, 0.2];

export type AnalyticsBar = {
  value: number;
  day: string;
  pct: number;
  isPeak: boolean;
  isToday: boolean;
  dateKey: string;
};

export type ListingAnalyticsRow = {
  id: string;
  title: string;
  image: string;
  status: ShopListing['status'];
  category: string;
  views: number;
  orders: number;
  revenue: number;
  stock: number;
  viewShare: number;
};

export type CategoryRow = {
  name: string;
  count: number;
  views: number;
  pct: number;
};

function daysSince(isoDate: string) {
  const then = new Date(`${isoDate}T12:00:00`).getTime();
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}

function estimateListingViews(item: ShopListing) {
  if (item.status === 'draft') return 0;
  let score = 6;
  if (item.status === 'listed') score += 22;
  score += Math.min(item.images.length, 5) * 3;
  if (item.badge) score += 10;
  score += Math.min(Number(item.price) / 12, 18);
  if (item.compareAt && Number(item.compareAt) > Number(item.price)) score += 6;
  if (item.colorOptions.length || item.sizeOptions.length) score += 4;
  if (daysSince(item.updatedAt) <= 7) score += 12;
  if (item.stock <= 2 && item.stock > 0) score += 3;
  return Math.round(score);
}

function last7DateKeys() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function todayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

export function useSellerAnalytics(
  listings: Ref<ShopListing[]>,
  orders: Ref<VendorOrder[]>,
  shopActive: Ref<boolean> | { value: boolean },
) {
  const listingViews = computed(() =>
    listings.value.map((item) => ({ id: item.id, views: estimateListingViews(item) })),
  );

  const totalViews = computed(() => {
    const sum = listingViews.value.reduce((acc, row) => acc + row.views, 0);
    return sum + (shopActive.value ? 12 : 0);
  });

  const orderCount = computed(() => orders.value.length);
  const orderRevenue = computed(() =>
    orders.value.reduce((sum, order) => sum + order.total, 0),
  );

  const avgOrderValue = computed(() =>
    orderCount.value ? orderRevenue.value / orderCount.value : 0,
  );

  const conversionRate = computed(() =>
    totalViews.value > 0 ? (orderCount.value / totalViews.value) * 100 : 0,
  );

  const conversionLabel = computed(() => `${conversionRate.value.toFixed(1)}%`);

  const liveCount = computed(() => listings.value.filter((l) => l.status === 'listed').length);
  const draftCount = computed(() => listings.value.filter((l) => l.status === 'draft').length);
  const pausedCount = computed(() => listings.value.filter((l) => l.status === 'paused').length);

  const catalogValue = computed(() =>
    listings.value
      .filter((l) => l.status !== 'draft')
      .reduce((sum, item) => sum + Number(item.price) * item.stock, 0),
  );

  const totalStockUnits = computed(() =>
    listings.value.reduce((sum, item) => sum + item.stock, 0),
  );

  const lowStockCount = computed(
    () => listings.value.filter((l) => l.status !== 'draft' && l.stock > 0 && l.stock <= 2).length,
  );

  const weekDateKeys = computed(() => last7DateKeys());

  const weekViews = computed(() => {
    const keys = weekDateKeys.value;
    const total = totalViews.value;
    const base = keys.map((_, i) => Math.max(1, Math.round(total * VIEW_SHAPE[i]!)));
    for (const order of orders.value) {
      const idx = keys.indexOf(order.dateKey);
      if (idx >= 0) base[idx] = (base[idx] ?? 0) + 8;
    }
    return base;
  });

  const weekChart = computed((): AnalyticsBar[] => {
    const values = weekViews.value;
    const max = Math.max(...values, 1);
    const today = todayIndex();
    const keys = weekDateKeys.value;
    return values.map((value, i) => ({
      value,
      day: WEEKDAY_SHORT[i]!,
      pct: Math.round((value / max) * 100),
      isPeak: value === max,
      isToday: i === today,
      dateKey: keys[i]!,
    }));
  });

  const weekViewsTotal = computed(() => weekViews.value.reduce((a, b) => a + b, 0));

  const peakDayFull = computed(() => {
    const values = weekViews.value;
    const max = Math.max(...values);
    const index = values.indexOf(max);
    return WEEKDAY_FULL[index] ?? '—';
  });

  const weekRevenue = computed(() => {
    const keys = weekDateKeys.value;
    return keys.map((key) =>
      orders.value
        .filter((order) => order.dateKey === key)
        .reduce((sum, order) => sum + order.total, 0),
    );
  });

  const weekRevenueChart = computed((): AnalyticsBar[] => {
    const values = weekRevenue.value;
    const max = Math.max(...values, 1);
    const today = todayIndex();
    const keys = weekDateKeys.value;
    return values.map((value, i) => ({
      value: Math.round(value * 100) / 100,
      day: WEEKDAY_SHORT[i]!,
      pct: value > 0 ? Math.round((value / max) * 100) : 0,
      isPeak: value === max && value > 0,
      isToday: i === today,
      dateKey: keys[i]!,
    }));
  });

  const weekRevenueTotal = computed(() =>
    Math.round(weekRevenue.value.reduce((a, b) => a + b, 0) * 100) / 100,
  );

  const topListings = computed((): ListingAnalyticsRow[] => {
    const viewMap = new Map(listingViews.value.map((row) => [row.id, row.views]));
    const total = totalViews.value || 1;
    return [...listings.value]
      .map((item) => {
        const itemOrders = orders.value.filter((o) => o.listingId === item.id);
        const revenue = itemOrders.reduce((sum, o) => sum + o.total, 0);
        const views = viewMap.get(item.id) ?? 0;
        return {
          id: item.id,
          title: item.title,
          image: item.image,
          status: item.status,
          category: item.category,
          views,
          orders: itemOrders.length,
          revenue: Math.round(revenue * 100) / 100,
          stock: item.stock,
          viewShare: Math.round((views / total) * 100),
        };
      })
      .sort((a, b) => b.views - a.views || b.revenue - a.revenue)
      .slice(0, 6);
  });

  const categoryBreakdown = computed((): CategoryRow[] => {
    const map = new Map<string, { count: number; views: number }>();
    for (const item of listings.value) {
      const views = estimateListingViews(item);
      const row = map.get(item.category) ?? { count: 0, views: 0 };
      row.count += 1;
      row.views += views;
      map.set(item.category, row);
    }
    const maxViews = Math.max(...[...map.values()].map((r) => r.views), 1);
    return [...map.entries()]
      .map(([name, row]) => ({
        name,
        count: row.count,
        views: row.views,
        pct: Math.round((row.views / maxViews) * 100),
      }))
      .sort((a, b) => b.views - a.views);
  });

  const statusBreakdown = computed(() => [
    { id: 'listed' as const, count: liveCount.value },
    { id: 'draft' as const, count: draftCount.value },
    { id: 'paused' as const, count: pausedCount.value },
  ]);

  const recentOrders = computed(() =>
    [...orders.value].sort((a, b) => b.dateKey.localeCompare(a.dateKey)).slice(0, 5),
  );

  return {
    totalViews,
    orderCount,
    orderRevenue,
    avgOrderValue,
    conversionRate,
    conversionLabel,
    liveCount,
    draftCount,
    pausedCount,
    catalogValue,
    totalStockUnits,
    lowStockCount,
    weekChart,
    weekViewsTotal,
    peakDayFull,
    weekRevenueChart,
    weekRevenueTotal,
    topListings,
    categoryBreakdown,
    statusBreakdown,
    recentOrders,
  };
}
