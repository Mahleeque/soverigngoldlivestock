# Test Plan — Sovereign Gold Livestock (local, master @ 551bdae)

Env: backend http://localhost:8081/api/v1 (running), frontend http://localhost:5173 (running), mongo docker `sg-mongo` seeded.
Evidence from code: App.tsx routes; Catalog.tsx (filters/sort/pagination, LIMIT=12); AnimalDetail.tsx L151-231 (thumbnails, qty, "Add to cart"/"Reserve 48h"/"Save"); Cart.tsx L53-111; Checkout.tsx L57-125 ("Use saved address", zone fee, coupon, payment options); account/index.tsx; admin/index.tsx L171-275; Header.tsx L137-146 (mobile Menu button, lg:hidden).
API facts verified via curl: SALLAH10 = 10% off, minOrderAmount ₦200,000, max ₦75,000. Zones: Lagos Metro ₦15,000; Abuja ₦40,000; Northern ₦55,000.

## T1 — Home renders live data
Load /. PASS: hero heading visible, category tiles, and a "featured" animal grid with real names/₦ prices matching API (not placeholders/skeletons). No error state.

## T2 — Catalogue filters actually change results
/animals. Record baseline total ("N animals matching your filters").
- Type "goat" in search + submit → total decreases and every visible card is a goat.
- Click category "Rams" → header title becomes "Rams", total changes, cards are rams.
- Set Min price 200000 → all displayed prices ≥ ₦200,000 and total shrinks.
- Sort "Price: low to high" → first card price ≤ last card price; switching to "Price: high to low" reverses first card.
- Clear filters, go to page 2 → different animal names than page 1, URL has page=2.
FAIL if total/cards identical across any of these.

## T3 — Detail page
Open a card. PASS: gallery thumbnail click swaps main image (visibly different photo); specs (weight/age/breed/health) shown; "Related animals" section lists ≥1 other animal, clicking it navigates.

## T4 — Cart
From detail: set qty 2 → "Add to cart" → /cart shows that animal, qty 2, line total = 2×price, summary subtotal matches. Increase to 3 → subtotal updates. Reload page → cart still has item (persistence). Remove → cart empty state shown.

## T5 — Register new customer
/register with unique email → lands authenticated (header shows account). Then sign out and sign in as customer@sovereigngoldlivestock.com / CustomerPass123.

## T6 — Checkout (primary flow)
Cart with subtotal ≥ ₦200,000 (so coupon qualifies).
- "Use saved address" → name/phone/street/city/state populate non-empty.
- Select "Lagos Metro" zone → Delivery row = ₦15,000 and total = subtotal+15,000. Switch to "Northern Nigeria" → Delivery = ₦55,000 and total increases by ₦40,000. FAIL if fee static.
- Enter SALLAH10 → Apply → success toast, Discount row = 10% of subtotal (capped ₦75,000), total drops by that amount.
- Choose "Pay on delivery" → Place order → navigates to /order-confirmed/:id showing order number, correct total (subtotal+fee−discount), and cart badge cleared.

## T7 — Account area
/account/orders shows the order from T6 with matching total. /account/wishlist: after clicking "Save" on a detail page, that animal appears here. /account/reservations shows reservation from T8. /account/addresses lists saved address. /account/notifications loads. Profile: change phone → Save → success toast → reload shows new value persisted.

## T8 — Reserve 48h
Signed-in, on an available animal detail page click "Reserve 48h" → success toast, and /account/reservations lists that animal with an expiry ~48h out.

## T9 — Admin
Sign in as admin. /admin: stat cards show non-zero Revenue/Orders/Customers/Livestock. /admin/inventory: change an animal's status select to "Reserved" → success feedback → reload page → still "Reserved" (persisted). /admin/coupons: create coupon TESTQA5 (percentage, 5, min 1000) → appears in Active coupons list → Delete → disappears after refresh. /admin/delivery: zones list with fees renders.

## T10 — Responsive (390×844-ish)
Resize to mobile width: Header shows Menu button; open it → nav links visible and clicking one navigates and closes menu. Check /animals, /cart, /checkout for horizontal overflow / overlapping text / cut-off buttons.

Throughout: watch browser console for errors (record any).
