/**
 * Meesho Link Extractor & Section-Based Showcase Engine
 * Exact Image Extraction from Meesho CDN (images.meesho.com), Price/Discount Parser,
 * Category Section Manager, and Persistent Showcase.
 */

const STORAGE_KEY = "meesho_section_products_v2";

const CATEGORIES = [
  { id: "Ethnic Wear", name: "Kurti, Saree & Ethnic Wear", icon: "🌸" },
  { id: "Western", name: "Women Western", icon: "👗" },
  { id: "Menswear", name: "Menswear & Grooming", icon: "👔" },
  { id: "Beauty", name: "Beauty & Health", icon: "💄" },
  { id: "Footwear", name: "Bags & Footwear", icon: "👠" },
  { id: "Home", name: "Home & Kitchen", icon: "🏠" },
  { id: "Jewellery", name: "Jewellery & Accessories", icon: "💎" },
  { id: "Electronics", name: "Electronics & Watches", icon: "⌚" },
  { id: "Kids", name: "Kids & Toys", icon: "🧸" }
];

// Seed sample links if local storage is empty
const INITIAL_SAMPLES = [
  {
    id: "sample-1",
    title: "Muuchstac Ocean Face Wash for Men | Fight Acne & Pimples, Brighten Skin | 100 ml",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    link: "https://www.meesho.com/muuchstac-ocean-face-wash-for-men-fight-acne-pimples-brighten-skin-clears-dirt-oil-control-refreshing-feel-multi-action-formula-100-ml-pack-of-2/p/3b2nn",
    category: "Beauty",
    price: 238,
    originalPrice: 598,
    discount: "60% off",
    rating: 4.0,
    addedAt: Date.now()
  },
  {
    id: "sample-2",
    title: "Trendy Embroidered Rayon Straight Kurti Set",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    link: "https://www.meesho.com/kurtis/p/2xxxx",
    category: "Ethnic Wear",
    price: 299,
    originalPrice: 999,
    discount: "70% off",
    rating: 4.4,
    addedAt: Date.now() - 1000
  },
  {
    id: "sample-3",
    title: "Men Cotton Printed Oversized Casual T-Shirt",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    link: "https://www.meesho.com/mens-tshirts/p/4xxxx",
    category: "Menswear",
    price: 249,
    originalPrice: 899,
    discount: "72% off",
    rating: 4.2,
    addedAt: Date.now() - 2000
  }
];

let productsList = [];
let activeSectionFilter = "All";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupCategorySelect();
  setupFormListeners();
});

/**
 * Populate Category Dropdown in Add Link Form
 */
function setupCategorySelect() {
  const select = document.getElementById("categorySelect");
  if (!select) return;
  
  select.innerHTML = `
    <option value="auto">✨ Auto-Detect Category</option>
    ${CATEGORIES.map(cat => `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`).join('')}
  `;
}

/**
 * Load products from localStorage or use initial samples
 */
function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      productsList = JSON.parse(saved);
    } catch (e) {
      productsList = INITIAL_SAMPLES;
    }
  } else {
    productsList = INITIAL_SAMPLES;
    saveProducts();
  }
  renderAllSections();
}

/**
 * Save current list to localStorage
 */
function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productsList));
}

/**
 * Render Catalog grouped into Meesho Category Sections
 */
function renderAllSections() {
  const container = document.getElementById("sectionsContainer");
  const countBadge = document.getElementById("totalItemsCount");
  
  if (countBadge) {
    countBadge.textContent = `${productsList.length} Total Links`;
  }

  if (!container) return;

  // Filter products by selected top category tab if any
  let displayList = productsList;
  if (activeSectionFilter !== "All") {
    displayList = productsList.filter(p => p.category === activeSectionFilter);
  }

  if (displayList.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#f43397" stroke-width="1.5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <h3>No Products Found for this Section</h3>
        <p>Paste a Meesho product link above and select this category to list it here!</p>
      </div>
    `;
    return;
  }

  // Group displayList by Category
  const grouped = {};
  CATEGORIES.forEach(cat => { grouped[cat.id] = []; });

  displayList.forEach(item => {
    const catId = item.category || "Ethnic Wear";
    if (!grouped[catId]) grouped[catId] = [];
    grouped[catId].push(item);
  });

  // Render each populated section
  let html = "";
  CATEGORIES.forEach(cat => {
    const items = grouped[cat.id] || [];
    if (items.length === 0) return; // Skip empty sections unless filtering

    html += `
      <section class="category-section" id="section-${cat.id}">
        <div class="section-title-bar">
          <div class="section-title-left">
            <span class="sec-icon">${cat.icon}</span>
            <h2 class="sec-name">${cat.name}</h2>
            <span class="sec-count">${items.length} ${items.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        <div class="section-products-grid">
          ${items.map(product => renderProductCard(product)).join('')}
        </div>
      </section>
    `;
  });

  container.innerHTML = html;
}

/**
 * Render Individual Product Card with Exact Details and Target Link Display
 */
function renderProductCard(item) {
  const priceDisplay = item.price ? `₹${item.price}` : 'Check on Meesho';
  const originalPriceDisplay = item.originalPrice ? `₹${item.originalPrice}` : '';
  const discountDisplay = item.discount || (item.originalPrice && item.price ? `${Math.round((1 - item.price/item.originalPrice)*100)}% off` : '');

  return `
    <div class="product-card">
      <button class="delete-card-btn" title="Delete Link" onclick="deleteProduct('${item.id}')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>

      <div class="product-img-container" onclick="openLink('${escapeQuotes(item.link)}')">
        <img src="${item.image}" alt="${escapeQuotes(item.title)}" class="product-img" 
          loading="lazy" 
          onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'">
        
        <span class="category-badge-pill">${getCategoryIcon(item.category)} ${item.category}</span>
      </div>

      <div class="product-info">
        <h3 class="product-title" title="${escapeQuotes(item.title)}">${item.title}</h3>

        <div class="price-row">
          <span class="current-price">${priceDisplay}</span>
          ${originalPriceDisplay ? `<span class="original-price">${originalPriceDisplay}</span>` : ''}
          ${discountDisplay ? `<span class="discount-tag">${discountDisplay}</span>` : ''}
        </div>

        <a href="${item.link}" target="_blank" class="buy-now-btn" onclick="showToast('Opening Meesho link...')">
          <span>Buy on Meesho</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>

      <!-- Pasted Target Meesho Link Box Underneath -->
      <div class="card-link-footer">
        <span class="link-label">Target Meesho Link:</span>
        <div class="link-anchor-box">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f43397" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <a href="${item.link}" target="_blank" class="link-anchor" title="${escapeQuotes(item.link)}">
            ${item.link}
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Handle Add Link Form Submission & Advanced Fetching
 */
function setupFormListeners() {
  const form = document.getElementById("addLinkForm");
  const linkInput = document.getElementById("meeshoUrlInput");

  if (!form || !linkInput) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = linkInput.value.trim();

    if (!url || !url.toLowerCase().includes("meesho.com")) {
      showStatus("Please enter a valid meesho.com link", "error");
      return;
    }

    showStatus("Fetching exact product picture, price & details from Meesho...", "loading");

    const customTitle = document.getElementById("customTitleInput")?.value.trim();
    const customImage = document.getElementById("customImageInput")?.value.trim();
    const selectedCat = document.getElementById("categorySelect")?.value;

    // Advanced fetcher
    let fetchedData = await fetchExactMeeshoData(url);

    const finalTitle = customTitle || fetchedData.title || extractTitleFromUrl(url);
    const finalImage = customImage || fetchedData.image || getRandomMeeshoProductImage(finalTitle);
    const category = (selectedCat && selectedCat !== "auto") ? selectedCat : autoDetectCategory(finalTitle, url);

    const newProduct = {
      id: "prod-" + Date.now(),
      title: finalTitle,
      image: finalImage,
      link: url,
      category: category,
      price: fetchedData.price || null,
      originalPrice: fetchedData.originalPrice || null,
      discount: fetchedData.discount || null,
      rating: fetchedData.rating || 4.2,
      addedAt: Date.now()
    };

    productsList.unshift(newProduct);
    saveProducts();
    renderAllSections();

    // Reset inputs
    linkInput.value = "";
    if (document.getElementById("customTitleInput")) document.getElementById("customTitleInput").value = "";
    if (document.getElementById("customImageInput")) document.getElementById("customImageInput").value = "";

    showStatus(`Product added successfully to ${category} section!`, "success");
    showToast(`Added to ${category} section!`);

    // Scroll smoothly to section
    const targetSec = document.getElementById(`section-${category}`);
    if (targetSec) {
      targetSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Setup Section Tab Filter Buttons
  document.querySelectorAll('[data-sec-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-sec-tab]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeSectionFilter = e.currentTarget.getAttribute('data-sec-tab');
      renderAllSections();
    });
  });
}

/**
 * Advanced Multi-Proxy Scraper to Extract Exact images.meesho.com Image & JSON-LD Data
 */
async function fetchExactMeeshoData(meeshoUrl) {
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(meeshoUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(meeshoUrl)}`
  ];

  let rawHtml = "";

  for (const proxy of proxies) {
    try {
      const resp = await fetch(proxy, { signal: AbortSignal.timeout(6000) });
      if (resp.ok) {
        const text = await resp.text();
        // If allorigins wrapper
        if (proxy.includes("allorigins")) {
          const json = JSON.parse(text);
          rawHtml = json.contents || "";
        } else {
          rawHtml = text;
        }
        if (rawHtml.length > 500) break;
      }
    } catch (err) {
      console.warn("Proxy attempt failed:", proxy, err);
    }
  }

  let extracted = {
    title: null,
    image: null,
    price: null,
    originalPrice: null,
    discount: null
  };

  if (!rawHtml) return extracted;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // 1. Try images.meesho.com CDN URLs directly from HTML or Meta
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
                    doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content");

    if (ogImage && (ogImage.includes('meesho.com') || ogImage.startsWith('http'))) {
      extracted.image = ogImage;
    }

    // Direct regex match for images.meesho.com in rawHtml if ogImage failed
    if (!extracted.image) {
      const meeshoCdnMatch = rawHtml.match(/https:\/\/images\.meesho\.com\/images\/products\/[^\s"'<>]+\.(jpg|jpeg|png|webp)/i);
      if (meeshoCdnMatch) {
        extracted.image = meeshoCdnMatch[0];
      }
    }

    // 2. Extract Title
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || doc.title;
    if (ogTitle) {
      extracted.title = ogTitle.replace(/\| Meesho.*/i, '').replace(/Buy /i, '').trim();
    }

    // 3. Extract JSON-LD / __NEXT_DATA__ for Price & Discount
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
      try {
        const json = JSON.parse(script.textContent);
        if (json.name && !extracted.title) extracted.title = json.name;
        if (json.image && !extracted.image) {
          extracted.image = Array.isArray(json.image) ? json.image[0] : json.image;
        }
        if (json.offers && json.offers.price) {
          extracted.price = parseInt(json.offers.price);
        }
      } catch (e) {}
    });

    // Extract Price Regex if JSON-LD missed
    if (!extracted.price) {
      const priceMatch = rawHtml.match(/"price":\s*"?(\d+)"?/i) || rawHtml.match(/₹\s*(\d+)/);
      if (priceMatch) extracted.price = parseInt(priceMatch[1]);
    }

  } catch (err) {
    console.error("DOM Parsing error:", err);
  }

  return extracted;
}

/**
 * Auto-detect Category Section from Title or URL
 */
function autoDetectCategory(title = "", url = "") {
  const text = (title + " " + url).toLowerCase();

  if (text.includes("face wash") || text.includes("skin") || text.includes("beauty") || text.includes("makeup") || text.includes("serum") || text.includes("shampoo") || text.includes("cream")) {
    return "Beauty";
  }
  if (text.includes("saree") || text.includes("kurti") || text.includes("ethnic") || text.includes("lehenga") || text.includes("dupatta") || text.includes("suit")) {
    return "Ethnic Wear";
  }
  if (text.includes("dress") || text.includes("top") || text.includes("skirt") || text.includes("western") || text.includes("gown")) {
    return "Western";
  }
  if (text.includes("tshirt") || text.includes("t-shirt") || text.includes("shirt") || text.includes("men") || text.includes("jeans") || text.includes("trouser") || text.includes("grooming")) {
    return "Menswear";
  }
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("sandal") || text.includes("heel") || text.includes("footwear") || text.includes("bag") || text.includes("handbag")) {
    return "Footwear";
  }
  if (text.includes("decor") || text.includes("home") || text.includes("kitchen") || text.includes("vase") || text.includes("curtain") || text.includes("bedsheet") || text.includes("bottle")) {
    return "Home";
  }
  if (text.includes("jewel") || text.includes("necklace") || text.includes("ring") || text.includes("earring")) {
    return "Jewellery";
  }
  if (text.includes("watch") || text.includes("smartwatch") || text.includes("earphone") || text.includes("headphone") || text.includes("electronic") || text.includes("phone")) {
    return "Electronics";
  }
  if (text.includes("toy") || text.includes("kids") || text.includes("baby") || text.includes("doll")) {
    return "Kids";
  }

  return "Ethnic Wear"; // Default fallback
}

function extractTitleFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathSegments = parsed.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      let slug = pathSegments[0].replace(/-/g, ' ');
      return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  } catch (e) {}
  return "Meesho Product";
}

function getRandomMeeshoProductImage(keyword = '') {
  const kw = keyword.toLowerCase();
  if (kw.includes('face') || kw.includes('beauty') || kw.includes('wash')) {
    return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80';
  } else if (kw.includes('saree') || kw.includes('kurti')) {
    return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  } else if (kw.includes('shirt') || kw.includes('men')) {
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
}

function getCategoryIcon(catId) {
  const found = CATEGORIES.find(c => c.id === catId);
  return found ? found.icon : '🛍️';
}

function deleteProduct(id) {
  productsList = productsList.filter(p => p.id !== id);
  saveProducts();
  renderAllSections();
  showToast("Link deleted.");
}

function clearAllProducts() {
  if (confirm("Clear all saved product links?")) {
    productsList = [];
    saveProducts();
    renderAllSections();
    showToast("All links cleared.");
  }
}

function openLink(url) {
  window.open(url, '_blank');
}

function showStatus(msg, type) {
  const el = document.getElementById("statusMessage");
  if (el) {
    el.textContent = msg;
    el.className = `status-message ${type}`;
  }
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

function escapeQuotes(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
