import {
  apiRequest,
  getApiErrorMessage,
  unwrapData,
  type ApiEnvelope,
  type ApiRequestOptions,
} from 'src/helper/api/apiClient';
import { endpoints, isApiEnabled } from 'src/helper/api/apiConfig';

export type VendorBalancesDto = {
  held_gross: number;
  available_gross: number;
  fees_accrued: number;
  net_available: number;
  paid_out?: number;
  min_withdraw: number;
  can_withdraw: boolean;
  fee_rate: number;
  payout_configured: boolean;
};

export type VendorLedgerRowDto = {
  id: number;
  order_id: string | null;
  payin_method: string | null;
  phase: string | null;
  gross: number;
  platform_fee: number;
  net: number;
  delivered_at: string | null;
  created_at: string | null;
};

export type WithdrawalDto = {
  id: number;
  amount: number;
  method: string;
  account_name: string;
  account_ref: string;
  bank_name: string | null;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  provider_ref: string | null;
  failure_reason: string | null;
  created_at: string | null;
  processed_at: string | null;
  paid_at: string | null;
  vendor_id?: number;
  vendor_name?: string;
  vendor_email?: string;
};

export type PaymentSetupDto = {
  payin: { aba: boolean; wing: boolean; cod: boolean };
  payout: {
    method: string | null;
    account_name: string | null;
    account_ref: string | null;
    bank_name: string | null;
    khqr_url: string | null;
    configured: boolean;
    configured_at: string | null;
  };
};

export type WithdrawRequest = {
  amount?: number;
  idempotency_key?: string;
};

export type AdminWithdrawalUpdate = {
  status: 'processing' | 'paid' | 'failed';
  provider_ref?: string;
  failure_reason?: string;
};

function isVendorBalances(value: unknown): value is VendorBalancesDto {
  return (
    !!value &&
    typeof value === 'object' &&
    'net_available' in value &&
    typeof (value as VendorBalancesDto).net_available === 'number'
  );
}

function asBalances(res: ApiEnvelope<VendorBalancesDto> | VendorBalancesDto): VendorBalancesDto | null {
  if (isVendorBalances(res)) return res;
  const nested = unwrapData(res);
  return isVendorBalances(nested) ? nested : null;
}

export async function fetchVendorBalances(): Promise<VendorBalancesDto | null> {
  if (!isApiEnabled()) return null;
  const res = await apiRequest<VendorBalancesDto>(endpoints.vendorBalances);
  return asBalances(res);
}

export async function fetchVendorLedger(): Promise<VendorLedgerRowDto[]> {
  if (!isApiEnabled()) return [];
  const res = await apiRequest<VendorLedgerRowDto[]>(endpoints.vendorLedger);
  if (Array.isArray(res)) return res;
  const nested = unwrapData(res);
  return Array.isArray(nested) ? nested : [];
}

export async function requestVendorWithdraw(payload: WithdrawRequest = {}): Promise<WithdrawalDto> {
  const res = await apiRequest<WithdrawalDto>(endpoints.vendorWithdraw, {
    method: 'POST',
    body: payload,
  });
  const data = unwrapData(res);
  if (data && typeof data.amount === 'number') return data;
  if (res && typeof res === 'object' && 'amount' in res && typeof res.amount === 'number') {
    return res as unknown as WithdrawalDto;
  }
  throw new Error('Withdraw response missing data');
}

export async function fetchVendorPaymentSetup(): Promise<PaymentSetupDto | null> {
  if (!isApiEnabled()) return null;
  const res = await apiRequest<PaymentSetupDto>(endpoints.vendorPaymentSetup);
  return unwrapData(res);
}

export async function saveVendorPayin(payin: {
  aba: boolean;
  wing: boolean;
  cod: boolean;
}): Promise<PaymentSetupDto> {
  const res = await apiRequest<PaymentSetupDto>(endpoints.vendorPaymentPayin, {
    method: 'PUT',
    body: payin,
  });
  const data = unwrapData(res);
  if (!data) throw new Error('Pay-in save failed');
  return data;
}

export async function saveVendorPayout(payout: {
  method: string;
  account_name: string;
  account_ref: string;
  bank_name?: string | null;
}): Promise<PaymentSetupDto> {
  const res = await apiRequest<PaymentSetupDto>(endpoints.vendorPaymentPayout, {
    method: 'PUT',
    body: payout,
  });
  const data = unwrapData(res);
  if (!data) throw new Error('Payout save failed');
  return data;
}

type AdminWithdrawalsPayload = {
  data: WithdrawalDto[];
  meta: { pending_count: number; processing_count: number };
};

export async function fetchAdminWithdrawals(status?: string): Promise<AdminWithdrawalsPayload> {
  const options: ApiRequestOptions = {};
  if (status && status !== 'all') {
    options.params = { status };
  }

  const res = await apiRequest<AdminWithdrawalsPayload>(endpoints.adminWithdrawals, options);
  const payload = res as unknown as AdminWithdrawalsPayload;
  return {
    data: Array.isArray(payload.data) ? payload.data : [],
    meta: payload.meta ?? { pending_count: 0, processing_count: 0 },
  };
}

export async function updateAdminWithdrawal(
  id: number | string,
  body: AdminWithdrawalUpdate,
): Promise<WithdrawalDto> {
  const res = await apiRequest<WithdrawalDto>(endpoints.adminWithdrawal(id), {
    method: 'PATCH',
    body,
  });
  const data = unwrapData(res);
  if (!data) throw new Error(getApiErrorMessage(res, 'Update failed'));
  return data;
}

export { getApiErrorMessage };
