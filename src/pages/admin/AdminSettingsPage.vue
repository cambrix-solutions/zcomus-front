<template>
  <AdminPageShell :title="t('admin.navSettings')" :subtitle="t('admin.settingsSub')">
    <div class="z-ahub-settings">
      <section class="z-ahub-block" v-for="group in groups" :key="group.id">
        <header>
          <h2>{{ group.title }}</h2>
        </header>
        <div class="z-ahub-setting-list">
          <label v-for="item in group.items" :key="item.key" class="z-ahub-setting">
            <div>
              <strong>{{ item.label }}</strong>
              <span>{{ item.hint }}</span>
            </div>
            <input
              v-if="item.kind === 'text'"
              v-model="form[item.key]"
              type="text"
              class="z-ahub-input"
            />
            <input
              v-else-if="item.kind === 'toggle'"
              v-model="form[item.key]"
              type="checkbox"
              class="z-ahub-toggle"
            />
          </label>
        </div>
      </section>
    </div>

    <div class="z-ahub-page__actions z-ahub-page__actions--end">
      <button class="z-btn z-btn-primary" type="button" @click="save">
        {{ t('admin.saveSettings') }}
      </button>
    </div>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import AdminPageShell from 'components/admin/AdminPageShell.vue';

const { t } = useI18n();

const form = reactive<Record<string, string | boolean>>({
  siteName: 'Zcomus',
  supportPhone: '(+855) 23 555 0100',
  freeShip: '75',
  maintenance: false,
  codEnabled: true,
  newVendorApproval: true,
});

const groups = computed(() => [
  {
    id: 'store',
    title: t('admin.settingsStore'),
    items: [
      {
        key: 'siteName',
        kind: 'text' as const,
        label: t('admin.setSiteName'),
        hint: t('admin.setSiteNameHint'),
      },
      {
        key: 'supportPhone',
        kind: 'text' as const,
        label: t('admin.setPhone'),
        hint: t('admin.setPhoneHint'),
      },
      {
        key: 'freeShip',
        kind: 'text' as const,
        label: t('admin.setFreeShip'),
        hint: t('admin.setFreeShipHint'),
      },
    ],
  },
  {
    id: 'ops',
    title: t('admin.settingsOps'),
    items: [
      {
        key: 'codEnabled',
        kind: 'toggle' as const,
        label: t('admin.setCod'),
        hint: t('admin.setCodHint'),
      },
      {
        key: 'newVendorApproval',
        kind: 'toggle' as const,
        label: t('admin.setVendorApproval'),
        hint: t('admin.setVendorApprovalHint'),
      },
      {
        key: 'maintenance',
        kind: 'toggle' as const,
        label: t('admin.setMaintenance'),
        hint: t('admin.setMaintenanceHint'),
      },
    ],
  },
]);

function save() {
  Notify.create({ type: 'positive', message: t('admin.demoSettingsSaved'), position: 'top' });
}
</script>
