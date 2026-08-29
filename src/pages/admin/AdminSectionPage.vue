<template>
  <div>
    <div class="z-ahub-section-head">
      <h1>{{ title }}</h1>
      <p>{{ t('admin.sectionHint') }}</p>
    </div>

    <section class="z-ahub-block">
      <header>
        <h2>{{ t('admin.sectionList', { title }) }}</h2>
      </header>
      <table class="z-ahub-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ t('admin.colName') }}</th>
            <th>{{ t('admin.colStatus') }}</th>
            <th>{{ t('admin.colDate') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td><strong>{{ row.name }}</strong></td>
            <td><span class="z-ahub-badge is-active">{{ t('admin.vendorStatus.active') }}</span></td>
            <td>{{ row.date }}</td>
          </tr>
        </tbody>
      </table>
      <p class="z-ahub-empty">{{ t('admin.sectionApiLater') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ titleKey: string }>();
const { t } = useI18n();

const title = computed(() => t(props.titleKey));

const rows = computed(() =>
  Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    name: `${title.value} ${i + 1}`,
    date: '25.08.2026',
  })),
);
</script>
