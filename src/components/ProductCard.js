"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { PriceTag, categoryLabel, useDeal, whatsappNotifyUrl } from './ShopUI';
import { isComingSoon } from '@/data/campaign';
import { FALLBACK_PRODUCTS } from '@/data/products';

const PAGE_IDS = new Set(FALLBACK_PRODUCTS.map((p) => p.id));

export default function ProductCard({ product }) {
  const { setSelectedProduct, settings } = useCart();

  const startingPrice = product.sizes && product.sizes.length > 0
    ? Math.min(...product.sizes.map((s) => Number(s.price) || 0))
    : 0;
  const { percent } = useDeal(product, startingPrice);
  const comingSoon = isComingSoon(product);
  const outOfStock = product.inStock === false;
  const open = () => setSelectedProduct(product);
  const hasPage = PAGE_IDS.has(product.id);

  return (
    <article className={`product-card ${percent ? 'has-deal' : ''} ${comingSoon ? 'is-coming-soon' : ''}`}>
      <div
        className={`card-image-wrapper ${outOfStock ? 'out-of-stock' : ''}`}
        onClick={open}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
        aria-label={`Quick view: ${product.title}`}
      >
        {percent > 0 ? (
          <span className="card-badge badge-deal">-{percent}% · Black November</span>
        ) : product.tag ? (
          <span className={`card-badge ${product.tag === 'NEW' ? 'badge-new' : ''} ${comingSoon ? 'badge-soon' : ''}`}>{product.tag}</span>
        ) : null}
        {outOfStock && !comingSoon && (
          <div className="out-of-stock-overlay"><span className="out-of-stock-text">Out of Stock</span></div>
        )}
        {comingSoon && <div className="coming-soon-ribbon">Coming Soon</div>}
        {product.image && (
          <img src={product.image} alt={product.title} className="card-product-image" loading="lazy" decoding="async" />
        )}
        <span className="card-quickview">Quick view</span>
      </div>

      <div className="card-info">
        <span className="card-category">{categoryLabel(product.category)}</span>
        <h3 className="card-title">
          {hasPage ? (
            <Link href={`/products/${product.id}`}>{product.title}</Link>
          ) : (
            <button type="button" className="card-title-btn" onClick={open}>{product.title}</button>
          )}
        </h3>
        <p className="card-desc" onClick={open}>{product.desc}</p>

        {product.sizes && product.sizes.length > 0 && !comingSoon && (
          <div className="card-sizes-pills">
            {product.sizes.map((s, idx) => (
              <span key={`${product.id}-size-${idx}`} className="size-pill">{s.size}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <div className="card-price-col">
            <span className="card-price-label">{product.sizes && product.sizes.length > 1 ? 'From' : 'Price'}</span>
            <PriceTag product={product} basePrice={startingPrice} />
          </div>
        </div>

        {comingSoon ? (
          <a
            className="btn btn-secondary card-cta-btn"
            href={whatsappNotifyUrl(settings.whatsappNumber, product)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Notify me on WhatsApp
          </a>
        ) : outOfStock ? (
          <button type="button" className="btn btn-secondary card-cta-btn out-of-stock-btn" disabled>Out of Stock</button>
        ) : (
          <button type="button" className="btn btn-primary card-cta-btn" onClick={open}>
            {percent ? 'Grab the Deal' : 'Choose Options'}
          </button>
        )}
      </div>
    </article>
  );
}
