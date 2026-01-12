import React from 'react'
import ShopifyMerchEmbed from '../components/ShopifyMerchEmbed.jsx'

export default function Merch() {
  return (
    <section className="section merch-section">
      <div className="merch-inner">
        <div className="section-heading">Merch</div>
        <p className="section-sub">
          Limited runs built around the Deaf Dogs palette — teal flashes, worn textures,
          and art that feels like a frame from a show you half-remember.
        </p>

        <div className="merch-embed-wrap merch-animate" style={{ marginTop: '2rem' }}>
          <ShopifyMerchEmbed />
        </div>
        </div>
    </section>
  )
}
