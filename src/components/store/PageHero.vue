<template>
  <div class="z-page-hero" :class="variant !== 'default' ? variant : undefined">
    <div>
      <p v-if="kicker" class="z-page-hero__kicker">{{ kicker }}</p>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="z-page-hero__sub">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    kicker?: string;
    variant?: 'default' | 'deal' | 'shop';
  }>(),
  { variant: 'default' },
);
</script>
