const devicesGrid = document.getElementById("devices-grid");
const devicesStatus = document.getElementById("devices-status");
const devicesTime = document.getElementById("devices-time");
const filterButtons = document.querySelectorAll(".device-filter");

const categoryConfig = {
  iphone: { query: "iphone", label: "iPhone" },
  ipad: { query: "ipad", label: "iPad" },
  pixel: { query: "google pixel", label: "Google Pixel" },
  macbook: { query: "macbook", label: "MacBook" }
};

function setStatus(text, className) {
  if (!devicesStatus) return;
  devicesStatus.textContent = text;
  devicesStatus.className = `phone-status ${className || ""}`.trim();
}

function setTimeLabel() {
  if (!devicesTime) return;
  devicesTime.textContent = `Last updated: ${new Date().toLocaleString()}`;
}

function buildCardHTML(item) {
  const title = item.title || "Device";
  const price = typeof item.price === "number" ? `$${item.price.toLocaleString()}` : "Price unavailable";
  const brand = item.brand || "Unknown brand";
  const link = item.id ? `https://dummyjson.com/products/${item.id}` : "https://dummyjson.com/products";
  const image = item.thumbnail || item.images?.[0] || "https://via.placeholder.com/540x360?text=No+Image";

  return `
    <article class="device-card">
      <img src="${image}" alt="${title}" loading="lazy" referrerpolicy="no-referrer">
      <div class="device-card-body">
        <h3>${title}</h3>
        <p class="device-price">${price}</p>
        <p class="device-location">${brand}</p>
        <a href="${link}" target="_blank" rel="noopener noreferrer">View API Item</a>
      </div>
    </article>
  `;
}

async function fetchCategory(categoryKey) {
  const config = categoryConfig[categoryKey];
  if (!config || !devicesGrid) return;

  setStatus("Loading...", "status-loading");
  devicesGrid.innerHTML = "<p class=\"device-empty\">Loading products...</p>";

  try {
    const params = new URLSearchParams({ q: config.query, limit: "12" });
    const response = await fetch(`https://dummyjson.com/products/search?${params.toString()}`);
    if (!response.ok) throw new Error("Request failed");

    const data = await response.json();
    const products = Array.isArray(data?.products) ? data.products : [];
    const topResults = products.slice(0, 12);

    if (!topResults.length) {
      devicesGrid.innerHTML = `<p class="device-empty">No ${config.label} listings found right now.</p>`;
      setStatus("No Data", "status-loading");
      setTimeLabel();
      return;
    }

    devicesGrid.innerHTML = topResults.map(buildCardHTML).join("");
    setStatus("Live", "status-live");
    setTimeLabel();
  } catch (error) {
    devicesGrid.innerHTML = "<p class=\"device-empty\">Unable to fetch device prices right now. Try again shortly.</p>";
    setStatus("Error", "status-error");
  }
}

function setActiveButton(activeKey) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.category === activeKey;
    button.classList.toggle("active", isActive);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedKey = button.dataset.category;
    setActiveButton(selectedKey);
    fetchCategory(selectedKey);
  });
});

fetchCategory("iphone");
