<template>
  <AdminPageShell :title="t('admin.navTransactions')" :subtitle="t('admin.txSub')">
    <template #toolbar>
      <div class="z-ahub-chips">
        <button
          v-for="chip in chips"
          :key="chip.id"
          type="button"
          class="z-ahub-chip"
          :class="{ 'is-active': filter === chip.id }"
          @click="filter = chip.id"
        >
          {{ chip.label }}
          <b v-if="chip.count">{{ chip.count }}</b>
        </button>
      </div>
    </template>

    <div class="z-ahub-mini-stats">
      <article>
        <span>{{ t('admin.txPendingPayout') }}</span>
        <strong>${{ pendingPayout.toLocaleString() }}</strong>
      </article>
      <article>
        <span>{{ t('admin.txEscrow') }}</span>
        <strong>${{ escrow.toLocaleString() }}</strong>
      </article>
      <article>
        <span>{{ t('admin.txFeesToday') }}</span>
        <strong>${{ feesToday.toFixed(2) }}</strong>
      </article>
    </div>

    <section class="z-ahub-block">
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colId') }}</th>
              <th>{{ t('admin.colType') }}</th>
              <th>{{ t('admin.colParty') }}</th>
              <th>{{ t('admin.colAmount') }}</th>
              <th>{{ t('admin.colMethod') }}</th>
              <th>{{ t('admin.colStatus') }}</th>
              <th>{{ t('admin.colDate') }}</th>
              <th>{{ t('admin.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in filtered" :key="tx.id">
              <td class="z-ahub-mono">{{ tx.id }}</td>
              <td>
                <span class="z-ahub-badge" :class="`is-tx-${tx.type}`">
                  {{ t(`admin.txType.${tx.type}`) }}
                </span>
              </td>
              <td>{{ tx.party }}</td>
              <td>
                <strong :class="{ 'is-neg': tx.type === 'refund' || tx.type === 'payout' }">
                  {{ tx.type === 'fee' ? '+' : '−' }}${{ tx.amount.toFixed(2) }}
                </strong>
              </td>
              <td>{{ tx.method }}</td>
              <td>
                <span class="z-ahub-badge" :class="`is-${tx.status}`">
                  {{ t(`admin.txStatus.${tx.status}`) }}
                </span>
              </td>
              <td class="z-ahub-muted">{{ tx.at }}</td>
              <td>
                <button
                  v-if="tx.status === 'pending' && tx.type === 'payout'"
                  class="z-btn z-btn-primary z-btn--sm"
                  type="button"
                  @click="release(tx.party)"
                >
                  {{ t('admin.release') }}
                </button>
                <span v-else class="z-ahub-muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import AdminPageShell from 'components/admin/AdminPageShell.vue';
import { adminOpsTransactions, type TxType } from 'src/data/mock-admin-ops';

const { t } = useI18n();
const filter = ref<'all' | TxType | 'pending'>('all');

const chips = computed(() => [
  { id: 'all' as const, label: t('admin.filterAll'), count: adminOpsTransactions.length },
  {
    id: 'pending' as const,
    label: t('admin.txStatus.pending'),
    count: adminOpsTransactions.filter((x) => x.status === 'pending').length,
  },
  { id: 'payout' as const, label: t('admin.txType.payout'), count: 0 },
  { id: 'fee' as const, label: t('admin.txType.fee'), count: 0 },
  { id: 'escrow' as const, label: t('admin.txType.escrow'), count: 0 },
  { id: 'refund' as const, label: t('admin.txType.refund'), count: 0 },
]);

const filtered = computed(() =>
  adminOpsTransactions.filter((tx) => {
    if (filter.value === 'all') return true;
    if (filter.value === 'pending') return tx.status === 'pending';
    return tx.type === filter.value;
  }),
);

const pendingPayout = computed(() =>
  adminOpsTransactions
    .filter((t) => t.type === 'payout' && t.status === 'pending')
    .reduce((s, t) => s + t.amount, 0),
);

const escrow = computed(() =>
  adminOpsTransactions
    .filter((t) => t.type === 'escrow' && t.status === 'pending')
    .reduce((s, t) => s + t.amount, 0),
);

const feesToday = computed(() =>
  adminOpsTransactions.filter((t) => t.type === 'fee').reduce((s, t) => s + t.amount, 0),
);

function release(party: string) {
  Notify.create({
    type: 'positive',
    message: t('admin.demoRelease', { name: party }),
    position: 'top',
  });
}
</script>
