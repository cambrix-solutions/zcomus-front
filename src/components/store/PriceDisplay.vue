<template>
  <span class="z-price">
    <strong class="z-price__main">{{ main }}</strong>
    <span v-if="compareAt" class="z-price__was">{{ formatMoney(compareAt, prefs.currency) }}</span>
    <span v-if="showAlt" class="z-price__alt">{{ alt }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatKhr, formatMoney, formatUsd } from 'src/helper/money';
import { usePrefsStore } from 'stores/prefs-store';

const props = withDefaults(
  defineProps<{
    amount: number;
    compareAt?: number | null | undefined;
    alt?: boolean;
  }>(),
  { alt: true },
);

const prefs = usePrefsStore();

const main = computed(() => formatMoney(props.amount, prefs.currency));
const alt = computed(() =>
  prefs.currency === 'KHR' ? formatUsd(props.amount) : formatKhr(props.amount),
);
const showAlt = computed(() => props.alt);
</script>
