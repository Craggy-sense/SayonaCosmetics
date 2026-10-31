"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { PriceTag, SizePills, categoryLabel, defaultSizeIdx, sizeImage, useDeal, whatsappNotifyUrl } from './ShopUI';
import { dealPrice } from '@/data/campaign';
import { track } from '@/lib/track';
import { isComingSoon } from '@/data/campaign';
import { FALLBACK_PRODUCTS } from '@/data/products';

const PAGE_IDS = new Set(FALLBACK_PRODUCTS.map((p) => p.id));

export default function ProductCard({ product }) {
  const { setSelectedProduct, settings, addToCart } = useCart();

  const [sizeIdx, setSizeIdx] = useState(() => defaultSizeIdx(product));
  const sizes = product.sizes || [];
  const selected = sizes[sizeIdx] || sizes[0];
  const shownPrice = selected ? Number(selected.price) || 0 : 0;
  const { percent } = useDeal(product, shownPrice);
  const comingSoon = isComingSoon(product);
  const outOfStock = product.inStock === false;
  const photo = sizeImage(product, sizeIdx);
  // Quick view opens on the size the shopper picked on the card
  const open = () => setSelectedProduct({ ...product, initialSize: sizeIdx });
  const hasPage = PAGE_IDS.has(product.id);

  // One-tap add of the size shown on the card (no popup) — fastest path on phones
  const quickAdd = () => {
    if (!selected) return open();
    const price = dealPrice(shownPrice, percent);
    addToCart({ ...product, image: photo }, { ...selected, price, rrp: shownPrice }, 1, { open: false });
    track('add_to_cart', { value: price, items: [{ id: product.id, title: product.title, size: selected.size, price, qty: 1 }] });
  };

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
          <span className="card-badge badge-deal">-{percent}%<span className="badge-long"> · Black November</span></span>
        ) : product.tag ? (
          <span className={`card-badge ${product.tag === 'NEW' ? 'badge-new' : ''} ${comingSoon ? 'badge-soon' : ''}`}>{product.tag}</span>
        ) : null}
        {outOfStock && !comingSoon && (
          <div className="out-of-stock-overlay"><span className="out-of-stock-text">Out of Stock</span></div>
        )}
        {comingSoon && <div className="coming-soon-ribbon">Coming Soon</div>}
        {photo && (
          <img
            key={photo}
            src={photo}
            alt={`${product.title}${selected && sizes.length > 1 ? ` ${selected.size}` : ''}`}
            className="card-product-image"
            loading="lazy"
            decoding="async"
          />
        )}
        {selected && sizes.length > 1 && !comingSoon && (selected.image || product.groupImage) && (
          <span className="card-size-chip">{selected.size}{selected.image ? '' : ' · range photo'}</span>
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

        {!comingSoon && sizes.length > 1 && (
          <SizePills product={product} sizeIdx={sizeIdx} onSelect={setSizeIdx} compact />
        )}
        {!comingSoon && sizes.length === 1 && (
          <div className="card-sizes-pills"><span className="size-pill">{sizes[0].size}</span></div>
        )}

        <div className="card-footer">
          <div className="card-price-col">
            <span className="card-price-label">{selected && sizes.length > 1 ? selected.size : 'Price'}</span>
            <PriceTag product={product} basePrice={shownPrice} />
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
          <button type="button" className="btn btn-primary card-cta-btn" onClick={quickAdd} aria-label={`Add ${product.title}${selected ? ` ${selected.size}` : ''} to cart`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            <span>Add to cart</span>
          </button>
        )}
      </div>
    </article>
  );
}
