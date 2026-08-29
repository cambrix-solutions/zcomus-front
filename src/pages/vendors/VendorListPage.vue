<template>
  <main class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('nav.vendors') }]" />

    <div class="z-vendors-hero">
      <div>
        <p class="z-page-hero__kicker">Cambodia marketplace</p>
        <h1>{{ t('nav.vendors') }}</h1>
        <p class="z-muted">
          Discover <strong>{{ vendors.length }}</strong> trusted local shops — electronics, fashion, and more.
        </p>
      </div>
      <router-link class="z-btn z-btn-deal" to="/vendor">
        <i class="material-icons">storefront</i>
        {{ t('footer.openShop') }}
      </router-link>
    </div>

    <div class="z-shop-layout">
      <aside class="z-shop-layout__side d-none-xs">
        <div class="z-shop-filters">
          <div class="z-shop-filters__block">
            <h6>Industry</h6>
            <ul class="z-shop-filters__list">
              <li>
                <button type="button" :class="{ 'is-active': industry === 'all' }" @click="industry = 'all'">
                  <span>All</span>
                  <em>{{ vendors.length }}</em>
                </button>
              </li>
              <li v-for="ind in industries" :key="ind.id">
                <button type="button" :class="{ 'is-active': industry === ind.id }" @click="industry = ind.id">
                  <span>{{ ind.name }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <div class="z-shop-layout__main">
        <div class="z-vendor-toolbar">
          <label class="z-vendor-toolbar__search">
            <i class="material-icons">search</i>
            <input v-model="search" type="search" placeholder="Search vendors…" />
          </label>
          <label class="z-shop-toolbar__control">
            <span>Sort</span>
            <select v-model="sort">
              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </label>
          <span class="z-vendor-toolbar__meta">{{ filtered.length }} shops</span>
        </div>

        <div class="z-vendor-industries d-only-xs">
          <button type="button" :class="{ 'is-active': industry === 'all' }" @click="industry = 'all'">All</button>
          <button
            v-for="ind in industries"
            :key="ind.id"
            type="button"
            :class="{ 'is-active': industry === ind.id }"
            @click="industry = ind.id"
          >
            {{ ind.name }}
          </button>
        </div>

        <div v-if="booting" class="z-vendor-grid">
          <div v-for="n in 6" :key="n" class="z-skel-vendor z-fade-item" :style="{ '--i': n }">
            <div class="z-skel z-skel-vendor__cover" />
            <div class="z-skel z-skel-vendor__logo" />
            <div class="z-skel-vendor__body">
              <div class="z-skel z-skel--md" style="width: 60%; margin: 0 auto" />
              <div class="z-skel z-skel--sm" style="width: 80%; margin: 8px auto 0" />
              <div class="z-skel z-skel--pill" style="margin: 12px auto 0" />
            </div>
          </div>
        </div>
        <div v-else-if="!filtered.length" class="z-empty">No vendors match.</div>
        <div v-else class="z-vendor-grid">
          <router-link
            v-for="(v, i) in filtered"
            :key="v.slug"
            class="z-vendor-card z-vendor-card--rich z-fade-item"
            :style="{ '--i': Math.min(i, 8) }"
            :to="`/vendors/${v.slug}`"
          >
            <div class="z-vendor-card__cover">
              <div class="z-vendor-card__cover-media">
                <img class="cover" :src="v.cover" :alt="v.name" />
              </div>
              <img v-if="v.logo" class="logo" :src="v.logo" :alt="`${v.name} logo`" />
              <span class="z-vendor-card__count">{{ v.products }} items</span>
            </div>
            <div class="z-vendor-card__body">
              <h3>{{ v.name }}</h3>
              <p class="z-stars">★★★★★ <span>({{ v.reviews }})</span></p>
              <p class="z-vendor-card__meta">
                <i class="material-icons">place</i>
                <span>{{ shortAddress(v.address) }}</span>
              </p>
              <p class="z-vendor-card__meta">
                <i class="material-icons">call</i>
                <span>{{ v.phone }}</span>
              </p>
              <span class="z-btn z-btn-deal z-btn-sm z-btn-block">
                {{ t('home.visitShop') }}
                <i class="material-icons">arrow_forward</i>
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <TrustStrip />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import TrustStrip from 'components/home/TrustStrip.vue';
import { mockVendors, vendorIndustries } from 'src/data/mock-vendors';
import { liveShopToVendor } from 'src/data/vendor-store';
import { useSellerShop } from 'src/composables/useSellerShop';
import { useBootLoad } from 'src/composables/useBootLoad';

const { t } = useI18n();
const { shop, listingCount } = useSellerShop();
const vendors = computed(() => {
  if (!shop.active || !shop.name.trim()) return mockVendors;
  const live = liveShopToVendor(shop, listingCount.value);
  const rest = mockVendors.filter((v) => v.slug !== live.slug);
  return [live, ...rest];
});
const industries = vendorIndustries.filter((i) => i.id !== 'all');
const search = ref('');
const industry = ref('all');
const sort = ref('latest');
const { booting } = useBootLoad(undefined, 350);
const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'products', label: 'Most products' },
  { value: 'name', label: 'Name A–Z' },
];

function shortAddress(address: string) {
  const parts = address.split(',');
  return parts.slice(-2).join(',').trim() || address;
}

const filtered = computed(() => {
  let list = [...vendors.value];
  if (industry.value !== 'all') list = list.filter((v) => v.industry === industry.value);
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (v) => v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q) || v.phone.includes(q),
    );
  }
  switch (sort.value) {
    case 'oldest':
      list.reverse();
      break;
    case 'products':
      list.sort((a, b) => b.products - a.products);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
  return list;
});
</script>
