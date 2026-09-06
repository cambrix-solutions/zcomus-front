<template>
  <AdminPageShell :title="t('admin.navCategories')" :subtitle="t('admin.categoriesSub')">
    <template #actions>
      <button class="z-btn z-btn-primary" type="button" @click="hint">
        <i class="material-icons">add</i>
        {{ t('admin.addCategory') }}
      </button>
    </template>

    <section class="z-ahub-block">
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colSort') }}</th>
              <th>{{ t('admin.colName') }}</th>
              <th>{{ t('admin.colSlug') }}</th>
              <th>{{ t('admin.colProducts') }}</th>
              <th>{{ t('admin.colFeatured') }}</th>
              <th>{{ t('admin.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in adminOpsCategories" :key="c.id">
              <td class="z-ahub-mono">{{ c.sort }}</td>
              <td><strong>{{ c.name }}</strong></td>
              <td class="z-ahub-muted">/{{ c.slug }}</td>
              <td>{{ c.products }}</td>
              <td>
                <span class="z-ahub-badge" :class="c.featured ? 'is-active' : 'is-shipped'">
                  {{ c.featured ? t('admin.yes') : t('admin.no') }}
                </span>
              </td>
              <td>
                <button class="z-ahub-link-btn" type="button" @click="hint">
                  {{ t('admin.edit') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import AdminPageShell from 'components/admin/AdminPageShell.vue';
import { adminOpsCategories } from 'src/data/mock-admin-ops';

const { t } = useI18n();

function hint() {
  Notify.create({ type: 'info', message: t('admin.demoCategory'), position: 'top' });
}
</script>
