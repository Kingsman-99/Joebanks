const forexList = document.getElementById("forex-list");
const cryptoList = document.getElementById("crypto-list");
const forexStatus = document.getElementById("forex-status");
const cryptoStatus = document.getElementById("crypto-status");
const marketTime = document.getElementById("market-time");
const refreshBtn = document.getElementById("refresh-market");

const forexPairs = ["EUR", "GBP", "JPY", "CAD", "NGN"];
const cryptoCoins = ["bitcoin", "ethereum", "solana", "ripple", "binancecoin"];
const coinLabels = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  ripple: "XRP",
  binancecoin: "BNB"
};

let previousForexRates = {};
let previousCryptoPrices = {};

function setListLoading(target) {
  if (!target) return;
  target.innerHTML = "<li>Loading data...</li>";
}

function setStatus(target, text, color) {
  if (!target) return;
  target.textContent = text;
  target.style.background = color;
}

function updateTime() {
  if (!marketTime) return;
  const now = new Date();
  marketTime.textContent = `Last updated: ${now.toLocaleString()}`;
}

function getDelta(currentValue, previousValue) {
  if (typeof currentValue !== "number" || typeof previousValue !== "number") {
    return { text: "--", className: "delta-flat" };
  }

  if (currentValue > previousValue) {
    const percent = ((currentValue - previousValue) / previousValue) * 100;
    return { text: `▲ ${percent.toFixed(2)}%`, className: "delta-up" };
  }

  if (currentValue < previousValue) {
    const percent = ((previousValue - currentValue) / previousValue) * 100;
    return { text: `▼ ${percent.toFixed(2)}%`, className: "delta-down" };
  }

  return { text: "● 0.00%", className: "delta-flat" };
}

function renderPriceItem(label, amount, delta) {
  return `<span>${label}</span><span class="value-wrap"><strong>${amount}</strong><small class="delta ${delta.className}">${delta.text}</small></span>`;
}

async function fetchForex() {
  setStatus(forexStatus, "Loading", "#ffd166");
  setListLoading(forexList);

  try {
    const url = `https://api.exchangerate.host/latest?base=USD&symbols=${forexPairs.join(",")}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Forex request failed");

    const data = await response.json();
    const rates = data.rates || {};

    if (!forexList) return;
    forexList.innerHTML = "";

    forexPairs.forEach((pair) => {
      const currentValue = rates[pair];
      const previousValue = previousForexRates[pair];
      const delta = getDelta(currentValue, previousValue);
      const amount = typeof currentValue === "number" ? currentValue.toFixed(4) : "N/A";

      const li = document.createElement("li");
      li.innerHTML = renderPriceItem(`USD/${pair}`, amount, delta);
      forexList.appendChild(li);
    });

    previousForexRates = rates;
    setStatus(forexStatus, "Live", "#31d0a0");
  } catch (error) {
    if (forexList) {
      forexList.innerHTML = "<li>Unable to load forex prices now.</li>";
    }
    setStatus(forexStatus, "Error", "#ff7b7b");
  }
}

async function fetchCrypto() {
  setStatus(cryptoStatus, "Loading", "#ffd166");
  setListLoading(cryptoList);

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCoins.join(",")}&vs_currencies=usd`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Crypto request failed");

    const data = await response.json();

    if (!cryptoList) return;
    cryptoList.innerHTML = "";

    cryptoCoins.forEach((coin) => {
      const currentPrice = data[coin]?.usd;
      const previousPrice = previousCryptoPrices[coin];
      const delta = getDelta(currentPrice, previousPrice);
      const label = coinLabels[coin] || coin;
      const amount = typeof currentPrice === "number" ? `$${currentPrice.toLocaleString()}` : "N/A";

      const li = document.createElement("li");
      li.innerHTML = renderPriceItem(label, amount, delta);
      cryptoList.appendChild(li);
    });

    previousCryptoPrices = Object.fromEntries(
      cryptoCoins.map((coin) => [coin, data[coin]?.usd])
    );

    setStatus(cryptoStatus, "Live", "#31d0a0");
  } catch (error) {
    if (cryptoList) {
      cryptoList.innerHTML = "<li>Unable to load crypto prices now.</li>";
    }
    setStatus(cryptoStatus, "Error", "#ff7b7b");
  }
}

async function loadMarketData() {
  if (!refreshBtn) return;
  refreshBtn.disabled = true;
  refreshBtn.textContent = "Refreshing...";

  await Promise.all([fetchForex(), fetchCrypto()]);
  updateTime();

  refreshBtn.disabled = false;
  refreshBtn.textContent = "Refresh Market Data";
}

if (refreshBtn && forexList && cryptoList) {
  refreshBtn.addEventListener("click", loadMarketData);
  loadMarketData();
}
