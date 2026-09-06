<template>
  <div class="z-ahub-page">
    <header class="z-ahub-page__head">
      <div>
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="z-ahub-page__actions">
        <slot name="actions" />
      </div>
    </header>

    <div v-if="$slots.toolbar" class="z-ahub-toolbar">
      <slot name="toolbar" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
