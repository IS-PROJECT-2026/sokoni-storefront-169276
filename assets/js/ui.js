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
