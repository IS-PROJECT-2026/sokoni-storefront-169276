/**
 * Cart page: line items, quantity stepping, removal and the running order
 * summary. Everything re-renders from `Store` so a change in one place cannot
 * leave another showing stale numbers.
 */
(() => {
  const list = document.querySelector("#cart-lines");
  if (!list) return;

  const empty = document.querySelector("#cart-empty");
  const summary = document.querySelector("#cart-summary");

  function lineMarkup(line) {
    return `
      <li class="line" data-id="${line.id}">
        ${productArt(line)}
        <div class="line-body">
          <p class="eyebrow">${line.category}</p>
          <h3 class="line-title">${line.name}</h3>
          <p class="line-unit">${money(line.price)} each</p>
        </div>
        <div class="qty" role="group" aria-label="Quantity for ${line.name}">
          <button class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
          <input class="qty-input" type="number" min="1" max="${line.stock}"
                 value="${line.qty}" aria-label="Quantity" />
          <button class="qty-btn" data-action="inc" aria-label="Increase quantity"
                  ${line.qty >= line.stock ? "disabled" : ""}>+</button>
        </div>
        <p class="line-total">${money(line.lineTotal)}</p>
        <button class="link-danger" data-action="remove" aria-label="Remove ${line.name} from cart">Remove</button>
      </li>`;
  }

  function render() {
    const lines = Store.detailed();
    list.innerHTML = lines.map(lineMarkup).join("");

    const hasItems = lines.length > 0;
    empty.hidden = hasItems;
    summary.hidden = !hasItems;
    if (!hasItems) return;

    const subtotal = Store.subtotal();
    const delivery = deliveryFor(subtotal);

    summary.querySelector("[data-slot=subtotal]").textContent = money(subtotal);
    summary.querySelector("[data-slot=delivery]").textContent =
      delivery === 0 ? "Free" : money(delivery);
    summary.querySelector("[data-slot=total]").textContent = money(subtotal + delivery);

    const nudge = summary.querySelector("[data-slot=nudge]");
    const shortfall = freeDeliveryShortfall(subtotal);
    nudge.hidden = shortfall <= 0;
    if (shortfall > 0) nudge.textContent = `Spend ${money(shortfall)} more for free delivery.`;
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.closest(".line").dataset.id;
    const line = Store.detailed().find((l) => l.id === id);
    if (!line) return;

    if (button.dataset.action === "inc") Store.setQty(id, line.qty + 1);
    else if (button.dataset.action === "dec") Store.setQty(id, line.qty - 1);
    else if (button.dataset.action === "remove") {
      Store.remove(id);
      toast(`${line.name} removed`);
    }
  });

  list.addEventListener("change", (event) => {
    const input = event.target.closest(".qty-input");
    if (!input) return;

    const id = input.closest(".line").dataset.id;
    const next = Number.parseInt(input.value, 10);
    // A cleared or non-numeric field should not silently empty the cart.
    Store.setQty(id, Number.isFinite(next) ? next : 1);
  });

  document.querySelector("#clear-cart").addEventListener("click", () => {
    Store.clear();
    toast("Cart cleared");
  });

  Store.subscribe(render);
})();
