<template>
  <aside class="z-shop-filters">
    <div class="z-shop-filters__block">
      <h6>{{ t('shop.title') }}</h6>
      <ul class="z-shop-filters__list">
        <li>
          <button type="button" :class="{ 'is-active': category === 'all' }" @click="category = 'all'">
            <span>{{ t('shop.all') }}</span>
            <em>{{ totalCount }}</em>
          </button>
        </li>
        <li v-for="c in visibleCategories" :key="c.id">
          <button type="button" :class="{ 'is-active': category === c.slug }" @click="category = c.slug">
            <span>{{ c.name }}</span>
            <em>{{ countInCategory(c.id) }}</em>
          </button>
        </li>
      </ul>
      <button
        v-if="categories.length > 8"
        class="z-btn z-btn-text z-btn-sm"
        type="button"
        @click="moreOpen = !moreOpen"
      >
        {{ moreOpen ? 'See less' : 'See more' }}
      </button>
      <ul v-if="moreOpen" class="z-shop-filters__list">
        <li v-for="c in hiddenCategories" :key="`more-${c.id}`">
          <button type="button" :class="{ 'is-active': category === c.slug }" @click="category = c.slug">
            <span>{{ c.name }}</span>
            <em>{{ countInCategory(c.id) }}</em>
          </button>
        </li>
      </ul>
    </div>

    <div class="z-shop-filters__block">
      <h6>{{ t('shop.filters') }}</h6>
      <label v-for="band in priceBands" :key="band.id" class="z-shop-filters__check">
        <input type="radio" name="shop-price" :checked="priceBand === band.id" @change="priceBand = band.id" />
        <span>{{ band.label }}</span>
        <em>{{ countInPrice(band.id) }}</em>
      </label>
    </div>

    <div class="z-shop-filters__block">
      <h6>Brands</h6>
      <label v-for="b in brandRows" :key="b.name" class="z-shop-filters__check">
        <input v-model="selectedBrands" type="checkbox" :value="b.name" />
        <span>{{ b.name }}</span>
        <em>{{ b.count }}</em>
      </label>
    </div>

    <div class="z-shop-filters__block">
      <h6>Color</h6>
      <div class="z-chip-row" style="flex-wrap: wrap">
        <button
          v-for="c in colors"
          :key="c"
          class="z-chip"
          :class="{ 'is-active': selectedColor === c }"
          type="button"
          @click="selectedColor = selectedColor === c ? '' : c"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <button class="z-btn z-btn-ghost z-btn-block" type="button" @click="$emit('reset')">
      {{ t('shop.reset') }}
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Category } from 'src/data/mock-catalog';

const category = defineModel<string>('category', { required: true });
const priceBand = defineModel<string>('priceBand', { required: true });
const selectedBrands = defineModel<string[]>('selectedBrands', { required: true });
const selectedColor = defineModel<string>('selectedColor', { required: true });

const props = defineProps<{
  categories: Category[];
  priceBands: { id: string; label: string; min: number; max: number }[];
  brandRows: { name: string; count: number }[];
  totalCount: number;
  countInCategory: (id: number) => number;
  countInPrice: (bandId: string) => number;
}>();

defineEmits<{ reset: [] }>();

const { t } = useI18n();
const moreOpen = ref(false);
const colors = ['Black', 'White', 'Red', 'Blue', 'Green'];
const visibleCategories = computed(() => props.categories.slice(0, 8));
const hiddenCategories = computed(() => props.categories.slice(8));
</script>
