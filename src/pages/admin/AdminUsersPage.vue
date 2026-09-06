<template>
  <AdminPageShell :title="t('admin.navUsers')" :subtitle="t('admin.usersSub')">
    <template #actions>
      <button class="z-btn z-btn-primary" type="button" @click="invite">
        <i class="material-icons">person_add</i>
        {{ t('admin.inviteStaff') }}
      </button>
    </template>

    <section class="z-ahub-block">
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colName') }}</th>
              <th>{{ t('admin.colEmail') }}</th>
              <th>{{ t('admin.colRole') }}</th>
              <th>{{ t('admin.colStatus') }}</th>
              <th>{{ t('admin.colLastActive') }}</th>
              <th>{{ t('admin.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in adminOpsUsers" :key="u.id">
              <td>
                <div class="z-ahub-person">
                  <em>{{ u.name[0] }}</em>
                  <strong>{{ u.name }}</strong>
                </div>
              </td>
              <td class="z-ahub-muted">{{ u.email }}</td>
              <td>
                <span class="z-ahub-badge" :class="`is-role-${u.role}`">
                  {{ t(`admin.staffRole.${u.role}`) }}
                </span>
              </td>
              <td>
                <span class="z-ahub-badge" :class="`is-${u.status}`">
                  {{ t(`admin.userStatus.${u.status}`) }}
                </span>
              </td>
              <td class="z-ahub-muted">{{ u.lastActive }}</td>
              <td>
                <button class="z-ahub-link-btn" type="button" @click="invite">
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
import { adminOpsUsers } from 'src/data/mock-admin-ops';

const { t } = useI18n();

function invite() {
  Notify.create({ type: 'info', message: t('admin.demoInvite'), position: 'top' });
}
</script>
