/**
 * Delivery pricing rules.
 *
 * The cart and the checkout both quote delivery, and they must never disagree —
 * a total that changes between the two screens reads as a bug to the shopper.
 * Keeping the rule in one place makes that impossible.
 */

/** Orders at or above this subtotal ship free. */
const FREE_DELIVERY_FROM = 20000;

/** Flat delivery charge applied below the free-delivery threshold. */
const DELIVERY_FEE = 450;

/** Delivery charge for a given subtotal, in KES. */
function deliveryFor(subtotal) {
  return subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
}

/** How much more the shopper must spend to qualify for free delivery. */
function freeDeliveryShortfall(subtotal) {
  return Math.max(0, FREE_DELIVERY_FROM - subtotal);
}
