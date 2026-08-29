<template>
  <article class="z-vstore" :class="themeClass" :style="accentStyle">
    <p v-if="vendor.announcement" class="z-vstore__ribbon">{{ vendor.announcement }}</p>

    <div class="z-vstore__banner">
      <img class="z-vstore__cover" :src="vendor.cover" :alt="vendor.name" />
      <div class="z-vstore__banner-glow" />
    </div>

    <div class="z-vstore__body">
      <div class="z-vstore__head">
        <div class="z-vstore__logo-wrap">
          <img v-if="vendor.logo" class="z-vstore__logo" :src="vendor.logo" :alt="vendor.name" />
          <em v-else class="z-vstore__logo-fallback">{{ vendor.name.slice(0, 1) }}</em>
        </div>

        <div class="z-vstore__intro">
          <p class="z-vstore__eyebrow">{{ t('nav.vendors') }}</p>
          <h1>{{ vendor.name }}</h1>
          <p v-if="vendor.tagline" class="z-vstore__tagline">{{ vendor.tagline }}</p>
        </div>

        <div class="z-vstore__actions">
          <a class="z-btn z-btn-primary" :href="`tel:${vendor.phone}`">
            <i class="material-icons">call</i>
            {{ t('vendorStore.call') }}
          </a>
          <button class="z-btn z-btn-ghost" type="button" @click="emit('follow')">
            <i class="material-icons">{{ followed ? 'favorite' : 'favorite_border' }}</i>
            {{ followed ? t('vendorStore.following') : t('vendorStore.follow') }}
          </button>
        </div>
      </div>

      <div class="z-vstore__chips">
        <span v-if="vendor.address">
          <i class="material-icons">place</i>
          {{ vendor.address }}
        </span>
        <span v-if="vendor.phone">
          <i class="material-icons">phone</i>
          {{ vendor.phone }}
        </span>
      </div>

      <p v-if="vendor.description" class="z-vstore__bio">{{ vendor.description }}</p>

      <div class="z-vstore__stats">
        <div>
          <strong>{{ vendor.products }}</strong>
          <span>{{ t('vendorStore.products') }}</span>
        </div>
        <div>
          <strong>{{ vendor.reviews }}</strong>
          <span>{{ t('vendorStore.reviews') }}</span>
        </div>
        <div>
          <strong>{{ vendor.memberSince }}</strong>
          <span>{{ t('vendorStore.since') }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Vendor } from 'src/data/mock-vendors';

const props = defineProps<{
  vendor: Vendor;
  followed?: boolean;
}>();

const emit = defineEmits<{ follow: [] }>();

const { t } = useI18n();

const themeClass = computed(() => (props.vendor.theme ? `z-vstore--${props.vendor.theme}` : ''));
const accentStyle = computed(() =>
  props.vendor.accentColor ? { '--z-vstore-accent': props.vendor.accentColor } : undefined,
);
</script>
