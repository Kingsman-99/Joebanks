# Joebanks Website

Responsive personal forex website for Joebanks, with:

- Personal/mentorship landing page
- Live Forex and Crypto market section
- Dedicated devices page (`phones.html`) for iPhone, iPad, Google Pixel, and MacBook listings

## Project Structure

- `index.html` - Main landing page
- `styles.css` - Shared styling
- `app.js` - Live forex/crypto fetch logic
- `phones.html` - Devices listing page
- `phones.js` - Devices API fetch/render logic

## Run Locally

This is a static website, so no build step is required.

1. Open `index.html` directly in your browser, or
2. Run a simple local server from the `Joebanks` folder:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## APIs Used

- Forex rates: `https://api.exchangerate.host/latest`
- Crypto prices: `https://api.coingecko.com/api/v3/simple/price`
- Device data: `https://dummyjson.com/products/search`

## Notes

- API results can vary by availability and rate limits.
- Device prices are provider data and may not match local in-store pricing exactly.
