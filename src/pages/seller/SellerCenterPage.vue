<template>
  <div class="z-seller-page">
    <!-- Onboard -->
    <div v-if="!shop.active" class="z-vendor-setup">
      <header class="z-vendor-setup__intro">
        <p class="z-vendor-setup__kicker">{{ t('seller.kicker') }}</p>
        <h1>{{ t('seller.setupTitle') }}</h1>
        <p>{{ t('seller.setupLead') }}</p>
      </header>

      <nav class="z-vendor-setup__steps" aria-label="Setup steps">
        <button
          type="button"
          :class="{ 'is-active': setupStep === 1, 'is-done': setupStep > 1 }"
          @click="goSetupStep(1)"
        >
          <em>1</em>
          <span>{{ t('seller.stepName') }}</span>
        </button>
        <button
          type="button"
          :class="{ 'is-active': setupStep === 2, 'is-done': setupStep > 2 }"
          :disabled="!setup.name.trim()"
          @click="goSetupStep(2)"
        >
          <em>2</em>
          <span>{{ t('seller.stepCategory') }}</span>
        </button>
        <button
          type="button"
          :class="{ 'is-active': setupStep === 3 }"
          :disabled="!setup.name.trim()"
          @click="goSetupStep(3)"
        >
          <em>3</em>
          <span>{{ t('seller.stepContact') }}</span>
        </button>
      </nav>

      <div class="z-vendor-setup__card">
        <template v-if="setupStep === 1">
          <h2>{{ t('seller.stepNameAsk') }}</h2>
          <p>{{ t('seller.stepNameHint') }}</p>
          <div class="z-input-wrap z-vendor-setup__input">
            <i class="material-icons">storefront</i>
            <input
              id="seller-name"
              v-model="setup.name"
              class="z-input"
              :placeholder="t('seller.shopNamePh')"
              autocomplete="organization"
            />
          </div>
          <button
            class="z-btn z-btn-deal z-vendor-setup__cta"
            type="button"
            :disabled="!setup.name.trim()"
            @click="setupStep = 2"
          >
            {{ t('seller.continue') }}
          </button>
        </template>

        <template v-else-if="setupStep === 2">
          <h2>{{ t('seller.stepCategoryAsk') }}</h2>
          <p>{{ t('seller.stepCategoryHint') }}</p>
          <div class="z-seller-cats">
            <button
              v-for="c in categories"
              :key="c"
              type="button"
              class="z-seller-cat"
              :class="{ 'is-active': setup.category === c }"
              @click="setup.category = c"
            >
              {{ c }}
            </button>
          </div>
          <div class="z-seller-actions">
            <button class="z-btn z-btn-ghost" type="button" @click="setupStep = 1">{{ t('seller.back') }}</button>
            <button class="z-btn z-btn-deal" type="button" @click="setupStep = 3">{{ t('seller.continue') }}</button>
          </div>
        </template>

        <template v-else>
          <h2>{{ t('seller.stepContactAsk') }}</h2>
          <p>{{ t('seller.stepContactHint') }}</p>
          <div class="z-input-wrap z-vendor-setup__input">
            <i class="material-icons">phone</i>
            <input
              id="seller-phone"
              v-model="setup.phone"
              class="z-input"
              :placeholder="t('seller.phonePh')"
              autocomplete="tel"
            />
          </div>
          <p class="z-vendor-setup__terms">{{ t('seller.terms') }}</p>
          <div class="z-seller-actions">
            <button class="z-btn z-btn-ghost" type="button" @click="setupStep = 2">{{ t('seller.back') }}</button>
            <button class="z-btn z-btn-deal" type="button" :disabled="!setup.phone.trim()" @click="onActivate">
              {{ t('seller.activate') }}
            </button>
          </div>
        </template>
      </div>

      <ul class="z-vendor-setup__perks">
        <li>
          <i class="material-icons">groups</i>
          <span>{{ t('seller.whyReach') }}</span>
        </li>
        <li>
          <i class="material-icons">payments</i>
          <span>{{ t('seller.whyPay') }}</span>
        </li>
        <li>
          <i class="material-icons">local_shipping</i>
          <span>{{ t('seller.whyShip') }}</span>
        </li>
        <li>
          <i class="material-icons">verified</i>
          <span>{{ t('seller.whyTrust') }}</span>
        </li>
      </ul>
    </div>

    <div v-else class="z-seller-workspace">
      <!-- DASHBOARD -->
      <template v-if="panel === 'dashboard'">
        <section class="z-studio-hero">
          <div class="z-studio-hero__copy">
            <p class="z-studio-hero__kicker">{{ greeting }}</p>
            <h1>{{ shop.name }}</h1>
            <p>{{ t('seller.homeSub') }}</p>
            <div class="z-studio-hero__cta">
              <button class="z-btn z-btn-deal" type="button" @click="openAddListing">
                <i class="material-icons">add</i>{{ t('seller.addListing') }}
              </button>
              <button class="z-btn z-btn-ghost" type="button" @click="openPanel('orders')">
                {{ t('seller.orders') }}
                <em v-if="pendingOrders">{{ pendingOrders }}</em>
              </button>
            </div>
            <div class="z-studio-quick">
              <button type="button" @click="openPanel('listings')">
                <i class="material-icons">inventory_2</i>
                {{ t('seller.listings') }}
              </button>
              <button type="button" @click="openPanel('analytics')">
                <i class="material-icons">insights</i>
                {{ t('seller.analytics') }}
              </button>
              <button type="button" @click="openPanel('payouts')">
                <i class="material-icons">payments</i>
                {{ t('seller.payouts') }}
              </button>
              <button type="button" @click="openPanel('storefront')">
                <i class="material-icons">palette</i>
                {{ t('seller.storefront') }}
              </button>
            </div>
          </div>
          <div class="z-studio-hero__mosaic" aria-hidden="true">
            <button
              v-for="(item, i) in listings.slice(0, 4)"
              :key="item.id"
              type="button"
              class="z-studio-hero__tile"
              :class="`is-${i}`"
              :title="item.title"
              @click="onEdit(item.id)"
            >
              <img v-if="item.image" :src="item.image" :alt="item.title" />
              <span v-else>{{ item.title.slice(0, 1) }}</span>
            </button>
            <button
              v-if="!listings.length"
              type="button"
              class="z-studio-hero__tile is-empty"
              @click="openAddListing"
            >
              <i class="material-icons">add_a_photo</i>
              <small>{{ t('seller.addFirstListing') }}</small>
            </button>
          </div>
        </section>

        <div v-if="doneCount < SETUP_STEP_TOTAL || lowStockCount > 0" class="z-studio-checklist">
          <header>
            <strong>{{ t('seller.nextTitle') }}</strong>
            <span>{{ t('seller.setupProgress', { n: doneCount, total: SETUP_STEP_TOTAL }) }}</span>
          </header>
          <div class="z-studio-checklist__bar" aria-hidden="true">
            <i :style="{ width: `${(doneCount / SETUP_STEP_TOTAL) * 100}%` }" />
          </div>
          <div class="z-studio-checklist__items">
            <button
              type="button"
              :class="{ 'is-done': allListingCount > 0 }"
              @click="allListingCount ? openPanel('listings') : openAddListing()"
            >
              <i class="material-icons">{{ allListingCount ? 'check_circle' : 'radio_button_unchecked' }}</i>
              <span>{{ t('seller.addListing') }}</span>
            </button>
            <button
              type="button"
              :class="{ 'is-done': payoutSet }"
              @click="openPanel('payouts')"
            >
              <i class="material-icons">{{ payoutSet ? 'check_circle' : 'radio_button_unchecked' }}</i>
              <span>{{ t('seller.setupPayment') }}</span>
            </button>
            <button
              type="button"
              :class="{ 'is-done': storefrontReady }"
              @click="openPanel('storefront')"
            >
              <i class="material-icons">{{ storefrontReady ? 'check_circle' : 'radio_button_unchecked' }}</i>
              <span>{{ t('seller.setupStorefront') }}</span>
            </button>
            <button
              v-if="lowStockCount > 0"
              type="button"
              class="is-warn"
              @click="openPanel('listings')"
            >
              <i class="material-icons">warning</i>
              <span>{{ t('seller.lowStockAlert', { n: lowStockCount }) }}</span>
            </button>
          </div>
        </div>

        <div v-if="pendingOrders > 0" class="z-studio-banner">
          <div>
            <strong>{{ t('seller.alertPack', { n: pendingOrders }) }}</strong>
            <span>{{ t('seller.alertPackHint') }}</span>
          </div>
          <button class="z-btn z-btn-sm z-btn-deal" type="button" @click="openPanel('orders')">
            {{ t('seller.handleOrders') }}
          </button>
        </div>

        <div class="z-studio-stats">
          <button type="button" @click="openPanel('listings')">
            <i class="material-icons">storefront</i>
            <strong>{{ listingCount }}</strong>
            <span>{{ t('seller.kpiLive') }}</span>
          </button>
          <button type="button" class="is-hot" @click="openPanel('orders')">
            <i class="material-icons">local_shipping</i>
            <strong>{{ pendingOrders }}</strong>
            <span>{{ t('seller.kpiPending') }}</span>
          </button>
          <button type="button" @click="openPanel('analytics')">
            <i class="material-icons">visibility</i>
            <strong>{{ views }}</strong>
            <span>{{ t('seller.kpiViews') }}</span>
          </button>
          <button type="button" class="is-money" @click="openPanel('payouts')">
            <i class="material-icons">payments</i>
            <strong>${{ revenue }}</strong>
            <span>{{ t('seller.kpiRevenue') }}</span>
          </button>
        </div>

        <div class="z-studio-split">
          <section class="z-studio-block">
            <header>
              <h2>{{ t('seller.needsAttention') }}</h2>
              <button type="button" @click="openPanel('orders')">{{ t('seller.viewAll') }}</button>
            </header>
            <div v-if="!sellerOrders.length" class="z-studio-empty">
              <p>{{ t('seller.noPending') }}</p>
            </div>
            <ul v-else class="z-studio-tickets">
              <li v-for="o in sellerOrders" :key="o.id">
                <div>
                  <strong>#{{ o.id }}</strong>
                  <span>{{ o.buyer }} · {{ o.date }}</span>
                </div>
                <em :class="`is-${o.tone}`">{{ o.status }}</em>
                <b>${{ o.total }}</b>
                <button
                  v-if="o.action === 'pack'"
                  class="z-btn z-btn-sm z-btn-deal"
                  type="button"
                  @click="onFulfill(o.id)"
                >
                  {{ t('seller.fulfill') }}
                </button>
              </li>
            </ul>
          </section>

          <section class="z-studio-block">
            <header>
              <h2>{{ t('seller.yourListings') }}</h2>
              <button type="button" @click="openPanel('listings')">{{ t('seller.manage') }}</button>
            </header>
            <div v-if="!listings.length" class="z-studio-empty">
              <p>{{ t('seller.listingsEmptyHint') }}</p>
              <button class="z-btn z-btn-sm z-btn-deal" type="button" @click="openAddListing">
                {{ t('seller.addListing') }}
              </button>
            </div>
            <div v-else class="z-studio-mini-grid">
              <article v-for="item in listings.slice(0, 4)" :key="item.id" @click="onEdit(item.id)">
                <div class="z-studio-mini-grid__img">
                  <img v-if="item.image" :src="item.image" :alt="item.title" />
                  <i v-else class="material-icons">inventory_2</i>
                  <span v-if="item.status !== 'listed'" class="z-studio-mini-grid__status">{{ statusLabel(item.status) }}</span>
                </div>
                <strong>{{ item.title }}</strong>
                <span>${{ item.price }}</span>
              </article>
            </div>
          </section>
        </div>
      </template>

      <!-- LISTINGS -->
      <div
        v-else-if="panel === 'listings'"
        class="z-listings-panel"
        :class="listingViewMode === 'list' ? 'is-list-view' : 'is-grid-view'"
      >
        <div class="z-studio-toolbar">
          <h1>{{ t('seller.listings') }}</h1>
          <div class="z-studio-toolbar__tools">
            <div class="z-seller-search">
              <i class="material-icons">search</i>
              <input
                v-model="listingQuery"
                class="z-input"
                type="search"
                :placeholder="t('seller.searchListings')"
              />
            </div>
            <select v-model="listingCatFilter" class="z-input z-seller-filter">
              <option value="">{{ t('seller.allCategories') }}</option>
              <option v-for="c in listingCategories" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="listingStatusFilter" class="z-input z-seller-filter">
              <option value="all">{{ t('seller.filterAll') }}</option>
              <option value="listed">{{ t('seller.statusListed') }}</option>
              <option value="draft">{{ t('seller.statusDraft') }}</option>
              <option value="paused">{{ t('seller.statusPaused') }}</option>
            </select>
            <div class="z-listings-view" role="group" :aria-label="t('seller.listingView')">
              <button
                type="button"
                class="z-listings-view__btn"
                :class="{ 'is-active': listingViewMode === 'grid' }"
                :aria-pressed="listingViewMode === 'grid'"
                @click="setListingView('grid')"
              >
                <i class="material-icons">grid_view</i>
                <span>{{ t('shop.grid') }}</span>
              </button>
              <button
                type="button"
                class="z-listings-view__btn"
                :class="{ 'is-active': listingViewMode === 'list' }"
                :aria-pressed="listingViewMode === 'list'"
                @click="setListingView('list')"
              >
                <i class="material-icons">view_list</i>
                <span>{{ t('shop.list') }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="z-seller-tabs z-seller-tabs--status">
          <button
            v-for="tab in listingStatusTabs"
            :key="tab.id"
            type="button"
            :class="{ 'is-active': listingStatusFilter === tab.id }"
            @click="listingStatusFilter = tab.id"
          >
            {{ tab.label }}
            <em>{{ tab.count }}</em>
          </button>
        </div>

        <div v-if="lowStockCount" class="z-studio-banner">
          <div>
            <strong>{{ t('seller.lowStockAlert', { n: lowStockCount }) }}</strong>
            <span>{{ t('seller.lowStockHint') }}</span>
          </div>
        </div>

        <div v-if="!filteredListings.length" class="z-seller-empty">
          <div class="z-seller-empty__art" aria-hidden="true"><i class="material-icons">inventory_2</i></div>
          <h3>{{ listings.length ? t('seller.noMatch') : t('seller.listingsEmpty') }}</h3>
          <p>{{ listings.length ? t('seller.noMatchHint') : t('seller.listingsEmptyHint') }}</p>
          <button v-if="!listings.length" class="z-btn z-btn-deal" type="button" @click="openAddListing">
            <i class="material-icons">add</i>
            {{ t('seller.addFirstListing') }}
          </button>
        </div>

        <div v-else class="z-studio-catalog">
          <article v-for="item in filteredListings" :key="item.id" class="z-studio-product">
            <div class="z-studio-product__media">
              <img v-if="item.image" :src="item.image" :alt="item.title" />
              <i v-else class="material-icons">inventory_2</i>
              <span v-if="item.badge" class="z-studio-product__badge">{{ item.badge }}</span>
              <span v-if="(item.images?.length || 0) > 1" class="z-studio-product__shots">
                {{ item.images.length }}
              </span>
              <span class="z-studio-product__status" :class="`is-${item.status}`">
                {{ statusLabel(item.status) }}
              </span>
            </div>
            <div class="z-studio-product__body">
              <p class="z-studio-product__cat">
                {{ item.category }}
                <template v-if="item.brand"> · {{ item.brand }}</template>
              </p>
              <h3>{{ item.title }}</h3>
              <div class="z-studio-product__meta">
                <strong>
                  ${{ item.price }}
                  <small v-if="item.compareAt">${{ item.compareAt }}</small>
                </strong>
                <span :class="{ 'is-low': item.stock <= 2 }">{{ t('seller.stock', { n: item.stock }) }}</span>
              </div>
              <div v-if="item.colors.length || item.sizes.length || item.styles.length" class="z-studio-product__opts">
                <em v-for="c in item.colors.slice(0, 3)" :key="`c-${item.id}-${c}`">{{ c }}</em>
                <em v-for="s in item.sizes.slice(0, 3)" :key="`s-${item.id}-${s}`">{{ s }}</em>
                <em v-for="st in item.styles.slice(0, 2)" :key="`st-${item.id}-${st}`">{{ st }}</em>
              </div>
              <div class="z-studio-product__actions">
                <button class="z-btn z-btn-sm z-btn-deal" type="button" @click="onEdit(item.id)">
                  {{ t('seller.edit') }}
                </button>
                <router-link
                  v-if="item.status === 'listed'"
                  class="z-btn z-btn-sm z-btn-ghost"
                  :to="storefrontPath(item)"
                  target="_blank"
                >
                  {{ t('seller.viewListing') }}
                </router-link>
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="onDuplicate(item.id)">
                  {{ t('seller.duplicate') }}
                </button>
                <button
                  v-if="item.status === 'listed'"
                  class="z-btn z-btn-sm z-btn-ghost"
                  type="button"
                  @click="onPause(item.id)"
                >
                  {{ t('seller.pause') }}
                </button>
                <button
                  v-else
                  class="z-btn z-btn-sm z-btn-ghost"
                  type="button"
                  @click="onPublishItem(item.id)"
                >
                  {{ t('seller.goLive') }}
                </button>
                <button class="z-btn z-btn-sm z-btn-ghost" type="button" @click="onRemove(item.id)">
                  {{ t('seller.remove') }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- ORDERS -->
      <div v-else-if="panel === 'orders'" class="z-orders-panel">
        <header class="z-orders-panel__head">
          <div>
            <p class="z-orders-panel__kicker">{{ t('seller.ordersKicker') }}</p>
            <h1>{{ t('seller.orders') }}</h1>
            <p>{{ t('seller.ordersSub') }}</p>
          </div>
          <div class="z-orders-panel__meta">
            <span>
              <strong>{{ pendingOrders }}</strong>
              {{ t('seller.ordersToPack') }}
            </span>
            <span>
              <strong>${{ orderRevenue.toFixed(2) }}</strong>
              {{ t('seller.kpiRevenue') }}
            </span>
          </div>
        </header>

        <div class="z-orders-panel__filters">
          <div class="z-seller-tabs z-seller-tabs--orders">
            <button
              v-for="tab in orderTabs"
              :key="tab.id"
              type="button"
              :class="{ 'is-active': orderFilter === tab.id }"
              @click="orderFilter = tab.id"
            >
              {{ tab.label }}
              <em v-if="tab.count">{{ tab.count }}</em>
            </button>
          </div>
        </div>

        <div v-if="!filteredOrders.length" class="z-seller-empty">
          <div class="z-seller-empty__art" aria-hidden="true"><i class="material-icons">receipt_long</i></div>
          <h3>{{ t('seller.ordersEmpty') }}</h3>
          <p>{{ t('seller.ordersEmptyHint') }}</p>
        </div>

        <ul v-else class="z-orders-list">
          <li v-for="o in filteredOrders" :key="o.id" class="z-orders-card" :class="`is-${o.tone}`">
            <div class="z-orders-card__main">
              <div class="z-orders-card__head">
                <div class="z-orders-card__id">
                  <strong>#{{ o.id }}</strong>
                  <span>{{ o.date }}</span>
                </div>
                <em class="z-orders-card__status" :class="`is-${o.tone}`">{{ o.status }}</em>
              </div>

              <div class="z-orders-card__body">
                <p class="z-orders-card__buyer">{{ o.buyer }}</p>
                <p class="z-orders-card__item">{{ o.listingTitle }}</p>
                <div class="z-orders-card__tags">
                  <span class="z-orders-card__payin">
                    <i class="material-icons">{{ orderPayinIcon(o.payinMethod) }}</i>
                    {{ t(`seller.payin_${o.payinMethod}`) }}
                  </span>
                  <span v-if="o.tone === 'deal'" class="z-orders-card__hint">
                    {{ t('seller.orderPayinHeld') }}
                  </span>
                  <span v-else-if="o.tone === 'ok'" class="z-orders-card__hint is-settled">
                    {{ t('seller.orderPayinSettled') }}
                  </span>
                </div>

                <ol class="z-orders-progress" :aria-label="t('seller.orderProgressAria', { id: o.id })">
                  <li
                    v-for="step in o.progress"
                    :key="step.id"
                    :class="{ 'is-done': step.done, 'is-current': step.current }"
                  >
                    <i class="material-icons">{{ step.icon }}</i>
                    <span>{{ t(`seller.orderStep_${step.id}`) }}</span>
                  </li>
                </ol>
              </div>
            </div>

            <footer class="z-orders-card__foot">
              <b>${{ o.total }}</b>
              <button
                v-if="o.action === 'pack'"
                class="z-btn z-btn-deal"
                type="button"
                @click="onFulfill(o.id)"
              >
                {{ t('seller.fulfill') }}
              </button>
              <button
                v-else-if="o.action === 'ship'"
                class="z-btn z-btn-deal"
                type="button"
                @click="onShip(o.id)"
              >
                {{ t('seller.markShipped') }}
              </button>
              <span v-else-if="o.status === 'Shipped'" class="z-orders-card__waiting">
                {{ t('seller.orderInTransit') }}
              </span>
            </footer>
          </li>
        </ul>
      </div>

      <!-- ANALYTICS -->
      <div v-else-if="panel === 'analytics'" class="z-analytics-panel">
        <header class="z-analytics-panel__head">
          <div>
            <p class="z-analytics-panel__kicker">{{ t('seller.analyticsPeriod') }}</p>
            <h1>{{ t('seller.analytics') }}</h1>
            <p>{{ t('seller.analyticsSub') }}</p>
          </div>
          <div class="z-analytics-panel__meta">
            <span><strong>{{ liveCount }}</strong> {{ t('seller.statusListed') }}</span>
            <span><strong>{{ orderCount }}</strong> {{ t('seller.analyticsOrders') }}</span>
          </div>
        </header>

        <div class="z-analytics-kpis z-analytics-kpis--primary">
          <article class="z-analytics-kpi">
            <i class="material-icons" aria-hidden="true">visibility</i>
            <strong>{{ totalViews }}</strong>
            <span>{{ t('seller.kpiViews') }}</span>
          </article>
          <article class="z-analytics-kpi">
            <i class="material-icons" aria-hidden="true">shopping_bag</i>
            <strong>{{ orderCount }}</strong>
            <span>{{ t('seller.analyticsOrders') }}</span>
          </article>
          <article class="z-analytics-kpi">
            <i class="material-icons" aria-hidden="true">ads_click</i>
            <strong>{{ conversionLabel }}</strong>
            <span>{{ t('seller.conversion') }}</span>
          </article>
          <article class="z-analytics-kpi is-money">
            <i class="material-icons" aria-hidden="true">payments</i>
            <strong>${{ orderRevenue.toFixed(2) }}</strong>
            <span>{{ t('seller.analyticsSales') }}</span>
          </article>
        </div>

        <div class="z-analytics-kpis z-analytics-kpis--secondary">
          <article class="z-analytics-stat">
            <span>{{ t('seller.analyticsAvgOrder') }}</span>
            <strong>${{ avgOrderValue.toFixed(2) }}</strong>
          </article>
          <article class="z-analytics-stat">
            <span>{{ t('seller.analyticsCatalog') }}</span>
            <strong>${{ catalogValue.toFixed(0) }}</strong>
          </article>
          <article class="z-analytics-stat">
            <span>{{ t('seller.analyticsStockUnits') }}</span>
            <strong>{{ totalStockUnits }}</strong>
          </article>
          <article class="z-analytics-stat" :class="{ 'is-warn': lowStockCount > 0 }">
            <span>{{ t('seller.analyticsLowStock') }}</span>
            <strong>{{ lowStockCount }}</strong>
          </article>
        </div>

        <div class="z-analytics-charts">
          <section class="z-analytics-chart">
            <header class="z-analytics-chart__head">
              <div>
                <h2>{{ t('seller.viewsWeek') }}</h2>
                <p>{{ t('seller.analyticsWeekTotal', { n: weekViewsTotal }) }}</p>
              </div>
              <span class="z-analytics-chart__peak">
                <i class="material-icons" aria-hidden="true">trending_up</i>
                {{ t('seller.analyticsPeak') }} · {{ peakDayFull }}
              </span>
            </header>
            <div class="z-analytics-chart__bars" role="img" :aria-label="viewsChartAria">
              <div
                v-for="(bar, i) in weekChart"
                :key="`v-${bar.dateKey}-${i}`"
                class="z-analytics-chart__col"
                :class="{ 'is-peak': bar.isPeak, 'is-today': bar.isToday }"
              >
                <span class="z-analytics-chart__val">{{ bar.value }}</span>
                <div class="z-analytics-chart__track">
                  <i :style="{ height: `${bar.pct}%` }" />
                </div>
                <span class="z-analytics-chart__day">{{ bar.day }}</span>
              </div>
            </div>
          </section>

          <section class="z-analytics-chart is-revenue">
            <header class="z-analytics-chart__head">
              <div>
                <h2>{{ t('seller.analyticsRevenueWeek') }}</h2>
                <p>{{ t('seller.analyticsRevenueTotal', { n: weekRevenueTotal.toFixed(2) }) }}</p>
              </div>
            </header>
            <div class="z-analytics-chart__bars is-compact" role="img" :aria-label="revenueChartAria">
              <div
                v-for="(bar, i) in weekRevenueChart"
                :key="`r-${bar.dateKey}-${i}`"
                class="z-analytics-chart__col"
                :class="{ 'is-peak': bar.isPeak, 'is-today': bar.isToday, 'is-empty': bar.value <= 0 }"
              >
                <span class="z-analytics-chart__val">{{ bar.value > 0 ? `$${bar.value}` : '—' }}</span>
                <div class="z-analytics-chart__track">
                  <i :style="{ height: `${Math.max(bar.pct, bar.value > 0 ? 8 : 0)}%` }" />
                </div>
                <span class="z-analytics-chart__day">{{ bar.day }}</span>
              </div>
            </div>
          </section>
        </div>

        <div class="z-analytics-grid">
          <section class="z-analytics-block">
            <header class="z-analytics-block__head">
              <h2>{{ t('seller.analyticsTopListings') }}</h2>
              <button type="button" class="z-analytics-link" @click="openPanel('listings')">
                {{ t('seller.viewAll') }}
              </button>
            </header>
            <ul v-if="topListings.length" class="z-analytics-listings">
              <li v-for="(row, index) in topListings" :key="row.id">
                <span class="z-analytics-listings__rank">{{ index + 1 }}</span>
                <div class="z-analytics-listings__thumb">
                  <img v-if="row.image" :src="row.image" :alt="row.title" />
                  <i v-else class="material-icons">inventory_2</i>
                </div>
                <div class="z-analytics-listings__body">
                  <strong>{{ row.title }}</strong>
                  <span>{{ row.views }} {{ t('seller.kpiViews').toLowerCase() }} · {{ row.viewShare }}%</span>
                  <em :class="`is-${row.status}`">{{ statusLabel(row.status) }}</em>
                </div>
                <div class="z-analytics-listings__nums">
                  <b>{{ row.orders }} {{ t('seller.analyticsOrders').toLowerCase() }}</b>
                  <small>${{ row.revenue.toFixed(2) }}</small>
                </div>
              </li>
            </ul>
            <p v-else class="z-analytics-empty">{{ t('seller.analyticsNoListings') }}</p>
          </section>

          <section class="z-analytics-block">
            <header class="z-analytics-block__head">
              <h2>{{ t('seller.analyticsCategories') }}</h2>
            </header>
            <ul v-if="categoryBreakdown.length" class="z-analytics-categories">
              <li v-for="cat in categoryBreakdown" :key="cat.name">
                <div class="z-analytics-categories__label">
                  <strong>{{ cat.name }}</strong>
                  <span>{{ cat.count }} · {{ cat.views }} {{ t('seller.kpiViews').toLowerCase() }}</span>
                </div>
                <div class="z-analytics-categories__bar">
                  <i :style="{ width: `${cat.pct}%` }" />
                </div>
              </li>
            </ul>
            <p v-else class="z-analytics-empty">{{ t('seller.analyticsNoListings') }}</p>

            <div class="z-analytics-status">
              <span
                v-for="row in statusBreakdown"
                :key="row.id"
                class="z-analytics-status__pill"
                :class="`is-${row.id}`"
              >
                {{ statusLabel(row.id) }}
                <b>{{ row.count }}</b>
              </span>
            </div>
          </section>
        </div>

        <section class="z-analytics-block">
          <header class="z-analytics-block__head">
            <h2>{{ t('seller.analyticsRecentOrders') }}</h2>
            <button type="button" class="z-analytics-link" @click="openPanel('orders')">
              {{ t('seller.viewAll') }}
            </button>
          </header>
          <ul v-if="recentOrders.length" class="z-analytics-orders">
            <li v-for="order in recentOrders" :key="order.id">
              <div>
                <strong>#{{ order.id }}</strong>
                <span>{{ order.buyer }} · {{ order.listingTitle }}</span>
              </div>
              <em :class="`is-${order.tone}`">{{ order.status }}</em>
              <b>${{ order.total.toFixed(2) }}</b>
              <small>{{ order.date }}</small>
            </li>
          </ul>
          <p v-else class="z-analytics-empty">{{ t('seller.ordersEmptyHint') }}</p>
        </section>

        <article class="z-analytics-insight is-tip">
          <i class="material-icons" aria-hidden="true">lightbulb</i>
          <div>
            <strong>{{ t('seller.analyticsTipTitle') }}</strong>
            <p>{{ analyticsTip }}</p>
          </div>
        </article>
      </div>

      <!-- PAYOUTS -->
      <div v-else-if="panel === 'payouts'" class="z-payout-panel">
        <header class="z-payout-panel__head">
          <div>
            <p class="z-payout-panel__kicker">{{ t('seller.payoutsKicker') }}</p>
            <h1>{{ t('seller.payouts') }}</h1>
            <p>{{ t('seller.payoutsSub') }}</p>
          </div>
        </header>

        <VendorPaymentSetup @saved="onPayoutSaved" />

        <div class="z-payout-balance z-payout-balance--compact">
          <article class="z-payout-balance__card">
            <span>{{ t('seller.balancePending') }}</span>
            <strong>${{ grossPending.toFixed(2) }}</strong>
          </article>
          <article class="z-payout-balance__card is-available">
            <span>{{ t('seller.balanceAvailable') }}</span>
            <strong>${{ netAvailable.toFixed(2) }}</strong>
          </article>
          <article class="z-payout-balance__card">
            <span>{{ t('seller.balanceFees') }}</span>
            <strong>${{ platformFees.toFixed(2) }}</strong>
          </article>
          <article class="z-payout-balance__card is-next">
            <span>{{ t('seller.balanceNextPayout') }}</span>
            <strong>{{ nextPayoutDate }}</strong>
          </article>
        </div>
      </div>

      <!-- STOREFRONT -->
      <template v-else-if="panel === 'storefront'">
        <VendorStorefrontPanel />
      </template>

      <!-- SETTINGS -->
      <div v-else-if="panel === 'settings'" class="z-settings-panel">
        <header class="z-settings-panel__head">
          <div>
            <p class="z-settings-panel__kicker">{{ t('seller.settingsKicker') }}</p>
            <h1>{{ t('seller.settings') }}</h1>
            <p>{{ t('seller.settingsSub') }}</p>
          </div>
          <span v-if="profileDirty" class="z-settings-panel__dirty">{{ t('seller.settingsUnsaved') }}</span>
        </header>

        <article class="z-settings-shop-card">
          <img v-if="shop.logo" class="z-settings-shop-card__logo" :src="shop.logo" :alt="shop.name" />
          <div v-else class="z-settings-shop-card__icon" aria-hidden="true">
            <i class="material-icons">storefront</i>
          </div>
          <div>
            <strong>{{ shop.name }}</strong>
            <span>{{ shop.category || t('seller.category') }}</span>
          </div>
          <em class="z-settings-shop-card__live">{{ t('seller.statusLive') }}</em>
        </article>

        <div class="z-settings-layout">
          <form class="z-settings-form" @submit.prevent="onSaveProfile">
            <section class="z-settings-section">
              <header>
                <i class="material-icons">badge</i>
                <div>
                  <h2>{{ t('seller.settingsSectionShop') }}</h2>
                  <p>{{ t('seller.settingsSectionShopHint') }}</p>
                </div>
              </header>

              <div class="z-seller-form-row">
                <div class="z-field">
                  <label class="z-label" for="set-name">{{ t('seller.shopName') }}</label>
                  <input
                    id="set-name"
                    v-model="profile.name"
                    class="z-input"
                    :placeholder="t('seller.shopNamePh')"
                    autocomplete="organization"
                  />
                </div>
                <div class="z-field">
                  <label class="z-label" for="set-cat">{{ t('seller.category') }}</label>
                  <select id="set-cat" v-model="profile.category" class="z-input">
                    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
              </div>

              <div class="z-field">
                <label class="z-label" for="set-bio">{{ t('seller.bio') }}</label>
                <textarea
                  id="set-bio"
                  v-model="profile.bio"
                  class="z-input z-textarea"
                  rows="4"
                  :placeholder="t('seller.bioPh')"
                />
              </div>
            </section>

            <section class="z-settings-section">
              <header>
                <i class="material-icons">phone</i>
                <div>
                  <h2>{{ t('seller.settingsSectionContact') }}</h2>
                  <p>{{ t('seller.settingsSectionContactHint') }}</p>
                </div>
              </header>

              <div class="z-field">
                <label class="z-label" for="set-phone">{{ t('seller.phone') }}</label>
                <input
                  id="set-phone"
                  v-model="profile.phone"
                  class="z-input"
                  :placeholder="t('seller.phonePh')"
                  autocomplete="tel"
                  inputmode="tel"
                />
              </div>
            </section>

            <footer class="z-settings-form__foot">
              <button class="z-btn z-btn-deal" type="submit" :disabled="!profileDirty">
                {{ t('seller.save') }}
              </button>
              <button class="z-btn z-btn-ghost" type="button" @click="onShare">
                <i class="material-icons">share</i>
                {{ t('seller.share') }}
              </button>
            </footer>
          </form>

          <aside class="z-settings-aside">
            <h3>{{ t('seller.settingsQuickLinks') }}</h3>
            <ul>
              <li>
                <button type="button" @click="openPanel('storefront')">
                  <i class="material-icons">palette</i>
                  <div>
                    <strong>{{ t('seller.storefront') }}</strong>
                    <span>{{ t('seller.settingsLinkStorefront') }}</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" @click="openPanel('payouts')">
                  <i class="material-icons">payments</i>
                  <div>
                    <strong>{{ t('seller.payouts') }}</strong>
                    <span>{{ t('seller.settingsLinkPayouts') }}</span>
                  </div>
                </button>
              </li>
              <li v-if="storeUrl">
                <router-link :to="storeUrl" target="_blank">
                  <i class="material-icons">open_in_new</i>
                  <div>
                    <strong>{{ t('seller.viewStore') }}</strong>
                    <span>{{ storeUrl }}</span>
                  </div>
                </router-link>
              </li>
            </ul>

            <div class="z-settings-danger">
              <h4>{{ t('seller.settingsDanger') }}</h4>
              <p>{{ t('seller.settingsDangerHint') }}</p>
              <button class="z-btn z-btn-ghost z-settings-danger__btn" type="button" @click="onDeactivate">
                {{ t('seller.deactivate') }}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { listingCategories, type ListingStatus, type ShopListing, useSellerShop } from 'src/composables/useSellerShop';
import { useSellerAnalytics } from 'src/composables/useSellerAnalytics';
import { useSellerPaymentFlow } from 'src/composables/useSellerPaymentFlow';
import { listingToSlug } from 'src/data/seller-catalog';
import { buildVendorOrders, type VendorOrderTone, type VendorPayinMethod } from 'src/data/vendor-orders';
import { buildOrderProgress, orderVendorAction } from 'src/helper/orderProgress';
import { useSellerUi } from 'src/composables/useSellerUi';
import VendorStorefrontPanel from 'components/seller/VendorStorefrontPanel.vue';
import VendorPaymentSetup from 'components/seller/VendorPaymentSetup.vue';

type OrderFilter = 'all' | 'new' | 'packed';
type ListingStatusFilter = 'all' | ListingStatus;
type ListingViewMode = 'grid' | 'list';

const LISTING_VIEW_KEY = 'zcomus-listing-view';

function readListingView(): ListingViewMode {
  const saved = localStorage.getItem(LISTING_VIEW_KEY);
  if (saved === 'list' || saved === 'grid') return saved;
  return window.matchMedia('(max-width: 899px)').matches ? 'list' : 'grid';
}

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const {
  shop,
  listings,
  payoutSet,
  listingCount,
  allListingCount,
  lowStockCount,
  views,
  revenue,
  activate,
  deactivate,
  saveProfile,
  removeListing,
  setListingStatus,
  duplicateListing,
  storeUrl,
} = useSellerShop();
const { panel, openPanel, openAddListing, openEditListing } = useSellerUi();

const SETUP_STEP_TOTAL = 3;

const setupStep = ref(1);
const categories = ['Electronics', 'Fashion', 'Home & Living', 'Food', 'Other'];
const listingQuery = ref('');
const listingCatFilter = ref('');
const listingStatusFilter = ref<ListingStatusFilter>('all');
const listingViewMode = ref<ListingViewMode>(readListingView());

function setListingView(mode: ListingViewMode) {
  listingViewMode.value = mode;
  localStorage.setItem(LISTING_VIEW_KEY, mode);
}
const orderFilter = ref<OrderFilter>('all');
const orderStatusOverrides = ref<Record<string, { status: string; tone: VendorOrderTone }>>({});
const storefrontReady = computed(() => !!shop.slug?.trim());

const doneCount = computed(
  () =>
    (allListingCount.value > 0 ? 1 : 0) +
    (payoutSet.value ? 1 : 0) +
    (storefrontReady.value ? 1 : 0),
);

const vendorOrders = computed(() => buildVendorOrders(listings.value));

const {
  grossPending,
  netAvailable,
  platformFees,
  nextPayoutDate,
} = useSellerPaymentFlow(vendorOrders);

const {
  totalViews,
  orderCount,
  orderRevenue,
  avgOrderValue,
  conversionLabel,
  liveCount,
  catalogValue,
  totalStockUnits,
  conversionRate,
  weekChart,
  weekViewsTotal,
  peakDayFull,
  weekRevenueChart,
  weekRevenueTotal,
  topListings,
  categoryBreakdown,
  statusBreakdown,
  recentOrders,
} = useSellerAnalytics(listings, vendorOrders, computed(() => shop.active));

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return t('seller.greetMorning');
  if (h < 18) return t('seller.greetAfternoon');
  return t('seller.greetEvening');
});

const viewsChartAria = computed(() =>
  t('seller.analyticsChartAria', {
    total: weekViewsTotal.value,
    peak: peakDayFull.value,
  }),
);

const revenueChartAria = computed(() =>
  t('seller.analyticsRevenueAria', { total: weekRevenueTotal.value.toFixed(2) }),
);

const analyticsTip = computed(() => {
  if (!listingCount.value) return t('seller.analyticsTipEmpty');
  if (orderCount.value > 0 && conversionRate.value < 3) {
    return t('seller.analyticsTipConversion');
  }
  if (lowStockCount.value > 0) return t('seller.analyticsTipStock');
  if (topListings.value[0]) {
    return t('seller.analyticsTipTopListing', { title: topListings.value[0].title });
  }
  return t('seller.analyticsTipDefault');
});

const setup = reactive({
  name: shop.name || '',
  category: shop.category || 'Electronics',
  phone: shop.phone || '',
});

const profile = reactive({
  name: shop.name,
  category: shop.category || 'Electronics',
  phone: shop.phone,
  bio: shop.bio || '',
});

watch(
  () => [shop.name, shop.category, shop.phone, shop.bio],
  () => {
    profile.name = shop.name;
    profile.category = shop.category || 'Electronics';
    profile.phone = shop.phone;
    profile.bio = shop.bio || '';
  },
);

const profileDirty = computed(
  () =>
    profile.name.trim() !== shop.name ||
    profile.category !== (shop.category || 'Electronics') ||
    profile.phone.trim() !== shop.phone ||
    profile.bio.trim() !== (shop.bio || ''),
);

function onPayoutSaved() {
  Notify.create({ type: 'positive', message: t('seller.payoutSaved'), position: 'top' });
}

const sellerOrders = computed(() =>
  vendorOrders.value.map((order) => {
    const override = orderStatusOverrides.value[order.id];
    const status = override?.status ?? order.status;
    const tone = override?.tone ?? order.tone;
    return {
      id: order.id,
      buyer: order.buyer,
      date: order.date,
      status,
      total: order.total.toFixed(2),
      tone,
      listingTitle: order.listingTitle,
      payinMethod: order.payinMethod,
      progress: buildOrderProgress(status, tone),
      action: orderVendorAction(status, tone),
    };
  }),
);

const pendingOrders = computed(() => sellerOrders.value.filter((o) => o.tone === 'deal').length);

const orderTabs = computed(() => [
  { id: 'all' as const, label: t('seller.filterAll'), count: sellerOrders.value.length },
  {
    id: 'new' as const,
    label: t('seller.filterNew'),
    count: sellerOrders.value.filter((o) => o.tone === 'deal').length,
  },
  {
    id: 'packed' as const,
    label: t('seller.filterPacked'),
    count: sellerOrders.value.filter((o) => o.tone === 'info').length,
  },
]);

const filteredOrders = computed(() => {
  if (orderFilter.value === 'new') return sellerOrders.value.filter((o) => o.tone === 'deal');
  if (orderFilter.value === 'packed') return sellerOrders.value.filter((o) => o.tone === 'info');
  return sellerOrders.value;
});

const filteredListings = computed(() => {
  const q = listingQuery.value.trim().toLowerCase();
  return listings.value.filter((item) => {
    if (listingStatusFilter.value !== 'all' && item.status !== listingStatusFilter.value) return false;
    if (listingCatFilter.value && item.category !== listingCatFilter.value) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.brand || '').toLowerCase().includes(q) ||
      (item.desc || '').toLowerCase().includes(q)
    );
  });
});

const listingStatusTabs = computed(() => [
  { id: 'all' as const, label: t('seller.filterAll'), count: listings.value.length },
  {
    id: 'listed' as const,
    label: t('seller.statusListed'),
    count: listings.value.filter((l) => l.status === 'listed').length,
  },
  {
    id: 'draft' as const,
    label: t('seller.statusDraft'),
    count: listings.value.filter((l) => l.status === 'draft').length,
  },
  {
    id: 'paused' as const,
    label: t('seller.statusPaused'),
    count: listings.value.filter((l) => l.status === 'paused').length,
  },
]);

if (route.query.tab === 'listings') openPanel('listings');
if (route.query.action === 'add') openAddListing();

function statusLabel(status: ListingStatus) {
  if (status === 'draft') return t('seller.statusDraft');
  if (status === 'paused') return t('seller.statusPaused');
  return t('seller.statusListed');
}

function goSetupStep(step: 1 | 2 | 3) {
  if (step > 1 && !setup.name.trim()) return;
  setupStep.value = step;
}

function storefrontPath(item: ShopListing) {
  return `/product/${listingToSlug(item)}`;
}

function onActivate() {
  activate({ name: setup.name, category: setup.category, phone: setup.phone });
  openPanel('dashboard');
  Notify.create({ type: 'positive', message: t('seller.activated'), position: 'top' });
}

function onEdit(id: string) {
  openEditListing(id);
}

function onDuplicate(id: string) {
  const newId = duplicateListing(id);
  Notify.create({ type: 'positive', message: t('seller.duplicated'), position: 'top' });
  if (newId) openEditListing(newId);
}

function onPause(id: string) {
  setListingStatus(id, 'paused');
  Notify.create({ type: 'info', message: t('seller.paused'), position: 'top' });
}

function onPublishItem(id: string) {
  setListingStatus(id, 'listed');
  Notify.create({ type: 'positive', message: t('seller.wentLive'), position: 'top' });
}

function onRemove(id: string) {
  removeListing(id);
}

function orderPayinIcon(method: VendorPayinMethod) {
  const icons: Record<VendorPayinMethod, string> = {
    aba: 'qr_code_2',
    wing: 'phone_android',
    cod: 'local_shipping',
  };
  return icons[method];
}

function onFulfill(id: string) {
  orderStatusOverrides.value[id] = { status: 'Packed', tone: 'info' };
  Notify.create({ type: 'positive', message: t('seller.fulfilled', { id }), position: 'top' });
}

function onShip(id: string) {
  orderStatusOverrides.value[id] = { status: 'Shipped', tone: 'info' };
  Notify.create({ type: 'positive', message: t('seller.shipped', { id }), position: 'top' });
}

function onShare() {
  const path = storeUrl.value || '/vendors';
  void navigator.clipboard?.writeText(`${window.location.origin}${path}`).catch(() => undefined);
  Notify.create({ type: 'positive', message: t('seller.shareReady', { name: shop.name }), position: 'top' });
}

function onSaveProfile() {
  if (!profileDirty.value) return;
  saveProfile(profile);
  Notify.create({ type: 'positive', message: t('seller.settingsSaved'), position: 'top' });
}

function onDeactivate() {
  deactivate();
  setupStep.value = 1;
  setup.name = '';
  setup.phone = '';
  openPanel('dashboard');
  Notify.create({ type: 'info', message: t('seller.deactivated'), position: 'top' });
  void router.replace({ query: {} });
}
</script>
