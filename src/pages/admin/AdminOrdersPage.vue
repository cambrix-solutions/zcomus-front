<template>
  <AdminPageShell :title="t('admin.navOrders')" :subtitle="t('admin.ordersSub')">
    <template #actions>
      <button class="z-btn z-btn-ghost" type="button" @click="exportHint">
        <i class="material-icons">download</i>
        {{ t('admin.export') }}
      </button>
    </template>

    <template #toolbar>
      <div class="z-ahub-chips" role="tablist">
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
      <label class="z-ahub-search">
        <i class="material-icons">search</i>
        <input v-model="query" type="search" :placeholder="t('admin.searchOrders')" />
      </label>
    </template>

    <section class="z-ahub-block">
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colId') }}</th>
              <th>{{ t('admin.colCustomer') }}</th>
              <th>{{ t('admin.colVendor') }}</th>
              <th>{{ t('admin.colItems') }}</th>
              <th>{{ t('admin.colPay') }}</th>
              <th>{{ t('admin.colStatus') }}</th>
              <th>{{ t('admin.colTotal') }}</th>
              <th>{{ t('admin.colFee') }}</th>
              <th>{{ t('admin.colDate') }}</th>
              <th>{{ t('admin.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in filtered" :key="o.id">
              <td><strong>#{{ o.id }}</strong></td>
              <td>{{ o.customer }}</td>
              <td>{{ o.vendor }}</td>
              <td>{{ o.items }}</td>
              <td class="z-ahub-mono">{{ o.payin.toUpperCase() }}</td>
              <td>
                <span class="z-ahub-badge" :class="`is-${o.status}`">
                  {{ t(`admin.status.${o.status}`) }}
                </span>
              </td>
              <td>${{ o.total.toFixed(2) }}</td>
              <td>${{ o.fee.toFixed(2) }}</td>
              <td class="z-ahub-muted">{{ o.placedAt }}</td>
              <td>
                <button class="z-ahub-link-btn" type="button" @click="toast(o.id)">
                  {{ t('admin.view') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!filtered.length" class="z-ahub-empty">{{ t('admin.noResults') }}</p>
    </section>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import AdminPageShell from 'components/admin/AdminPageShell.vue';
import { adminOpsOrders, type OrderStatus } from 'src/data/mock-admin-ops';

const { t } = useI18n();
const filter = ref<'all' | OrderStatus>('all');
const query = ref('');

const chips = computed(() => {
  const statuses: Array<'all' | OrderStatus> = [
    'all',
    'paid',
    'disputed',
    'packed',
    'shipped',
    'delivered',
    'cancelled',
  ];
  return statuses.map((id) => ({
    id,
    label: id === 'all' ? t('admin.filterAll') : t(`admin.status.${id}`),
    count:
      id === 'all'
        ? adminOpsOrders.length
        : adminOpsOrders.filter((o) => o.status === id).length,
  }));
});

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return adminOpsOrders.filter((o) => {
    if (filter.value !== 'all' && o.status !== filter.value) return false;
    if (!q) return true;
    return (
      o.id.includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.vendor.toLowerCase().includes(q)
    );
  });
});

function toast(id: string) {
  Notify.create({
    type: 'info',
    message: t('admin.demoDetail', { id: `#${id}` }),
    position: 'top',
  });
}

function exportHint() {
  Notify.create({ type: 'info', message: t('admin.demoExport'), position: 'top' });
}
</script>
