<template>
  <div class="z-container z-page">
    <StoreCrumbs :crumbs="[{ label: t('nav.account') }]" />

    <div class="z-account-hero">
      <div class="z-account-hero__profile">
        <div class="z-account-hero__avatar" aria-hidden="true">{{ initials }}</div>
        <div>
          <p class="z-page-hero__kicker">{{ t('account.kicker') }}</p>
          <h1>{{ t('account.hello', { name: displayName }) }}</h1>
          <p class="z-muted">{{ t('account.subtitle') }}</p>
        </div>
      </div>
      <div class="z-account-hero__stats">
        <button type="button" class="z-account-stat" @click="tab = 'orders'">
          <strong>{{ orders.length }}</strong>
          <span>{{ t('account.statOrders') }}</span>
        </button>
        <button type="button" class="z-account-stat" @click="tab = 'vouchers'">
          <strong>{{ vouchers.length }}</strong>
          <span>{{ t('account.statVouchers') }}</span>
        </button>
        <button type="button" class="z-account-stat" @click="tab = 'wishlist'">
          <strong>{{ wishlist.items.length }}</strong>
          <span>{{ t('account.statWish') }}</span>
        </button>
        <button type="button" class="z-account-stat" @click="tab = 'notifications'">
          <strong>{{ notifications.length }}</strong>
          <span>{{ t('account.statNotes') }}</span>
        </button>
      </div>
    </div>

    <aside v-if="auth.isAdmin" class="z-account-sell is-admin">
      <div>
        <p class="z-page-hero__kicker">{{ t('admin.adminBannerKicker') }}</p>
        <h2>{{ t('admin.adminBannerTitle') }}</h2>
        <p class="z-muted">{{ t('admin.adminBannerSub') }}</p>
      </div>
      <router-link class="z-btn z-btn-primary" to="/admin">{{ t('admin.openAdmin') }}</router-link>
    </aside>

    <aside v-if="!shop.active" class="z-account-sell">
      <div>
        <p class="z-page-hero__kicker">{{ t('account.sellKicker') }}</p>
        <h2>{{ t('account.sellTitle') }}</h2>
        <p class="z-muted">{{ t('account.sellSub') }}</p>
      </div>
      <router-link class="z-btn z-btn-deal" to="/vendor">{{ t('account.openSellerCenter') }}</router-link>
    </aside>
    <aside v-else class="z-account-sell is-active">
      <div>
        <p class="z-page-hero__kicker">{{ t('account.shopLive') }}</p>
        <h2>{{ shop.name }}</h2>
        <p class="z-muted">{{ t('account.shopLiveSubSeller') }}</p>
      </div>
      <router-link class="z-btn z-btn-deal" to="/vendor">{{ t('account.openSellerCenter') }}</router-link>
    </aside>

    <div class="z-account-layout">
      <aside class="z-account-nav" aria-label="Account sections">
        <button
          v-for="tabItem in tabs"
          :key="tabItem.id"
          type="button"
          :class="{ 'is-active': tab === tabItem.id }"
          @click="tab = tabItem.id"
        >
          <i class="material-icons">{{ tabItem.icon }}</i>
          <span>{{ tabItem.label }}</span>
        </button>
      </aside>

      <div class="z-account-main">
        <template v-if="tab === 'notifications'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.notifications') }}</h2>
            <p class="z-muted">{{ t('account.notificationsSub') }}</p>
          </div>
          <div class="z-account-notes">
            <article v-for="n in notifications" :key="n.id" class="z-account-note" :class="`is-${n.tone}`">
              <div class="z-account-note__icon">
                <i class="material-icons">{{ n.icon }}</i>
              </div>
              <div>
                <h3>{{ n.title }}</h3>
                <p>{{ n.body }}</p>
                <span class="z-account-note__time">{{ n.time }}</span>
              </div>
            </article>
          </div>
        </template>

        <template v-else-if="tab === 'wishlist'">
          <div class="z-account-panel__head">
            <h2>{{ t('nav.wishlist') }}</h2>
            <router-link class="z-btn z-btn-ghost z-btn-sm" to="/wishlist">{{ t('home.viewAll') }}</router-link>
          </div>
          <div v-if="!wishlist.items.length" class="z-empty">
            <h3>{{ t('account.wishEmpty') }}</h3>
            <p>{{ t('account.wishEmptyHint') }}</p>
            <router-link class="z-btn z-btn-primary" to="/shop">{{ t('nav.shop') }}</router-link>
          </div>
          <div v-else class="z-products">
            <ProductCard
              v-for="(p, i) in wishlist.items.slice(0, 6)"
              :key="p.id"
              class="z-fade-item"
              :style="{ '--i': i }"
              :product="p"
              @add="onAdd"
              @open="onOpen"
              @quickview="onQuickview"
            />
          </div>
          <section v-if="recentProducts.length" class="z-account-block">
            <div class="z-account-panel__head">
              <h2>{{ t('account.recent') }}</h2>
              <p class="z-muted">{{ t('account.recentSub') }}</p>
            </div>
            <div class="z-products">
              <ProductCard
                v-for="(p, i) in recentProducts"
                :key="`r-${p.id}`"
                class="z-fade-item"
                :style="{ '--i': i }"
                :product="p"
                @add="onAdd"
                @open="onOpen"
                @quickview="onQuickview"
              />
            </div>
          </section>
        </template>

        <template v-else-if="tab === 'orders'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.orders') }}</h2>
            <p class="z-muted">{{ t('account.ordersSub') }}</p>
          </div>
          <div class="z-account-orders">
            <article
              v-for="o in orders"
              :key="o.id"
              class="z-account-order"
              :class="{ 'is-open': openOrderId === o.id }"
            >
              <div class="z-account-order__top">
                <div>
                  <h3>#{{ o.id }}</h3>
                  <p class="z-muted">{{ o.date }} · {{ o.vendor }}</p>
                </div>
                <span class="z-account-badge" :class="`is-${o.tone}`">{{ o.status }}</span>
              </div>
              <div class="z-account-order__meta">
                <span>{{ o.payment }}</span>
                <strong>${{ o.total }}</strong>
              </div>
              <div class="z-account-order__bottom">
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="toggleOrder(o.id)">
                  {{ openOrderId === o.id ? t('account.hideDetails') : t('account.details') }}
                </button>
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="onReorder(o)">
                  {{ t('account.reorder') }}
                </button>
                <button class="z-btn z-btn-sm z-btn-deal" type="button" @click="openTrack(o.id)">
                  {{ t('account.track') }}
                </button>
              </div>
              <div v-if="openOrderId === o.id" class="z-account-order__details">
                <div v-for="item in o.items" :key="item.id" class="z-account-order-item">
                  <img :src="item.image" :alt="item.name" />
                  <div>
                    <strong>{{ item.name }}</strong>
                    <p class="z-muted">×{{ item.qty }} · ${{ item.price.toFixed(2) }}</p>
                  </div>
                </div>
                <p class="z-account-order__hint">{{ t('account.supportHint') }}</p>
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="onSupport(o.id)">
                  {{ t('account.reportIssue') }}
                </button>
              </div>
            </article>
          </div>
        </template>

        <template v-else-if="tab === 'tracking'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.tracking') }}</h2>
            <p class="z-muted">{{ t('account.trackingSub') }}</p>
          </div>
          <div class="z-account-track-box">
            <div class="z-account-track-form">
              <div class="z-input-wrap">
                <i class="material-icons">local_shipping</i>
                <input v-model="trackingCode" class="z-input" :placeholder="t('account.trackPh')" />
              </div>
              <button class="z-btn z-btn-deal" type="button" @click="showTrack = true">
                {{ t('account.track') }}
              </button>
            </div>
            <ol v-if="showTrack && trackingCode" class="z-account-timeline">
              <li class="is-done">
                <span>{{ t('account.stepPlaced') }}</span>
                <small>12 Aug · 09:20</small>
              </li>
              <li class="is-done">
                <span>{{ t('account.stepPaid') }}</span>
                <small>12 Aug · 09:22</small>
              </li>
              <li class="is-done">
                <span>{{ t('account.stepPacked') }}</span>
                <small>13 Aug · 14:10</small>
              </li>
              <li class="is-active">
                <span>{{ t('account.stepShip') }}</span>
                <small>{{ t('account.stepShipNow') }}</small>
              </li>
              <li>
                <span>{{ t('account.stepDeliver') }}</span>
                <small>{{ t('account.stepSoon') }}</small>
              </li>
            </ol>
          </div>
        </template>

        <template v-else-if="tab === 'vouchers'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.vouchers') }}</h2>
            <p class="z-muted">{{ t('account.vouchersSub') }}</p>
          </div>
          <div class="z-account-vouchers">
            <article v-for="v in vouchers" :key="v.id" class="z-account-voucher" :class="{ 'is-used': v.used }">
              <div class="z-account-voucher__value">
                <strong>{{ v.value }}</strong>
                <span>{{ v.type }}</span>
              </div>
              <div>
                <h3>{{ v.title }}</h3>
                <p class="z-muted">{{ v.rule }}</p>
                <span class="z-account-note__time">{{ t('account.expires', { date: v.expires }) }}</span>
              </div>
              <button
                class="z-btn z-btn-sm"
                :class="v.used ? 'z-btn-ghost' : 'z-btn-deal'"
                type="button"
                :disabled="v.used"
                @click="onUseVoucher(v.title)"
              >
                {{ v.used ? t('account.used') : t('account.useVoucher') }}
              </button>
            </article>
          </div>
        </template>

        <template v-else-if="tab === 'payments'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.payments') }}</h2>
            <p class="z-muted">{{ t('account.paymentsSub') }}</p>
          </div>
          <div class="z-account-payments">
            <button
              v-for="method in paymentMethods"
              :key="method.id"
              type="button"
              class="z-account-pay"
              :class="{ 'is-active': preferredPay === method.id }"
              @click="setPreferredPay(method.id)"
            >
              <i class="material-icons">{{ method.icon }}</i>
              <div>
                <strong>{{ method.label }}</strong>
                <span>{{ method.hint }}</span>
              </div>
              <span v-if="preferredPay === method.id" class="z-account-badge is-deal">{{ t('account.default') }}</span>
            </button>
          </div>
        </template>

        <template v-else-if="tab === 'addresses'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.addresses') }}</h2>
            <p class="z-muted">{{ t('account.addressesSub') }}</p>
          </div>
          <div class="z-account-addresses">
            <article
              v-for="a in addresses"
              :key="a.id"
              class="z-account-address"
              :class="{ 'is-default': defaultAddressId === a.id }"
            >
              <div class="z-account-address__head">
                <span class="z-account-badge" :class="defaultAddressId === a.id ? 'is-deal' : 'is-info'">
                  {{ defaultAddressId === a.id ? t('account.default') : a.label }}
                </span>
                <i class="material-icons">place</i>
              </div>
              <h3>{{ a.name }}</h3>
              <p>{{ a.line }}</p>
              <p>{{ a.city }}</p>
              <p class="z-muted">{{ a.phone }}</p>
              <button
                v-if="defaultAddressId !== a.id"
                class="z-btn z-btn-sm z-btn-ghost"
                type="button"
                @click="setDefaultAddress(a.id)"
              >
                {{ t('account.setDefault') }}
              </button>
            </article>
          </div>
        </template>

        <template v-else-if="tab === 'shops'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.followed') }}</h2>
            <p class="z-muted">{{ t('account.followedSub') }}</p>
          </div>
          <div class="z-account-follows">
            <article v-for="v in followedVendors" :key="v.slug" class="z-account-follow">
              <img :src="v.logo" :alt="v.name" />
              <div>
                <h3>{{ v.name }}</h3>
                <p class="z-muted">{{ v.products }} {{ t('account.products') }}</p>
              </div>
              <router-link class="z-btn z-btn-sm z-btn-ghost" :to="`/vendors/${v.slug}`">
                {{ t('home.visitShop') }}
              </router-link>
            </article>
          </div>
        </template>

        <template v-else-if="tab === 'shop'">
          <div class="z-account-panel__head">
            <h2>{{ t('account.myShop') }}</h2>
            <p class="z-muted">{{ t('account.myShopGateSub') }}</p>
          </div>
          <div class="z-account-seller-gate">
            <div class="z-account-seller-gate__icon" aria-hidden="true">
              <i class="material-icons">storefront</i>
            </div>
            <h3>{{ shop.active ? shop.name : t('account.sellTitle') }}</h3>
            <p class="z-muted">
              {{ shop.active ? t('account.shopLiveSubSeller') : t('account.sellSub') }}
            </p>
            <ul class="z-account-seller-gate__feats">
              <li><i class="material-icons">inventory_2</i>{{ t('account.gateListings') }}</li>
              <li><i class="material-icons">receipt_long</i>{{ t('account.gateOrders') }}</li>
              <li><i class="material-icons">insights</i>{{ t('account.gateAnalytics') }}</li>
              <li><i class="material-icons">account_balance_wallet</i>{{ t('account.gatePayouts') }}</li>
            </ul>
            <router-link class="z-btn z-btn-deal" to="/vendor">
              {{ shop.active ? t('account.openSellerCenter') : t('account.activateShop') }}
            </router-link>
          </div>
        </template>

        <template v-else>
          <div class="z-account-panel__head">
            <h2>{{ t('account.settings') }}</h2>
            <p class="z-muted">{{ t('account.settingsSub') }}</p>
          </div>
          <div class="z-account-settings">
            <template v-if="auth.user">
              <div class="z-field">
                <label class="z-label" for="acc-name">{{ t('auth.name') }}</label>
                <div class="z-input-wrap">
                  <i class="material-icons">person_outline</i>
                  <input id="acc-name" v-model="profile.name" class="z-input" />
                </div>
              </div>
              <div class="z-field">
                <label class="z-label" for="acc-email">{{ t('auth.email') }}</label>
                <div class="z-input-wrap">
                  <i class="material-icons">mail_outline</i>
                  <input id="acc-email" v-model="profile.email" class="z-input" type="email" />
                </div>
              </div>

              <h3 class="z-account-settings__section">{{ t('account.alerts') }}</h3>
              <label v-for="a in alertOptions" :key="a.key" class="z-account-check">
                <input v-model="alerts[a.key]" type="checkbox" @change="persistAlerts" />
                <span>{{ a.label }}</span>
              </label>

              <div class="z-account-settings__actions">
                <button class="z-btn z-btn-deal" type="button" @click="onSaveProfile">{{ t('account.save') }}</button>
                <button class="z-btn z-btn-ghost" type="button" @click="onLogout">{{ t('account.signOut') }}</button>
              </div>
            </template>
            <template v-else>
              <div class="z-empty">
                <h3>{{ t('account.guestTitle') }}</h3>
                <p>{{ t('account.guestHint') }}</p>
                <router-link class="z-btn z-btn-deal" to="/login">{{ t('nav.login') }}</router-link>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import ProductCard from 'components/store/ProductCard.vue';
import StoreCrumbs from 'components/store/StoreCrumbs.vue';
import { useSellerShop } from 'src/composables/useSellerShop';
import { mockProducts, type Product } from 'src/data/mock-catalog';
import { mockVendors } from 'src/data/mock-vendors';
import { useAuthStore } from 'stores/auth-store';
import { useCartStore } from 'stores/cart-store';
import { useWishlistStore } from 'stores/wishlist-store';
import { useUiStore } from 'stores/ui-store';

type TabId =
  | 'notifications'
  | 'wishlist'
  | 'orders'
  | 'tracking'
  | 'vouchers'
  | 'payments'
  | 'addresses'
  | 'shops'
  | 'shop'
  | 'settings';

type PayId = 'cod' | 'aba' | 'wing' | 'khqr';

const PAY_KEY = 'zcomus-account-pay';
const ADDR_KEY = 'zcomus-account-addr';
const ALERT_KEY = 'zcomus-account-alerts';

const { t } = useI18n();
const auth = useAuthStore();
const cart = useCartStore();
const wishlist = useWishlistStore();
const ui = useUiStore();
const router = useRouter();
const { shop } = useSellerShop();
const tab = ref<TabId>('notifications');
const trackingCode = ref('1001');
const showTrack = ref(false);
const openOrderId = ref<string | null>(null);

const displayName = computed(() => auth.user?.name || 'Guest');
const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/);
  return ((parts[0]?.[0] || 'G') + (parts[1]?.[0] || '')).toUpperCase();
});

const tabs = computed(() => [
  { id: 'notifications' as const, label: t('account.notifications'), icon: 'notifications' },
  { id: 'orders' as const, label: t('account.orders'), icon: 'receipt_long' },
  { id: 'tracking' as const, label: t('account.tracking'), icon: 'local_shipping' },
  { id: 'wishlist' as const, label: t('nav.wishlist'), icon: 'favorite_border' },
  { id: 'vouchers' as const, label: t('account.vouchers'), icon: 'local_offer' },
  { id: 'payments' as const, label: t('account.payments'), icon: 'payments' },
  { id: 'addresses' as const, label: t('account.addresses'), icon: 'home' },
  { id: 'shops' as const, label: t('account.followed'), icon: 'favorite' },
  { id: 'shop' as const, label: t('account.myShop'), icon: 'add_business' },
  { id: 'settings' as const, label: t('account.settings'), icon: 'settings' },
]);

const notifications = [
  {
    id: 1,
    title: 'COD payment confirmed',
    body: 'Order #1001 has been confirmed and is being prepared.',
    time: '2 hours ago',
    icon: 'payments',
    tone: 'success',
  },
  {
    id: 2,
    title: 'Item shipped',
    body: 'Order #1002 is on the way across Cambodia.',
    time: 'Yesterday',
    icon: 'local_shipping',
    tone: 'info',
  },
  {
    id: 3,
    title: 'New voucher unlocked',
    body: 'Flash deal — 15% off electronics this weekend.',
    time: 'Today',
    icon: 'local_offer',
    tone: 'info',
  },
];

const p1 = mockProducts[0]!;
const p2 = mockProducts[2]!;
const p3 = mockProducts[4]!;

const orders = [
  {
    id: '1001',
    date: '12 Aug 2026',
    status: 'Delivered',
    total: '256.00',
    tone: 'success',
    payment: 'ABA',
    vendor: 'Futur Store',
    items: [{ id: p1.id, name: p1.name, image: p1.image, qty: 1, price: p1.price, product: p1 }],
  },
  {
    id: '1002',
    date: '14 Aug 2026',
    status: 'Shipping',
    total: '89.50',
    tone: 'deal',
    payment: 'COD',
    vendor: 'Elmado Shop',
    items: [{ id: p2.id, name: p2.name, image: p2.image, qty: 1, price: p2.price, product: p2 }],
  },
  {
    id: '1003',
    date: '15 Aug 2026',
    status: 'Processing',
    total: '120.00',
    tone: 'info',
    payment: 'KHQR',
    vendor: 'Market Hub',
    items: [{ id: p3.id, name: p3.name, image: p3.image, qty: 1, price: p3.price, product: p3 }],
  },
];

const vouchers = [
  { id: 1, title: 'Welcome deal', value: '15%', type: 'OFF', rule: 'Electronics · min $50', expires: '30 Aug 2026', used: false },
  { id: 2, title: 'Free delivery', value: '$0', type: 'SHIP', rule: 'Phnom Penh · orders $25+', expires: '28 Aug 2026', used: false },
  { id: 3, title: 'Used coupon', value: '$5', type: 'OFF', rule: 'Any seller', expires: '10 Aug 2026', used: true },
];

const paymentMethods = computed(() => [
  { id: 'cod' as const, label: 'COD', hint: t('account.payCod'), icon: 'payments' },
  { id: 'aba' as const, label: 'ABA', hint: t('account.payAba'), icon: 'account_balance' },
  { id: 'wing' as const, label: 'Wing', hint: t('account.payWing'), icon: 'phone_android' },
  { id: 'khqr' as const, label: 'KHQR', hint: t('account.payKhqr'), icon: 'qr_code_2' },
]);

const preferredPay = ref<PayId>((localStorage.getItem(PAY_KEY) as PayId) || 'cod');
const defaultAddressId = ref(Number(localStorage.getItem(ADDR_KEY) || 1));

const addresses = computed(() => [
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
]);

const followedVendors = mockVendors.slice(0, 4);
const recentProducts = mockProducts.slice(0, 4);

const alerts = reactive(loadAlerts());
const alertOptions = computed(() => [
  { key: 'order' as const, label: t('account.alertOrder') },
  { key: 'deal' as const, label: t('account.alertDeal') },
  { key: 'sms' as const, label: t('account.alertSms') },
]);

const profile = reactive({ name: auth.user?.name ?? '', email: auth.user?.email ?? '' });
watch(
  () => auth.user,
  (u) => {
    profile.name = u?.name ?? '';
    profile.email = u?.email ?? '';
  },
);

function loadAlerts() {
  try {
    const raw = localStorage.getItem(ALERT_KEY);
    if (raw) return JSON.parse(raw) as { order: boolean; deal: boolean; sms: boolean };
  } catch {
    /* ignore */
  }
  return { order: true, deal: true, sms: false };
}

function persistAlerts() {
  localStorage.setItem(ALERT_KEY, JSON.stringify(alerts));
}

function setPreferredPay(id: PayId) {
  preferredPay.value = id;
  localStorage.setItem(PAY_KEY, id);
  Notify.create({ type: 'positive', message: t('success'), position: 'top' });
}

function setDefaultAddress(id: number) {
  defaultAddressId.value = id;
  localStorage.setItem(ADDR_KEY, String(id));
  Notify.create({ type: 'positive', message: t('success'), position: 'top' });
}

function toggleOrder(id: string) {
  openOrderId.value = openOrderId.value === id ? null : id;
}

function openTrack(id: string) {
  trackingCode.value = id;
  showTrack.value = true;
  tab.value = 'tracking';
}

function onReorder(order: (typeof orders)[number]) {
  for (const item of order.items) {
    cart.add(item.product);
  }
  Notify.create({ type: 'positive', message: t('account.reorderDone'), position: 'top' });
  void router.push('/cart');
}

function onSupport(orderId: string) {
  Notify.create({
    type: 'info',
    message: t('account.supportQueued', { id: orderId }),
    position: 'top',
  });
}

function onUseVoucher(title: string) {
  Notify.create({ type: 'positive', message: t('account.voucherReady', { title }), position: 'top' });
  void router.push('/shop');
}

function onAdd(product: Product) {
  cart.add(product);
  Notify.create({ type: 'positive', message: t('product.addCart'), position: 'top' });
}
function onOpen(product: Product) {
  void router.push(`/product/${product.slug}`);
}
function onQuickview(product: Product) {
  ui.openQuickview(product);
}
function onSaveProfile() {
  persistAlerts();
  Notify.create({ type: 'positive', message: t('success'), position: 'top' });
}
async function onLogout() {
  await auth.logout();
  void router.push('/login');
}
</script>
