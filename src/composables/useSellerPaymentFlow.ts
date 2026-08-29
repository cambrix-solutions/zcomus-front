import { computed, type Ref } from 'vue';
import type { VendorOrder } from 'src/data/vendor-orders';

export type PayinMethodId = 'aba' | 'wing' | 'cod' | 'card';

export const PLATFORM_FEE_RATE = 0.08;

export type PaymentLifecycleStep = {
  id: string;
  icon: string;
  done: boolean;
  current: boolean;
};

function nextMondayLabel() {
  const d = new Date();
  const day = d.getDay();
  const daysUntil = day === 0 ? 1 : day === 1 ? 7 : 8 - day;
  d.setDate(d.getDate() + daysUntil);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function isDelivered(order: VendorOrder) {
  return order.status === 'Delivered';
}

function isInTransit(order: VendorOrder) {
  return order.status === 'New' || order.status === 'Packed';
}

export function useSellerPaymentFlow(orders: Ref<VendorOrder[]>) {
  const payinMethods = computed((): PayinMethodId[] => ['aba', 'wing', 'cod', 'card']);

  const pendingOrders = computed(() => orders.value.filter((o) => isInTransit(o)));
  const deliveredOrders = computed(() => orders.value.filter((o) => isDelivered(o)));

  const grossPending = computed(() =>
    pendingOrders.value.reduce((sum, o) => sum + o.total, 0),
  );

  const grossAvailable = computed(() =>
    deliveredOrders.value.reduce((sum, o) => sum + o.total, 0),
  );

  const platformFees = computed(() => Math.round(grossAvailable.value * PLATFORM_FEE_RATE * 100) / 100);

  const netAvailable = computed(() =>
    Math.round((grossAvailable.value - platformFees.value) * 100) / 100,
  );

  const nextPayoutDate = computed(() => nextMondayLabel());

  const canPayout = computed(() => netAvailable.value >= 10);

  const lifecycleSteps = computed((): PaymentLifecycleStep[] => {
    const hasOrders = orders.value.length > 0;
    const hasPending = pendingOrders.value.length > 0;
    const hasDelivered = deliveredOrders.value.length > 0;
    return [
      {
        id: 'payin',
        icon: 'shopping_cart_checkout',
        done: hasOrders,
        current: hasOrders && hasPending && !hasDelivered,
      },
      {
        id: 'hold',
        icon: 'hourglass_top',
        done: hasDelivered || (!hasPending && hasOrders),
        current: hasPending,
      },
      {
        id: 'deliver',
        icon: 'local_shipping',
        done: hasDelivered,
        current: hasDelivered && grossAvailable.value > 0,
      },
      {
        id: 'settle',
        icon: 'event_available',
        done: hasDelivered && netAvailable.value >= 10,
        current: hasDelivered && netAvailable.value > 0 && netAvailable.value < 10,
      },
      {
        id: 'payout',
        icon: 'account_balance_wallet',
        done: false,
        current: canPayout.value,
      },
    ];
  });

  const ledgerRows = computed(() =>
    [...orders.value]
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .map((order) => ({
        id: order.id,
        buyer: order.buyer,
        title: order.listingTitle,
        total: order.total,
        status: order.status,
        payinMethod: order.payinMethod,
        phase: isDelivered(order) ? ('available' as const) : ('held' as const),
        fee: isDelivered(order)
          ? Math.round(order.total * PLATFORM_FEE_RATE * 100) / 100
          : 0,
        net: isDelivered(order)
          ? Math.round(order.total * (1 - PLATFORM_FEE_RATE) * 100) / 100
          : 0,
        date: order.date,
      })),
  );

  return {
    payinMethods,
    pendingOrders,
    deliveredOrders,
    grossPending,
    grossAvailable,
    platformFees,
    netAvailable,
    nextPayoutDate,
    canPayout,
    lifecycleSteps,
    ledgerRows,
  };
}
