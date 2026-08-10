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
 * Product artwork is drawn as inline SVG rather than fetched as an image so the
 * site has zero external requests — it renders identically offline and cannot
 * break because a CDN went away.
 */
const ICON_PATHS = {
  headphones: "M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 012-2h1v6H6a2 2 0 01-2-2v-2zm16 0a2 2 0 00-2-2h-1v6h1a2 2 0 002-2v-2z",
  buds: "M8 4a3 3 0 013 3v6a3 3 0 11-6 0V7a3 3 0 013-3zm8 0a3 3 0 013 3v6a3 3 0 11-6 0V7a3 3 0 013-3z",
  laptop: "M4 6a1 1 0 011-1h14a1 1 0 011 1v9H4V6zm-2 11h20l-1.5 2H3.5L2 17z",
  keyboard: "M3 7h18v10H3V7zm3 3h2m2 0h2m2 0h2m2 0h2M8 13h8",
  mouse: "M12 3a5 5 0 015 5v8a5 5 0 01-10 0V8a5 5 0 015-5zm0 3v4",
  watch: "M9 3h6v3M9 18v3h6v-3M6 8a6 6 0 1112 0v4a6 6 0 11-12 0V8z",
  ring: "M12 5a7 7 0 100 14 7 7 0 000-14zm0 4a3 3 0 100 6 3 3 0 000-6z",
  lamp: "M12 4v10m-6 6h12M8 4h8l3 6H5l3-6z",
  mug: "M4 6h12v10a3 3 0 01-3 3H7a3 3 0 01-3-3V6zm12 2h2a3 3 0 010 6h-2",
  battery: "M3 8h15v8H3V8zm18 2v4M7 11v2m4-2v2",
  plug: "M9 3v6m6-6v6M6 9h12v3a6 6 0 01-12 0V9zm6 9v3",
  speaker: "M6 3h12v18H6V3zm6 4a1 1 0 100 2 1 1 0 000-2zm0 5a3 3 0 100 6 3 3 0 000-6z",
};

/** Build the decorative artwork tile for a product card. */
function productArt(product) {
  const path = ICON_PATHS[product.icon] || ICON_PATHS.mug;
  return `
    <div class="art" style="--accent:${product.accent}" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="${path}" />
      </svg>
    </div>`;
}

/** Render a 5-star rating as text plus an accessible label. */
function stars(rating) {
  const full = Math.round(rating);
  return `<span class="stars" aria-label="Rated ${rating} out of 5">${"★".repeat(full)}${"☆".repeat(5 - full)}</span>`;
}

/** Mark the current page in the primary navigation. */
function markActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});
