/**
 * Storefront home: renders the product grid from the catalogue data.
 */
(() => {
  const grid = document.querySelector("#product-grid");
  if (!grid) return;

  const resultCount = document.querySelector("#result-count");

  function cardMarkup(product) {
    const soldOut = product.stock === 0;
    const low = !soldOut && product.stock <= 5;

    return `
      <article class="card" data-id="${product.id}">
        ${productArt(product)}
        <div class="card-body">
          <p class="eyebrow">${product.category}</p>
          <h3 class="card-title">${product.name}</h3>
          <p class="card-blurb">${product.blurb}</p>
          <div class="card-meta">
            ${stars(product.rating)}
            <span class="rating-value">${product.rating.toFixed(1)}</span>
            ${soldOut ? '<span class="pill pill-out">Sold out</span>' : ""}
            ${low ? `<span class="pill pill-low">Only ${product.stock} left</span>` : ""}
          </div>
          <div class="card-foot">
            <span class="price">${money(product.price)}</span>
          </div>
        </div>
      </article>`;
  }

  function render() {
    grid.innerHTML = PRODUCTS.map(cardMarkup).join("");
    resultCount.textContent = `Showing all ${PRODUCTS.length} products`;
  }

  render();
})();
