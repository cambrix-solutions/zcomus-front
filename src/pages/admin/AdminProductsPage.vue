<template>
  <AdminPageShell :title="t('admin.navProducts')" :subtitle="t('admin.productsSub')">
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
      <label class="z-ahub-search">
        <i class="material-icons">search</i>
        <input v-model="query" type="search" :placeholder="t('admin.searchProducts')" />
      </label>
    </template>

    <section class="z-ahub-block">
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colProduct') }}</th>
              <th>{{ t('admin.colVendor') }}</th>
              <th>{{ t('admin.colCategory') }}</th>
              <th>{{ t('admin.colPrice') }}</th>
              <th>{{ t('admin.colStock') }}</th>
              <th>{{ t('admin.colStatus') }}</th>
              <th>{{ t('admin.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id">
              <td><strong>{{ p.name }}</strong></td>
              <td>{{ p.vendor }}</td>
              <td>{{ p.category }}</td>
              <td>${{ p.price.toFixed(2) }}</td>
              <td :class="{ 'is-warn-text': p.stock === 0 }">{{ p.stock }}</td>
              <td>
                <span class="z-ahub-badge" :class="`is-${p.status}`">
                  {{ t(`admin.productStatus.${p.status}`) }}
                </span>
              </td>
              <td class="z-ahub-row-actions">
                <button
                  v-if="p.status === 'flagged'"
                  class="z-btn z-btn-primary z-btn--sm"
                  type="button"
                  @click="mod(p.name, 'hide')"
                >
                  {{ t('admin.hide') }}
                </button>
                <button
                  v-else-if="p.status === 'hidden'"
                  class="z-btn z-btn-ghost z-btn--sm"
                  type="button"
                  @click="mod(p.name, 'restore')"
                >
                  {{ t('admin.restore') }}
                </button>
                <button
                  v-else
                  class="z-ahub-link-btn"
                  type="button"
                  @click="mod(p.name, 'view')"
                >
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
import { adminOpsProducts, type ProductModeration } from 'src/data/mock-admin-ops';

const { t } = useI18n();
const filter = ref<'all' | ProductModeration>('all');
const query = ref('');

const chips = computed(() =>
  (['all', 'live', 'flagged', 'hidden'] as const).map((id) => ({
    id,
    label: id === 'all' ? t('admin.filterAll') : t(`admin.productStatus.${id}`),
    count:
      id === 'all'
        ? adminOpsProducts.length
        : adminOpsProducts.filter((p) => p.status === id).length,
  })),
);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return adminOpsProducts.filter((p) => {
    if (filter.value !== 'all' && p.status !== filter.value) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });
});

function mod(name: string, kind: 'hide' | 'restore' | 'view') {
  Notify.create({
    type: kind === 'view' ? 'info' : 'positive',
    message: t(`admin.demoProduct.${kind}`, { name }),
    position: 'top',
  });
}
</script>
