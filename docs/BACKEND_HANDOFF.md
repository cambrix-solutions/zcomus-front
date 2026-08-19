# Backend handoff — Zcomus storefront API

This document is for **backend developers** working on [`zcomus`](https://github.com/cambrix-solutions/zcomus) (Laravel).

The Quasar storefront lives in **`zcomus-front`**. It currently runs on **mock catalog data** and a **local cart**. Auth can fall back to a demo session when the API is unavailable.

Do **not** expect catalog/cart endpoints to exist yet — that is your work.

---

## Context

| Item | Value |
|------|--------|
| Frontend | Quasar 2 + Vue 3 + Pinia, history mode |
| Dev URL | `http://localhost:9000` |
| Expected API base | `http://127.0.0.1:8000` (override with `VITE_API_URL`) |
| Frontend env | `zcomus-front/.env` → `VITE_API_URL=http://127.0.0.1:8000` |
| Contract source | `zcomus-front/src/helper/apiConfig.ts` |
| Mock shapes | `zcomus-front/src/data/mock-catalog.ts` |
| UI reference | Ecom HTML template **Home 2** (`index-2.html`) — visual only |

**Existing backend (keep):** multi-role auth (`customer` / `vendor` / `support`), admin guard, Google OAuth, Breeze-style JSON login/logout. See `routes/auth.php`, `routes/admin.php`, `routes/google.php`.

**Frontend routes already built:** `/`, `/shop`, `/product/:slug`, `/cart`, `/checkout`, `/login`, `/register`.

---

## CORS & SPA session (required first)

The SPA calls the API with credentials (`withCredentials` + XSRF).

1. Set `FRONTEND_URL=http://localhost:9000` in Laravel `.env`.
2. Configure CORS for that origin with `supports_credentials: true`.
3. Expose CSRF cookie endpoint (Sanctum recommended):
   - `GET /sanctum/csrf-cookie` → `204`
4. Ensure `POST /login`, `POST /register`, `POST /logout` work as **JSON** for the SPA (login already returns JSON; register should too).
5. Add `GET /api/user` → `{ "user": { id, name, email, role } }` for authenticated customers.

Suggested login response (already close):

```json
{
  "message": "Logged in successfully.",
  "user": { "id": 1, "name": "Ada", "email": "ada@example.com", "role": "customer" }
}
```

Suggested register response:

```json
{
  "message": "Registered successfully.",
  "user": { "id": 2, "name": "Ada", "email": "ada@example.com", "role": "customer" }
}
```

---

## Catalog API (priority)

Frontend service: `src/services/catalog.ts` — switch from mocks to these endpoints when ready.

### `GET /api/categories`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Cell Phones",
      "slug": "cell-phones",
      "image": null,
      "products_count": 318
    }
  ]
}
```

### `GET /api/products`

Query params (optional):

| Param | Type | Notes |
|-------|------|--------|
| `category` | string | category slug |
| `q` | string | search name/brand |
| `flash` | bool | `is_flash=true` |
| `trending` | bool | `is_trending=true` |

```json
{
  "data": [
    {
      "id": 1,
      "name": "Apple AirPods Pro with MagSafe Charging Case",
      "slug": "airpods-pro",
      "brand": "Apple",
      "category_id": 5,
      "price": 219.0,
      "compare_at_price": 249.0,
      "image": "https://cdn.example.com/products/airpods.jpg",
      "description": "…",
      "badge": "-12%",
      "is_flash": false,
      "is_trending": true,
      "is_top_selling": true
    }
  ]
}
```

### `GET /api/products/{idOrSlug}`

Resolve by **slug** or **numeric id**.

```json
{
  "data": { /* same product object as above */ }
}
```

### Suggested schema

**`categories`:** `id`, `name`, `slug` (unique), `image` nullable, timestamps.

**`products`:** `id`, `category_id` FK, `name`, `slug` (unique), `brand`, `price` decimal, `compare_at_price` nullable, `image`, `description` text nullable, `badge` nullable, `is_flash` bool, `is_trending` bool, `is_top_selling` bool, timestamps.

Seed enough data for Home 2 sections: flash, trending, top selling, and categories.

---

## Cart API (after catalog)

Frontend cart is Pinia + `localStorage` today. When the API exists, sync from `stores/cart-store.ts`.

| Method | Path | Body | Notes |
|--------|------|------|--------|
| `GET` | `/api/cart` | — | Session or user cart |
| `POST` | `/api/cart` | `{ "product_id": 1, "qty": 1 }` | Add / increment |
| `PUT` | `/api/cart/{productId}` | `{ "qty": 2 }` | Set qty; `0` = remove |
| `DELETE` | `/api/cart/{productId}` | — | Remove line |
| `DELETE` | `/api/cart` | — | Clear |

Example `GET /api/cart` response:

```json
{
  "data": [
    {
      "product_id": 1,
      "qty": 2,
      "product": { /* product object */ }
    }
  ]
}
```

Prefer authenticated customer cart; guest session cart is acceptable for MVP.

---

## Orders / checkout (later)

Checkout UI is a shell. When ready:

- `POST /api/orders` with shipping fields + cart snapshot
- Return order id / status
- Frontend will replace the current “demo place order” notify

Suggested payload shape (flexible):

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "address": "502 New Design Str",
  "city": "Melbourne",
  "phone": "+1 123 456 789",
  "items": [{ "product_id": 1, "qty": 2 }]
}
```

---

## Frontend integration checklist

When APIs are live, frontend will:

1. Point `VITE_API_URL` at the API.
2. Change `src/services/catalog.ts` to call `/api/categories` and `/api/products` (with mock fallback optional).
3. Re-enable cart sync in `src/stores/cart-store.ts`.
4. Prefer real auth from `src/stores/auth-store.ts` (remove demo fallback once stable).

Endpoint map already defined in `src/helper/apiConfig.ts`:

- `login` → `POST /login`
- `register` → `POST /register`
- `logout` → `POST /logout`
- `user` → `GET /api/user`
- `categories` → `GET /api/categories`
- `products` → `GET /api/products`
- `product(id)` → `GET /api/products/:id`
- `cart` / `cartItem(id)` → cart routes above

---

## Out of scope for this handoff

- Wishlist / compare / blog
- Vendor storefront pages
- Admin Quasar dashboard (Laravel admin Blade can stay for now)
- Payment gateway

---

## Suggested implementation order

1. CORS + CSRF + JSON register + `GET /api/user`
2. Categories + products migrations, models, seeders, list/show APIs
3. Cart session/user APIs
4. Orders checkout API
5. Tell frontend to flip from mocks to live API

Questions: align on `FRONTEND_URL`, image storage (local disk vs S3), and whether cart is guest-session or auth-only before building cart.
