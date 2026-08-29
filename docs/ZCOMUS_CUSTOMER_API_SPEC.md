# Zcomus — Customer (Shopper) API Specification

**Document version:** 1.3  
**Date:** August 2026  
**Audience:** Backend, frontend, and product teams  
**Scope:** Customer / shopper user only (not Vendor Center, not Admin Hub)  
**Backend stack:** Laravel + **Laravel Breeze** (session auth)  
**Base URLs:**  
- Local: `https://zcomus.test`  
- Production: `https://api.zcomus.site`

> **v1.3 adds:** DB table columns (required vs optional) + JSON request/response fields for each API.  

---

## 1. Purpose

This document lists all APIs required for the **customer (shopper)** experience in the Zcomus SPA (`zcomus-front`). Use it as the backend build checklist and for sprint planning.

**Auth note:** Customer login, register, logout, password reset, and email verification use **Laravel Breeze** (session cookies). The Quasar SPA calls these routes with `credentials: include`. Call `GET /csrf-cookie` first so Laravel sets the `XSRF-TOKEN` cookie before `POST /login` / `POST /register`.

**Status legend**

| Status | Meaning |
|--------|---------|
| **Exists** | Already implemented on Laravel / Breeze backend |
| **Partial** | Exists in Breeze but needs JSON/SPA adjustments |
| **Needed** | Required by frontend flows; not yet built |
| **Optional** | Nice-to-have / phase 2 |

---

## 2. Auth & session (Laravel Breeze)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 1 | GET | `/csrf-cookie` | Public | **Needed** | Start web session + set `XSRF-TOKEN` for SPA (Breeze/web middleware) |
| 2 | POST | `/login` | Guest | **Exists** | Breeze login → JSON `{ message, user }` |
| 3 | POST | `/register` | Guest | **Partial** | Breeze register; must return JSON user (today redirects) |
| 4 | POST | `/logout` | Auth | **Exists** | Breeze logout — end session |
| 5 | GET | `/api/user` | Auth | **Needed** | Current authenticated customer profile |
| 6 | PUT | `/password` | Auth | **Exists** | Breeze change password |
| 7 | POST | `/forgot-password` | Guest | **Exists** | Breeze send password reset link |
| 8 | POST | `/reset-password` | Guest | **Exists** | Breeze complete password reset |
| 9 | GET | `/customer/auth/google` | Guest | **Exists** | Start Google OAuth |
| 10 | GET | `/customer/auth/google/callback` | Guest | **Exists** | OAuth callback → session + redirect to SPA |
| 11 | POST | `/email/verification-notification` | Auth | **Exists** | Breeze resend email verification |
| 12 | GET | `/verify-email/{id}/{hash}` | Auth | **Exists** | Breeze verify email address |

### Suggested request / response notes

**POST `/login`**

```json
{ "email": "user@gmail.com", "password": "secret" }
```

**Response**

```json
{
  "message": "OK",
  "user": {
    "id": 1,
    "name": "Sophea Chan",
    "email": "user@gmail.com",
    "role": "customer",
    "email_verified_at": "2026-08-01T00:00:00Z"
  }
}
```

**GET `/api/user`** — same `user` shape as above.

---

## 3. Profile & account preferences

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 13 | GET | `/api/user` | Auth | **Needed** | Load profile (shared with §2) |
| 14 | PUT | `/api/profile` | Auth | **Needed** | Update name, email, phone |
| 15 | DELETE | `/api/profile` | Auth | **Optional** | Delete / deactivate account |
| 16 | GET | `/api/account/notification-preferences` | Auth | **Needed** | Order, deal, SMS/Telegram alert flags |
| 17 | PUT | `/api/account/notification-preferences` | Auth | **Needed** | Save alert preferences |
| 18 | GET | `/api/account/payment-preferences` | Auth | **Optional** | Preferred checkout method (COD / ABA / Wing / KHQR) |
| 19 | PUT | `/api/account/payment-preferences` | Auth | **Optional** | Save preferred payment method |

---

## 4. Catalog (browse)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 20 | GET | `/api/categories` | Public | **Needed** | Category tree / list |
| 21 | GET | `/api/products` | Public | **Needed** | Product list (filters: category, search, sort, page) |
| 22 | GET | `/api/products/{id}` | Public | **Needed** | Product detail by id |
| 23 | GET | `/api/products/by-slug/{slug}` | Public | **Optional** | Product detail by slug (SPA uses slug routes) |
| 24 | GET | `/api/vendors` | Public | **Needed** | Public vendor directory |
| 25 | GET | `/api/vendors/{slug}` | Public | **Needed** | Public vendor storefront + products |

### Query params for `GET /api/products`

| Param | Example | Notes |
|-------|---------|-------|
| `q` | `phone` | Search |
| `category` | `electronics` | Filter |
| `vendor` | `pp-gadgets` | Filter by shop |
| `sort` | `price_asc` | Sorting |
| `page` | `1` | Pagination |
| `per_page` | `24` | Page size |

---

## 5. Cart

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 26 | GET | `/api/cart` | Guest or Auth | **Needed** | Get current cart |
| 27 | POST | `/api/cart` | Guest or Auth | **Needed** | Add item `{ product_id, qty }` |
| 28 | PATCH | `/api/cart/{productId}` | Guest or Auth | **Needed** | Update quantity |
| 29 | DELETE | `/api/cart/{productId}` | Guest or Auth | **Needed** | Remove one item |
| 30 | DELETE | `/api/cart` | Guest or Auth | **Needed** | Clear cart |
| 31 | POST | `/api/cart/merge` | Auth | **Optional** | Merge guest cart into user cart after login |

---

## 6. Checkout, coupons & payments

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 32 | POST | `/api/coupons/validate` | Guest or Auth | **Needed** | Validate coupon / voucher code |
| 33 | POST | `/api/checkout` | Auth* | **Needed** | Place order (items, address, shipping, pay method) |
| 34 | POST | `/api/payments/initiate` | Auth | **Needed** | Start ABA / Wing / KHQR payment for an order |
| 35 | GET | `/api/payments/{id}/status` | Auth | **Needed** | Poll payment status |
| 36 | POST | `/api/payments/webhook/{provider}` | Server | **Needed** | Provider callback (ABA / Wing / etc.) |

\*Guest checkout may be **Optional** later.

### Suggested `POST /api/checkout` body

```json
{
  "address_id": 12,
  "shipping_method": "standard",
  "payment_method": "aba",
  "coupon_code": "SAVE10",
  "notes": ""
}
```

### Payment methods (customer-facing)

| Code | Label |
|------|-------|
| `cod` | Cash on delivery |
| `aba` | ABA Pay / transfer |
| `wing` | Wing Money |
| `khqr` | KHQR scan |

---

## 7. Orders, tracking & support

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 37 | GET | `/api/orders` | Auth | **Needed** | Customer order list |
| 38 | GET | `/api/orders/{id}` | Auth | **Needed** | Order detail (items, status, totals, fee display N/A to customer) |
| 39 | GET | `/api/orders/{id}/tracking` | Auth | **Needed** | Tracking timeline / courier status |
| 40 | GET | `/api/tracking/{code}` | Auth or Public | **Optional** | Track by order code without full account context |
| 41 | POST | `/api/orders/{id}/reorder` | Auth | **Needed** | Re-add order items to cart |
| 42 | POST | `/api/orders/{id}/issues` | Auth | **Needed** | Report issue / open support ticket |

### Order status values (customer-visible)

`placed` → `paid` → `packed` → `shipped` → `delivered` (or `cancelled`)

---

## 8. Wishlist

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 43 | GET | `/api/wishlist` | Auth | **Needed** | List saved products |
| 44 | POST | `/api/wishlist` | Auth | **Needed** | Add `{ product_id }` |
| 45 | DELETE | `/api/wishlist/{productId}` | Auth | **Needed** | Remove product |
| 46 | DELETE | `/api/wishlist` | Auth | **Optional** | Clear wishlist |

---

## 9. Addresses

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 47 | GET | `/api/addresses` | Auth | **Needed** | List saved addresses |
| 48 | POST | `/api/addresses` | Auth | **Needed** | Create address |
| 49 | PUT | `/api/addresses/{id}` | Auth | **Needed** | Update address |
| 50 | DELETE | `/api/addresses/{id}` | Auth | **Needed** | Delete address |
| 51 | PUT | `/api/addresses/{id}/default` | Auth | **Needed** | Set default shipping address |

### Address fields

`label`, `full_name`, `phone`, `line1`, `line2`, `city`, `province`, `postal_code`, `country` (default KH), `is_default`

---

## 10. Vouchers

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 52 | GET | `/api/vouchers` | Auth | **Needed** | Customer’s available / used vouchers |
| 53 | POST | `/api/vouchers/claim` | Auth | **Optional** | Claim a public promo code into wallet |
| 54 | POST | `/api/coupons/validate` | Guest or Auth | **Needed** | Shared with checkout (§6) |

---

## 11. Notifications

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 55 | GET | `/api/notifications` | Auth | **Needed** | Inbox (orders, deals, system) |
| 56 | POST | `/api/notifications/{id}/read` | Auth | **Needed** | Mark one as read |
| 57 | POST | `/api/notifications/read-all` | Auth | **Optional** | Mark all as read |
| 58 | DELETE | `/api/notifications/{id}` | Auth | **Optional** | Dismiss notification |

---

## 12. Followed shops

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 59 | GET | `/api/followed-shops` | Auth | **Needed** | List followed vendors |
| 60 | POST | `/api/followed-shops` | Auth | **Needed** | Follow `{ vendor_id }` |
| 61 | DELETE | `/api/followed-shops/{vendorId}` | Auth | **Needed** | Unfollow |

---

## 13. Recently viewed (Account page)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 62 | GET | `/api/recently-viewed` | Auth | **Optional** | Products customer recently opened |
| 63 | POST | `/api/recently-viewed` | Auth | **Optional** | Record view `{ product_id }` |

*(Can stay client-side localStorage in phase 1.)*

---

## 14. Priority build order (recommended)

### Phase 1 — Must have (SPA can leave mocks)

1. Laravel Breeze JSON login/register/logout + `GET /csrf-cookie` + `GET /api/user`
2. Categories + products (+ by slug)
3. Cart CRUD
4. Checkout + order create
5. Orders list + detail + tracking
6. Addresses CRUD

### Phase 2 — Account polish

7. Wishlist  
8. Vouchers + coupon validate  
9. Notifications  
10. Followed shops  
11. Profile update + notification preferences  
12. Payment initiate / status / webhooks  

### Phase 3 — Nice to have

13. Guest checkout + cart merge  
14. Google login wired in SPA  
15. Forgot/reset password UI  
16. Recently viewed sync  
17. Account payment preferences  

---

## 15. Frontend mapping (what uses what today)

| SPA area | Current data source | Target APIs |
|----------|---------------------|-------------|
| Login / Register | `auth-store` → Breeze `/login`, `/register` | §2 Auth (Breeze) |
| Account profile | Notify-only save | §3 |
| Shop / Home / Product | Mock catalog fallback | §4 |
| Cart | `localStorage` | §5 |
| Checkout | Demo place-order | §6 |
| Orders / tracking | Hardcoded in Account | §7 |
| Wishlist | `localStorage` | §8 |
| Addresses | Hardcoded + local default | §9 |
| Vouchers | Hardcoded | §10 |
| Notifications | Hardcoded | §11 |
| Followed shops | Mock vendors slice | §12 |

---

## 16. Conventions for all customer APIs

1. **Auth:** **Laravel Breeze** session cookie + `GET /csrf-cookie` for SPA (`credentials: include`, send `X-XSRF-TOKEN`).  
2. **Role:** Customer endpoints require `users.role = customer` (or allow any authenticated shopper).  
3. **Envelope (suggested):**

```json
{
  "message": "OK",
  "data": { }
}
```

4. **Errors:** HTTP 4xx/5xx with `{ "message": "...", "errors": { } }` validation shape.  
5. **Money:** USD decimals in API; format in UI.  
6. **Pagination:** `{ data: [], meta: { current_page, last_page, per_page, total } }`.  
7. **CORS:** Allow SPA origin (`localhost:9000` / production front domain) with credentials.

---

## 17. Out of scope (separate docs)

- Vendor Center APIs (listings, payouts, vendor orders)  
- Admin / Super Admin APIs (fees, staff, platform metrics)  
- Platform monetization ledger (8% fee settlement)

---

## 18. Summary count

| Category | Endpoints (approx.) |
|----------|---------------------|
| Auth & session | 12 |
| Profile & preferences | 7 |
| Catalog & vendors | 6 |
| Cart | 6 |
| Checkout & payments | 5 |
| Orders & support | 6 |
| Wishlist | 4 |
| Addresses | 5 |
| Vouchers | 3 |
| Notifications | 4 |
| Followed shops | 3 |
| Recently viewed | 2 |
| **Total listed** | **~63** |

**Already on backend today:** Laravel Breeze auth/password/email verify + Google OAuth (~10).  
**Still to build for customers:** ~50+ commerce & account endpoints.

---

## 19. Database tables — required columns

Legend: **R** = required · **O** = optional · **FK** = foreign key

### 19.1 `users` (exists — extend for SPA)

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `name` | string | R | |
| `email` | string unique | R | |
| `password` | string nullable | O | Null for Google users |
| `google_id` | string nullable unique | O | |
| `phone` | string nullable | O | **Add** for profile/checkout |
| `role` | enum | R | `customer` \| `vendor` \| `support` |
| `email_verified_at` | timestamp nullable | O | |
| `preferred_payment` | enum nullable | O | `cod` \| `aba` \| `wing` \| `khqr` |
| `alert_order` | boolean | O | default true |
| `alert_deal` | boolean | O | default true |
| `alert_sms` | boolean | O | default false |
| `remember_token` | string | O | |
| `created_at` / `updated_at` | timestamps | R | |

### 19.2 `categories`

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `name` | string | R | |
| `slug` | string unique | R | |
| `image` | string nullable | O | URL |
| `sort_order` | int | O | default 0 |
| `is_active` | boolean | R | default true |
| `created_at` / `updated_at` | timestamps | R | |

### 19.3 `shops` (public vendor storefront)

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `user_id` | FK → users | R | Vendor owner |
| `name` | string | R | |
| `slug` | string unique | R | |
| `logo` | string nullable | O | |
| `cover` | string nullable | O | |
| `industry` | string nullable | O | |
| `description` | text nullable | O | |
| `tagline` | string nullable | O | |
| `address` | string nullable | O | |
| `phone` | string nullable | O | |
| `accent_color` | string nullable | O | |
| `theme` | enum | O | `classic` \| `minimal` \| `bold` |
| `announcement` | string nullable | O | |
| `is_active` | boolean | R | |
| `created_at` / `updated_at` | timestamps | R | |

### 19.4 `products`

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `shop_id` | FK → shops | R | |
| `category_id` | FK → categories | R | |
| `name` | string | R | |
| `slug` | string unique | R | |
| `brand` | string | R | |
| `price` | decimal(10,2) | R | USD |
| `compare_at_price` | decimal(10,2) nullable | O | |
| `image` | string | R | Primary image URL |
| `images` | json nullable | O | Gallery URLs |
| `description` | text nullable | O | |
| `short_description` | string nullable | O | |
| `sku` | string nullable | O | |
| `stock` | int | R | default 0 |
| `badge` | string nullable | O | e.g. hot / new |
| `warranty` | string nullable | O | |
| `specs` | json/text nullable | O | |
| `colors` / `styles` / `sizes` | json nullable | O | |
| `status` | enum | R | `listed` \| `draft` \| `paused` |
| `is_flash` | boolean | O | |
| `is_trending` | boolean | O | |
| `is_top_selling` | boolean | O | |
| `created_at` / `updated_at` | timestamps | R | |

### 19.5 `product_variants` (optional if simple SKUs)

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `product_id` | FK | R | |
| `sku` | string | R | |
| `color` / `style` / `size` | string nullable | O | |
| `stock` | int | R | |
| `price` | decimal nullable | O | Override product price |
| `created_at` / `updated_at` | timestamps | R | |

### 19.6 `carts` + `cart_items`

**`carts`**

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `user_id` | FK nullable | O | Null = guest |
| `session_id` | string nullable | O | Guest cart key |
| `created_at` / `updated_at` | timestamps | R |

**`cart_items`**

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `cart_id` | FK | R |
| `product_id` | FK | R |
| `variant_id` | FK nullable | O |
| `qty` | int | R | min 1 |
| `unit_price` | decimal(10,2) | R | Snapshot at add time |
| `created_at` / `updated_at` | timestamps | R |

### 19.7 `addresses`

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `user_id` | FK | R | |
| `label` | string | R | Shipping / Billing / Home |
| `full_name` | string | R | |
| `phone` | string | R | |
| `line1` | string | R | |
| `line2` | string nullable | O | |
| `city` | string | R | |
| `province` | string nullable | O | |
| `postal_code` | string nullable | O | |
| `country` | string | R | default `KH` |
| `is_default` | boolean | R | default false |
| `created_at` / `updated_at` | timestamps | R | |

### 19.8 `orders` + `order_items`

**`orders`**

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `order_code` | string unique | R | Public tracking code e.g. `ZC-1001` |
| `user_id` | FK | R | |
| `shop_id` | FK | R | Primary vendor (split orders later) |
| `address_id` | FK nullable | O | Snapshot preferred |
| `shipping_name` | string | R | Snapshot |
| `shipping_phone` | string | R | Snapshot |
| `shipping_line1` | string | R | Snapshot |
| `shipping_city` | string | R | Snapshot |
| `status` | enum | R | see §7 |
| `payment_method` | enum | R | `cod` \| `aba` \| `wing` \| `khqr` |
| `payment_status` | enum | R | `pending` \| `paid` \| `failed` \| `refunded` |
| `subtotal` | decimal(10,2) | R | |
| `shipping_fee` | decimal(10,2) | R | |
| `discount` | decimal(10,2) | R | default 0 |
| `total` | decimal(10,2) | R | |
| `coupon_code` | string nullable | O | |
| `notes` | text nullable | O | |
| `tracking_code` | string nullable | O | Courier |
| `carrier` | string nullable | O | |
| `placed_at` | timestamp | R | |
| `paid_at` / `packed_at` / `shipped_at` / `delivered_at` | timestamp nullable | O | |
| `created_at` / `updated_at` | timestamps | R | |

**`order_items`**

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `order_id` | FK | R |
| `product_id` | FK | R |
| `product_name` | string | R | Snapshot |
| `product_image` | string | R | Snapshot |
| `sku` | string nullable | O |
| `qty` | int | R |
| `unit_price` | decimal(10,2) | R |
| `line_total` | decimal(10,2) | R |
| `created_at` / `updated_at` | timestamps | R |

### 19.9 `order_tracking_events`

| Column | Type | Req | Notes |
|--------|------|-----|-------|
| `id` | bigint PK | R | |
| `order_id` | FK | R | |
| `status` | string | R | Matches order status step |
| `label` | string | R | Human text |
| `happened_at` | timestamp | R | |
| `created_at` / `updated_at` | timestamps | R | |

### 19.10 `payments`

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `order_id` | FK | R |
| `provider` | enum | R | `aba` \| `wing` \| `khqr` \| `cod` |
| `amount` | decimal(10,2) | R |
| `status` | enum | R | `pending` \| `paid` \| `failed` |
| `provider_ref` | string nullable | O |
| `raw_payload` | json nullable | O |
| `created_at` / `updated_at` | timestamps | R |

### 19.11 `wishlists`

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `user_id` | FK | R |
| `product_id` | FK | R |
| `created_at` / `updated_at` | timestamps | R |
| unique(`user_id`,`product_id`) | | R |

### 19.12 `coupons` + `user_vouchers`

**`coupons`**

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `code` | string unique | R |
| `title` | string | R |
| `type` | enum | R | `percent` \| `fixed` \| `shipping` |
| `value` | decimal(10,2) | R |
| `min_order` | decimal nullable | O |
| `starts_at` / `ends_at` | timestamp | R |
| `is_active` | boolean | R |

**`user_vouchers`**

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `user_id` | FK | R |
| `coupon_id` | FK | R |
| `used_at` | timestamp nullable | O |
| `created_at` / `updated_at` | timestamps | R |

### 19.13 `notifications`

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `user_id` | FK | R |
| `title` | string | R |
| `body` | text | R |
| `tone` | enum | O | `info` \| `deal` \| `success` \| `warn` |
| `icon` | string nullable | O |
| `read_at` | timestamp nullable | O |
| `created_at` / `updated_at` | timestamps | R |

### 19.14 `followed_shops`

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `user_id` | FK | R |
| `shop_id` | FK | R |
| `created_at` / `updated_at` | timestamps | R |
| unique(`user_id`,`shop_id`) | | R |

### 19.15 `order_issues`

| Column | Type | Req |
|--------|------|-----|
| `id` | bigint PK | R |
| `order_id` | FK | R |
| `user_id` | FK | R |
| `message` | text | R |
| `status` | enum | R | `open` \| `queued` \| `closed` |
| `created_at` / `updated_at` | timestamps | R |

---

## 20. JSON contracts — request / response columns

Envelope for most resources:

```json
{ "message": "OK", "data": { } }
```

List endpoints:

```json
{
  "message": "OK",
  "data": [ ],
  "meta": { "current_page": 1, "last_page": 5, "per_page": 24, "total": 110 }
}
```

### 20.1 Auth — `user` object (returned by login / register / GET `/api/user`)

| Field | Type | Always |
|-------|------|--------|
| `id` | number | yes |
| `name` | string | yes |
| `email` | string | yes |
| `role` | string | yes |
| `phone` | string\|null | yes |
| `email_verified_at` | string\|null | yes |
| `preferred_payment` | string\|null | yes |
| `shop` | object\|null | if vendor |

**POST `/login` request (R):** `email`, `password`  
**POST `/register` request (R):** `name`, `email`, `password`, `password_confirmation`  
**PUT `/password` request (R):** `current_password`, `password`, `password_confirmation`

### 20.2 Profile

**PUT `/api/profile` request**

| Field | Req |
|-------|-----|
| `name` | R |
| `email` | R |
| `phone` | O |

**Response `data`:** same as `user` object (§20.1)

**PUT `/api/account/notification-preferences` request (all R):**  
`alert_order`, `alert_deal`, `alert_sms` (boolean)

**Response `data`:**

```json
{ "alert_order": true, "alert_deal": true, "alert_sms": false }
```

**PUT `/api/account/payment-preferences` request (R):** `preferred_payment`  
**Response `data`:** `{ "preferred_payment": "aba" }`

### 20.3 Categories — GET `/api/categories`

Each item in `data[]`:

| Field | Type | Always |
|-------|------|--------|
| `id` | number | yes |
| `name` | string | yes |
| `slug` | string | yes |
| `image` | string\|null | yes |
| `products_count` | number | yes |

### 20.4 Products — list & detail

**List item / card columns (GET `/api/products` → `data[]`):**

| Field | Type | Always | Notes |
|-------|------|--------|-------|
| `id` | number | yes | |
| `name` | string | yes | |
| `slug` | string | yes | |
| `brand` | string | yes | |
| `category_id` | number | yes | |
| `price` | number | yes | |
| `compare_at_price` | number\|null | yes | |
| `image` | string | yes | |
| `badge` | string\|null | yes | |
| `stock` | number | yes | |
| `vendor_name` | string | yes | |
| `vendor_slug` | string | yes | |
| `is_flash` | boolean | yes | |
| `is_trending` | boolean | yes | |
| `is_top_selling` | boolean | yes | |

**Detail extras (GET `/api/products/{id}` or by-slug):**

| Field | Type | Always |
|-------|------|--------|
| `images` | string[] | yes |
| `description` | string\|null | yes |
| `short_description` | string\|null | yes |
| `sku` | string\|null | yes |
| `warranty` | string\|null | yes |
| `specs` | array\|string\|null | yes |
| `colors` | string[] | yes |
| `styles` | string[] | yes |
| `sizes` | string[] | yes |
| `variants` | array | yes |
| `vendor_bio` | string\|null | yes |

**Variant object columns:** `key`, `color`, `style`, `size`, `stock`, `price` (nullable)

### 20.5 Vendors — GET `/api/vendors` & `/api/vendors/{slug}`

| Field | Type | Always |
|-------|------|--------|
| `id` | number | yes |
| `slug` | string | yes |
| `name` | string | yes |
| `logo` | string\|null | yes |
| `cover` | string\|null | yes |
| `products` | number | yes | Count |
| `reviews` | number | yes | |
| `member_since` | number | yes | Year |
| `address` | string\|null | yes |
| `phone` | string\|null | yes |
| `industry` | string\|null | yes |
| `description` | string\|null | yes |
| `tagline` | string\|null | yes |
| `accent_color` | string\|null | yes |
| `theme` | string | yes |
| `announcement` | string\|null | yes |

Detail may also include `products_preview` (array of product list cards).

### 20.6 Cart — GET `/api/cart`

```json
{
  "message": "OK",
  "data": {
    "id": 1,
    "items": [
      {
        "id": 10,
        "product_id": 5,
        "name": "Wireless Earbuds",
        "slug": "wireless-earbuds",
        "image": "https://...",
        "qty": 2,
        "unit_price": 29.99,
        "line_total": 59.98,
        "stock": 50,
        "vendor_name": "PP Gadgets",
        "vendor_slug": "pp-gadgets"
      }
    ],
    "items_count": 2,
    "subtotal": 59.98
  }
}
```

**POST `/api/cart` request (R):** `product_id`, `qty` · **O:** `variant_id`  
**PATCH `/api/cart/{productId}` request (R):** `qty`

### 20.7 Coupons — POST `/api/coupons/validate`

**Request (R):** `code` · **O:** `subtotal`  
**Response `data`:**

| Field | Type |
|-------|------|
| `valid` | boolean |
| `code` | string |
| `title` | string |
| `type` | `percent` \| `fixed` \| `shipping` |
| `value` | number |
| `discount_amount` | number |
| `message` | string |

### 20.8 Checkout — POST `/api/checkout`

**Request**

| Field | Req |
|-------|-----|
| `address_id` | R |
| `payment_method` | R |
| `shipping_method` | O | default `standard` |
| `coupon_code` | O |
| `notes` | O |

**Response `data`:**

| Field | Type |
|-------|------|
| `id` | number |
| `order_code` | string |
| `status` | string |
| `payment_method` | string |
| `payment_status` | string |
| `subtotal` | number |
| `shipping_fee` | number |
| `discount` | number |
| `total` | number |
| `payment` | object\|null | If online: `{ id, status, pay_url? }` |

### 20.9 Payments

**POST `/api/payments/initiate` request (R):** `order_id`  
**Response `data`:** `id`, `order_id`, `provider`, `amount`, `status`, `pay_url` (nullable), `qr_payload` (nullable)

**GET `/api/payments/{id}/status` → `data`:** `id`, `status`, `provider_ref`, `paid_at`

### 20.10 Orders — list & detail

**GET `/api/orders` → `data[]`:**

| Field | Type | Always |
|-------|------|--------|
| `id` | number | yes |
| `order_code` | string | yes |
| `date` | string | yes | Display date |
| `status` | string | yes |
| `total` | number | yes |
| `payment_method` | string | yes |
| `vendor_name` | string | yes |
| `items_count` | number | yes |
| `thumbnail` | string\|null | yes | First item image |

**GET `/api/orders/{id}` → `data`:** all list fields plus:

| Field | Type |
|-------|------|
| `subtotal` | number |
| `shipping_fee` | number |
| `discount` | number |
| `notes` | string\|null |
| `shipping` | object | `full_name`, `phone`, `line1`, `line2`, `city`, `province`, `postal_code`, `country` |
| `items` | array | see below |
| `tracking` | array | optional inline |

**Order item columns:** `id`, `product_id`, `name`, `image`, `sku`, `qty`, `unit_price`, `line_total`

### 20.11 Tracking — GET `/api/orders/{id}/tracking`

**Response `data`:**

```json
{
  "order_code": "ZC-1001",
  "status": "shipped",
  "carrier": "J&T",
  "tracking_code": "JT123",
  "events": [
    { "status": "placed", "label": "Order placed", "happened_at": "2026-08-12T10:00:00Z" },
    { "status": "paid", "label": "Payment confirmed", "happened_at": "2026-08-12T10:05:00Z" },
    { "status": "packed", "label": "Packed", "happened_at": "2026-08-12T16:00:00Z" },
    { "status": "shipped", "label": "Out for delivery", "happened_at": "2026-08-13T09:00:00Z" }
  ]
}
```

### 20.12 Support — POST `/api/orders/{id}/issues`

**Request (R):** `message`  
**Response `data`:** `id`, `order_id`, `status`, `message`, `created_at`

### 20.13 Wishlist — GET `/api/wishlist`

`data[]` = **product list card** columns (§20.4).  
**POST request (R):** `product_id`

### 20.14 Addresses

**Request create/update**

| Field | Req |
|-------|-----|
| `label` | R |
| `full_name` | R |
| `phone` | R |
| `line1` | R |
| `line2` | O |
| `city` | R |
| `province` | O |
| `postal_code` | O |
| `country` | O | default `KH` |
| `is_default` | O |

**Response item columns:** `id` + all request fields + `created_at`

### 20.15 Vouchers — GET `/api/vouchers`

| Field | Type | Always |
|-------|------|--------|
| `id` | number | yes |
| `title` | string | yes |
| `code` | string | yes |
| `type` | string | yes | `OFF` / `SHIP` / `percent` / `fixed` |
| `value` | string\|number | yes | Display value |
| `rule` | string | yes |
| `expires` | string | yes | Date |
| `used` | boolean | yes |

### 20.16 Notifications — GET `/api/notifications`

| Field | Type | Always |
|-------|------|--------|
| `id` | number | yes |
| `title` | string | yes |
| `body` | string | yes |
| `tone` | string | yes |
| `icon` | string\|null | yes |
| `time` | string | yes | Relative or ISO |
| `read_at` | string\|null | yes |

### 20.17 Followed shops — GET `/api/followed-shops`

`data[]` = vendor list columns (§20.5) at least:  
`id`, `slug`, `name`, `logo`, `products`, `industry`

**POST request (R):** `shop_id` (or `vendor_id`)

### 20.18 Recently viewed

**POST request (R):** `product_id`  
**GET `data[]`:** product list card columns (§20.4)

---

## 21. Validation error JSON (all write APIs)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "qty": ["The qty must be at least 1."]
  }
}
```

HTTP **422** for validation · **401** unauthenticated · **403** wrong role · **404** missing resource.

---

*Prepared for Cambrix / Zcomus development team — Customer API inventory (Laravel Breeze).*
