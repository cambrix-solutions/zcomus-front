<template>
  <AdminPageShell :title="t('admin.navVendors')" :subtitle="t('admin.vendorsSub')">
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
        <input v-model="query" type="search" :placeholder="t('admin.searchVendors')" />
      </label>
    </template>

    <section class="z-ahub-block">
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colVendor') }}</th>
              <th>{{ t('admin.colOwner') }}</th>
              <th>{{ t('admin.colCity') }}</th>
              <th>{{ t('admin.colListings') }}</th>
              <th>{{ t('admin.colGmv') }}</th>
              <th>{{ t('admin.colOrders') }}</th>
              <th>{{ t('admin.colStatus') }}</th>
              <th>{{ t('admin.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in filtered" :key="v.id">
              <td>
                <strong>{{ v.name }}</strong>
                <div class="z-ahub-sub">/{{ v.slug }}</div>
              </td>
              <td>{{ v.owner }}</td>
              <td>{{ v.city }}</td>
              <td>{{ v.listings }}</td>
              <td>${{ v.gmv.toLocaleString() }}</td>
              <td>{{ v.orders }}</td>
              <td>
                <span class="z-ahub-badge" :class="`is-${v.status}`">
                  {{ t(`admin.vendorStatus.${v.status}`) }}
                </span>
              </td>
              <td class="z-ahub-row-actions">
                <button
                  v-if="v.status === 'pending'"
                  class="z-btn z-btn-primary z-btn--sm"
                  type="button"
                  @click="act(v.name, 'approve')"
                >
                  {{ t('admin.approve') }}
                </button>
                <button
                  v-else-if="v.status === 'active'"
                  class="z-btn z-btn-ghost z-btn--sm"
                  type="button"
                  @click="act(v.name, 'suspend')"
                >
                  {{ t('admin.suspend') }}
                </button>
                <button
                  v-else
                  class="z-btn z-btn-ghost z-btn--sm"
                  type="button"
                  @click="act(v.name, 'restore')"
                >
                  {{ t('admin.restore') }}
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
import { adminOpsVendors, type VendorStatus } from 'src/data/mock-admin-ops';

const { t } = useI18n();
const filter = ref<'all' | VendorStatus>('all');
const query = ref('');

const chips = computed(() =>
  (['all', 'pending', 'active', 'suspended'] as const).map((id) => ({
    id,
    label: id === 'all' ? t('admin.filterAll') : t(`admin.vendorStatus.${id}`),
    count:
      id === 'all'
        ? adminOpsVendors.length
        : adminOpsVendors.filter((v) => v.status === id).length,
  })),
);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return adminOpsVendors.filter((v) => {
    if (filter.value !== 'all' && v.status !== filter.value) return false;
    if (!q) return true;
    return (
      v.name.toLowerCase().includes(q) ||
      v.owner.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.slug.toLowerCase().includes(q)
    );
  });
});

function act(name: string, kind: 'approve' | 'suspend' | 'restore') {
  Notify.create({
    type: 'positive',
    message: t(`admin.demoVendor.${kind}`, { name }),
    position: 'top',
  });
}
</script>
