"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { ProductPurchase, categoryLabel } from './ShopUI';
import { FALLBACK_PRODUCTS } from '@/data/products';

const PAGE_IDS = new Set(FALLBACK_PRODUCTS.map((p) => p.id));

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;
  if (!selectedProduct) return null;

  const product = selectedProduct;
  const close = () => setSelectedProduct(null);

  return (
    <div className="product-modal-wrapper" onClick={close}>
      <div
        className="product-modal-container"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={close} aria-label="Close details">✕</button>

        <div className="modal-body-grid">
          <div className="modal-image-panel">
            {product.tag && <span className="modal-badge-new">{product.tag}</span>}
            {product.image && (
              <img src={product.image} alt={product.title} className="modal-product-image" />
            )}
          </div>

          <div className="modal-details-panel">
            <span className="modal-category-tag">{categoryLabel(product.category)}</span>
            <h2 className="modal-product-title">{product.title}</h2>

            {/* key resets size/qty whenever a different product opens */}
            <ProductPurchase key={product.id} product={product} onAdded={close} />

            <p className="modal-product-desc">{product.desc}</p>

            <div className="modal-details-tabs">
              {product.benefits && product.benefits.length > 0 && (
                <details open className="modal-details-spec">
                  <summary>Key Benefits &amp; Features</summary>
                  <ul className="spec-list">
                    {product.benefits.map((b, idx) => (
                      <li key={`${product.id}-benefit-${idx}`}>{b}</li>
                    ))}
                  </ul>
                </details>
              )}
              {product.usage && (
                <details className="modal-details-spec">
                  <summary>How to Use &amp; Application</summary>
                  <p className="spec-text">{product.usage}</p>
                </details>
              )}
            </div>

            {PAGE_IDS.has(product.id) && (
              <Link href={`/products/${product.id}`} className="modal-full-link" onClick={close}>
                View full product page →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
