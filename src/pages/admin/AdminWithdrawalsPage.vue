<template>
  <AdminPageShell :title="t('admin.navWithdrawals')" :subtitle="t('admin.withdrawalsSub')">
    <template #toolbar>
      <div class="z-ahub-chips">
        <button
          v-for="chip in chips"
          :key="chip.id"
          type="button"
          class="z-ahub-chip"
          :class="{ 'is-active': filter === chip.id }"
          @click="setFilter(chip.id)"
        >
          {{ chip.label }}
          <b v-if="chip.count">{{ chip.count }}</b>
        </button>
      </div>
      <button class="z-btn z-btn-ghost z-btn--sm" type="button" :disabled="loading" @click="load">
        {{ t('admin.refresh') }}
      </button>
    </template>

    <div class="z-ahub-mini-stats">
      <article>
        <span>{{ t('admin.wdPending') }}</span>
        <strong>{{ meta.pending_count }}</strong>
      </article>
      <article>
        <span>{{ t('admin.wdProcessing') }}</span>
        <strong>{{ meta.processing_count }}</strong>
      </article>
      <article>
        <span>{{ t('admin.wdQueueUsd') }}</span>
        <strong>${{ queueUsd.toFixed(2) }}</strong>
      </article>
    </div>

    <p v-if="error" class="z-ahub-muted">{{ error }}</p>

    <section class="z-ahub-block">
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colId') }}</th>
              <th>{{ t('admin.colParty') }}</th>
              <th>{{ t('admin.colAmount') }}</th>
              <th>{{ t('admin.colMethod') }}</th>
              <th>{{ t('admin.colStatus') }}</th>
              <th>{{ t('admin.colDate') }}</th>
              <th>{{ t('admin.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!rows.length">
              <td colspan="7" class="z-ahub-muted">{{ t('admin.wdEmpty') }}</td>
            </tr>
            <tr v-for="row in rows" :key="row.id">
              <td class="z-ahub-mono">#{{ row.id }}</td>
              <td>
                <strong>{{ row.vendor_name || row.account_name }}</strong>
                <div class="z-ahub-muted">{{ row.vendor_email || row.account_ref }}</div>
              </td>
              <td>
                <strong class="is-neg">−${{ row.amount.toFixed(2) }}</strong>
              </td>
              <td>{{ row.method.toUpperCase() }}</td>
              <td>
                <span class="z-ahub-badge" :class="`is-${row.status}`">
                  {{ t(`admin.wdStatus.${row.status}`, row.status) }}
                </span>
              </td>
              <td class="z-ahub-muted">{{ formatDate(row.created_at) }}</td>
              <td class="z-ahub-actions">
                <button
                  v-if="row.status === 'pending'"
                  class="z-btn z-btn-ghost z-btn--sm"
                  type="button"
                  :disabled="busyId === row.id"
                  @click="setStatus(row.id, 'processing')"
                >
                  {{ t('admin.wdMarkProcessing') }}
                </button>
                <button
                  v-if="row.status === 'pending' || row.status === 'processing'"
                  class="z-btn z-btn-primary z-btn--sm"
                  type="button"
                  :disabled="busyId === row.id"
                  @click="setStatus(row.id, 'paid')"
                >
                  {{ t('admin.wdMarkPaid') }}
                </button>
                <button
                  v-if="row.status === 'pending' || row.status === 'processing'"
                  class="z-btn z-btn-ghost z-btn--sm"
                  type="button"
                  :disabled="busyId === row.id"
                  @click="setStatus(row.id, 'failed')"
                >
                  {{ t('admin.wdMarkFailed') }}
                </button>
                <span v-if="row.status === 'paid' || row.status === 'failed'" class="z-ahub-muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import AdminPageShell from 'components/admin/AdminPageShell.vue';
import { isApiEnabled } from 'src/helper/api/apiConfig';
import {
  fetchAdminWithdrawals,
  getApiErrorMessage,
  updateAdminWithdrawal,
  type WithdrawalDto,
} from 'src/helper/api/vendorMoneyApi';
import { adminOpsTransactions } from 'src/data/mock-admin-ops';

const { t } = useI18n();
const filter = ref<'all' | 'pending' | 'processing' | 'paid' | 'failed'>('pending');
const rows = ref<WithdrawalDto[]>([]);
const meta = ref({ pending_count: 0, processing_count: 0 });
const loading = ref(false);
const busyId = ref<number | null>(null);
const error = ref<string | null>(null);

const chips = computed(() => [
  { id: 'all' as const, label: t('admin.filterAll'), count: rows.value.length },
  { id: 'pending' as const, label: t('admin.wdStatus.pending'), count: meta.value.pending_count },
  {
    id: 'processing' as const,
    label: t('admin.wdStatus.processing'),
    count: meta.value.processing_count,
  },
  { id: 'paid' as const, label: t('admin.wdStatus.paid'), count: 0 },
  { id: 'failed' as const, label: t('admin.wdStatus.failed'), count: 0 },
]);

const queueUsd = computed(() =>
  rows.value
    .filter((r) => r.status === 'pending' || r.status === 'processing')
    .reduce((s, r) => s + r.amount, 0),
);

function formatDate(value: string | null) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function mockWithdrawals(): WithdrawalDto[] {
  return adminOpsTransactions
    .filter((tx) => tx.type === 'payout')
    .map((tx, index) => ({
      id: index + 1,
      amount: tx.amount,
      method: tx.method.toLowerCase().includes('wing') ? 'wing' : 'aba',
      account_name: tx.party,
      account_ref: '••••',
      bank_name: null,
      status: tx.status === 'completed' ? 'paid' : tx.status === 'failed' ? 'failed' : 'pending',
      provider_ref: null,
      failure_reason: null,
      created_at: tx.at,
      processed_at: null,
      paid_at: null,
      vendor_name: tx.party,
      vendor_email: '',
    }));
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    if (!isApiEnabled()) {
      const all = mockWithdrawals();
      rows.value =
        filter.value === 'all' ? all : all.filter((r) => r.status === filter.value);
      meta.value = {
        pending_count: all.filter((r) => r.status === 'pending').length,
        processing_count: all.filter((r) => r.status === 'processing').length,
      };
      return;
    }
    const res = await fetchAdminWithdrawals(filter.value === 'all' ? undefined : filter.value);
    rows.value = res.data;
    meta.value = res.meta;
  } catch (e) {
    error.value = getApiErrorMessage(e, t('admin.wdLoadFailed'));
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

function setFilter(id: typeof filter.value) {
  filter.value = id;
  void load();
}

async function setStatus(id: number, status: 'processing' | 'paid' | 'failed') {
  if (!isApiEnabled()) {
    Notify.create({
      type: 'info',
      message: t('admin.wdDemoOnly'),
      position: 'top',
    });
    return;
  }
  busyId.value = id;
  try {
    const body: {
      status: 'processing' | 'paid' | 'failed';
      provider_ref?: string;
      failure_reason?: string;
    } = { status };
    if (status === 'failed') body.failure_reason = 'Marked failed by admin';
    if (status === 'paid') body.provider_ref = `manual-${Date.now()}`;
    await updateAdminWithdrawal(id, body);
    Notify.create({
      type: 'positive',
      message: t('admin.wdUpdated'),
      position: 'top',
    });
    await load();
  } catch (e) {
    Notify.create({
      type: 'negative',
      message: getApiErrorMessage(e, t('admin.wdUpdateFailed')),
      position: 'top',
    });
  } finally {
    busyId.value = null;
  }
}

onMounted(() => {
  void load();
});
</script>
