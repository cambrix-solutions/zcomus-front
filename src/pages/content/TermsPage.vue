<template>
  <ContentPageShell title="Term and Condition">
    <section class="section-box shop-template mt-30 mb-50">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 mx-auto page-content">
            <h2 class="text-center mb-20">Term and Condition</h2>
            <img class="mb-30 img-fluid" :src="hero" alt="Terms" />
            <p class="font-md color-gray-700 mb-20">
              Thank you for supporting Zcomus. To protect your personal data when you use our
              marketplace services, please read these terms carefully.
            </p>

            <h5>1. Collection of Personal Data</h5>
            <p class="font-md color-gray-700 mb-15">
              <strong>1.1 Definition of personal data.</strong>
              Personal data means any information relating to an identified or identifiable natural
              person, such as a name, identification number, or location data.
            </p>
            <p class="font-md color-gray-700 mb-15">
              <strong>1.2 What we collect.</strong>
              Depending on the products and services you choose, we may collect account details,
              purchase and shipping information, device data, and communications you send to support.
            </p>
            <p class="font-md color-gray-700 mb-20">
              <strong>1.3 Sources.</strong>
              We collect data you provide directly, data from your device when you use our services,
              and limited data from partners when you choose social login.
            </p>

            <h5>2. Cookies and Similar Technologies</h5>
            <p class="font-md color-gray-700 mb-20">
              We use cookies to provide, protect, and improve our products and services — for example
              remembering preferences, measuring ads, understanding usage, and improving security.
              You can reject cookies in your browser settings, which may affect some features.
            </p>

            <h5>3. How We Use Your Data</h5>
            <p class="font-md color-gray-700 mb-20">
              We use personal data to operate your account, process orders, provide customer support,
              improve our marketplace, and communicate important updates about policies and services.
            </p>

            <h5>4. Sharing and Disclosure</h5>
            <p class="font-md color-gray-700 mb-20">
              We may share data with vendors and logistics partners to fulfill orders, with payment
              providers to process transactions, and when required by law or to protect our rights and
              users. We do not sell personal data.
            </p>

            <h5>5. Account Responsibilities</h5>
            <p class="font-md color-gray-700 mb-20">
              You are responsible for keeping login credentials secure and for activity under your
              account. Vendors must provide accurate listings and comply with marketplace policies.
            </p>

            <h5>6. Orders, Payments, and Returns</h5>
            <p class="font-md color-gray-700 mb-20">
              Orders are subject to product availability and seller confirmation. Shipping times vary
              by destination. Returns follow the seller’s policy and our marketplace guidelines for
              eligible items.
            </p>

            <h5>7. Contact</h5>
            <p class="font-md color-gray-700 mb-30">
              Questions about these terms?
              <router-link class="color-brand-2" to="/contact">Contact us</router-link>
              or email support@zcomus.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  </ContentPageShell>
</template>

<script setup lang="ts">
import ContentPageShell from 'components/store/ContentPageShell.vue';
import { ecom } from 'src/helper/ecomAssets';

const hero = ecom('imgs/page/about/team.jpg');
</script>
