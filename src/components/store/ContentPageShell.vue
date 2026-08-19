<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div" :class="{ 'mb-0': flushBreadcrumb }">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><span class="font-xs color-gray-500">Pages</span></li>
            <li><span class="font-xs color-gray-500">{{ title }}</span></li>
          </ul>
        </div>
      </div>
    </div>
    <slot />
  </main>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    flushBreadcrumb?: boolean;
  }>(),
  { flushBreadcrumb: false },
);
</script>
