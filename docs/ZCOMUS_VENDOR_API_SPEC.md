# Zcomus — Vendor (Seller) API Specification

**Document version:** 1.0  
**Date:** August 2026  
**Audience:** Backend, frontend, and product teams  
**Scope:** Vendor / seller only (Vendor Center + public storefront data owned by vendors)  
**Out of scope:** Customer shopper APIs, Admin / Super Admin APIs  
**Backend stack:** Laravel + **Laravel Breeze** (session auth); vendor APIs under `/api/vendor/...`  
**Base URLs:**  
- Local: `https://zcomus.test`  
- Production: `https://api.zcomus.site`

---

## 1. Purpose

This document lists all APIs required for the **Vendor Center** SPA (`/vendor`) and related public storefront data. Use it as the backend build checklist and sprint plan.

**Status legend**

| Status | Meaning |
|--------|---------|
| **Exists** | Already implemented on Laravel / Breeze backend |
| **Partial** | Exists in Breeze but not SPA/JSON ready |
| **Needed** | Required by Vendor Center; not yet built |
| **Optional** | Nice-to-have / phase 2 |

**Auth assumption:** Session (or token) + `users.role = vendor` (or shop ownership). Suggested prefix: `/api/vendor/...`

---

## 2. Current state (summary)

| Layer | Reality |
|-------|---------|
| Laravel | Only `GET /vendor/dashboard` (Blade stub) + `role=vendor` enum |
| SPA Vendor Center | Full UX: shop, listings, orders, storefront, analytics, pay-in/payout |
| Wire-up | **0** vendor REST calls — all localStorage / mocks |
| Platform fee | Frontend encodes **8%** on delivered orders; must be server truth |

---

## 3. Auth & becoming a vendor

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 1 | POST | `/login` | Guest | **Partial** | Login; must return `role` (incl. `vendor`) |
| 2 | POST | `/logout` | Auth | **Exists** | End session |
| 3 | GET | `/api/user` | Auth | **Needed** | Current user + shop summary if vendor |
| 4 | POST | `/api/vendor/register` | Auth (customer) | **Needed** | Upgrade to vendor / open shop onboarding |
| 5 | GET | `/vendor/dashboard` | Auth + vendor | **Partial** | Blade stub only — SPA uses `/vendor` instead |
| 6 | PUT | `/password` | Auth | **Exists** | Change password (shared) |

### Suggested `GET /api/user` vendor shape

```json
{
  "user": {
    "id": 2,
    "name": "Dara Vendor",
    "email": "vendor@gmail.com",
    "role": "vendor",
    "shop": {
      "id": 10,
      "name": "Phnom Penh Gadgets",
      "slug": "pp-gadgets",
      "active": true,
      "logo": "https://..."
    }
  }
}
```

---

## 4. Shop profile

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 7 | GET | `/api/vendor/shop` | Vendor | **Needed** | Load shop profile |
| 8 | POST | `/api/vendor/shop` | Auth | **Needed** | Activate / create shop `{ name, category, phone }` |
| 9 | PATCH | `/api/vendor/shop` | Vendor | **Needed** | Update settings (name, category, phone, bio) |
| 10 | POST | `/api/vendor/shop/deactivate` | Vendor | **Needed** | Deactivate shop; hide listings |
| 11 | POST | `/api/vendor/shop/reactivate` | Vendor | **Optional** | Re-open deactivated shop |

### Shop fields (settings panel)

`name`, `category`, `phone`, `bio`, `active`, `created_at`

---

## 5. Storefront customization

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 12 | PATCH | `/api/vendor/shop/storefront` | Vendor | **Needed** | Tagline, announcement, address, accent, theme, slug |
| 13 | POST | `/api/vendor/shop/logo` | Vendor | **Needed** | Upload shop logo |
| 14 | POST | `/api/vendor/shop/cover` | Vendor | **Needed** | Upload cover image |
| 15 | DELETE | `/api/vendor/shop/logo` | Vendor | **Optional** | Remove logo |
| 16 | DELETE | `/api/vendor/shop/cover` | Vendor | **Optional** | Remove cover |
| 17 | GET | `/api/vendor/shop/slug-check?slug=` | Vendor | **Needed** | Check slug availability |
| 18 | GET | `/api/vendors/{slug}` | Public | **Needed** | Public storefront page data |
| 19 | GET | `/api/vendors/{slug}/products` | Public | **Needed** | Public products for that shop |

### Storefront fields

`slug`, `tagline`, `announcement`, `bio`, `address`, `phone`, `logo`, `cover`, `accent_color`, `theme` (`classic` \| `minimal` \| `bold`)

---

## 6. Listings (products)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 20 | GET | `/api/vendor/listings` | Vendor | **Needed** | List listings (filter status, category, q) |
| 21 | POST | `/api/vendor/listings` | Vendor | **Needed** | Create listing |
| 22 | GET | `/api/vendor/listings/{id}` | Vendor | **Needed** | Listing detail |
| 23 | PUT | `/api/vendor/listings/{id}` | Vendor | **Needed** | Full update |
| 24 | PATCH | `/api/vendor/listings/{id}` | Vendor | **Needed** | Partial update |
| 25 | PATCH | `/api/vendor/listings/{id}/status` | Vendor | **Needed** | `listed` \| `draft` \| `paused` |
| 26 | POST | `/api/vendor/listings/{id}/duplicate` | Vendor | **Needed** | Duplicate as draft |
| 27 | DELETE | `/api/vendor/listings/{id}` | Vendor | **Needed** | Soft-delete / remove |
| 28 | POST | `/api/vendor/listings/{id}/images` | Vendor | **Needed** | Upload images (max 5) |
| 29 | DELETE | `/api/vendor/listings/{id}/images/{imageId}` | Vendor | **Needed** | Remove one image |
| 30 | PUT | `/api/vendor/listings/{id}/images/order` | Vendor | **Optional** | Reorder gallery |

### Listing payload (aligned with SPA)

```json
{
  "title": "Wireless Earbuds",
  "description": "...",
  "category": "Electronics",
  "price": 29.99,
  "compare_at": 39.99,
  "sku": "EAR-001",
  "stock": 50,
  "status": "listed",
  "badge": "hot",
  "warranty": "6 months",
  "specs": [{ "label": "Battery", "value": "24h" }],
  "colors": ["Black", "White"],
  "styles": [],
  "sizes": [],
  "variants": [
    { "sku": "EAR-001-BLK", "color": "Black", "stock": 20, "price": 29.99 }
  ]
}
```

### Query params for `GET /api/vendor/listings`

| Param | Example | Notes |
|-------|---------|-------|
| `status` | `listed` | listed / draft / paused / all |
| `q` | `earbuds` | Search title/SKU |
| `category` | `Electronics` | Filter |
| `page` | `1` | Pagination |
| `per_page` | `20` | Page size |

---

## 7. Orders & fulfillment

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 31 | GET | `/api/vendor/orders` | Vendor | **Needed** | Vendor order inbox |
| 32 | GET | `/api/vendor/orders/{id}` | Vendor | **Needed** | Detail: buyer, items, pay-in, totals |
| 33 | POST | `/api/vendor/orders/{id}/pack` | Vendor | **Needed** | Mark packed |
| 34 | POST | `/api/vendor/orders/{id}/ship` | Vendor | **Needed** | Mark shipped (+ optional tracking) |
| 35 | GET | `/api/vendor/orders/stats` | Vendor | **Optional** | Counts by status for badges |

### Order status flow (vendor-visible)

`paid` → `packed` → `shipped` → `delivered` (or `cancelled`)

**Note:** Vendors mark **packed** and **shipped**. **Delivered** should be confirmed by platform / courier (unlocks settlement).

### Suggested ship body

```json
{
  "carrier": "J&T",
  "tracking_code": "JT123456789"
}
```

### Order list filters

`status`, `payin` (`aba` \| `wing` \| `cod`), `from`, `to`, `q`, `page`

---

## 8. Dashboard

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 36 | GET | `/api/vendor/dashboard` | Vendor | **Needed** | KPIs, pending packs, setup checklist, recent orders |

### Suggested dashboard response

```json
{
  "kpis": {
    "live_listings": 12,
    "pending_orders": 3,
    "views_30d": 1840,
    "revenue_30d": 920.5
  },
  "setup": {
    "has_listing": true,
    "payment_ready": true,
    "storefront_ready": false,
    "done": 2,
    "total": 3
  },
  "attention_orders": []
}
```

---

## 9. Analytics

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 37 | GET | `/api/vendor/analytics/summary` | Vendor | **Needed** | Views, orders, revenue, conversion, AOV |
| 38 | GET | `/api/vendor/analytics/timeseries` | Vendor | **Needed** | Daily views / sales series |
| 39 | GET | `/api/vendor/analytics/listings` | Vendor | **Needed** | Per-listing performance |
| 40 | GET | `/api/vendor/analytics/categories` | Vendor | **Optional** | Revenue / orders by category |

### Query params

`range=7d|30d|90d` or `from` / `to`

---

## 10. Payment setup — pay-in (what buyers can use)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 41 | GET | `/api/vendor/payment-setup` | Vendor | **Needed** | Full pay-in + payout config |
| 42 | PUT | `/api/vendor/payment-setup/payin` | Vendor | **Needed** | Enable/disable ABA, Wing, COD |

### Pay-in body

```json
{
  "aba": true,
  "wing": true,
  "cod": false
}
```

**Business rule:** Pay-in goes to **Zcomus**, not the vendor’s personal wallet. This only controls which methods appear for this shop at checkout.

---

## 11. Payment setup — payout (how vendor gets paid)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 43 | PUT | `/api/vendor/payment-setup/payout` | Vendor | **Needed** | Save payout destination |
| 44 | POST | `/api/vendor/payment-setup/payout/khqr` | Vendor | **Needed** | Upload ABA KHQR image |
| 45 | DELETE | `/api/vendor/payment-setup/payout/khqr` | Vendor | **Optional** | Remove KHQR image |
| 46 | GET | `/api/vendor/payment-setup/status` | Vendor | **Optional** | Setup completeness flags |

### Payout body

```json
{
  "method": "aba",
  "account_name": "Dara Kim",
  "account_ref": "012345678",
  "bank_name": null
}
```

`method`: `aba` \| `wing` \| `bank`  
For ABA: name + (phone **or** KHQR image) required.

---

## 12. Balances, ledger & settlements (8% fee)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 47 | GET | `/api/vendor/balances` | Vendor | **Needed** | Held / available / fees / next payout |
| 48 | GET | `/api/vendor/ledger` | Vendor | **Needed** | Per-order gross, fee, net, phase |
| 49 | GET | `/api/vendor/settlements` | Vendor | **Needed** | Weekly settlement batches |
| 50 | GET | `/api/vendor/settlements/{id}` | Vendor | **Needed** | Batch detail + line items |
| 51 | — | Internal job | System | **Needed** | Monday settlement runner |

### Platform monetization rules (server must enforce)

| Rule | Value |
|------|-------|
| Platform fee | **8%** of delivered order gross |
| Hold | Funds held until order **delivered** |
| Available | Delivered orders enter available balance (minus fee) |
| Minimum payout | **$10** net; below rolls to next cycle |
| Settlement day | Every **Monday** (prior week delivered) |
| Payout timing | ABA/Wing ~1–2 days; bank ~2–3 days |

### Suggested balances response

```json
{
  "held_gross": 210.0,
  "available_gross": 480.0,
  "fees_accrued": 38.4,
  "net_available": 441.6,
  "min_payout": 10,
  "next_settlement_at": "2026-09-01",
  "fee_rate": 0.08
}
```

### Ledger line

`order_id`, `payin_method`, `phase` (`held` \| `available` \| `paid_out`), `gross`, `platform_fee`, `net`, `delivered_at`

---

## 13. Media / uploads (shared helpers)

| # | Method | Endpoint | Auth | Status | Purpose |
|---|--------|----------|------|--------|---------|
| 52 | POST | `/api/vendor/uploads` | Vendor | **Optional** | Generic signed upload (logo/cover/listing/KHQR) |
| 53 | GET | `/api/vendor/uploads/{id}` | Vendor | **Optional** | Upload status |

Prefer dedicated endpoints in §§5–6 / §11 if simpler for v1.

---

## 14. Priority build order (recommended)

### Phase 1 — Must have (replace localStorage)

1. `GET /api/user` with shop summary + vendor role gate  
2. Shop create / get / patch / deactivate  
3. Listings CRUD + images + status  
4. Vendor orders list + pack / ship  
5. Payment setup (pay-in + payout + KHQR)  
6. Balances + ledger (8% fee)  

### Phase 2 — Storefront & dashboard

7. Storefront patch + logo/cover + slug check  
8. Public `GET /api/vendors/{slug}` (+ products)  
9. Dashboard JSON KPIs + checklist  
10. Settlements list / detail + Monday job  

### Phase 3 — Analytics & polish

11. Analytics summary / timeseries / per-listing  
12. Order stats badges  
13. Duplicate listing, image reorder  
14. Reactivate shop  

---

## 15. Frontend mapping (today)

| Vendor Center panel | Current data source | Target APIs |
|---------------------|---------------------|-------------|
| Onboarding / activate | `useSellerShop` localStorage | §4 Shop |
| Settings | localStorage shop | §4 Shop |
| Storefront | `VendorStorefrontPanel` local | §5 Storefront |
| Listings | localStorage listings | §6 Listings |
| Orders | Demo `buildVendorOrders` + overrides | §7 Orders |
| Dashboard | Computed from local | §8 Dashboard |
| Analytics | Heuristic estimates | §9 Analytics |
| Payouts / payment setup | `useSellerPayout` localStorage | §§10–12 |
| Public `/vendors/:slug` | Merged mock + local shop | §5 Public |

### localStorage stand-ins to retire

| Key | Contents |
|-----|----------|
| `zcomus-account-shop` | Full shop + storefront JSON |
| `zcomus-account-listings` | Listing array (images as data URLs) |
| `zcomus-account-payout` | Flag payout configured |
| `zcomus-account-payout-profile` | Payout destination + KHQR |
| `zcomus-account-payin-setup` | ABA / Wing / COD toggles |
| `zcomus-seller-payout-method` | Draft payout method |
| `zcomus-listing-view` | UI only (grid/list) — may stay client-side |

---

## 16. API conventions

1. **Auth:** **Laravel Breeze** session cookie + `GET /csrf-cookie`; middleware `auth` + `role:vendor` (or shop ownership).  
2. **Envelope:** `{ "message": "OK", "data": { } }`  
3. **Errors:** `{ "message": "...", "errors": { } }` with HTTP 4xx/5xx  
4. **Money:** USD decimals; fee calculated **server-side only**  
5. **Pagination:** `{ data: [], meta: { current_page, last_page, per_page, total } }`  
6. **Media:** Multipart uploads; store URLs (not base64)  
7. **Slug:** Unique across platform; validate on change  
8. **Idempotency:** Pack/ship and settlement jobs must be idempotent  

---

## 17. Out of scope (separate docs)

- Customer shopper APIs (cart, checkout, wishlist, addresses)  
- Admin / Super Admin APIs (platform fees config UI, staff, vendor approval queue)  
- Courier / delivery-partner APIs that mark orders delivered  

---

## 18. Summary count

| Category | Endpoints (approx.) |
|----------|---------------------|
| Auth & become vendor | 6 |
| Shop profile | 5 |
| Storefront + public | 8 |
| Listings | 11 |
| Orders & fulfillment | 5 |
| Dashboard | 1 |
| Analytics | 4 |
| Pay-in / payout setup | 6 |
| Balances / ledger / settlements | 5 |
| Uploads (optional) | 2 |
| **Total listed** | **~53** |

**Already on backend today:** Blade vendor dashboard + shared login (~2 usable for SPA).  
**Still to build:** ~50+ vendor commerce & payout endpoints.

---

*Prepared for Cambrix / Zcomus development team — Vendor API inventory.*
