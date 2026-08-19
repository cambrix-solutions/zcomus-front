<template>
  <footer class="footer">
    <div class="footer-1">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 width-25 mb-30">
            <h4 class="mb-30 color-gray-1000">Contact</h4>
            <div class="font-md mb-20 color-gray-900">
              <strong class="font-md-bold">Address:</strong>
              #12, St. 168, Sangkat Veal Vong, Khan 7 Makara, Phnom Penh, Cambodia
            </div>
            <div class="font-md mb-20 color-gray-900">
              <strong class="font-md-bold">Phone:</strong> (+855) 23 555 0100
            </div>
            <div class="font-md mb-20 color-gray-900">
              <strong class="font-md-bold">E-mail:</strong> contact@zcomus.com
            </div>
            <div class="font-md mb-20 color-gray-900">
              <strong class="font-md-bold">Hours:</strong> 8:00 - 17:00, Mon - Sat
            </div>
          </div>
          <div class="col-lg-3 width-20 mb-30">
            <h4 class="mb-30 color-gray-1000">Make Money with Us</h4>
            <ul class="menu-footer">
              <li><router-link to="/about">Mission &amp; Vision</router-link></li>
              <li><router-link to="/register">Open a shop</router-link></li>
              <li><router-link to="/careers">Careers</router-link></li>
              <li><router-link to="/vendors">Become a vendor</router-link></li>
            </ul>
          </div>
          <div class="col-lg-3 width-16 mb-30">
            <h4 class="mb-30 color-gray-1000">Company</h4>
            <ul class="menu-footer">
              <li><router-link to="/about">About Us</router-link></li>
              <li><router-link to="/blog">Our Blog</router-link></li>
              <li><router-link to="/terms">Terms</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
            </ul>
          </div>
          <div class="col-lg-3 width-16 mb-30">
            <h4 class="mb-30 color-gray-1000">My account</h4>
            <ul class="menu-footer">
              <li><router-link to="/login">Sign in</router-link></li>
              <li><router-link to="/account">My Account</router-link></li>
              <li><router-link to="/cart">View cart</router-link></li>
              <li><router-link to="/wishlist">Wishlist</router-link></li>
              <li><router-link to="/shop">Shop</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 col-md-6 text-center text-md-start">
            <span class="color-gray-500 font-sm">
              © {{ year }} Zcomus Marketplace. All rights reserved.
            </span>
          </div>
          <div class="col-lg-6 col-md-6 text-center text-md-end">
            <img
              :src="ecom('imgs/template/payment-method.png')"
              alt="Payment"
              class="d-inline-block"
              style="max-height: 28px"
              @error="onPayErr"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ecom } from 'src/helper/ecomAssets';

const year = new Date().getFullYear();

function onPayErr(e: Event) {
  const el = e.target as HTMLImageElement;
  el.style.display = 'none';
}
</script>
