# Zcomus visual system

The storefront look is ours. Routes, Pinia stores, and mocks stay as they are; class names, colors, type, and layouts do not copy any purchased template.

Source of truth for tokens is `src/css/zcomus.scss` (`:root`). Quasar's equivalents live in `src/css/quasar.variables.scss` and must stay in sync.

## Brand

Three colors only — espresso, ember, warm white. Everything else is a shade of one of them, or a neutral.

| Token | Value | Use | Contrast |
|-------|--------|-----|----------|
| Espresso | `#2D2A27` | All text (`--z-ink`), header strip, hub headers | 13.44:1 — AAA |
| Ember | `#C2410C` | The single accent: links, buttons, badges, deals, prices, ratings | 4.88:1 as text — AA |
| Ember dark | `#9A3412` | Deals, flash countdowns, sale prices, hover states | — |
| Ember darkest | `#7C2D12` | Errors (`--z-danger`), destructive actions | — |
| Ember soft | `#FDECE2` | Badge and alert washes | — |
| Warm white | `#FFF7F0` | Page background (`--z-paper`) | — |
| Warm | `#FDF0E7` | Section washes, image wells | — |
| Surface | `#FFFFFF` | Cards, header, footer | — |
| Muted | `#7A7269` | Secondary text | — |
| Line | `#F0E3D8` | Borders | — |

Emphasis comes from **fill and shade, not extra hues**: solid ember for a primary button, darker ember for urgency, tinted ember with dark ember text for badges, an ember outline for secondary actions. `--z-deal`, `--z-gold`, and `--z-danger` all resolve into the ember family. There is no separate red, green, or amber.

### Bronze

`#A6704D` was the accent until it was measured: **3.92:1 as text, which fails WCAG AA**, while being used as a text color in 68 places. It is now retained only in the logo artwork (`--z-bronze`, `public/brand/*.svg`, the favicons and PWA icons), where decorative marks are exempt from text-contrast rules. Do not use it for type, icons, or borders.

Vendors may still pick their own storefront accent, including a bronze "Clay" cover preset — that is their branding, not the platform's.

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
