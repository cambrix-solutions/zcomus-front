# Zcomus Platform — Monetization & Money Flow Plan

**Document version:** 1.0  
**Date:** August 2026  
**Prepared for:** Cambrix / Zcomus development team  
**Status:** Baseline plan (subscription tier details to be added in a future revision)

---

## 1. Executive summary

Zcomus is a **marketplace platform**. Customers pay **Zcomus** (not vendors directly). Zcomus holds funds until orders are delivered, retains a **platform fee**, and pays vendors their **net earnings** on a weekly settlement cycle.

**Primary revenue (baseline):** **8% commission** on delivered order totals.

**Subscription tiers:** To be defined in a follow-up document.

---

## 2. Roles & money flow

| Party | Role |
|-------|------|
| **Customer (shopper)** | Pays Zcomus at checkout via ABA KHQR, Wing, or COD |
| **Vendor (seller)** | Lists products, fulfills orders, receives net payouts |
| **Zcomus (platform / developer)** | Collects pay-in, holds escrow, takes platform fee, settles vendors |

### High-level flow

```
Customer pays → Zcomus merchant account → Funds held → Order delivered
    → Platform fee (8%) retained → Vendor net paid weekly
```

### Detailed lifecycle

1. **Pay-in** — Shopper pays Zcomus at checkout (ABA, Wing, or COD).
2. **Hold** — Funds stay in platform escrow until delivery is confirmed.
3. **Deliver** — Vendor ships; order marked delivered.
4. **Settle** — Every Monday, delivered orders from the past week are batched.
5. **Payout** — Net amount (gross minus 8% fee) sent to vendor’s ABA KHQR / phone / Wing / bank.

**Minimum payout:** $10 (balances below this roll to the next cycle).

**Payout timing:** 1–3 business days after settlement, depending on method.

---

## 3. How the platform developer earns

### 3.1 Core model: commission on GMV

```
Platform revenue = Delivered order total × 8%
Vendor net       = Delivered order total × 92%
```

**Example — $100 delivered order**

| Item | Amount |
|------|--------|
| Customer pays Zcomus | $100.00 |
| Platform fee (8%) — **your revenue** | **$8.00** |
| Vendor receives | $92.00 |

### 3.2 Revenue scaling

```
Monthly platform revenue ≈ Monthly delivered GMV × 8%
```

| Monthly delivered GMV | Platform revenue (8%) |
|----------------------|------------------------|
| $10,000 | $800 |
| $50,000 | $4,000 |
| $100,000 | $8,000 |

*Before payment gateway fees, refunds, chargebacks, and operating costs.*

### 3.3 What is NOT platform revenue

- Money in transit to vendors (92% owed on delivered orders)
- Undelivered / cancelled order amounts (until policy defines otherwise)
- COD not yet confirmed by driver

Platform earnings must be tracked in a **separate ledger account** from vendor payable balances.

---

## 4. Pay-in methods (customer → Zcomus)

| Method | Description | Integration (production) |
|--------|-------------|-------------------------|
| **ABA KHQR / Pay** | QR scan or ABA transfer at checkout | ABA PayWay / Bakong API |
| **Wing Money** | Wallet transfer from buyer | Wing merchant API |
| **Cash on delivery (COD)** | Driver collects cash; platform settles vendor after confirmed delivery | Driver / ops confirmation |
| **Cards** | Visa / Mastercard (future) | Payment gateway |

Vendors choose which pay-in methods to offer in **Vendor Center → Payment setup → Accept payments**.

---

## 5. Payout methods (Zcomus → vendor)

| Method | Vendor provides | Platform action |
|--------|-----------------|---------------|
| **ABA** | Account name + phone **or uploaded KHQR image** | ABA transfer API or ops scan KHQR |
| **Wing** | Account name + Wing phone | Wing payout API |
| **Bank** | Bank name + account number | Batch bank transfer |

**ABA KHQR upload:** Vendors can upload their KHQR from ABA Mobile so settlements can be sent to the correct receive address.

---

## 6. Vendor payment setup (3 steps)

1. **Accept payments** — Enable ABA, Wing, COD for checkout.
2. **Payout account** — Enter wallet/bank details; upload ABA KHQR if applicable.
3. **Review & save** — Confirm and store payout profile.

Order fulfillment progress (vendor side): **Paid → Packed → Shipped → Delivered**.

---

## 7. Technical implementation phases

### Phase 1 — Current (frontend demo)

- Vendor UI: pay-in toggles, payout profile, KHQR upload
- Demo balances and 8% fee calculation
- Local storage only (no real money movement)

### Phase 2 — Pay-in integration

- Zcomus merchant accounts (ABA business, Wing merchant)
- Checkout API: create payment / dynamic QR per order
- Webhooks: `payment.confirmed` → mark order paid, credit vendor ledger as **held**

**Suggested APIs**

- `POST /checkout/pay` — initiate pay-in
- `POST /webhooks/aba` — payment confirmation
- `POST /webhooks/wing` — payment confirmation

### Phase 3 — Ledger & escrow

- `vendor_balances`: pending, available, paid_out
- `payment_events`: pay-in, fee, release, payout
- On delivery: move pending → available (deduct 8% platform fee)
- COD: release only after driver confirms collection

### Phase 4 — Automated payout

- Weekly cron (Monday): vendors with available ≥ $10
- Read payout profile (KHQR / phone / bank)
- Execute transfer; record payout ID; mark ledger paid_out
- Notify vendor in Vendor Center

**Suggested APIs**

- `POST /vendor/payout-profile`
- `GET /vendor/balance`
- `POST /admin/payouts/run`
- `GET /vendor/payouts`

### Phase 5 — Admin & reconciliation

- Dashboard: GMV, platform fees earned, payouts owed/sent
- Failed payout retry queue
- Optional: KHQR decode validation vs account name

---

## 8. Additional revenue opportunities (future)

| Model | Description |
|-------|-------------|
| **Featured listings** | Vendors pay to boost visibility on homepage / search |
| **Vendor subscription** | Pro tier — details in separate document |
| **Listing fee** | One-time fee per published product |
| **COD handling fee** | Surcharge on cash-on-delivery orders |
| **Payment markup** | Recover ABA/Wing gateway costs within or on top of 8% |

---

## 9. Policy summary (vendor-facing)

- Customers pay **Zcomus**, not the vendor directly (buyer protection).
- Pay-in is **held** until delivery is confirmed.
- **8% platform fee** applies to delivered order totals at settlement.
- **Weekly settlements** every Monday; **$10 minimum** payout.
- Payout processing: 1–3 business days after settlement.

---

## 10. Subscription model

**To be added** — vendor subscription tiers, pricing, and benefits will be documented in **Zcomus Platform — Subscription Plan (v1.1)**.

---

## 11. Appendix — Key constants (current app)

| Constant | Value |
|----------|-------|
| Platform fee rate | 8% (`PLATFORM_FEE_RATE = 0.08`) |
| Minimum payout | $10 |
| Settlement day | Monday (weekly) |
| Demo storage keys | `zcomus-account-payout-profile`, `zcomus-account-payin-setup` |

---

*© Cambrix / Zcomus — Internal planning document. Not a legal or financial contract.*
