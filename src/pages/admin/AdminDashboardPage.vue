<template>
  <div class="z-ahub-dash">
    <section class="z-ahub-hero">
      <div>
        <p class="z-ahub-hero__kicker">{{ greeting }} · {{ roleLabel }}</p>
        <h1>{{ t('admin.dashTitle') }}</h1>
        <p>{{ t('admin.dashSub') }}</p>
        <div class="z-ahub-hero__cta">
          <router-link class="z-btn z-btn-primary" to="/admin/orders">
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
      <aside class="z-ahub-hero__pulse" aria-label="Queue snapshot">
        <div>
          <strong>{{ queue.orders }}</strong>
          <span>{{ t('admin.queueOrders') }}</span>
        </div>
        <div>
          <strong>{{ queue.vendors }}</strong>
          <span>{{ t('admin.queueVendors') }}</span>
        </div>
        <div>
          <strong>{{ queue.products }}</strong>
          <span>{{ t('admin.queueProducts') }}</span>
        </div>
      </aside>
    </section>

    <div v-if="auth.isSuperAdmin" class="z-ahub-super">
      <router-link class="z-ahub-super__card" to="/admin/fees">
        <span>{{ t('admin.superFeeRate') }}</span>
        <strong>{{ extras.feeRateLabel }}</strong>
        <small>{{ t('admin.superFeeRateHint') }}</small>
      </router-link>
      <router-link class="z-ahub-super__card" to="/admin/transactions">
        <span>{{ t('admin.superEscrow') }}</span>
        <strong>{{ extras.escrowHeld }}</strong>
        <small>{{ t('admin.superEscrowHint') }}</small>
      </router-link>
      <router-link class="z-ahub-super__card" to="/admin/transactions">
        <span>{{ t('admin.superSettle') }}</span>
        <strong>{{ extras.pendingSettlements }}</strong>
        <small>{{ t('admin.superSettleHint') }}</small>
      </router-link>
      <router-link class="z-ahub-super__card" to="/admin/users">
        <span>{{ t('admin.superStaff') }}</span>
        <strong>{{ extras.staffCount }}</strong>
        <small>{{ t('admin.superStaffHint') }}</small>
      </router-link>
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
                <th>{{ t('admin.colVendor') }}</th>
                <th>{{ t('admin.colStatus') }}</th>
                <th>{{ t('admin.colTotal') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders.slice(0, 5)" :key="o.id">
                <td><strong>#{{ o.id }}</strong></td>
                <td>{{ o.vendor }}</td>
                <td>
                  <span class="z-ahub-badge" :class="`is-${o.status}`">
                    {{ t(`admin.status.${o.status}`) }}
                  </span>
                </td>
                <td>${{ o.total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <section class="z-ahub-block">
      <header>
        <h2>{{ t('admin.topVendors') }}</h2>
        <router-link to="/admin/sellers">{{ t('admin.viewAll') }}</router-link>
      </header>
      <div class="z-ahub-table-wrap">
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
                <div class="z-ahub-sub">/{{ v.slug }}</div>
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
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  adminAttention,
  adminKpis,
  adminVendors,
  superAdminExtras,
} from 'src/data/mock-admin-metrics';
import { adminNavBadges, adminOpsOrders } from 'src/data/mock-admin-ops';
import { useAuthStore } from 'stores/auth-store';

const { t } = useI18n();
const auth = useAuthStore();

const kpis = adminKpis;
const orders = adminOpsOrders;
const attention = adminAttention;
const vendors = adminVendors;
const extras = superAdminExtras;
const queue = adminNavBadges;

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
