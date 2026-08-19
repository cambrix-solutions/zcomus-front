<template>
  <main class="main">
    <div class="section-box">
      <div class="breadcrumbs-div">
        <div class="container">
          <ul class="breadcrumb">
            <li><router-link class="font-xs color-gray-1000" to="/">Home</router-link></li>
            <li><span class="font-xs color-gray-500">Pages</span></li>
            <li><span class="font-xs color-gray-500">My Account</span></li>
          </ul>
        </div>
      </div>
    </div>

    <section class="section-box shop-template mt-30 mb-50">
      <div class="container box-account-template">
        <h3>Hello {{ auth.user?.name || 'Guest' }}</h3>
        <p class="font-md color-gray-500 mb-30">
          From your account dashboard you can check recent orders, manage addresses,
          and edit your account details.
        </p>

        <div class="box-tabs mb-50">
          <ul class="nav nav-tabs nav-tabs-account">
            <li v-for="t in tabs" :key="t.id">
              <a
                href="#"
                :class="{ active: tab === t.id }"
                @click.prevent="tab = t.id"
              >
                {{ t.label }}
              </a>
            </li>
          </ul>
          <div class="border-bottom mt-20 mb-30" />

          <!-- Notifications -->
          <div v-if="tab === 'notifications'">
            <div class="list-notifications">
              <div v-for="n in notifications" :key="n.id" class="item-notification mb-20">
                <div class="info-notification">
                  <h5 class="mb-5">{{ n.title }}</h5>
                  <p class="font-md color-brand-3">{{ n.body }}</p>
                </div>
                <div class="button-notification">
                  <button class="btn btn-buy w-auto" type="button" @click="tab = 'orders'">
                    View details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Wishlist preview -->
          <div v-else-if="tab === 'wishlist'">
            <div v-if="!wishlist.items.length" class="color-gray-500">
              Wishlist is empty.
              <router-link class="color-brand-2" to="/shop">Browse shop</router-link>
            </div>
            <div v-else class="row">
              <div
                v-for="p in wishlist.items.slice(0, 6)"
                :key="p.id"
                class="col-lg-4 col-md-6 mb-20"
              >
                <ProductCard :product="p" @add="onAdd" @open="onOpen" />
              </div>
            </div>
            <router-link class="btn btn-border mt-10" to="/wishlist">Open full wishlist</router-link>
          </div>

          <!-- Orders -->
          <div v-else-if="tab === 'orders'">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="o in orders" :key="o.id">
                    <td class="font-md-bold">#{{ o.id }}</td>
                    <td>{{ o.date }}</td>
                    <td>
                      <span class="btn btn-gray font-sm">{{ o.status }}</span>
                    </td>
                    <td>${{ o.total }}</td>
                    <td>
                      <button
                        class="btn btn-buy btn-sm"
                        type="button"
                        @click="trackingCode = o.id; tab = 'tracking'"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="font-sm color-gray-500 mt-10">
              Demo orders only — live history when orders API is ready.
            </p>
          </div>

          <!-- Tracking -->
          <div v-else-if="tab === 'tracking'">
            <label class="font-sm color-gray-500">Order ID</label>
            <div class="d-flex gap-2 mb-20 flex-wrap">
              <input v-model="trackingCode" class="form-control" style="max-width: 280px" />
              <button class="btn btn-buy" type="button" @click="showTrack = true">Track</button>
            </div>
            <div v-if="showTrack && trackingCode" class="card-grid-style-3">
              <div class="card-grid-inner p-4">
                <h5 class="mb-15">Tracking #{{ trackingCode }}</h5>
                <ul class="list-disc font-sm color-gray-900">
                  <li>Order placed</li>
                  <li>Payment confirmed</li>
                  <li>Packed at warehouse</li>
                  <li class="color-brand-2">Out for delivery</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Addresses -->
          <div v-else-if="tab === 'addresses'">
            <div class="row">
              <div v-for="a in addresses" :key="a.id" class="col-md-6 mb-20">
                <div class="border p-4" style="border-radius: 8px">
                  <h6 class="mb-10">{{ a.label }}</h6>
                  <p class="font-sm color-gray-500 mb-0">
                    {{ a.name }}<br />
                    {{ a.line }}<br />
                    {{ a.city }}<br />
                    {{ a.phone }}
                  </p>
                </div>
              </div>
            </div>
            <button class="btn btn-border" type="button" @click="onAddAddress">
              Add address
            </button>
          </div>

          <!-- Settings -->
          <div v-else>
            <div v-if="auth.user" class="row" style="max-width: 520px">
              <div class="col-12 mb-20">
                <label class="font-sm color-gray-500">Name</label>
                <input v-model="profile.name" class="form-control" />
              </div>
              <div class="col-12 mb-20">
                <label class="font-sm color-gray-500">Email</label>
                <input v-model="profile.email" type="email" class="form-control" />
              </div>
              <div class="col-12 mb-20">
                <button
                  class="btn btn-buy me-2"
                  type="button"
                  @click="onSaveProfile"
                >
                  Save changes
                </button>
                <button class="btn btn-border" type="button" @click="onLogout">Sign out</button>
              </div>
            </div>
            <div v-else>
              <p class="color-gray-500 mb-20">Sign in to edit account settings.</p>
              <router-link class="btn btn-buy" to="/login">Sign in</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import type { Product } from 'src/data/mock-catalog';
import { useAuthStore } from 'stores/auth-store';
import { useCartStore } from 'stores/cart-store';
import { useWishlistStore } from 'stores/wishlist-store';

type TabId = 'notifications' | 'wishlist' | 'orders' | 'tracking' | 'addresses' | 'settings';

const auth = useAuthStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const router = useRouter();

const tab = ref<TabId>('notifications');
const trackingCode = ref('1001');
const showTrack = ref(false);

const tabs: { id: TabId; label: string }[] = [
  { id: 'notifications', label: 'Notification' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'orders', label: 'Orders' },
  { id: 'tracking', label: 'Order Tracking' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'settings', label: 'Setting' },
];

const notifications = [
  {
    id: 1,
    title: 'COD payment confirmed',
    body: 'Order #1001 has been confirmed. Check estimated delivery in order details.',
  },
  {
    id: 2,
    title: 'Item shipped',
    body: 'Order #1002 is on the way. Track it from the Order Tracking tab.',
  },
];

const orders = [
  { id: '1001', date: '12 Aug 2026', status: 'Delivered', total: '256.00' },
  { id: '1002', date: '14 Aug 2026', status: 'Shipping', total: '89.50' },
  { id: '1003', date: '15 Aug 2026', status: 'Processing', total: '120.00' },
];

const addresses = [
  {
    id: 1,
    label: 'Shipping',
    name: auth.user?.name || 'Customer',
    line: '#12, St. 168, Sangkat Veal Vong',
    city: 'Phnom Penh',
    phone: '+855 12 345 678',
  },
  {
    id: 2,
    label: 'Billing',
    name: auth.user?.name || 'Customer',
    line: 'Street 289, Sangkat Boeung Kak I',
    city: 'Phnom Penh',
    phone: '+855 12 345 678',
  },
];

const profile = reactive({
  name: auth.user?.name ?? '',
  email: auth.user?.email ?? '',
});

watch(
  () => auth.user,
  (u) => {
    profile.name = u?.name ?? '';
    profile.email = u?.email ?? '';
  },
);

function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: 'Added to cart', position: 'top' });
}

function onOpen(product: Product) {
  void router.push(`/product/${product.slug}`);
}

function onAddAddress() {
  Notify.create({ message: 'Address form UI — wire API later', position: 'top' });
}

function onSaveProfile() {
  Notify.create({ type: 'positive', message: 'Profile saved (local demo)', position: 'top' });
}

async function onLogout() {
  await auth.logout();
  void router.push('/login');
}
</script>
