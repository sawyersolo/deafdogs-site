import React, { useEffect, useMemo, useRef, useState } from 'react'

// Shopify Buy Button (Storefront SDK) embed, implemented in a React-safe way.
// Supports: Collection grid (preferred) or ProductSet fallback.

const SDK_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'

function loadShopifySdk() {
  return new Promise((resolve, reject) => {
    if (window.ShopifyBuy && window.ShopifyBuy.UI) return resolve()

    const existing = document.querySelector(`script[src="${SDK_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Shopify SDK')))
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = SDK_URL
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Shopify SDK'))
    document.body.appendChild(script)
  })
}

export default function ShopifyMerchEmbed({ className = '' }) {
  const mountRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  const config = useMemo(() => {
    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN
    const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
    const collectionId = import.meta.env.VITE_SHOPIFY_COLLECTION_ID
    const productIdsRaw = import.meta.env.VITE_SHOPIFY_PRODUCT_IDS
    const productIds = productIdsRaw
      .split(',')
      .map(s => s.trim()) 
      .filter(Boolean)

    return { domain, token, collectionId, productIds }
  }, [])

  useEffect(() => {
    let destroyed = false
    let uiInstance = null

    async function init() {
      try {
        await loadShopifySdk()
        if (destroyed) return

        const { domain, token, collectionId, productIds } = config
        if (!domain || !token) throw new Error('Missing Shopify domain/token')

        const client = window.ShopifyBuy.buildClient({ domain, storefrontAccessToken: token })
        uiInstance = await window.ShopifyBuy.UI.onReady(client)
        if (destroyed) return

        // Clear mount (important for HMR / route re-entry)
        if (mountRef.current) mountRef.current.innerHTML = ''

        const baseOptions = {
          // Visual match to the site (dark, teal accents, rounded)
          product: {
            styles: {
              product: {
                'background-color': 'transparent',
                'text-align': 'left',
                'max-width': '100%',
              },
              title: {
                color: '#e5e7eb',
                'font-size': '1rem',
                'font-weight': '700',
                'letter-spacing': '0.02em',
              },
              price: {
                color: '#81e6dd',
                'font-size': '0.95rem',
                'font-weight': '600',
              },
              compareAt: {
                color: 'rgba(229,231,235,0.6)',
              },
              description: {
                color: 'rgba(229,231,235,0.75)',
              },
              button: {
                'font-family': 'Roboto, system-ui, -apple-system, Segoe UI, sans-serif',
                'font-weight': '800',
                'letter-spacing': '0.06em',
                'text-transform': 'uppercase',
                color: '#81e6dd',
                'background-color': '#37433e',
                ':hover': {
                  color: '#81e6dd',
                  'background-color': '#323c38',
                },
                ':focus': {
                  'background-color': '#323c38',
                },
                'border-radius': '14px',
                padding: '14px 18px',
              },
              select: {
                'background-color': 'rgba(15, 20, 18, 0.8)',
                color: '#e5e7eb',
                border: '1px solid rgba(129,230,221,0.25)',
                'border-radius': '12px',
                padding: '12px 12px',
              },
              option: {
                color: '#0f1412',
              },
              quantityInput: {
                'background-color': 'rgba(15, 20, 18, 0.8)',
                color: '#e5e7eb',
                border: '1px solid rgba(129,230,221,0.25)',
                'border-radius': '12px',
                padding: '10px 12px',
              },
            },
            text: {
              button: 'Add to cart',
              outOfStock: 'Sold out',
            },
            googleFonts: ['Roboto'],
          },

          option: {
            styles: {
              label: {
                color: 'rgba(229,231,235,0.75)',
                'font-size': '0.85rem',
                'font-weight': '600',
                'margin-bottom': '6px',
              },
              select: {
                'background-color': 'rgba(15, 20, 18, 0.8)',
                color: '#e5e7eb',
                border: '1px solid rgba(129,230,221,0.25)',
                'border-radius': '12px',
                padding: '12px 12px',
              },
            },
          },

          modalProduct: {
            contents: {
              img: true,
              imgWithCarousel: true,
              title: true,
              price: true,
              button: true,
              buttonWithQuantity: true,
              quantity: true,
            },
            styles: {
              product: {
                'background-color': '#0f1412',
                color: '#e5e7eb',
              },
              title: {
                color: '#e5e7eb',
              },
              price: {
                color: '#81e6dd',
              },
              button: {
                'font-family': 'Roboto, system-ui, -apple-system, Segoe UI, sans-serif',
                'font-weight': '800',
                'letter-spacing': '0.06em',
                'text-transform': 'uppercase',
                color: '#81e6dd',
                'background-color': '#37433e',
                ':hover': { 'background-color': '#323c38' },
                ':focus': { 'background-color': '#323c38' },
                'border-radius': '14px',
              },
              select: {
                'background-color': 'rgba(15, 20, 18, 0.8)',
                color: '#e5e7eb',
                border: '1px solid rgba(129,230,221,0.25)',
                'border-radius': '12px',
              },
            },
            text: {
              button: 'Add to cart',
              outOfStock: 'Sold out',
            },
          },

          cart: {
            popup: false,
            styles: {
              cart: { 'background-color': '#0f1412' },
              title: { color: '#e5e7eb' },
              header: { color: '#e5e7eb' },
              lineItems: { color: '#e5e7eb' },
              subtotalText: { color: '#81e6dd' },
              subtotal: { color: '#81e6dd' },
              notice: { color: 'rgba(229,231,235,0.75)' },
              button: {
                'font-family': 'Roboto, system-ui, -apple-system, Segoe UI, sans-serif',
                'font-weight': '800',
                'letter-spacing': '0.06em',
                'text-transform': 'uppercase',
                color: '#81e6dd',
                'background-color': '#37433e',
                ':hover': { 'background-color': '#323c38' },
                ':focus': { 'background-color': '#323c38' },
                'border-radius': '14px',
              },
            },
            text: { total: 'Subtotal', button: 'Checkout' },
            googleFonts: ['Roboto'],
          },

          toggle: {
            styles: {
              toggle: {
                'font-family': 'Roboto, system-ui, -apple-system, Segoe UI, sans-serif',
                'font-weight': '800',
                'background-color': '#37433e',
                ':hover': { 'background-color': '#323c38' },
                ':focus': { 'background-color': '#323c38' },
                'border-radius': '999px',
              },
              count: { color: '#81e6dd', 'font-weight': '800' },
              iconPath: { fill: '#81e6dd' },
            },
            googleFonts: ['Roboto'],
          },
        }

        // Merch grid
        const productSetGridStyles = {
          products: {
            display: 'grid',
            gap: '22px',
            'grid-template-columns': 'repeat(auto-fit, minmax(220px, 1fr))',
            'align-items': 'stretch',
          },
        }

        const cardSurfaceStyles = {
          product: {
            'background-color': 'rgba(15, 20, 18, 0.55)',
            border: '1px solid rgba(129,230,221,0.14)',
            'border-radius': '18px',
            padding: '18px',
            'box-shadow': '0 8px 26px rgba(0,0,0,0.35)',
            'backdrop-filter': 'blur(10px)',
          },
          imgWrapper: {
            'border-radius': '14px',
            overflow: 'hidden',
          },
        }

        if (collectionId) {
          uiInstance.createComponent('collection', {
            id: String(collectionId),
            node: mountRef.current,
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              ...baseOptions,
              productSet: {
                styles: productSetGridStyles,
              },
              product: {
                ...baseOptions.product,
                styles: {
                  ...baseOptions.product.styles,
                  ...cardSurfaceStyles,
                },
              },
            },
          })
        } else {
          // Fallback: fixed product IDs as a grid.
          uiInstance.createComponent('productSet', {
            node: mountRef.current,
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              ...baseOptions,
              productSet: {
                styles: productSetGridStyles,
              },
              product: {
                ...baseOptions.product,
                styles: {
                  ...baseOptions.product.styles,
                  ...cardSurfaceStyles,
                },
              },
            },
            contents: { products: true },
            // BuyButton UI uses search terms, but productSet accepts productIds via "products" option in some versions.
            // To keep this embed stable across SDK versions, we create multiple product components if productSet can't filter.
          })

          // Create individual products (ensures the right SKUs show, and preserves grid layout)
          // We mount each product into its own div.
          if (productIds.length) {
            mountRef.current.innerHTML = ''
            const grid = document.createElement('div')
            grid.className = 'shopify-merch-grid'
            mountRef.current.appendChild(grid)

            for (const pid of productIds) {
              const slot = document.createElement('div')
              grid.appendChild(slot)
              uiInstance.createComponent('product', {
                id: String(pid),
                node: slot,
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: {
                  ...baseOptions,
                  product: {
                    ...baseOptions.product,
                    styles: { ...baseOptions.product.styles, ...cardSurfaceStyles },
                  },
                },
              })
            }
          }
        }

        setReady(true)
      } catch (e) {
        console.error(e)
        setError(e?.message || 'Shopify embed failed to load')
      }
    }

    init()

    return () => {
      destroyed = true
      try {
        // UI exposes destroy() in some versions; safe-guard.
        if (uiInstance && typeof uiInstance.destroy === 'function') uiInstance.destroy()
      } catch (_) {}
    }
  }, [config])

  return (
    <div className={`shopify-embed ${className}`}>
      {!ready && !error && (
        <div className="shopify-loading">Loading merch…</div>
      )}
      {error && (
        <div className="shopify-error">
          <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Merch isn’t loading</div>
          <div style={{ opacity: 0.8, fontSize: '0.95rem' }}>{error}</div>
          <div style={{ opacity: 0.7, fontSize: '0.85rem', marginTop: '0.75rem' }}>
            Tip: set <code>VITE_SHOPIFY_COLLECTION_ID</code> in <code>.env</code> (see <code>.env.example</code>).
          </div>
        </div>
      )}
      <div ref={mountRef} />
    </div>
  )
}
