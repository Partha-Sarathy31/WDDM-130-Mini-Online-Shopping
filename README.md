# Maple & Co. — Mini Online Store

WDDM130 — Project 1 submission. A client-side-only mini online store built with plain HTML, CSS, and JavaScript — no frameworks, no backend, no database.

**Live site:** add your GitHub Pages link here
**Repository:** add your repo link here

## Features

- 10 products rendered dynamically from a JavaScript data array — nothing hard-coded in the HTML
- Live shopping cart that updates instantly as quantities change, with subtotal, 13% HST, and total
- Customer checkout form with full validation:
  - Full name required
  - Email must contain "@" and "."
  - Phone number must contain exactly 10 digits
  - Postal code must match Canadian format (e.g. A1A 1A1)
  - Cart cannot be empty
- Validation errors shown directly on the page (no `alert()` popups)
- Printed-receipt-style confirmation on successful checkout, with a receipt number, date/time, customer summary, itemized list, and totals
- "Start a new order" button to reset the cart and form after checkout

## Bonus features

- **Search & sort** — filter products by name, and sort by price (low–high, high–low) or name (A–Z)
- **Promo codes** — enter `MAPLE10` or `WELCOME15` at checkout for a percentage discount on the subtotal
- **Stock limits** — each product has a fixed stock count; quantity inputs are capped so you can't add more to the cart than what's in stock

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and semantic markup |
| `css/style.css` | Styling, layout, and the receipt's printed-paper look |
| `js/script.js` | Product data, cart logic, validation, and receipt generation |

## Running locally

No build step needed — just open `index.html` directly in a browser.

## Deploying with GitHub Pages

1. Push this repo to GitHub (already done if you're reading this here).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then **Save**.
5. Refresh the Pages settings page after a minute for your live URL.

## Known limitation

Stock and order state live only in memory for the current browser session — there's no backend or database, so refreshing the page resets all stock counts back to their starting values. This is expected for a client-side-only project.
