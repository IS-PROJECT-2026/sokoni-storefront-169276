# Sokoni Storefront

A small e-commerce storefront — browse a catalogue, build a cart that survives a
refresh, and check out with validated delivery details. Built as a static site
with no framework, no build step and no external requests.

**Live site:** https://is-project-2026.github.io/sokoni-storefront-169276/

---

## What it does

**Catalogue** — twelve products across five categories, rendered from a data
module rather than hand-written markup. Live search matches product names,
descriptions and categories; results can be filtered by category and sorted by
price, rating or name. Stock levels drive "sold out" and "only n left" badges
automatically, and a product detail dialog opens without leaving the page.

**Cart** — quantities can be stepped, typed directly, or removed, and every
change is clamped to the stock actually available. The cart is stored in
`localStorage`, so closing the tab does not lose it. Delivery is free over
KES 20,000, and below that the summary shows exactly how much more is needed.

**Checkout** — delivery details are validated on blur rather than on every
keystroke, a failed submit moves focus to the first invalid field, and reaching
checkout with an empty cart shows a guard instead of a submittable form.
Placing an order clears the cart and issues a reference number.

No payment is taken and nothing is transmitted — the entire system runs in the
browser.

## Technologies used

| Technology | Role |
|---|---|
| **HTML5** | Semantic document structure; native `<dialog>` for the product modal |
| **CSS3** | Custom properties for the token layer, Grid and Flexbox for layout, container-relative units for responsiveness |
| **JavaScript (ES2020)** | Catalogue rendering, cart state, filtering, sorting and form validation — no framework |
| **Web Storage API** | `localStorage` cart persistence |
| **`Intl.NumberFormat`** | KES currency formatting via the platform rather than a library |
| **Git & GitHub** | Feature-branch workflow, protected `main`, pull requests, milestones and issues |
| **GitHub Pages** | Static hosting, deployed from `main` |

## How it is put together

```
index.html          Catalogue: search, filter, sort, product dialog
cart.html           Cart: line items, quantities, order summary
checkout.html       Checkout: delivery form, order review, confirmation
assets/css/main.css Design tokens and every component style
assets/js/
  data.js           Product catalogue and derived category list
  store.js          Cart state, persistence and stock rules
  pricing.js        Delivery threshold and fee, shared by cart and checkout
  ui.js             Money formatting, product artwork, toasts, cart badge
  catalogue.js      Grid rendering, search, filtering, sorting, dialog
  cart.js           Cart page behaviour
  checkout.js       Checkout validation and confirmation
```

Three decisions worth calling out:

- **The cart is the only shared state**, so it lives behind one module with a
  subscribe model. Pages listen for changes instead of reading the array
  directly, which is what stops the header badge and the page body disagreeing.
- **Stored cart data is validated on load, not trusted.** Unknown product ids
  and nonsense quantities are dropped, so a cart written by an older version of
  the catalogue cannot break rendering.
- **Product artwork is inline SVG**, not fetched images. The site makes zero
  external requests, renders identically offline, and cannot break because a CDN
  went away.

## Running it locally

There is no build step. Clone the repository and open `index.html`, or serve the
folder to exercise it over HTTP:

```bash
git clone https://github.com/IS-PROJECT-2026/sokoni-storefront-169276.git
cd sokoni-storefront-169276
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deployment

GitHub Pages serves the repository root of `main`. `index.html` sits at that
root, which is what Pages looks for as the entry point — nesting it in a
subfolder is the usual cause of a 404 on this setup.

## Project workflow

Development ran through three milestones — catalogue foundation, cart and
checkout, then discovery and release — broken into issues and delivered on
feature branches named after the issue they close (`feat/3-product-grid`,
`fix/13-...`, `style/10-responsive-layout`). `main` is protected: every change
arrived through a pull request, and no commit was pushed to it directly.

## Author

**Sharon Mugure Kariuki** — Admission No. 169276 — ICS 4D
Strathmore University
