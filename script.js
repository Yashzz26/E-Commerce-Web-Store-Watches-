document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE ---
  const allProducts = [
    {
      id: 1,
      name: "Galaxy Watch 6",
      price: 249.99,
      image: "https://via.placeholder.com/400x400.png?text=Galaxy+Watch",
      category: "Smart Watch",
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
      category: "Analog",
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
      category: "Analog",
      description: "Legendary toughness in a slim, modern octagonal case.",
      reviews: "4,800 reviews",
      buyers: "25k+ buyers",
    },
    {
      id: 4,
      name: "Tudor Black Bay",
      price: 4150.0,
      image: "https://via.placeholder.com/400x400.png?text=Tudor+BB",
      category: "Luxury",
      description: "A vintage-inspired diver watch with modern craftsmanship.",
      reviews: "800 reviews",
      buyers: "2k+ buyers",
    },
    {
      id: 5,
      name: "Apple Watch Ultra",
      price: 799.0,
      image: "https://via.placeholder.com/400x400.png?text=Apple+Watch",
      category: "Smart Watch",
      description: "The most rugged and capable Apple Watch ever.",
      reviews: "3,100 reviews",
      buyers: "15k+ buyers",
    },
    {
      id: 6,
      name: "Rolex Submariner",
      price: 9150.0,
      image: "https://via.placeholder.com/400x400.png?text=Rolex",
      category: "Luxury",
      description: "The archetype of the diver's watch, a true icon.",
      reviews: "1,800 reviews",
      buyers: "4k+ buyers",
    },
  ];

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  let cart = JSON.parse(localStorage.getItem("chronixCart")) || [];

  // --- GENERAL FUNCTIONS ---
  const saveCart = () =>
    localStorage.setItem("chronixCart", JSON.stringify(cart));

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

  const checkAuth = () => {
    if (!sessionStorage.getItem("loggedIn") && currentPath !== "login.html") {
      window.location.href = "login.html";
    }
  };

  // --- INITIALIZATION ---
  checkAuth();
  updateCartCount();

  // --- SMOOTH PAGE TRANSITIONS ---
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.classList.add("fade-in");
  }

  // --- LIVE SEARCH BAR LOGIC ---
  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    const searchResultsContainer = document.getElementById("search-results");
    searchBar.addEventListener("input", () => {
      const searchTerm = searchBar.value.toLowerCase();
      if (searchTerm.length > 1) {
        const results = allProducts.filter((p) =>
          p.name.toLowerCase().includes(searchTerm)
        );
        searchResultsContainer.innerHTML = "";
        if (results.length > 0) {
          results.forEach((product) => {
            searchResultsContainer.innerHTML += `
                            <a href="product.html?id=${
                              product.id
                            }" class="search-result-item">
                                <img src="${product.image}" alt="${
              product.name
            }">
                                <div class="search-result-item-info"><h4>${
                                  product.name
                                }</h4><p>$${product.price.toFixed(2)}</p></div>
                            </a>`;
          });
          searchResultsContainer.style.display = "block";
        } else {
          searchResultsContainer.style.display = "none";
        }
      } else {
        searchResultsContainer.style.display = "none";
      }
    });
    document.addEventListener("click", (e) => {
      if (!searchBar.contains(e.target)) {
        searchResultsContainer.style.display = "none";
      }
    });
  }

  // --- 1. LOGIN PAGE LOGIC ---
  if (currentPath === "login.html") {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
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
  }

  // --- 2. INDEX (MAIN) PAGE LOGIC ---
  if (currentPath === "index.html") {
    const productGrid = document.getElementById("product-grid");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("sort-select");

    const displayProducts = (products) => {
      productGrid.innerHTML = "";
      products.forEach((product) => {
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
    };

    const applyFiltersAndSort = () => {
      const activeCategory =
        document.querySelector(".filter-btn.active").dataset.category;
      const sortValue = sortSelect.value;
      let filteredProducts = [...allProducts];
      if (activeCategory !== "all") {
        filteredProducts = filteredProducts.filter(
          (p) => p.category === activeCategory
        );
      }
      if (sortValue === "price-asc")
        filteredProducts.sort((a, b) => a.price - b.price);
      else if (sortValue === "price-desc")
        filteredProducts.sort((a, b) => b.price - a.price);
      displayProducts(filteredProducts);
    };

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFiltersAndSort();
      });
    });
    sortSelect.addEventListener("change", applyFiltersAndSort);
    applyFiltersAndSort();
  }

  // --- 3. PRODUCT DETAIL PAGE LOGIC ---
  if (currentPath === "product.html") {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    const product = allProducts.find((p) => p.id === productId);
    const container = document.getElementById("product-detail-container");

    if (product && container) {
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
                        <a href="checkout.html?buyNow=${
                          product.id
                        }" class="buy-now-btn">Buy Now</a>
                    </div>
                </div>`;
      container
        .querySelector(".add-to-cart-btn")
        .addEventListener("click", (e) => {
          const id = parseInt(e.target.dataset.id);
          const existingItem = cart.find((item) => item.id === id);
          if (existingItem) existingItem.quantity++;
          else cart.push({ id: id, quantity: 1 });
          saveCart();
          updateCartCount();
          showToast("Item added to cart!");
        });
    } else if (container) {
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
        document.querySelector(".cart-main h1").style.display = "none";
        return;
      }
      emptyCartMessage.classList.remove("show");
      cartSummary.style.display = "block";
      document.querySelector(".cart-main h1").style.display = "block";

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
                            <h3>${
                              product.name
                            }</h3><p class="price">$${product.price.toFixed(
          2
        )}</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn decrease-qty">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn increase-qty">+</button>
                            </div>
                        </div>
                        <button class="remove-item-btn"><i class="fas fa-trash"></i></button>
                    </div>`;
      });

      const total = subtotal;
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

      if (target.classList.contains("increase-qty")) cartItem.quantity++;
      else if (target.classList.contains("decrease-qty")) {
        if (cartItem.quantity > 1) cartItem.quantity--;
      } else if (target.classList.contains("remove-item-btn")) {
        cart = cart.filter((item) => item.id !== id);
      }
      saveCart();
      updateCartCount();
      renderCart();
    });
    renderCart();
  }

  // --- 5. CHECKOUT PAGE LOGIC ---
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
          `Order placed successfully!\nPayment Method: ${paymentMethod.toUpperCase()}`
        );
        cart = []; // Clear cart on successful order
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

  // --- LOGOUT BUTTON (runs on pages where it exists) ---
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    });
  }
});
