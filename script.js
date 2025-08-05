document.addEventListener("DOMContentLoaded", function () {
  // Sample product data
  const products = [
    {
      id: 1,
      title: "The-Dye Lounge Set",
      price: 150.0,
      image: "/assets/product-1.jpg",
    },
    {
      id: 2,
      title: "Sunburst Tracksuit",
      price: 150.0,
      image: "/assets/product-2.jpg",
    },
    {
      id: 3,
      title: "Retro Red Streetwear",
      price: 150.0,
      image: "/assets/product-3.jpg",
    },
    {
      id: 4,
      title: "Urban Sportwear Combo",
      price: 150.0,
      image: "/assets/product-4.jpg",
    },
    {
      id: 5,
      title: "Over-sized Knit & Coat",
      price: 150.0,
      image: "/assets/product-5.jpg",
    },
    {
      id: 6,
      title: "Chic Monochrome Blazer",
      price: 150.0,
      image: "/assets/product-6.jpg",
    },
  ];

  // State to track selected products
  let bundleItems = [];

  // DOM elements
  const productsGrid = document.querySelector(".products-grid");
  const bundleItemsContainer = document.querySelector(".bundle-items");
  const discountAmount = document.querySelector(".discount-amount");
  const subtotalAmount = document.querySelector(".subtotal-amount");
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  const emptyState = document.querySelector(".empty-state");

  // Render all products
  function renderProducts() {
    productsGrid.innerHTML = "";

    products.forEach((product) => {
      const isAdded = bundleItems.some((item) => item.id === product.id);

      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
                <div class="product-image" style="background-image: url('${
                  product.image
                }')"></div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">$${product.price.toFixed(
                      2
                    )}</div>
                    <button class="add-to-bundle-btn ${
                      isAdded ? "added" : ""
                    }" data-id="${product.id}">
                          <span class="btn-text">${
                            isAdded ? "Added to Bundle" : "Add to Bundle"
                          }</span>
                        <span class="btn-icon">
                            ${
                              isAdded
                                ? `<img src="/assets/icons/check.svg" alt="Added">`
                                : "+"
                            }
                        </span>
                    </button>
                </div>
            `;

      productsGrid.appendChild(productCard);
    });

    // Add event listeners to buttons
    document.querySelectorAll(".add-to-bundle-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        toggleProductInBundle(productId);
      });
    });
  }

  // Toggle product in bundle
  function toggleProductInBundle(productId) {
    const productIndex = bundleItems.findIndex((item) => item.id === productId);
    const product = products.find((p) => p.id === productId);

    if (productIndex === -1) {
      // Add to bundle
      bundleItems.push({
        ...product,
        quantity: 1,
      });
    } else {
      // Remove from bundle
      bundleItems.splice(productIndex, 1);
    }

    updateBundleUI();
    renderProducts();
  }

  // Update quantity of a product in the bundle
  function updateQuantity(productId, newQuantity) {
    const productIndex = bundleItems.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
      if (newQuantity < 1) {
        bundleItems.splice(productIndex, 1);
      } else {
        bundleItems[productIndex].quantity = newQuantity;
      }

      updateBundleUI();
      renderProducts();
    }
  }

  // Update bundle UI (sidebar)
  function updateBundleUI() {
    bundleItemsContainer.innerHTML = "";
    bundleItemsContainer.classList.add("has-items");

    const totalSlots = 3;

    const progressFill = document.querySelector(".progress-fill");
    const progress = Math.min((bundleItems.length / 3) * 100, 100);
    progressFill.style.width = `${progress}%`;

    for (let i = 0; i < totalSlots; i++) {
      const item = bundleItems[i];
      const bundleSlot = document.createElement("div");

      if (item) {
        bundleSlot.className = "bundle-item";
        bundleSlot.innerHTML = `
  <div class="bundle-item-image" style="background-image: url('${
    item.image
  }')"></div>
  <div class="bundle-item-info">
    <div class="bundle-item-title">${item.title}</div>
    <div class="bundle-item-price">$${item.price.toFixed(2)}</div>
    <div class="bundle-item-quantity">
      <button class="quantity-btn minus" data-id="${item.id}">-</button>
      <span class="quantity-value">${item.quantity}</span>
      <button class="quantity-btn plus" data-id="${item.id}">+</button>
    </div>
  </div>
  <button class="delete-item-btn" data-id="${item.id}">
    <img src="/assets/icons/delete.svg" alt="delete" />
  </button>
`;
      } else {
        bundleSlot.className = "skeleton-box";
        bundleSlot.innerHTML = `
        <div class="skeleton-left"></div>
        <div class="skeleton-right"></div>
      `;
      }

      bundleItemsContainer.appendChild(bundleSlot);
    }

    // delete button event
    document.querySelectorAll(".delete-item-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        toggleProductInBundle(productId);
      });
    });

    // Attach quantity buttons after DOM elements are injected
    document.querySelectorAll(".quantity-btn.minus").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        const item = bundleItems.find((item) => item.id === productId);
        if (item) updateQuantity(productId, item.quantity - 1);
      });
    });

    document.querySelectorAll(".quantity-btn.plus").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        const item = bundleItems.find((item) => item.id === productId);
        if (item) updateQuantity(productId, item.quantity + 1);
      });
    });

    // Price Calculation
    const subtotal = bundleItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discount = bundleItems.length >= 3 ? subtotal * 0.3 : 0;
    const total = subtotal - discount;

    discountAmount.textContent = `-$${discount.toFixed(2)} (30%)`;
    subtotalAmount.textContent = `$${total.toFixed(2)}`;

    if (bundleItems.length >= 3) {
      addToCartBtn.disabled = false;
      addToCartBtn.innerHTML = `
    <span>Add Bundle to Cart</span>
    <img src="/assets/icons/arrow-right.svg" alt="arrow right" class="btn-icon" />
  `;
    } else {
      addToCartBtn.disabled = true;
      addToCartBtn.innerHTML = `
    <span>Add 3 Items to Proceed</span>
    <img src="/assets/icons/arrow-right.svg" alt="arrow right" class="btn-icon" />
  `;
    }
  }

  // Add to cart button handler
  addToCartBtn.addEventListener("click", function () {
    if (bundleItems.length >= 3) {
      console.log("Bundle added to cart:", bundleItems);
      alert("Bundle added to cart! Check console for details.");
    }
  });

  // Initialize the UI
  renderProducts();
  updateBundleUI();
});
