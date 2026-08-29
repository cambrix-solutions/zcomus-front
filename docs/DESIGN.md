# Zcomus visual system

The storefront look is ours. Routes, Pinia stores, and mocks stay as they are; class names, colors, type, and layouts do not copy any purchased template.

Source of truth for tokens is `src/css/zcomus.scss` (`:root`). Quasar's equivalents live in `src/css/quasar.variables.scss` and must stay in sync.

## Brand

Three colors only — bronze, cream, espresso. Everything else is derived.

| Token | Value | Use |
|-------|--------|-----|
| Bronze | `#A6704D` | Primary actions, links, badges, deals, ratings |
| Bronze dark | `#8C5740` | Hover / pressed states, gradient ends |
| Cream | `#F9F7F2` | Page background (`--z-paper`) |
| Espresso | `#2D2A27` | Text (`--z-ink`), hub headers |
| Warm | `#F1EBE3` | Section washes, alternating bands |
| Surface | `#FFFFFF` | Cards, header, footer |
| Muted | `#75706A` | Secondary text |
| Line | `#E8E4DC` | Borders |
| Danger | `#8B3A2F` | Destructive actions and errors only |

Deal, gold, and primary all resolve to bronze — flash and discount treatments are separated by weight and layout, not by hue. There is no separate red or green accent in the storefront palette.

## Type

Two families, swapped by locale in `src/stores/prefs-store.ts` via the `--z-font` variable:

- **English** — `'Plus Jakarta Sans', 'Kantumruy Pro', sans-serif`
- **Khmer** — `'Kantumruy Pro', 'Plus Jakarta Sans', sans-serif`

Both are loaded in `index.html` at weights 400–800. Roboto is disabled in `quasar.config.ts`; do not reintroduce it or Kanit.

## Layout

- Sticky header: wordmark, search, account / wishlist / cart
- Trust bar: free shipping in Cambodia, hotline
- Categories as chips (drawer on phone) — no left icon rail
- Product grid: 2 columns on phone, 4–5 on desktop
- Price is the loudest element on a card
- USD primary, KHR secondary (display rate 4100); the header toggle is display-only
- EN / ខ្មែរ via vue-i18n

## Surfaces

| Area | Prefix | Stylesheet |
|------|--------|------------|
| Storefront | `z-` | `zcomus.scss` |
| Vendor Center | `z-vhub` | `vendor-hub.scss` (+ per-page vendor sheets) |
| Admin Center | `z-ahub` | `admin-hub.scss` |

Vendor and admin hubs share the storefront tokens; only their header gradients differ (bronze for vendor, espresso for admin).

## Rules

- All storefront classes start with `z-`
- Quasar for Notify, icons, and dialogs — not for layout chrome
- Placeholder product photos still come from `/ecom/assets` via `src/helper/ecomAssets.ts`
- Cambodia only: copy, addresses, phones, shipping, and payment labels (KHQR / ABA / Wing / COD)
- Mocks until the Laravel APIs in `ZCOMUS_CUSTOMER_API_SPEC.md` and `ZCOMUS_VENDOR_API_SPEC.md` are live
