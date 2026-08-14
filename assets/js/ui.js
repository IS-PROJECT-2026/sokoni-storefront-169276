/**
 * Shared presentation helpers used by every page.
 */

/** Format an integer amount of KES for display. */
function money(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Product image tile.
 *
 * `size` is "sm" for the 400px card version or "lg" for the 800px one the
 * dialog uses. The product name always sits right next to this, so the image
 * is marked decorative rather than repeating the name to a screen reader.
 */
function productArt(product, size = "sm") {
  const file = size === "lg" ? product.image : `${product.image}-sm`;
  const px = size === "lg" ? 800 : 400;
  return `
    <div class="art" style="--accent:${product.accent}" data-label="${product.name}">
      <img src="assets/images/products/${file}.jpg" alt="" aria-hidden="true"
           loading="lazy" decoding="async" width="${px}" height="${px}" />
    </div>`;
}

/**
 * If a photo fails to load, drop it so the tile falls back to a coloured block
 * with the product name. Error events do not bubble, so this has to listen in
 * the capture phase rather than sit on each tag.
 */
document.addEventListener(
  "error",
  (event) => {
    const img = event.target;
    if (img.tagName !== "IMG") return;
    const tile = img.closest(".art");
    if (!tile) return;
    tile.classList.add("art-missing");
    img.remove();
  },
  true,
);

/** Render a 5-star rating as text plus an accessible label. */
function stars(rating) {
  const full = Math.round(rating);
  return `<span class="stars" aria-label="Rated ${rating} out of 5">${"★".repeat(full)}${"☆".repeat(5 - full)}</span>`;
}

/** Keep every `[data-cart-count]` badge in step with the cart. */
function bindCartBadge() {
  Store.subscribe((lines) => {
    const total = lines.reduce((sum, l) => sum + l.qty, 0);
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(total);
      el.hidden = total === 0;
    });
  });
}

/** Brief, non-blocking confirmation message. */
function toast(message) {
  let host = document.querySelector(".toast-host");
  if (!host) {
    host = document.createElement("div");
    host.className = "toast-host";
    // Announce politely so a screen reader hears the confirmation without
    // losing the user's place on the page.
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    document.body.appendChild(host);
  }

  const note = document.createElement("div");
  note.className = "toast";
  note.textContent = message;
  host.appendChild(note);

  setTimeout(() => note.classList.add("out"), 2200);
  setTimeout(() => note.remove(), 2600);
}

/** Mark the current page in the primary navigation. */
function markActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindCartBadge();
  markActiveNav();
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});
