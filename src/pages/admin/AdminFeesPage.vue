<template>
  <AdminPageShell :title="t('admin.navFees')" :subtitle="t('admin.feesSub')">
    <div class="z-ahub-fee-hero">
      <div>
        <span>{{ t('admin.defaultFee') }}</span>
        <strong>{{ (feeRate * 100).toFixed(0) }}%</strong>
        <p>{{ t('admin.defaultFeeHint') }}</p>
      </div>
      <label class="z-ahub-slider">
        <input v-model.number="feeRate" type="range" min="0.04" max="0.15" step="0.01" />
        <small>{{ t('admin.feeSliderHint') }}</small>
      </label>
      <button class="z-btn z-btn-primary" type="button" @click="saveFee">
        {{ t('admin.saveFee') }}
      </button>
    </div>

    <section class="z-ahub-block">
      <header>
        <h2>{{ t('admin.feeTiers') }}</h2>
      </header>
      <div class="z-ahub-table-wrap">
        <table class="z-ahub-table">
          <thead>
            <tr>
              <th>{{ t('admin.colName') }}</th>
              <th>{{ t('admin.colRate') }}</th>
              <th>{{ t('admin.colMinOrders') }}</th>
              <th>{{ t('admin.colVendors') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tier in adminFeeTiers" :key="tier.id">
              <td><strong>{{ tier.name }}</strong></td>
              <td>{{ (tier.rate * 100).toFixed(0) }}%</td>
              <td>{{ tier.minOrders }}+</td>
              <td>{{ tier.vendors }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AdminPageShell>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import AdminPageShell from 'components/admin/AdminPageShell.vue';
import { adminFeeTiers } from 'src/data/mock-admin-ops';
import { PLATFORM_FEE_RATE } from 'src/data/mock-admin-metrics';

const { t } = useI18n();
const feeRate = ref(PLATFORM_FEE_RATE);

function saveFee() {
  Notify.create({
    type: 'positive',
    message: t('admin.demoFeeSaved', { rate: `${(feeRate.value * 100).toFixed(0)}%` }),
    position: 'top',
  });
}
</script>
