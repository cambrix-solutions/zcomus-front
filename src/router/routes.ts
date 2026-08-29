import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/StoreLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'shop', name: 'shop', component: () => import('pages/shop/ShopPage.vue') },
      {
        path: 'product/:slug',
        name: 'product',
        component: () => import('pages/shop/ProductPage.vue'),
      },
      { path: 'cart', name: 'cart', component: () => import('pages/cart/CartPage.vue') },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('pages/cart/CheckoutPage.vue'),
      },
      {
        path: 'wishlist',
        name: 'wishlist',
        component: () => import('pages/shop/WishlistPage.vue'),
      },
      {
        path: 'compare',
        name: 'compare',
        component: () => import('pages/shop/ComparePage.vue'),
      },
      {
        path: 'vendors',
        name: 'vendors',
        component: () => import('pages/vendors/VendorListPage.vue'),
      },
      {
        path: 'vendors/:slug',
        name: 'vendor',
        component: () => import('pages/vendors/VendorSinglePage.vue'),
      },
      { path: 'login', name: 'login', component: () => import('pages/auth/LoginPage.vue') },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('pages/account/AccountPage.vue'),
      },
      { path: 'about', name: 'about', component: () => import('pages/content/AboutPage.vue') },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('pages/content/ContactPage.vue'),
      },
      {
        path: 'careers',
        name: 'careers',
        component: () => import('pages/content/CareersPage.vue'),
      },
      { path: 'terms', name: 'terms', component: () => import('pages/content/TermsPage.vue') },
      {
        path: 'blog',
        name: 'blog',
        component: () => import('pages/blog/BlogListPage.vue'),
      },
      {
        path: 'blog/:slug',
        name: 'blog-single',
        component: () => import('pages/blog/BlogSinglePage.vue'),
      },
      {
        path: ':catchAll(.*)*',
        name: 'not-found',
        component: () => import('pages/ErrorNotFound.vue'),
      },
    ],
  },
  {
    path: '/vendor',
    component: () => import('layouts/SellerLayout.vue'),
    children: [
      {
        path: '',
        name: 'vendor-center',
        component: () => import('pages/seller/SellerCenterPage.vue'),
      },
    ],
  },
  {
    path: '/seller',
    redirect: '/vendor',
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'super_admin'] },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('pages/admin/AdminDashboardPage.vue'),
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navProducts' },
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navCategories' },
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navOrders' },
      },
      {
        path: 'sellers',
        name: 'admin-sellers',
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navVendors' },
      },
      {
        path: 'transactions',
        name: 'admin-transactions',
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navTransactions' },
      },
      {
        path: 'users',
        name: 'admin-users',
        meta: { roles: ['super_admin'] },
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navUsers' },
      },
      {
        path: 'fees',
        name: 'admin-fees',
        meta: { roles: ['super_admin'] },
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navFees' },
      },
      {
        path: 'settings',
        name: 'admin-settings',
        meta: { roles: ['super_admin'] },
        component: () => import('pages/admin/AdminSectionPage.vue'),
        props: { titleKey: 'admin.navSettings' },
      },
    ],
  },
];

export default routes;
