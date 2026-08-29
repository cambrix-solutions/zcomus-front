<template>
  <div class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: title }]" />
    <PageHero v-if="hero" class="z-fade-item" v-bind="pageHeroProps" />
    <div ref="body" class="z-page-body z-reveal" :class="{ 'is-in': visible }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import PageHero from 'components/store/PageHero.vue';
import { useReveal } from 'src/composables/useReveal';

const props = withDefaults(
  defineProps<{
    title: string;
    hero?: string;
    subtitle?: string;
    kicker?: string;
    heroVariant?: 'default' | 'deal' | 'shop';
    flushBreadcrumb?: boolean;
  }>(),
  { flushBreadcrumb: false, heroVariant: 'default' },
);

const body = ref<HTMLElement | null>(null);
const { visible } = useReveal(body);

const pageHeroProps = computed(() => {
  const bind: {
    title: string;
    variant: 'default' | 'deal' | 'shop';
    subtitle?: string;
    kicker?: string;
  } = {
    title: props.hero!,
    variant: props.heroVariant,
  };
  if (props.subtitle) bind.subtitle = props.subtitle;
  if (props.kicker) bind.kicker = props.kicker;
  return bind;
});
</script>
