<template>
  <div class="ecom-store">
    <StoreTopbar />
    <StoreHeader />
    <CategorySidebar />
    <main class="main">
      <router-view />
    </main>
    <StoreFooter />
    <QuickviewModal />
  </div>
</template>

<script setup lang="ts">
import StoreTopbar from 'components/store/StoreTopbar.vue';
import StoreHeader from 'components/store/StoreHeader.vue';
import StoreFooter from 'components/store/StoreFooter.vue';
import CategorySidebar from 'components/store/CategorySidebar.vue';
import QuickviewModal from 'components/store/QuickviewModal.vue';
</script>

<style>
/* Bypass Quasar layout so Ecom CSS controls stacking / clicks */
.ecom-store {
  min-height: 100vh;
  background: #fff;
  position: relative;
  overflow-x: hidden;
}

.ecom-store .header {
  float: none !important;
  position: relative;
  z-index: 1100;
  background: #fff;
}

.ecom-store .topbar {
  position: relative;
  z-index: 1101;
  background: #fff;
}

/* Prevent shop icons from covering nav links when widths overflow */
.ecom-store .header .main-header .header-left {
  flex-wrap: nowrap;
  gap: 8px;
}

.ecom-store .header .main-header .header-left .header-logo {
  flex: 0 0 auto;
  max-width: 140px;
}

.ecom-store .header .main-header .header-left .header-search {
  flex: 1 1 280px;
  width: auto !important;
  max-width: 420px;
  min-width: 180px;
}

.ecom-store .header .main-header .header-left .header-nav {
  flex: 1 1 auto;
  width: auto !important;
  text-align: center;
  position: relative;
  z-index: 2;
}

.ecom-store .header .main-header .header-left .header-shop {
  flex: 0 0 auto;
  width: auto !important;
  min-width: 0;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

.ecom-store .header .main-menu li a {
  pointer-events: auto;
  cursor: pointer;
}

.ecom-store .header .main-menu li ul {
  pointer-events: auto;
}

.ecom-store .sidebar-left {
  z-index: 1050;
}

.ecom-store .main {
  position: relative;
  z-index: 1;
  min-height: 50vh;
}

/* Give home content a bit of breathing room from the icon rail */
.ecom-store .home-2 .banner-hero .container,
.ecom-store .home-2 .section-box > .container {
  padding-left: max(15px, env(safe-area-inset-left));
}
</style>
