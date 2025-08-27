document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE ---
  const allProducts = [
    {
      id: 1,
      name: "Galaxy Watch 6",
      price: 249.99,
      image: "https://m.media-amazon.com/images/I/61fDRIfPQEL.jpg",
      category: "Smart Watch",
      description:
        "Samsung Galaxy Watch6 LTE (44mm, Graphite, Compatible with Android only) | Introducing BP & ECG Features.<br>A stylish and powerful smartwatch with advanced health tracking.</br>",
      reviews: "1,200 reviews",
      buyers: "5k+ buyers",
    },
    {
      id: 2,
      name: "Seiko 5 Sports",
      price: 275.0,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRK9it_dSbJzeCZ9LKyt4UvFPKJ5E-3CQdH1AAFf5TTdw-YBNuLTZrgGNRgspRJZ1nnfT-IK_dmiJZ1mN8C00pnx5U5DeFoAuBlJ99aP6RX1DbuW-qwIuJuVg",
      category: "Analog",
      description:
        "A reliable and iconic automatic watch, perfect for everyday wear.",
      reviews: "2,500 reviews",
      buyers: "10k+ buyers",
    },
    {
      id: 3,
      name: "G-Shock GA2100",
      price: 1899.0,
      dealPrice: 598.0,
      onDeal: true,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT7HYrA1SlnzcP3hCsw4w6Pvj_huggDXnjX_CLhAYEUW8XYUg9_LbbKNZ0fX7DDPxRv6BlSdB8MYdwBkpTpkaBFZ7g9sBB4O6tg1r7O-M9MXgC68IW7Imwe8A",
      category: "Analog",
      description: "Legendary toughness in a slim, modern octagonal case.",
      reviews: "4,800 reviews",
      buyers: "25k+ buyers",
    },
    {
      id: 4,
      name: "Tudor Black Bay",
      price: 4150.0,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT-4fBer0ilZi604UpkWWEeJXeawiBqMUheAwNuvvhei5jjsHMQ5k_XtTVNDvdL7guNol_nMfox_lh6lv7qZHSGECQcRXRlMnhI-zIgd3qfWCHofapblQAcXw",
      category: "Luxury",
      description: "A vintage-inspired diver watch with modern craftsmanship.",
      reviews: "800 reviews",
      buyers: "2k+ buyers",
    },
    {
      id: 5,
      name: "Apple Watch Ultra",
      price: 799.0,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTFFFxq5qm01OJINS-8URwgxW07tzJSudnV_45lt6XXHPx4og_KEvtGzOexx99U47uRLv9AKdI05RM81bhp7L6C887gnxDArUCnfwa2JS4",
      category: "Smart Watch",
      description: "The most rugged and capable Apple Watch ever.",
      reviews: "3,100 reviews",
      buyers: "15k+ buyers",
    },
    {
      id: 6,
      name: "Rolex Submariner",
      price: 9150.0,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcToUUWWmXHwgCQ_vuwyxtHcHbaagfxuv16jdE1G7YBbOfZq8izoaxmwQZRG7lhl8euUTNHidcfs1zY8mwCR2gcasmjz5cyA0FnLglzqUlnjJb57r3JlZN-i8-E",
      category: "Luxury",
      description: "The archetype of the diver's watch, a true icon.",
      reviews: "1,800 reviews",
      buyers: "4k+ buyers",
    },
  ];

  // --- STATE MANAGEMENT ---
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  let cart = JSON.parse(localStorage.getItem("chronixCart")) || [];
  let userProfile =
    JSON.parse(localStorage.getItem("chronixUserProfile")) || {};

  // --- GENERAL HELPER FUNCTIONS ---
  const saveCart = () =>
    localStorage.setItem("chronixCart", JSON.stringify(cart));
  const saveProfile = () =>
    localStorage.setItem("chronixUserProfile", JSON.stringify(userProfile));

  const checkAuth = () => {
    if (!sessionStorage.getItem("loggedIn") && currentPath !== "login.html") {
      window.location.href = "login.html";
    }
  };

  const updateCartCount = () => {
    const cartCountElement = document.getElementById("cart-item-count");
    if (cartCountElement) {
      cartCountElement.textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }
  };

  const showToast = (message, type = "default") => {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.prepend(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  };

  const updateUserGreeting = () => {
    const container = document.getElementById("user-greeting-container");
    if (!container) return;
    if (userProfile.name) {
      container.innerHTML = `<a href="profile.html" class="user-greeting-link"><img src="${
        userProfile.photo || "https://via.placeholder.com/150"
      }" alt="Profile" class="profile-pic-small"><span>Hello, ${
        userProfile.name.split(" ")[0]
      }</span></a>`;
    } else {
      container.innerHTML = `<a href="profile.html">Hello, Guest</a>`;
    }
  };

  // in script.js

  // Deal of the Day countdown timer logic
  const dealSection = document.getElementById("deal-of-the-day-section");
  if (dealSection) {
    // THIS IS THE LINE YOU WILL EDIT
   let dealEndTime = new Date(2025, 11, 31, 22, 0, 0); // December 31, 2025, 10:00 PM

    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = dealEndTime - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        dealSection.style.display = "none"; // Hide section when timer ends
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("hours").innerText = hours
        .toString()
        .padStart(2, "0");
      document.getElementById("minutes").innerText = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("seconds").innerText = seconds
        .toString()
        .padStart(2, "0");
    }, 1000);
  }

  // --- INITIALIZATION ---
  checkAuth();
  updateCartCount();
  updateUserGreeting();
  const mainContent = document.getElementById("main-content");
  if (mainContent) mainContent.classList.add("fade-in");

  // --- GLOBAL COMPONENTS LOGIC (Navbar, Search, Logout) ---
  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    const searchResultsContainer = document.getElementById("search-results");
    searchBar.addEventListener("input", () => {
      const searchTerm = searchBar.value.toLowerCase();
      searchResultsContainer.innerHTML = "";
      if (searchTerm.length > 1) {
        const results = allProducts.filter((p) =>
          p.name.toLowerCase().includes(searchTerm)
        );
        if (results.length > 0) {
          results.forEach((product) => {
            searchResultsContainer.innerHTML += `<a href="product.html?id=${
              product.id
            }" class="search-result-item"><img src="${product.image}" alt="${
              product.name
            }"><div class="search-result-item-info"><h4>${
              product.name
            }</h4><p>₹${product.price.toFixed(2)}</p></div></a>`;
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
      if (searchResultsContainer && !searchBar.contains(e.target))
        searchResultsContainer.style.display = "none";
    });
  }
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    });
  }

  // --- PAGE-SPECIFIC LOGIC ---

  // 1. LOGIN PAGE
  if (currentPath === "login.html") {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        if (username === "admin" && password === "admin1234") {
          sessionStorage.setItem("loggedIn", "true");
          showToast("Login Successful!", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        } else {
          document.getElementById("login-error").textContent =
            "Invalid credentials.";
        }
      });
    }
  }

  // 2. INDEX PAGE (REVISED WITH NEW BUTTONS)
  if (currentPath === "index.html" || currentPath === "") {
    const productGrid = document.getElementById("product-grid");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("sort-select");

    if (productGrid && filterBtns.length > 0 && sortSelect) {
      // REVISED: displayProducts function now includes both buttons
      const displayProducts = (products) => {
        productGrid.innerHTML = "";
        products.forEach((p) => {
          productGrid.innerHTML += `
                        <div class="product-card">
                            <img src="${p.image}" alt="${p.name}">
                            <div class="product-card-content">
                                <h3>${p.name}</h3>
                                <p class="price">₹${p.price.toFixed(2)}</p>
                                <div class="card-actions">
                                    <button class="add-to-cart-btn-grid" data-id="${
                                      p.id
                                    }">Add to Cart</button>
                                    <a href="product.html?id=${
                                      p.id
                                    }" class="view-details-btn">View Details</a>
                                </div>
                            </div>
                        </div>`;
        });
      };

      const applyFiltersAndSort = () => {
        // ... (This function's logic is correct and remains the same)
        const category =
          document.querySelector(".filter-btn.active").dataset.category;
        const sort = sortSelect.value;
        let products = [...allProducts];
        if (category !== "all")
          products = products.filter((p) => p.category === category);
        if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc")
          products.sort((a, b) => b.price - a.price);
        displayProducts(products);
      };

      filterBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          applyFiltersAndSort();
        })
      );

      sortSelect.addEventListener("change", applyFiltersAndSort);

      // NEW: Add event listener for the new "Add to Cart" buttons on the grid
      productGrid.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart-btn-grid")) {
          const productId = parseInt(e.target.dataset.id);
          const existingItem = cart.find((item) => item.id === productId);

          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.push({ id: productId, quantity: 1 });
          }
          saveCart();
          updateCartCount();
          showToast("Item added to cart!");
        }
      });

      applyFiltersAndSort(); // Initial render of products
    }
  }
  // 3. PRODUCT DETAIL PAGE
  if (currentPath === "product.html") {
    const params = new URLSearchParams(window.location.search),
      productId = parseInt(params.get("id")),
      product = allProducts.find((p) => p.id === productId),
      container = document.getElementById("product-detail-container");
    if (product && container) {
      container.innerHTML = `<div class="product-image-gallery"><img src="${
        product.image
      }" alt="${product.name}"></div><div class="product-info"><h1>${
        product.name
      }</h1><p class="price">₹${(product.dealPrice || product.price).toFixed(
        2
      )}</p><p>${
        product.description
      }</p><div class="product-actions"><button class="add-to-cart-btn" data-id="${
        product.id
      }">Add to Cart</button><a href="checkout.html" class="buy-now-btn">Buy Now</a></div></div>`;
      container
        .querySelector(".add-to-cart-btn")
        .addEventListener("click", (e) => {
          const id = parseInt(e.target.dataset.id),
            existingItem = cart.find((item) => item.id === id);
          if (existingItem) existingItem.quantity++;
          else cart.push({ id, quantity: 1 });
          saveCart();
          updateCartCount();
          showToast("Item added to cart!");
        });
    } else if (container) {
      container.innerHTML = "<h2>Product not found</h2>";
    }
  }

  // 4. CART PAGE
  if (currentPath === "cart.html") {
    const cartItemsList = document.getElementById("cart-items-list"),
      cartSummary = document.getElementById("cart-summary"),
      emptyMsg = document.getElementById("empty-cart-message");
    if (cartItemsList) {
      const renderCart = () => {
        cartItemsList.innerHTML = "";
        if (cart.length === 0) {
          emptyMsg.classList.add("show");
          cartSummary.style.display = "none";
          document.querySelector(".cart-main h1").style.display = "none";
          return;
        }
        emptyMsg.classList.remove("show");
        cartSummary.style.display = "block";
        document.querySelector(".cart-main h1").style.display = "block";
        let subtotal = 0;
        cart.forEach((item) => {
          const p = allProducts.find((prod) => prod.id === item.id);
          subtotal += (p.dealPrice || p.price) * item.quantity;
          cartItemsList.innerHTML += `<div class="cart-item" data-id="${
            item.id
          }"><div class="cart-item-image"><img src="${p.image}" alt="${
            p.name
          }"></div><div class="cart-item-details"><h3>${
            p.name
          }</h3><p class="price">₹${(p.dealPrice || p.price).toFixed(
            2
          )}</p><div class="quantity-controls"><button class="quantity-btn decrease-qty">-</button><span>${
            item.quantity
          }</span><button class="quantity-btn increase-qty">+</button></div></div><button class="remove-item-btn"><i class="fas fa-trash"></i></button></div>`;
        });
        cartSummary.innerHTML = `<h2>Order Summary</h2><div class="summary-line"><span>Subtotal</span><span>₹${subtotal.toFixed(
          2
        )}</span></div><div class="summary-line total"><span>Total</span><span>₹${subtotal.toFixed(
          2
        )}</span></div><a href="checkout.html" class="btn checkout-btn">Proceed to Checkout</a>`;
      };
      cartItemsList.addEventListener("click", (e) => {
        const target = e.target.closest("button");
        if (!target) return;
        const id = parseInt(e.target.closest(".cart-item").dataset.id),
          item = cart.find((i) => i.id === id);
        if (target.classList.contains("increase-qty")) item.quantity++;
        else if (target.classList.contains("decrease-qty") && item.quantity > 1)
          item.quantity--;
        else if (target.classList.contains("remove-item-btn"))
          cart = cart.filter((i) => i.id !== id);
        saveCart();
        updateCartCount();
        renderCart();
      });
      renderCart();
    }
  }

  // 5. CHECKOUT PAGE
  if (currentPath === "checkout.html") {
    const checkoutForm = document.getElementById("checkout-form");
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const upiOverlay = document.getElementById("upi-payment-overlay");
    const confirmOrderBtn = document.getElementById("confirm-order-btn");

    if (
      checkoutForm &&
      paymentOptions.length > 0 &&
      upiOverlay &&
      confirmOrderBtn
    ) {
      const placeOrder = () => {
        if (upiOverlay.classList.contains("show")) {
          upiOverlay.classList.remove("show");
        }
        showToast("Order Placed Successfully!", "success");
        setTimeout(() => {
          cart = [];
          saveCart();
          updateCartCount();
          window.location.href = "confirmation.html";
        }, 2000);
      };
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedPayment = document.querySelector(
          'input[name="payment"]:checked'
        ).value;
        if (selectedPayment === "online") {
          upiOverlay.classList.add("show");
        } else {
          placeOrder();
        }
      });
      confirmOrderBtn.addEventListener("click", placeOrder);
    }
  }

  // 6. PROFILE PAGE
  if (currentPath === "profile.html") {
    const form = document.getElementById("profile-form"),
      nameInput = document.getElementById("full-name"),
      emailInput = document.getElementById("email-id"),
      addressInput = document.getElementById("address"),
      photoInput = document.getElementById("profile-photo-input"),
      photoPreview = document.getElementById("profile-photo-preview");

    if (form) {
      nameInput.value = userProfile.name || "";
      emailInput.value = userProfile.email || "";
      addressInput.value = userProfile.address || "";
      if (userProfile.photo) photoPreview.src = userProfile.photo;

      photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            photoPreview.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        userProfile.name = nameInput.value;
        userProfile.email = emailInput.value;
        userProfile.address = addressInput.value;
        userProfile.photo = photoPreview.src;
        saveProfile();
        showToast("Profile updated successfully!", "success");
        updateUserGreeting();

        // ===== NEW LINES ADDED HERE =====
        // This will redirect to the homepage after a 1.5 second delay,
        // giving the user time to see the "success" message.
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
        // =================================
      });
    }
  }
});
