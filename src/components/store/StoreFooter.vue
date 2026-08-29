<template>
  <footer class="z-footer">
    <div class="z-container">
      <div class="z-footer__cta">
        <div>
          <h3>Sell on Zcomus</h3>
          <p>Reach shoppers across Cambodia — open your shop in minutes.</p>
        </div>
        <router-link class="z-btn z-btn-deal" to="/vendor">{{ t('footer.openShop') }}</router-link>
      </div>

      <div class="z-footer__grid">
        <div>
          <div class="z-footer__brand">
            <router-link class="z-logo" to="/">
              <span class="z-logo__mark">Z</span>
              <span class="z-logo__text">{{ t('brand') }}</span>
            </router-link>
          </div>
          <p><strong>{{ t('footer.address') }}:</strong> {{ t('footer.addressValue') }}</p>
          <p style="margin-top: 8px"><strong>{{ t('footer.phone') }}:</strong> (+855) 23 555 0100</p>
          <p style="margin-top: 8px"><strong>{{ t('footer.email') }}:</strong> contact@zcomus.com</p>
          <p style="margin-top: 8px"><strong>{{ t('footer.hours') }}:</strong> {{ t('footer.hoursValue') }}</p>
        </div>
        <div>
          <h4>{{ t('footer.earn') }}</h4>
          <ul>
            <li><router-link to="/about">{{ t('footer.mission') }}</router-link></li>
            <li><router-link to="/vendor">{{ t('footer.openShop') }}</router-link></li>
            <li><router-link to="/careers">{{ t('footer.careers') }}</router-link></li>
            <li><router-link to="/vendors">{{ t('footer.becomeVendor') }}</router-link></li>
          </ul>
        </div>
        <div>
          <h4>{{ t('footer.company') }}</h4>
          <ul>
            <li><router-link to="/about">{{ t('nav.about') }}</router-link></li>
            <li><router-link to="/blog">{{ t('nav.blog') }}</router-link></li>
            <li><router-link to="/terms">{{ t('footer.terms') }}</router-link></li>
            <li><router-link to="/contact">{{ t('nav.contact') }}</router-link></li>
          </ul>
        </div>
        <div>
          <h4>{{ t('footer.account') }}</h4>
          <ul>
            <li><router-link to="/login">{{ t('nav.login') }}</router-link></li>
            <li><router-link to="/account">{{ t('nav.account') }}</router-link></li>
            <li><router-link to="/cart">{{ t('footer.viewCart') }}</router-link></li>
            <li><router-link to="/wishlist">{{ t('nav.wishlist') }}</router-link></li>
            <li><router-link to="/shop">{{ t('nav.shop') }}</router-link></li>
          </ul>
        </div>
      </div>
      <div class="z-footer__bottom">
        <span>© {{ year }} {{ t('footer.rights') }}</span>
        <div class="z-pay">
          <span>KHQR</span>
          <span>ABA</span>
          <span>Wing</span>
          <span>COD</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const year = new Date().getFullYear();
</script>
