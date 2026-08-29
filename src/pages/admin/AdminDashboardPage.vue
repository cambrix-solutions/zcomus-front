<template>
  <div class="z-ahub-dash">
    <section class="z-ahub-hero">
      <div>
        <p class="z-ahub-hero__kicker">{{ greeting }} · {{ roleLabel }}</p>
        <h1>{{ t('admin.dashTitle') }}</h1>
        <p>{{ t('admin.dashSub') }}</p>
        <div class="z-ahub-hero__cta">
          <router-link class="z-btn z-btn-deal" to="/admin/orders">
            <i class="material-icons">receipt_long</i>
            {{ t('admin.openOrders') }}
          </router-link>
          <router-link class="z-btn z-btn-ghost" to="/admin/sellers">
            {{ t('admin.reviewVendors') }}
          </router-link>
          <router-link
            v-if="auth.isSuperAdmin"
            class="z-btn z-btn-ghost"
            to="/admin/fees"
          >
            {{ t('admin.manageFees') }}
          </router-link>
        </div>
      </div>
    </section>

    <div v-if="auth.isSuperAdmin" class="z-ahub-super">
      <div class="z-ahub-super__card">
        <span>{{ t('admin.superFeeRate') }}</span>
        <strong>{{ extras.feeRateLabel }}</strong>
        <small>{{ t('admin.superFeeRateHint') }}</small>
      </div>
      <div class="z-ahub-super__card">
        <span>{{ t('admin.superEscrow') }}</span>
        <strong>{{ extras.escrowHeld }}</strong>
        <small>{{ t('admin.superEscrowHint') }}</small>
      </div>
      <div class="z-ahub-super__card">
        <span>{{ t('admin.superSettle') }}</span>
        <strong>{{ extras.pendingSettlements }}</strong>
        <small>{{ t('admin.superSettleHint') }}</small>
      </div>
      <div class="z-ahub-super__card">
        <span>{{ t('admin.superStaff') }}</span>
        <strong>{{ extras.staffCount }}</strong>
        <small>{{ t('admin.superStaffHint') }}</small>
      </div>
    </div>

    <div class="z-ahub-stats">
      <router-link
        v-for="kpi in kpis"
        :key="kpi.id"
        :to="kpi.to"
        :class="`is-${kpi.tone}`"
      >
        <i class="material-icons">{{ kpi.icon }}</i>
        <strong>{{ kpi.value }}</strong>
        <span>{{ t(kpi.labelKey) }}</span>
        <small>{{ t(kpi.hintKey) }}</small>
      </router-link>
    </div>

    <div class="z-ahub-split">
      <section class="z-ahub-block">
        <header>
          <h2>{{ t('admin.recentOrders') }}</h2>
          <router-link to="/admin/orders">{{ t('admin.viewAll') }}</router-link>
        </header>
        <div class="z-ahub-table-wrap">
          <table class="z-ahub-table">
            <thead>
              <tr>
                <th>{{ t('admin.colId') }}</th>
                <th>{{ t('admin.colCustomer') }}</th>
                <th>{{ t('admin.colVendor') }}</th>
                <th>{{ t('admin.colStatus') }}</th>
                <th>{{ t('admin.colTotal') }}</th>
                <th>{{ t('admin.colFee') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id">
                <td><strong>#{{ o.id }}</strong></td>
                <td>{{ o.customer }}</td>
                <td>{{ o.vendor }}</td>
                <td>
                  <span class="z-ahub-badge" :class="`is-${o.status}`">
                    {{ t(`admin.status.${o.status}`) }}
                  </span>
                </td>
                <td>${{ o.total.toFixed(2) }}</td>
                <td>${{ o.fee.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="z-ahub-block">
        <header>
          <h2>{{ t('admin.needsAttention') }}</h2>
        </header>
        <ul class="z-ahub-attn">
          <li
            v-for="item in attention"
            :key="item.id"
            :class="`is-${item.severity}`"
          >
            <router-link :to="item.to">
              <strong>{{ t(item.titleKey) }}</strong>
              <span>{{ t(item.bodyKey) }}</span>
            </router-link>
          </li>
        </ul>
      </section>
    </div>

    <section class="z-ahub-block">
      <header>
        <h2>{{ t('admin.topVendors') }}</h2>
        <router-link to="/admin/sellers">{{ t('admin.viewAll') }}</router-link>
      </header>
      <table class="z-ahub-table">
        <thead>
          <tr>
            <th>{{ t('admin.colVendor') }}</th>
            <th>{{ t('admin.colStatus') }}</th>
            <th>{{ t('admin.colGmv') }}</th>
            <th>{{ t('admin.colOrders') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in vendors" :key="v.id">
            <td>
              <strong>{{ v.name }}</strong>
              <div class="z-muted" style="font-size: 0.75rem">/{{ v.slug }}</div>
            </td>
            <td>
              <span class="z-ahub-badge" :class="`is-${v.status}`">
                {{ t(`admin.vendorStatus.${v.status}`) }}
              </span>
            </td>
            <td>${{ v.gmv.toLocaleString() }}</td>
            <td>{{ v.orders }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  adminAttention,
  adminKpis,
  adminOrders,
  adminVendors,
  superAdminExtras,
} from 'src/data/mock-admin-metrics';
import { useAuthStore } from 'stores/auth-store';

const { t } = useI18n();
const auth = useAuthStore();

const kpis = adminKpis;
const orders = adminOrders;
const attention = adminAttention;
const vendors = adminVendors;
const extras = superAdminExtras;

const hour = new Date().getHours();
const greeting = computed(() => {
  if (hour < 12) return t('admin.greetMorning');
  if (hour < 18) return t('admin.greetAfternoon');
  return t('admin.greetEvening');
});

const roleLabel = computed(() =>
  auth.isSuperAdmin ? t('admin.roleSuper') : t('admin.roleAdmin'),
);
</script>
