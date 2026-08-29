import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/StoreLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/HomePage.vue'),
        meta: { titleKey: 'seo.home.title', descKey: 'seo.home.desc' },
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import('pages/shop/ShopPage.vue'),
        meta: { titleKey: 'seo.shop.title', descKey: 'seo.shop.desc' },
      },
      {
        path: 'product/:slug',
        name: 'product',
        component: () => import('pages/shop/ProductPage.vue'),
        meta: { titleKey: 'seo.product.title', descKey: 'seo.product.desc', ogType: 'product' },
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('pages/cart/CartPage.vue'),
        meta: { titleKey: 'seo.cart.title', descKey: 'seo.cart.desc', noindex: true },
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('pages/cart/CheckoutPage.vue'),
        meta: { titleKey: 'seo.checkout.title', descKey: 'seo.checkout.desc', noindex: true },
      },
      {
        path: 'wishlist',
        name: 'wishlist',
        component: () => import('pages/shop/WishlistPage.vue'),
        meta: { titleKey: 'seo.wishlist.title', descKey: 'seo.wishlist.desc', noindex: true },
      },
      {
        path: 'compare',
        name: 'compare',
        component: () => import('pages/shop/ComparePage.vue'),
        meta: { titleKey: 'seo.compare.title', descKey: 'seo.compare.desc', noindex: true },
      },
      {
        path: 'vendors',
        name: 'vendors',
        component: () => import('pages/vendors/VendorListPage.vue'),
        meta: { titleKey: 'seo.vendors.title', descKey: 'seo.vendors.desc' },
      },
      {
        path: 'vendors/:slug',
        name: 'vendor',
        component: () => import('pages/vendors/VendorSinglePage.vue'),
        meta: { titleKey: 'seo.vendor.title', descKey: 'seo.vendor.desc' },
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { titleKey: 'seo.login.title', descKey: 'seo.login.desc', noindex: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
        meta: { titleKey: 'seo.register.title', descKey: 'seo.register.desc', noindex: true },
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('pages/account/AccountPage.vue'),
        meta: { titleKey: 'seo.account.title', descKey: 'seo.account.desc', noindex: true },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('pages/content/AboutPage.vue'),
        meta: { titleKey: 'seo.about.title', descKey: 'seo.about.desc' },
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('pages/content/ContactPage.vue'),
        meta: { titleKey: 'seo.contact.title', descKey: 'seo.contact.desc' },
      },
      {
        path: 'careers',
        name: 'careers',
        component: () => import('pages/content/CareersPage.vue'),
        meta: { titleKey: 'seo.careers.title', descKey: 'seo.careers.desc' },
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import('pages/content/TermsPage.vue'),
        meta: { titleKey: 'seo.terms.title', descKey: 'seo.terms.desc' },
      },
      {
        path: 'blog',
        name: 'blog',
        component: () => import('pages/blog/BlogListPage.vue'),
        meta: { titleKey: 'seo.blog.title', descKey: 'seo.blog.desc' },
      },
      {
        path: 'blog/:slug',
        name: 'blog-single',
        component: () => import('pages/blog/BlogSinglePage.vue'),
        meta: { titleKey: 'seo.blogSingle.title', descKey: 'seo.blogSingle.desc', ogType: 'article' },
      },
      {
        path: ':catchAll(.*)*',
        name: 'not-found',
        component: () => import('pages/ErrorNotFound.vue'),
        meta: { titleKey: 'seo.notFound.title', descKey: 'seo.notFound.desc', noindex: true },
      },
    ],
  },
  {
    path: '/vendor',
    component: () => import('layouts/SellerLayout.vue'),
    meta: { titleKey: 'seo.vendorCenter.title', descKey: 'seo.vendorCenter.desc', noindex: true },
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
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      titleKey: 'seo.admin.title',
      descKey: 'seo.admin.desc',
      noindex: true,
    },
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
