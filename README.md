# Sokoni Storefront

A small online shop you can browse, add things to a cart, and check out from.
Sokoni is Swahili for "at the market". It sells audio, computing, wearables,
power and home gear.

**Live site:** https://is-project-2026.github.io/sokoni-storefront-169276/



## What it does

The catalogue holds twelve products. You can search them, filter by category
and sort by price, rating or name. Clicking Details opens a dialog with a
bigger photo. Stock levels come from the data, so the "sold out" and "only n
left" labels look after themselves.

The cart keeps quantities within whatever stock is left, and saves itself to
`localStorage`, so closing the tab doesn't lose it. Delivery is free over
KES 20,000 and the summary tells you how much more you need to get there.

Checkout asks for delivery details and checks them when you leave each field
rather than on every keystroke. If you submit with something wrong, it jumps to
the first bad field. Landing on checkout with an empty cart shows a message
instead of a form you could submit. Placing an order clears the cart and gives
you a reference number.

Nothing is charged and nothing is sent anywhere. It all runs in the browser.

## Technologies used

| What | Why it's here |
|---|---|
| HTML5 | Page structure, and the native `<dialog>` for the product popup |
| CSS3 | Custom properties for colour and spacing, Grid and Flexbox for layout |
| JavaScript (ES2020) | Rendering, cart state, filtering, sorting, form checks |
| `localStorage` | Keeping the cart between visits |
| `Intl.NumberFormat` | Formatting shillings, so I didn't need a library |
| Git and GitHub | Branches, pull requests, issues, milestones, protected `main` |
| GitHub Pages | Hosting, served from `main` |

## Files

```
index.html          Catalogue: search, filter, sort, product dialog
cart.html           Cart: line items, quantities, order summary
checkout.html       Checkout: delivery form, order review, confirmation
assets/css/main.css All the styling
assets/images/products/   Product photos, plus CREDITS.md
assets/js/
  data.js           The products, and the category list built from them
  store.js          Cart state, saving, and the stock rules
  pricing.js        Delivery threshold and fee
  ui.js             Money formatting, product images, toasts, cart badge
  catalogue.js      Grid, search, filter, sort, dialog
  cart.js           Cart page
  checkout.js       Checkout and confirmation
```

## A few decisions

**The cart lives in one place.** It is the only state shared across pages, so
`store.js` owns it and pages subscribe to changes instead of reading the array.
Before I did that, the header badge and the cart page could disagree after an
update.

**Saved cart data gets checked before it's used.** Anything in `localStorage`
could be old or edited by hand, so on load I drop product ids that no longer
exist and quantities that make no sense. Otherwise a cart saved against an
older catalogue can break the page.

**Delivery pricing sits in its own file.** I first wrote the threshold and the
fee separately in `cart.js` and `checkout.js`. Two copies of the same rule
means the total could differ between the two screens, which just looks broken,
so I pulled it into `pricing.js`.

**Photos are committed, not linked.** They're in the repo rather than loaded
from somewhere else, so the site works offline and won't break if some other
site disappears. If an image fails anyway, the tile falls back to a coloured
block with the product name on it.

## Product photos

The photos come from Wikimedia Commons. I cropped each one square and made two
sizes: 400px for the cards and 800px for the dialog. Wide items like the
keyboard are padded rather than cropped, because cropping cut the ends off.

Licences are CC BY, CC BY-SA and public domain, and each file is credited in
[`assets/images/products/CREDITS.md`](assets/images/products/CREDITS.md).

## Running it

No build step. Clone it and open `index.html`, or serve the folder:

```bash
git clone https://github.com/IS-PROJECT-2026/sokoni-storefront-169276.git
cd sokoni-storefront-169276
python -m http.server 8000
```

Then go to http://localhost:8000.

## Deployment

Pages serves the root of `main`, and `index.html` is at that root. Putting it
in a subfolder is what usually causes a 404 here.

## How I worked

Four milestones: getting the catalogue on screen, cart and checkout, search and
release, then the visual rework and real photos. Each one was split into issues,
and every issue got its own branch named after it, like `feat/3-product-grid` or
`style/40-market-look`.

`main` is protected and rejects direct pushes, so everything went through a pull
request. Commit types used so far are `feat`, `fix`, `docs`, `style` and
`refactor`.

## Author

Sharon Mugure Kariuki, Admission No. 169276, ICS 4D, Strathmore University.
