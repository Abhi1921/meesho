/**
 * Meesho Link Extractor & Custom Showcase Engine
 * Enables pasting Meesho product URLs, auto-fetching metadata/images,
 * displaying products with target links underneath, and localStorage persistence.
 */

const STORAGE_KEY = "meesho_pasted_products_v1";

// Initial sample links if localStorage is empty
const INITIAL_SAMPLES = [
  {
    id: "sample-1",
    title: "Trendy Embroidered Rayon Kurti Set",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    link: "https://www.meesho.com/sarees/p/1xxxx",
    addedAt: Date.now()
  },
  {
    id: "sample-2",
    title: "Aagam Fashionable Ethnic Saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    link: "https://www.meesho.com/kurtis/p/2xxxx",
    addedAt: Date.now() - 1000
  },
  {
    id: "sample-3",
    title: "Men Cotton Printed Oversized T-Shirt",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    link: "https://www.meesho.com/mens-tshirts/p/4xxxx",
    addedAt: Date.now() - 2000
  }
];

let productsList = [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupFormListeners();
});

/**
 * Load products from localStorage or initialize with samples
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
  renderGrid();
}

/**
 * Save current list to localStorage
 */
function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productsList));
}

/**
 * Render Product Cards Grid
 */
function renderGrid() {
  const grid = document.getElementById("productsGrid");
  const countBadge = document.getElementById("productCount");
  
  if (countBadge) {
    countBadge.textContent = `${productsList.length} Items`;
  }

  if (!grid) return;

  if (productsList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 14px; border: 2px dashed #f0e0ed;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#f43397" stroke-width="1.5">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <h3 style="margin-top: 14px; font-size: 20px; color: #333; font-family: 'Outfit', sans-serif;">No Meesho Links Added Yet</h3>
        <p style="color: #666; font-size: 14px; margin-top: 6px;">Paste any Meesho product link above to auto-fetch and add it to your showcase!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = productsList.map(item => `
    <div class="product-card">
      <button class="delete-card-btn" title="Delete Link" onclick="deleteProduct('${item.id}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>

      <div class="product-img-container" onclick="openLink('${escapeQuotes(item.link)}')">
        <img src="${item.image}" alt="${escapeQuotes(item.title)}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'">
      </div>

      <div class="product-info">
        <h3 class="product-title">${item.title}</h3>
        <a href="${item.link}" target="_blank" class="buy-now-btn" onclick="showToast('Opening Meesho link...')">
          <span>Buy on Meesho</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>

      <!-- Pasted Link Display Box Underneath Card -->
      <div class="card-link-footer">
        <span class="link-label">Meesho Product Link:</span>
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
  `).join('');
}

/**
 * Handle Form Submission & Auto Link Fetching
 */
function setupFormListeners() {
  const form = document.getElementById("addLinkForm");
  const linkInput = document.getElementById("meeshoUrlInput");
  const statusMsg = document.getElementById("statusMessage");

  if (!form || !linkInput) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = linkInput.value.trim();

    if (!url) {
      showStatus("Please paste a valid Meesho link", "error");
      return;
    }

    if (!url.toLowerCase().includes("meesho.com")) {
      showStatus("Please make sure the link is from meesho.com", "error");
      return;
    }

    showStatus("Fetching product details & image from Meesho...", "loading");

    // Extract title & image
    const customTitle = document.getElementById("customTitleInput")?.value.trim();
    const customImage = document.getElementById("customImageInput")?.value.trim();

    let fetchedData = await fetchMeeshoMetadata(url);

    const title = customTitle || fetchedData.title || extractTitleFromUrl(url);
    const image = customImage || fetchedData.image || getRandomMeeshoProductImage(title);

    const newProduct = {
      id: "prod-" + Date.now(),
      title: title,
      image: image,
      link: url,
      addedAt: Date.now()
    };

    productsList.unshift(newProduct);
    saveProducts();
    renderGrid();

    linkInput.value = "";
    if (document.getElementById("customTitleInput")) document.getElementById("customTitleInput").value = "";
    if (document.getElementById("customImageInput")) document.getElementById("customImageInput").value = "";

    showStatus("Product successfully added with link!", "success");
    showToast("New Meesho Product Link Added!");
  });
}

/**
 * Attempt to fetch Open Graph Metadata (og:image, og:title) via CORS proxy
 */
async function fetchMeeshoMetadata(meeshoUrl) {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(meeshoUrl)}`;
    const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    const htmlText = data.contents;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
                    doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content");
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || doc.title;

    return {
      title: ogTitle ? ogTitle.replace('| Meesho', '').trim() : null,
      image: ogImage || null
    };
  } catch (err) {
    console.warn("CORS Proxy metadata fetch fallback:", err);
    return { title: null, image: null };
  }
}

/**
 * Extract clean fallback title from URL slug
 */
function extractTitleFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathSegments = parsed.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      let slug = pathSegments[0].replace(/-/g, ' ');
      return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  } catch (e) {}
  return "Meesho Trending Product";
}

/**
 * Fallback product image generator based on keyword
 */
function getRandomMeeshoProductImage(keyword = '') {
  const kw = keyword.toLowerCase();
  if (kw.includes('saree') || kw.includes('kurti') || kw.includes('ethnic')) {
    return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  } else if (kw.includes('shirt') || kw.includes('men') || kw.includes('jean')) {
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
  } else if (kw.includes('shoe') || kw.includes('footwear') || kw.includes('sneaker')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';
  } else if (kw.includes('decor') || kw.includes('home') || kw.includes('vase')) {
    return 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
}

/**
 * Delete a product link by ID
 */
function deleteProduct(id) {
  productsList = productsList.filter(p => p.id !== id);
  saveProducts();
  renderGrid();
  showToast("Product link removed.");
}

/**
 * Clear all added links
 */
function clearAllProducts() {
  if (confirm("Are you sure you want to remove all saved links?")) {
    productsList = [];
    saveProducts();
    renderGrid();
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
