<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><span class="font-xs color-gray-500">Vendor listing</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template mt-0 mb-50">
      <div class="container">
        <h2>Vendors Listing</h2>
        <div class="row align-items-center">
          <div class="col-lg-6 mb-30">
            <p class="font-md color-gray-500">
              We have
              <span class="font-md-bold color-brand-3"> {{ vendors.length }}</span>
              <span> vendors now</span>
            </p>
          </div>
          <div class="col-lg-6 mb-30 text-end">
            <router-link class="font-sm color-gray-900 mr-30" to="/contact">
              Support Ticket
            </router-link>
            <router-link class="font-sm color-gray-900 mr-30" to="/about">
              Become an Affilate
            </router-link>
            <router-link class="btn btn-buy w-auto font-sm-bold" to="/register">
              Open a Shop
            </router-link>
          </div>
        </div>
        <div class="border-bottom pt-0 mb-30" />

        <div class="row">
          <div class="col-lg-9 order-first order-lg-last">
            <div class="box-filters mt-0 pb-5 border-bottom">
              <div class="row align-items-center">
                <div class="col-lg-5 mb-10">
                  <input
                    v-model="search"
                    class="form-control"
                    type="search"
                    placeholder="Search vendors…"
                  />
                </div>
                <div class="col-lg-7 mb-10 text-lg-end text-center">
                  <span class="font-sm color-gray-900 font-medium border-1-right span">
                    Showing {{ filtered.length }} of {{ vendors.length }} results
                  </span>
                  <div class="d-inline-block">
                    <span class="font-sm color-gray-500 font-medium">Sort by:</span>
                    <div class="dropdown dropdown-sort border-1-right" :class="{ show: sortOpen }">
                      <button
                        class="btn dropdown-toggle font-sm color-gray-900 font-medium"
                        type="button"
                        @click="sortOpen = !sortOpen"
                      >
                        {{ sortLabel }}
                      </button>
                      <ul
                        class="dropdown-menu dropdown-menu-light"
                        :class="{ show: sortOpen }"
                        style="margin: 0"
                      >
                        <li v-for="opt in sortOptions" :key="opt.value">
                          <a
                            class="dropdown-item"
                            :class="{ active: sort === opt.value }"
                            href="#"
                            @click.prevent="setSort(opt.value)"
                          >
                            {{ opt.label }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!filtered.length" class="py-50 text-center color-gray-500">
              No vendors match your search.
            </div>

            <div v-else class="row mt-20">
              <div
                v-for="v in filtered"
                :key="v.slug"
                class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
              >
                <div class="card-vendor">
                  <div class="card-top-vendor">
                    <div class="card-top-vendor-left">
                      <router-link :to="`/vendors/${v.slug}`">
                        <img :src="v.logo" :alt="v.name" />
                      </router-link>
                      <div class="rating">
                        <img v-for="n in 5" :key="n" :src="star" alt="" />
                        <span class="font-xs color-gray-500"> ({{ v.reviews }})</span>
                      </div>
                    </div>
                    <div class="card-top-vendor-right">
                      <router-link class="btn btn-gray" :to="`/vendors/${v.slug}`">
                        {{ v.products }} Products
                      </router-link>
                      <p class="font-xs color-gray-500 mt-10">
                        Member since {{ v.memberSince }}
                      </p>
                    </div>
                  </div>
                  <div class="card-bottom-vendor">
                    <p class="font-sm color-gray-500 location mb-10">{{ v.address }}</p>
                    <p class="font-sm color-gray-500 phone">{{ v.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="col-lg-3 order-last order-lg-first mt-30 mt-lg-0">
            <div class="sidebar-border">
              <div class="sidebar-head">
                <h6 class="color-gray-900">Vendor by industry</h6>
              </div>
              <div class="sidebar-content">
                <ul class="list-nav-arrow">
                  <li>
                    <a
                      href="#"
                      :class="{ active: industry === 'all' }"
                      @click.prevent="industry = 'all'"
                    >
                      All industries
                      <span class="number">{{ vendors.length }}</span>
                    </a>
                  </li>
                  <li v-for="ind in industries" :key="ind.id">
                    <a
                      href="#"
                      :class="{ active: industry === ind.id }"
                      @click.prevent="industry = ind.id"
                    >
                      {{ ind.name }}
                      <span class="number">{{ countByIndustry(ind.id) }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="box-slider-item mt-30 mb-30">
              <div class="head pb-15 border-brand-2">
                <h5 class="color-gray-900">Popular tags</h5>
              </div>
              <div class="content-slider">
                <a
                  v-for="tag in tags"
                  :key="tag"
                  class="btn btn-border mr-5 mb-10"
                  href="#"
                  @click.prevent="search = tag"
                >
                  {{ tag }}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { mockVendors, vendorIndustries } from 'src/data/mock-vendors';
import { ecom } from 'src/helper/ecomAssets';

const star = ecom('imgs/template/icons/star.svg');
const vendors = mockVendors;
const industries = vendorIndustries.filter((i) => i.id !== 'all');
const tags = ['Games', 'Electronics', 'Video', 'Cellphone', 'Laptop', 'Camera', 'USB'];

const search = ref('');
const industry = ref('all');
const sort = ref('latest');
const sortOpen = ref(false);

const sortOptions = [
  { value: 'latest', label: 'Latest added' },
  { value: 'oldest', label: 'Oldest added' },
  { value: 'products', label: 'Most products' },
  { value: 'name', label: 'Name A–Z' },
];

const sortLabel = computed(
  () => sortOptions.find((o) => o.value === sort.value)?.label ?? 'Latest added',
);

function countByIndustry(id: string) {
  return vendors.filter((v) => v.industry === id).length;
}

const filtered = computed(() => {
  let list = [...vendors];
  if (industry.value !== 'all') {
    list = list.filter((v) => v.industry === industry.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.industry.toLowerCase().includes(q),
    );
  }
  switch (sort.value) {
    case 'oldest':
      list.sort((a, b) => a.memberSince - b.memberSince);
      break;
    case 'products':
      list.sort((a, b) => b.products - a.products);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      list.sort((a, b) => b.memberSince - a.memberSince || b.products - a.products);
  }
  return list;
});

function setSort(value: string) {
  sort.value = value;
  sortOpen.value = false;
}

function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (!t?.closest('.dropdown-sort')) sortOpen.value = false;
}

onMounted(() => document.addEventListener('click', onDocClick));
onUnmounted(() => document.removeEventListener('click', onDocClick));
</script>

<style scoped>
.list-nav-arrow a.active {
  color: var(--color-brand-2, #fd9636);
  font-weight: 600;
}
.dropdown-sort .dropdown-menu.show {
  display: block;
}
.card-vendor {
  margin-bottom: 20px;
}
</style>
