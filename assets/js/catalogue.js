/**
 * Storefront home: renders the product grid and drives search, category
 * filtering, sorting and the product detail dialog.
 */
(() => {
  const grid = document.querySelector("#product-grid");
  if (!grid) return;

  const searchInput = document.querySelector("#search");
  const categorySelect = document.querySelector("#category");
  const resultCount = document.querySelector("#result-count");
  const sortSelect = document.querySelector("#sort");
  const emptyState = document.querySelector("#empty-state");
  const dialog = document.querySelector("#product-dialog");

  /** Populate the category filter from the catalogue itself. */
  CATEGORIES.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  const SORTS = {
    featured: null,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.name.localeCompare(b.name),
  };

  /** Apply the current search term, category and sort to the catalogue. */
  function visibleProducts() {
    const term = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;

    let list = PRODUCTS.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.blurb.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });

    const comparator = SORTS[sortSelect.value];
    // Sort a copy: sorting in place would permanently reorder the catalogue
    // and make "featured" order impossible to get back.
    if (comparator) list = list.slice().sort(comparator);
    return list;
  }

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
            <div class="card-actions">
              <button class="btn btn-ghost" data-action="details" aria-label="View details for ${product.name}">Details</button>
              <button class="btn btn-primary" data-action="add" ${soldOut ? "disabled" : ""}>
                ${soldOut ? "Unavailable" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const list = visibleProducts();
    grid.innerHTML = list.map(cardMarkup).join("");

    resultCount.textContent =
      list.length === PRODUCTS.length
        ? `Showing all ${list.length} products`
        : `Showing ${list.length} of ${PRODUCTS.length} products`;
    emptyState.hidden = list.length > 0;
  }

  function openDetails(product) {
    dialog.querySelector("[data-slot=art]").innerHTML = productArt(product);
    dialog.querySelector("[data-slot=category]").textContent = product.category;
    dialog.querySelector("[data-slot=name]").textContent = product.name;
    dialog.querySelector("[data-slot=blurb]").textContent = product.blurb;
    dialog.querySelector("[data-slot=price]").textContent = money(product.price);
    dialog.querySelector("[data-slot=rating]").innerHTML =
      `${stars(product.rating)} <span class="rating-value">${product.rating.toFixed(1)}</span>`;
    dialog.querySelector("[data-slot=stock]").textContent =
      product.stock === 0 ? "Currently out of stock" : `${product.stock} in stock`;

    const addButton = dialog.querySelector("[data-action=add-from-dialog]");
    addButton.disabled = product.stock === 0;
    addButton.dataset.id = product.id;

    dialog.showModal();
  }

  // One delegated listener on the grid instead of a listener per card, so the
  // handlers survive every re-render.
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.closest(".card").dataset.id;
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    if (button.dataset.action === "add") {
      const fullyAdded = Store.add(product.id);
      toast(fullyAdded ? `${product.name} added to cart` : `Only ${product.stock} available — cart capped`);
    } else {
      openDetails(product);
    }
  });

  dialog.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    if (button.dataset.action === "close-dialog") {
      dialog.close();
    } else if (button.dataset.action === "add-from-dialog") {
      const product = PRODUCTS.find((p) => p.id === button.dataset.id);
      if (product && Store.add(product.id)) toast(`${product.name} added to cart`);
      dialog.close();
    }
  });

  [searchInput, categorySelect, sortSelect].forEach((control) =>
    control.addEventListener("input", render),
  );

  document.querySelector("#clear-filters").addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "all";
    sortSelect.value = "featured";
    render();
  });

  render();
})();
