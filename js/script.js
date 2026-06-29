//Mini Online Shopping


/* 1. Product data */
const PRODUCTS = [
  { id: 1,  name: "Wireless Earbuds",       emoji: "\u{1F3A7}", price: 49.99, stock: 12 },
  { id: 2,  name: "Ceramic Coffee Mug",     emoji: "\u2615",    price: 14.50, stock: 25 },
  { id: 3,  name: "Canvas Backpack",        emoji: "\u{1F392}", price: 64.00, stock: 8  },
  { id: 4,  name: "LED Desk Lamp",          emoji: "\u{1F4A1}", price: 32.75, stock: 15 },
  { id: 5,  name: "Kraft Notebook",         emoji: "\u{1F4D3}", price: 8.25,  stock: 40 },
  { id: 6,  name: "Insulated Water Bottle", emoji: "\u{1F36F}", price: 22.00, stock: 18 },
  { id: 7,  name: "Retro Sunglasses",       emoji: "\u{1F60E}", price: 27.99, stock: 10 },
  { id: 8,  name: "Terracotta Plant Pot",   emoji: "\u{1F331}", price: 16.40, stock: 20 },
  { id: 9,  name: "Adjustable Phone Stand", emoji: "\u{1F4F1}", price: 13.99, stock: 0  },
  { id: 10, name: "Soy Candle",             emoji: "\u{1F56F}", price: 19.95, stock: 14 },
];

/* Background tints the product image swatches cycle through. */
const SWATCHES = ["#E9EFE3", "#F1E0DC", "#EFEAD8", "#E4ECEC"];

const TAX_RATE = 0.13; // 13% HST

/* Optional bonus: promo codes give a percentage off the subtotal. */
const PROMO_CODES = {
  MAPLE10: 0.10,
  WELCOME15: 0.15,
};



/* 2. App state */
const cart = {};      // { [productId]: quantity }
let appliedPromo = null; // { code, rate } | null
let sortValue = "default";
let searchValue = "";



/* 3. DOM references */
const productGrid = document.getElementById("product-grid");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");

const cartItemsEl = document.getElementById("cart-items");
const cartEmptyMessage = document.getElementById("cart-empty-message");
const headerCartCount = document.getElementById("header-cart-count");

const promoInput = document.getElementById("promo-input");
const promoApplyBtn = document.getElementById("promo-apply-btn");
const promoMessage = document.getElementById("promo-message");

const subtotalAmountEl = document.getElementById("subtotal-amount");
const discountRowEl = document.getElementById("discount-row");
const discountAmountEl = document.getElementById("discount-amount");
const taxAmountEl = document.getElementById("tax-amount");
const totalAmountEl = document.getElementById("total-amount");

const checkoutForm = document.getElementById("checkout-form");
const formErrorsEl = document.getElementById("form-errors");

const receiptSection = document.getElementById("receipt-section");
const receiptContent = document.getElementById("receipt-content");
const startNewOrderBtn = document.getElementById("start-new-order-btn");



/* Helpers */
function formatCurrency(amount) {
  return "$" + amount.toFixed(2);
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}



/* 4. Render: products */
function getVisibleProducts() {
  let list = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchValue.trim().toLowerCase())
  );

  if (sortValue === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sortValue === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (sortValue === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

  return list;
}

function renderProducts() {
  const visible = getVisibleProducts();

  if (visible.length === 0) {
    productGrid.innerHTML = `<p class="no-results">No products match &ldquo;${searchValue}&rdquo;.</p>`;
    return;
  }

  productGrid.innerHTML = visible
    .map((product, index) => {
      const qty = cart[product.id] || 0;
      const outOfStock = product.stock === 0;
      const atMax = qty >= product.stock;
      const swatch = SWATCHES[index % SWATCHES.length];

      return `
        <article class="product-card" data-out-of-stock="${outOfStock}">
          <div class="product-image" style="background:${swatch}">
            <span aria-hidden="true">${product.emoji}</span>
          </div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">${formatCurrency(product.price)}</p>
          <p class="product-stock ${outOfStock ? "is-out" : ""}">
            ${outOfStock ? "Out of stock" : product.stock + " in stock"}
          </p>
          <div class="qty-row">
            <button type="button" class="qty-btn" data-action="decrement" data-id="${product.id}"
              aria-label="Decrease quantity of ${product.name}" ${qty <= 0 ? "disabled" : ""}>&minus;</button>
            <input type="number" class="qty-input" data-id="${product.id}"
              min="0" max="${product.stock}" value="${qty}"
              aria-label="Quantity of ${product.name}" ${outOfStock ? "disabled" : ""} />
            <button type="button" class="qty-btn" data-action="increment" data-id="${product.id}"
              aria-label="Increase quantity of ${product.name}" ${outOfStock || atMax ? "disabled" : ""}>+</button>
          </div>
        </article>
      `;
    })
    .join("");
}

renderProducts();

/* 5. Render: cart + totals */
function getCartLines() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ product: getProductById(Number(id)), qty }))
    .filter((line) => line.qty > 0 && line.product);
}

function calculateTotals() {
  const lines = getCartLines();
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const discount = appliedPromo ? subtotal * appliedPromo.rate : 0;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax;
  return { subtotal, discount, tax, total };
}

function renderCart() {
  const lines = getCartLines();
  const totalItemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  headerCartCount.textContent = String(totalItemCount);

  if (lines.length === 0) {
    cartItemsEl.innerHTML = "";
    cartEmptyMessage.hidden = false;
  } else {
    cartEmptyMessage.hidden = true;
    cartItemsEl.innerHTML = lines
      .map(({ product, qty }) => {
        const lineTotal = product.price * qty;
        return `
          <div class="cart-item">
            <span class="cart-item-name">${product.name}</span>
            <span class="cart-item-line-total">${formatCurrency(lineTotal)}</span>
            <span class="cart-item-meta">${qty} &times; ${formatCurrency(product.price)}</span>
            <span></span>
          </div>
        `;
      })
      .join("");
  }

  const { subtotal, discount, tax, total } = calculateTotals();
  subtotalAmountEl.textContent = formatCurrency(subtotal);
  taxAmountEl.textContent = formatCurrency(tax);
  totalAmountEl.textContent = formatCurrency(total);

  if (discount > 0) {
    discountRowEl.hidden = false;
    discountAmountEl.textContent = "\u2212" + formatCurrency(discount);
  } else {
    discountRowEl.hidden = true;
  }
}



/* Quantity changes (shared by +/- buttons and direct input typing) */
function setQuantity(id, rawValue) {
  const product = getProductById(id);
  if (!product) return;

  let qty = Math.floor(Number(rawValue));
  if (Number.isNaN(qty) || qty < 0) qty = 0;
  if (qty > product.stock) qty = product.stock; // enforce stock limit

  if (qty === 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }

  // Re-rendering replaces every product card's HTML, which would normally
  // steal focus away from the input the user is actively typing in.
  // Remember it here and restore it after the re-render.
  const active = document.activeElement;
  const wasFocusedId = active && active.classList.contains("qty-input") ? active.dataset.id : null;

  renderProducts();
  renderCart();

  if (wasFocusedId) {
    const input = productGrid.querySelector(`.qty-input[data-id="${wasFocusedId}"]`);
    if (input) {
      input.focus();
      const cursorPos = input.value.length;
      input.setSelectionRange(cursorPos, cursorPos);
    }
  }
}


productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".qty-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const current = cart[id] || 0;
  const delta = btn.dataset.action === "increment" ? 1 : -1;
  setQuantity(id, current + delta);
});

productGrid.addEventListener("input", (e) => {
  const input = e.target.closest(".qty-input");
  if (!input) return;
  setQuantity(Number(input.dataset.id), input.value);
});

renderProducts();
renderCart();

