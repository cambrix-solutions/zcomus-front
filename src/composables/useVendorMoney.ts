import { computed, onMounted, ref, type Ref } from 'vue';
import {
  PLATFORM_FEE_RATE,
  MIN_WITHDRAW_USD,
  useSellerPaymentFlow,
} from 'src/composables/useSellerPaymentFlow';
import type { VendorOrder } from 'src/data/vendor-orders';
import { isApiEnabled } from 'src/helper/api/apiConfig';
import {
  fetchVendorBalances,
  getApiErrorMessage,
  requestVendorWithdraw,
  type VendorBalancesDto,
} from 'src/helper/api/vendorMoneyApi';

/**
 * Vendor money balances: mock from orders when API is off;
 * live `GET /api/vendor/balances` when `VITE_USE_API=true`.
 */
export function useVendorMoney(orders: Ref<VendorOrder[]>) {
  const local = useSellerPaymentFlow(orders);
  const remote = ref<VendorBalancesDto | null>(null);
  const loading = ref(false);
  const lastError = ref<string | null>(null);
  const usingApi = computed(() => isApiEnabled() && remote.value !== null);

  const grossPending = computed(() =>
    usingApi.value ? remote.value!.held_gross : local.grossPending.value,
  );
  const netAvailable = computed(() =>
    usingApi.value ? remote.value!.net_available : local.netAvailable.value,
  );
  const platformFees = computed(() =>
    usingApi.value ? remote.value!.fees_accrued : local.platformFees.value,
  );
  const canWithdraw = computed(() =>
    usingApi.value ? remote.value!.can_withdraw : local.canWithdraw.value,
  );
  const shortfallToWithdraw = computed(() => {
    if (usingApi.value) {
      const min = remote.value!.min_withdraw ?? MIN_WITHDRAW_USD;
      return Math.max(0, Math.round((min - remote.value!.net_available) * 100) / 100);
    }
    return local.shortfallToWithdraw.value;
  });
  const feeRateLabel = computed(() => {
    const rate = usingApi.value ? remote.value!.fee_rate : PLATFORM_FEE_RATE;
    return `${Math.round(rate * 100)}%`;
  });

  async function refreshBalances() {
    if (!isApiEnabled()) {
      remote.value = null;
      return;
    }
    loading.value = true;
    lastError.value = null;
    try {
      const data = await fetchVendorBalances();
      if (data && typeof data.net_available === 'number') {
        remote.value = data;
      }
    } catch (e) {
      lastError.value = getApiErrorMessage(e, 'Could not load balances');
      remote.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function submitWithdraw(amount?: number) {
    if (!isApiEnabled()) {
      return { demo: true as const, amount: netAvailable.value };
    }
    const idempotency_key = `fe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const withdrawal = await requestVendorWithdraw(
      typeof amount === 'number' ? { amount, idempotency_key } : { idempotency_key },
    );
    await refreshBalances();
    return { demo: false as const, withdrawal };
  }

  onMounted(() => {
    void refreshBalances();
  });

  return {
    ...local,
    grossPending,
    netAvailable,
    platformFees,
    canWithdraw,
    shortfallToWithdraw,
    feeRateLabel,
    loading,
    lastError,
    usingApi,
    refreshBalances,
    submitWithdraw,
    remote,
  };
}
