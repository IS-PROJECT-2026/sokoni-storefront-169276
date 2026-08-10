/**
 * Cart state.
 *
 * The cart is the single piece of state shared across every page, so it lives
 * in localStorage and notifies subscribers whenever it changes. Pages subscribe
 * rather than reading the array directly, which keeps the header badge, the
 * cart table and the checkout totals from drifting out of sync.
 */
const CART_KEY = "sokoni.cart.v1";

const Store = (() => {
  /** @type {Array<{id: string, qty: number}>} */
  let lines = load();
  /** @type {Array<(lines: Array) => void>} */
  const listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Drop anything that no longer matches a live product or a sane quantity,
      // so a stale cart from an older catalogue cannot break rendering.
      return parsed
        .filter((l) => l && typeof l.id === "string" && Number.isFinite(l.qty))
        .map((l) => ({ id: l.id, qty: Math.max(1, Math.floor(l.qty)) }))
        .filter((l) => PRODUCTS.some((p) => p.id === l.id));
    } catch {
      return [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* Private-mode or quota failure: the cart still works for this session. */
    }
    listeners.forEach((fn) => fn(lines));
  }

  return {
    /** Register a change listener and fire it immediately with current state. */
    subscribe(fn) {
      listeners.push(fn);
      fn(lines);
    },

    /** Raw cart lines, each `{ id, qty }`. */
    lines() {
      return lines.slice();
    },

    /** Cart lines joined to their product record, skipping unknown ids. */
    detailed() {
      return lines
        .map((line) => {
          const product = PRODUCTS.find((p) => p.id === line.id);
          return product ? { ...product, qty: line.qty, lineTotal: product.price * line.qty } : null;
        })
        .filter(Boolean);
    },

    /** Total number of individual units in the cart. */
    count() {
      return lines.reduce((sum, l) => sum + l.qty, 0);
    },

    /** Cart subtotal in KES. */
    subtotal() {
      return this.detailed().reduce((sum, l) => sum + l.lineTotal, 0);
    },

    add(id, qty = 1) {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product || product.stock === 0) return false;

      const existing = lines.find((l) => l.id === id);
      const requested = (existing ? existing.qty : 0) + qty;
      // Never let the cart promise more units than the catalogue has.
      const allowed = Math.min(requested, product.stock);
      if (existing) existing.qty = allowed;
      else lines.push({ id, qty: allowed });

      persist();
      return allowed === requested;
    },

    setQty(id, qty) {
      const product = PRODUCTS.find((p) => p.id === id);
      const line = lines.find((l) => l.id === id);
      if (!product || !line) return;

      if (qty <= 0) return this.remove(id);
      line.qty = Math.min(Math.floor(qty), product.stock);
      persist();
    },

    remove(id) {
      lines = lines.filter((l) => l.id !== id);
      persist();
    },

    clear() {
      lines = [];
      persist();
    },
  };
})();
