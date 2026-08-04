/**
 * Meesho Clone - Dynamic Application Engine
 * Handles Product Listing, Dynamic Searching, Filtering, Sorting, and Seamless Redirection to meesho.com
 */

const MEESHO_PRODUCTS = [
  {
    id: 1,
    title: "Aagam Fashionable Ethnic Sarees with Blouse Piece",
    category: "Ethnic Wear",
    price: 349,
    originalPrice: 1299,
    discount: "73% off",
    rating: 4.3,
    reviews: "15,820",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/sarees/p/1xxxx"
  },
  {
    id: 2,
    title: "Trendy Rayon Straight Embroidered Kurti",
    category: "Ethnic Wear",
    price: 299,
    originalPrice: 999,
    discount: "70% off",
    rating: 4.4,
    reviews: "22,410",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/kurtis/p/2xxxx"
  },
  {
    id: 3,
    title: "Elegant Women Printed Floral Western Midi Dress",
    category: "Western",
    price: 399,
    originalPrice: 1499,
    discount: "73% off",
    rating: 4.2,
    reviews: "8,950",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/western-dresses/p/3xxxx"
  },
  {
    id: 4,
    title: "Stylish Men Cotton Blend Printed Oversized T-Shirt",
    category: "Menswear",
    price: 249,
    originalPrice: 899,
    discount: "72% off",
    rating: 4.1,
    reviews: "31,200",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/mens-tshirts/p/4xxxx"
  },
  {
    id: 5,
    title: "Lightweight Breathable Running Shoes for Men",
    category: "Footwear",
    price: 499,
    originalPrice: 1999,
    discount: "75% off",
    rating: 4.5,
    reviews: "18,400",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/footwear/p/5xxxx"
  },
  {
    id: 6,
    title: "Modern Ceramic Flower Vase for Living Room Decor",
    category: "Home Decor",
    price: 279,
    originalPrice: 899,
    discount: "68% off",
    rating: 4.6,
    reviews: "5,340",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/home-decor/p/6xxxx"
  },
  {
    id: 7,
    title: "Complete Matte Makeup Kit Set for Women",
    category: "Beauty",
    price: 389,
    originalPrice: 1599,
    discount: "75% off",
    rating: 4.3,
    reviews: "14,100",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/beauty/p/7xxxx"
  },
  {
    id: 8,
    title: "Premium PU Leather Handbag Tote for Women",
    category: "Accessories",
    price: 429,
    originalPrice: 1799,
    discount: "76% off",
    rating: 4.4,
    reviews: "9,850",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/handbags/p/8xxxx"
  },
  {
    id: 9,
    title: "Smart Bluetooth Fitness Tracker Watch with HD Display",
    category: "Electronics",
    price: 699,
    originalPrice: 2999,
    discount: "76% off",
    rating: 4.2,
    reviews: "45,000",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/smartwatches/p/9xxxx"
  },
  {
    id: 10,
    title: "Women Gold-Plated Kundan Jewellery Set with Earrings",
    category: "Accessories",
    price: 299,
    originalPrice: 1199,
    discount: "75% off",
    rating: 4.5,
    reviews: "12,900",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/jewellery/p/10xxxx"
  },
  {
    id: 11,
    title: "Boys & Girls Soft Cute Plush Bear Toy (30cm)",
    category: "Kids & Toys",
    price: 199,
    originalPrice: 699,
    discount: "71% off",
    rating: 4.7,
    reviews: "7,840",
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/toys/p/11xxxx"
  },
  {
    id: 12,
    title: "Men Slim Fit Casual Denim Stretchable Jeans",
    category: "Menswear",
    price: 549,
    originalPrice: 1899,
    discount: "71% off",
    rating: 4.3,
    reviews: "28,700",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    meeshoUrl: "https://www.meesho.com/mens-jeans/p/12xxxx"
  }
];

let currentCategory = "All";
let currentSearch = "";
let currentSort = "relevance";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
});

/**
 * Render Product Grid based on active filters
 */
function renderProducts() {
  const container = document.getElementById("productsGrid");
  if (!container) return;

  let filtered = MEESHO_PRODUCTS.filter(item => {
    const matchesCategory = (currentCategory === "All") || 
      (item.category.toLowerCase() === currentCategory.toLowerCase()) ||
      (currentCategory === "Popular");
    
    const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(currentSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (currentSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9f208c" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 style="margin-top: 16px; font-size: 20px; color: #333;">No Products Found</h3>
        <p style="color: #666; font-size: 14px; margin-top: 8px;">Try searching for "Kurti", "Saree", "Shoes", or "Jeans"</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    // Generate actual meesho redirection search/item URL
    const targetUrl = `https://www.meesho.com/search?q=${encodeURIComponent(product.title)}`;

    return `
      <div class="product-card" onclick="redirectToMeesho('${escapeQuotes(targetUrl)}', '${escapeQuotes(product.title)}')">
        <div class="product-img-container">
          <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
          <div class="redirect-badge">
            <span>Buy on Meesho</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <div class="price-row">
            <span class="current-price">₹${product.price}</span>
            <span class="original-price">₹${product.originalPrice}</span>
            <span class="discount-tag">${product.discount}</span>
          </div>
          <div class="badge-row">
            <span class="free-delivery-badge">Free Delivery</span>
            <span class="rating-badge">${product.rating} ★</span>
            <span class="review-count">(${product.reviews})</span>
          </div>
          <div class="trust-supplier-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            <span>Meesho Trusted Supplier</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Handle direct link/click redirection to Meesho
 */
function redirectToMeesho(url, title = 'Meesho Product') {
  showToast(`Redirecting to Meesho: ${title}`);
  setTimeout(() => {
    window.open(url, '_blank');
  }, 300);
}

function showToast(message) {
  const toast = document.getElementById('redirectToast');
  const toastText = document.getElementById('toastText');
  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/**
 * Event Listeners & Controllers
 */
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderProducts();
    });
  }

  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Category Tabs & Filter Pills
  document.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentCategory = e.currentTarget.getAttribute('data-category');
      renderProducts();
    });
  });
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}
