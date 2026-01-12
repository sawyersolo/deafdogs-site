# Deaf Dogs Website (Netlify / Vite)

## Dev

```bash
npm install
npm run dev
```

## Shopify merch

This site uses Shopify's Buy Button SDK (Storefront API) to render a **collection grid** on `/merch`.

1. Copy `.env.example` to `.env`
2. Set `VITE_SHOPIFY_COLLECTION_ID` to the numeric collection ID from Shopify Admin.

If you don't set a collection ID, the merch page will fall back to `VITE_SHOPIFY_PRODUCT_IDS` (comma-separated product IDs).

## Build / Deploy

```bash
npm run build
```

Deploy the `dist/` output with Netlify.
