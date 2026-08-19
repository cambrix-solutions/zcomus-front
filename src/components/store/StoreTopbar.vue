<template>
  <div class="topbar">
    <div class="container-topbar">
      <div class="menu-topbar-left d-none d-xl-block">
        <ul class="nav-small">
          <li><router-link class="font-xs" to="/about">About Us</router-link></li>
          <li><router-link class="font-xs" to="/careers">Careers</router-link></li>
          <li><router-link class="font-xs" to="/register">Open a shop</router-link></li>
        </ul>
      </div>
      <div class="info-topbar text-center d-none d-xl-block">
        <span class="font-xs color-brand-3">Free shipping in Cambodia for orders over</span>
        <span class="font-sm-bold color-success"> $75.00</span>
      </div>
      <div class="menu-topbar-right">
        <span class="font-xs color-brand-3">Need help? Call Us:</span>
        <span class="font-sm-bold color-success"> (+855) 23 555 0100</span>
        <div class="dropdown-right font-xs color-brand-3">English</div>
        <div class="dropdown-right font-xs color-brand-3">USD</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
