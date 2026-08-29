import type { VendorOrderTone } from 'src/data/vendor-orders';

export type OrderProgressStepId = 'paid' | 'packed' | 'shipped' | 'delivered';

const STEP_META: Record<OrderProgressStepId, { icon: string }> = {
  paid: { icon: 'payments' },
  packed: { icon: 'inventory_2' },
  shipped: { icon: 'local_shipping' },
  delivered: { icon: 'check_circle' },
};

const STEP_ORDER: OrderProgressStepId[] = ['paid', 'packed', 'shipped', 'delivered'];

export function orderProgressState(status: string, tone: VendorOrderTone) {
  if (status === 'Delivered' || tone === 'ok') {
    return { completed: 4, current: -1 };
  }
  if (status === 'Shipped') {
    return { completed: 3, current: 3 };
  }
  if (status === 'Packed' || tone === 'info') {
    return { completed: 2, current: 2 };
  }
  return { completed: 1, current: 1 };
}

export function buildOrderProgress(status: string, tone: VendorOrderTone) {
  const { completed, current } = orderProgressState(status, tone);
  return STEP_ORDER.map((id, index) => ({
    id,
    icon: STEP_META[id].icon,
    done: index < completed,
    current: current >= 0 && index === current,
  }));
}

export type OrderVendorAction = 'pack' | 'ship' | null;

export function orderVendorAction(status: string, tone: VendorOrderTone): OrderVendorAction {
  if (status === 'Delivered' || tone === 'ok' || status === 'Shipped') return null;
  if (status === 'Packed' || tone === 'info') return 'ship';
  return 'pack';
}
