/**
 * Checkout: order review, delivery form validation and the confirmation screen.
 *
 * Nothing is charged. The site is static, so placing an order just clears the
 * cart and makes up a reference number.
 */
(() => {
  const form = document.querySelector("#checkout-form");
  if (!form) return;

  const review = document.querySelector("#order-review");
  const confirmation = document.querySelector("#confirmation");
  const layout = document.querySelector("#checkout-layout");
  const guard = document.querySelector("#checkout-empty");

  function renderReview() {
    const lines = Store.detailed();

    // Someone can land here with an empty cart via a bookmark or the back
    // button, so the form is hidden rather than left submittable.
    if (lines.length === 0) {
      layout.hidden = true;
      guard.hidden = false;
      return;
    }
    layout.hidden = false;
    guard.hidden = true;

    review.querySelector("[data-slot=lines]").innerHTML = lines
      .map(
        (line) => `
        <li>
          <span class="review-name">${line.name} <span class="review-qty">×${line.qty}</span></span>
          <span>${money(line.lineTotal)}</span>
        </li>`,
      )
      .join("");

    const subtotal = Store.subtotal();
    const delivery = deliveryFor(subtotal);
    review.querySelector("[data-slot=subtotal]").textContent = money(subtotal);
    review.querySelector("[data-slot=delivery]").textContent =
      delivery === 0 ? "Free" : money(delivery);
    review.querySelector("[data-slot=total]").textContent = money(subtotal + delivery);
  }

  const VALIDATORS = {
    name: (value) => (value.trim().length >= 3 ? "" : "Enter your full name."),
    email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? "" : "Enter a valid email address."),
    phone: (value) =>
      /^(?:\+254|0)7\d{8}$/.test(value.replace(/\s/g, "")) ? "" : "Use a Kenyan number, e.g. 0712345678.",
    address: (value) => (value.trim().length >= 8 ? "" : "Enter a delivery address."),
    city: (value) => (value.trim().length >= 2 ? "" : "Enter your town or city."),
  };

  /** Validate one field and paint its error message. */
  function validateField(field) {
    const validate = VALIDATORS[field.name];
    if (!validate) return true;

    const message = validate(field.value);
    const slot = form.querySelector(`[data-error-for=${field.name}]`);
    slot.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  // Validate on blur rather than on every keystroke: flagging an email as
  // invalid while it is still being typed is noise, not help.
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll("input, textarea")];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      const firstBad = fields.find((f) => f.getAttribute("aria-invalid") === "true");
      if (firstBad) firstBad.focus();
      return;
    }

    const subtotal = Store.subtotal();
    const delivery = deliveryFor(subtotal);
    const reference = `SK-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    confirmation.querySelector("[data-slot=reference]").textContent = reference;
    confirmation.querySelector("[data-slot=paid]").textContent = money(subtotal + delivery);
    confirmation.querySelector("[data-slot=email]").textContent = form.elements.email.value.trim();

    Store.clear();
    layout.hidden = true;
    guard.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });

  renderReview();
})();
