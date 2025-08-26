document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE ---
  const allProducts = [
    {
      id: 1,
      name: "Galaxy Watch 6",
      price: 249.99,
      image: "https://via.placeholder.com/400x400.png?text=Galaxy+Watch",
      description:
        "A stylish and powerful smartwatch with advanced health tracking.",
      reviews: "1,200 reviews",
      buyers: "5k+ buyers",
    },
    {
      id: 2,
      name: "Seiko 5 Sports",
      price: 275.0,
      image: "https://via.placeholder.com/400x400.png?text=Seiko+5",
      description:
        "A reliable and iconic automatic watch, perfect for everyday wear.",
      reviews: "2,500 reviews",
      buyers: "10k+ buyers",
    },
    {
      id: 3,
      name: "G-Shock GA2100",
      price: 99.0,
      image: "https://via.placeholder.com/400x400.png?text=G-Shock",
      description: "Legendary toughness in a slim, modern octagonal case.",
      reviews: "4,800 reviews",
      buyers: "25k+ buyers",
    },
    {
      id: 4,
      name: "Tudor Black Bay",
      price: 4150.0,
      image: "https://via.placeholder.com/400x400.png?text=Tudor+BB",
      description: "A vintage-inspired diver watch with modern craftsmanship.",
      reviews: "800 reviews",
      buyers: "2k+ buyers",
    },
  ];

  const currentPath = window.location.pathname.split("/").pop();

  // --- CART MANAGEMENT ---
  let cart = JSON.parse(localStorage.getItem("chronixCart")) || [];

  const saveCart = () => {
    localStorage.setItem("chronixCart", JSON.stringify(cart));
  };

  const updateCartCount = () => {
    const cartCountElement = document.getElementById("cart-item-count");
    if (cartCountElement) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems;
    }
  };

  const showToast = (message) => {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  };

  // --- AUTHENTICATION ---
  const checkAuth = () => {
    if (!sessionStorage.getItem("loggedIn") && currentPath !== "login.html") {
      window.location.href = "login.html";
    }
  };

  // --- PAGE ROUTING & INITIALIZATION ---
  checkAuth();
  updateCartCount(); // Update cart count on every page load
  if (document.getElementById("main-content"))
    document.getElementById("main-content").style.display = "block";

  // --- 1. LOGIN PAGE LOGIC ---
  if (currentPath === "login.html" && document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      if (username === "admin" && password === "admin1234") {
        sessionStorage.setItem("loggedIn", "true");
        alert("Successfully logged in!");
        window.location.href = "index.html";
      } else {
        document.getElementById("login-error").textContent =
          "Invalid credentials.";
      }
    });
  }

  // --- 2. INDEX PAGE LOGIC ---
  if (currentPath === "index.html") {
    const productGrid = document.getElementById("product-grid");
    if (productGrid) {
      allProducts.forEach((product) => {
        productGrid.innerHTML += `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-card-content">
                            <h3>${product.name}</h3>
                            <p class="price">$${product.price.toFixed(2)}</p>
                            <a href="product.html?id=${
                              product.id
                            }" class="view-details-btn">View Details</a>
                        </div>
                    </div>`;
      });
    }
    if (document.getElementById("logout-btn")) {
      document.getElementById("logout-btn").addEventListener("click", () => {
        sessionStorage.removeItem("loggedIn");
        window.location.href = "login.html";
      });
    }
  }

  // --- 3. PRODUCT DETAIL PAGE LOGIC ---
  if (currentPath === "product.html") {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    const product = allProducts.find((p) => p.id === productId);
    const container = document.getElementById("product-detail-container");

    if (product) {
      container.innerHTML = `
                <div class="product-image-gallery"><img src="${
                  product.image
                }" alt="${product.name}"></div>
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-id="${
                          product.id
                        }">Add to Cart</button>
                        <a href="checkout.html?id=${
                          product.id
                        }" class="buy-now-btn">Buy Now</a>
                    </div>
                </div>`;

      container
        .querySelector(".add-to-cart-btn")
        .addEventListener("click", (e) => {
          const id = parseInt(e.target.dataset.id);
          const existingItem = cart.find((item) => item.id === id);
          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.push({ id: id, quantity: 1 });
          }
          saveCart();
          updateCartCount();
          showToast("Item added to cart!");
        });
    } else {
      container.innerHTML = "<h2>Product not found</h2>";
    }
  }

  // --- 4. CART PAGE LOGIC ---
  if (currentPath === "cart.html") {
    const cartItemsList = document.getElementById("cart-items-list");
    const cartSummary = document.getElementById("cart-summary");
    const emptyCartMessage = document.getElementById("empty-cart-message");

    const renderCart = () => {
      cartItemsList.innerHTML = "";
      if (cart.length === 0) {
        emptyCartMessage.classList.add("show");
        cartSummary.style.display = "none";
        return;
      }
      emptyCartMessage.classList.remove("show");
      cartSummary.style.display = "block";

      let subtotal = 0;
      cart.forEach((item) => {
        const product = allProducts.find((p) => p.id === item.id);
        subtotal += product.price * item.quantity;
        cartItemsList.innerHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image"><img src="${
                          product.image
                        }" alt="${product.name}"></div>
                        <div class="cart-item-details">
                            <h3>${product.name}</h3>
                            <p class="price">$${product.price.toFixed(2)}</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn decrease-qty">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn increase-qty">+</button>
                            </div>
                        </div>
                        <button class="remove-item-btn"><i class="fas fa-trash"></i></button>
                    </div>`;
      });

      const total = subtotal; // For now, total is same as subtotal
      cartSummary.innerHTML = `
                <h2>Order Summary</h2>
                <div class="summary-line"><span>Subtotal</span><span>$${subtotal.toFixed(
                  2
                )}</span></div>
                <div class="summary-line total"><span>Total</span><span>$${total.toFixed(
                  2
                )}</span></div>
                <a href="checkout.html" class="btn checkout-btn">Proceed to Checkout</a>`;
    };

    cartItemsList.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (!target) return;
      const cartItemDiv = e.target.closest(".cart-item");
      const id = parseInt(cartItemDiv.dataset.id);
      const cartItem = cart.find((item) => item.id === id);

      if (target.classList.contains("increase-qty")) {
        cartItem.quantity++;
      } else if (target.classList.contains("decrease-qty")) {
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        }
      } else if (target.classList.contains("remove-item-btn")) {
        cart = cart.filter((item) => item.id !== id);
      }
      saveCart();
      updateCartCount();
      renderCart();
    });

    renderCart(); // Initial render
  }

  // --- 5. CHECKOUT PAGE LOGIC ---
  // (This remains the same as your last version)
  if (currentPath === "checkout.html") {
    const checkoutForm = document.getElementById("checkout-form");
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const qrCodeOverlay = document.getElementById("qr-code-overlay");
    const qrPlaceOrderBtn = document.getElementById("qr-place-order-btn");

    const placeOrder = () => {
      const paymentMethod = document.querySelector(
        'input[name="payment"]:checked'
      ).value;
      if (qrCodeOverlay.classList.contains("show")) {
        qrCodeOverlay.classList.remove("show");
      }
      setTimeout(() => {
        alert(
          `Order placed successfully! \nPayment Method: ${paymentMethod.toUpperCase()}`
        );
        cart = []; // Clear the cart after placing order
        saveCart();
        window.location.href = "index.html";
      }, 300);
    };
    paymentOptions.forEach((option) => {
      option.addEventListener("change", () => {
        if (option.value === "upi") qrCodeOverlay.classList.add("show");
        else qrCodeOverlay.classList.remove("show");
      });
    });
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (
        document.querySelector('input[name="payment"]:checked').value === "upi"
      ) {
        qrCodeOverlay.classList.add("show");
      } else {
        placeOrder();
      }
    });
    qrPlaceOrderBtn.addEventListener("click", placeOrder);
  }
});
