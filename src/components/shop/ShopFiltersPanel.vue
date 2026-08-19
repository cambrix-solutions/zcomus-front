<template>
  <div>
    <div class="sidebar-border mb-0">
      <div class="sidebar-head">
        <h6 class="color-gray-900">Product Categories</h6>
      </div>
      <div class="sidebar-content">
        <ul class="list-nav-arrow">
          <li>
            <a
              href="#"
              :class="{ active: category === 'all' }"
              @click.prevent="category = 'all'"
            >
              All products
              <span class="number">{{ totalCount }}</span>
            </a>
          </li>
          <li v-for="c in visibleCategories" :key="c.id">
            <a
              href="#"
              :class="{ active: category === c.slug }"
              @click.prevent="category = c.slug"
            >
              {{ c.name }}
              <span class="number">{{ String(countInCategory(c.id)).padStart(2, '0') }}</span>
            </a>
          </li>
        </ul>
        <div v-if="categories.length > 8">
          <div v-show="moreOpen">
            <ul class="list-nav-arrow">
              <li v-for="c in hiddenCategories" :key="`more-${c.id}`">
                <a
                  href="#"
                  :class="{ active: category === c.slug }"
                  @click.prevent="category = c.slug"
                >
                  {{ c.name }}
                  <span class="number">{{ String(countInCategory(c.id)).padStart(2, '0') }}</span>
                </a>
              </li>
            </ul>
          </div>
          <a class="link-see-more mt-5" href="#" @click.prevent="moreOpen = !moreOpen">
            {{ moreOpen ? 'See Less' : 'See More' }}
          </a>
        </div>
      </div>
    </div>

    <div class="sidebar-border mb-40">
      <div class="sidebar-head">
        <h6 class="color-gray-900">Products Filter</h6>
      </div>
      <div class="sidebar-content">
        <h6 class="color-gray-900 mt-10 mb-10">Price</h6>
        <ul class="list-checkbox">
          <li v-for="band in priceBands.filter((b) => b.id !== 'all')" :key="band.id">
            <label class="cb-container">
              <input
                type="radio"
                name="shop-price"
                :checked="priceBand === band.id"
                @change="priceBand = band.id"
              />
              <span class="text-small">{{ band.label }}</span>
              <span class="checkmark" />
            </label>
            <span class="number-item">{{ countInPrice(band.id) }}</span>
          </li>
          <li>
            <label class="cb-container">
              <input
                type="radio"
                name="shop-price"
                :checked="priceBand === 'all'"
                @change="priceBand = 'all'"
              />
              <span class="text-small">All prices</span>
              <span class="checkmark" />
            </label>
            <span class="number-item">{{ countInPrice('all') }}</span>
          </li>
        </ul>

        <h6 class="color-gray-900 mt-20 mb-10">Brands</h6>
        <ul class="list-checkbox">
          <li v-for="b in brandRows" :key="b.name">
            <label class="cb-container">
              <input v-model="selectedBrands" type="checkbox" :value="b.name" />
              <span class="text-small">{{ b.name }}</span>
              <span class="checkmark" />
            </label>
            <span class="number-item">{{ b.count }}</span>
          </li>
        </ul>

        <h6 class="color-gray-900 mt-20 mb-10">Color</h6>
        <ul class="list-color">
          <li v-for="c in colors" :key="c.id">
            <a
              :class="[c.className, { active: selectedColor === c.id }]"
              href="#"
              @click.prevent="selectedColor = selectedColor === c.id ? '' : c.id"
            />
            <span>{{ c.label }}</span>
          </li>
        </ul>

        <button class="btn btn-border w-100 mt-20" type="button" @click="$emit('reset')">
          Clear filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
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

const moreOpen = ref(false);

const visibleCategories = computed(() => props.categories.slice(0, 8));
const hiddenCategories = computed(() => props.categories.slice(8));

const colors = [
  { id: 'red', label: 'Red', className: 'color-red' },
  { id: 'green', label: 'Green', className: 'color-green' },
  { id: 'blue', label: 'Blue', className: 'color-blue' },
  { id: 'purple', label: 'Purple', className: 'color-purple' },
  { id: 'black', label: 'Black', className: 'color-black' },
  { id: 'gray', label: 'Gray', className: 'color-gray' },
  { id: 'pink', label: 'Pink', className: 'color-pink' },
  { id: 'brown', label: 'Brown', className: 'color-brown' },
  { id: 'yellow', label: 'Yellow', className: 'color-yellow' },
];
</script>

<style scoped>
.list-nav-arrow a.active {
  color: var(--color-brand-2, #fd9636);
  font-weight: 600;
}
</style>
