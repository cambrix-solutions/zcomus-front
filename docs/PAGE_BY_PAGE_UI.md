# Page-by-page UI improvement

**Approach:** Improve one page at a time against the Ecom LTR template. Ship each page until it looks/feels close, then move on.

**Market:** Cambodia only (copy, addresses, phones, shipping, country selectors).

**Homepage:** Home 2 only (`/`). Other home variants removed.

## Order

| # | Page | Template reference | Status |
|---|------|--------------------|--------|
| 1 | Home (`/`) | `index-2.html` | Done |
| 2 | Shop (`/shop`) | `shop-fullwidth.html` | Done — polished (featured, promo, chips, filters) |
| 3 | Product detail (`/product/:slug`) | `shop-single-product.html` | Done — single PDP (layout demos removed) |
| 4 | Cart (`/cart`) | `shop-cart.html` | Done |
| 5 | Checkout (`/checkout`) | `shop-checkout.html` | Done |
| 6 | Login / Register | `page-login.html` / `page-register.html` | Done |
| 7 | Account (`/account`) | `page-account.html` | Done |
| 8 | Wishlist / Compare | `shop-wishlist.html` / `shop-compare.html` | Done — Ecom table layouts, suggestions, features strip |
| 9 | Vendors (`/vendors`, `/vendors/:slug`) | list + single as full shop | Done — vendor detail reuses shop features |
| 10 | Blog / content / 404 | matching HTML pages | About / Contact / Careers / Terms done; Blog + 404 pending |
| 11 | Admin | dashboard pack | Pending |

## Rules per page

- Match Ecom section order, spacing, and class names where possible
- Keep Quasar only for app logic (Notify, router); avoid Quasar layout chrome on storefront
- Use mocks until Laravel APIs are ready
- Do not reintroduce extra home layouts
