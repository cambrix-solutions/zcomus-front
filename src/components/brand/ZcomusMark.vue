<template>
  <svg
    class="z-mark"
    viewBox="0 0 64 64"
    :width="size"
    :height="size"
    role="img"
    :aria-label="label"
    focusable="false"
  >
    <title>{{ label }}</title>

    <!-- Mono: one colour from `currentColor`, Z knocked out via even-odd. -->
    <template v-if="mono">
      <path
        d="M24 26v-6a8 8 0 0 1 16 0v6"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M16.5 26h31l2.4 29.6a2.8 2.8 0 0 1-2.8 3.04H16.9a2.8 2.8 0 0 1-2.8-3.04zM24 33v4.6h8.7L24 45.8V51h16v-5.2h-8.7L40 37.6V33z"
        fill="currentColor"
        fill-rule="evenodd"
      />
    </template>

    <template v-else>
      <path
        d="M24 26v-6a8 8 0 0 1 16 0v6"
        fill="none"
        stroke="#A6704D"
        stroke-width="2.6"
        stroke-linecap="round"
      />
      <path
        d="M16.5 26h31l2.4 29.6a2.8 2.8 0 0 1-2.8 3.04H16.9a2.8 2.8 0 0 1-2.8-3.04z"
        fill="#A6704D"
      />
      <path d="M25 33h14v4.2l-7.6 7.6H39V49H25v-4.2l7.6-7.6H25z" fill="#F9F7F2" />
      <!-- Growth arrow is dropped below 40px: it muddies the Z at favicon scale. -->
      <template v-if="showArrow">
        <path
          d="M19 50.5l6.5-6.5 4.6 3.4 9.4-11.4"
          fill="none"
          stroke="#EFD8C0"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M43.6 32.2l-.8 8.3-7.4-5.9z" fill="#EFD8C0" />
      </template>
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Rendered square size in px. */
    size?: number;
    /** Single-colour rendering that inherits `currentColor` — for dark headers. */
    mono?: boolean;
    label?: string;
  }>(),
  { size: 32, mono: false, label: 'Zcomus' },
);

const showArrow = computed(() => props.size >= 40);
</script>

<style scoped>
.z-mark {
  display: block;
  flex: 0 0 auto;
}
</style>
