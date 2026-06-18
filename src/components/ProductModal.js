"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useCart();
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const pathname = usePathname();

  // Reset local selector states when product changes
  useEffect(() => {
    setSelectedSizeIdx(0);
    setQty(1);
  }, [selectedProduct]);

  if (pathname.startsWith('/admin')) return null;
  if (!selectedProduct) return null;

  const product = selectedProduct;
  const selectedSize = product.sizes && product.sizes[selectedSizeIdx] ? product.sizes[selectedSizeIdx] : null;

  const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getCategoryLabel = (cat) => {
    const mapping = {
      "shampoo-conditioner": "Shampoo & Conditioner",
      "treatments": "Hair Treatment",
      "styling": "Hair Styling",
      "appliances": "Appliance & Tool"
    };
    if (mapping[cat]) return mapping[cat];
    if (!cat) return "Cosmetics";
    return cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getProductSVG = (category) => {
    const CATEGORY_SVGS = {
      "shampoo-conditioner": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="shampooGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6e0030" /><stop offset="100%" stop-color="#4a001f" /></linearGradient></defs><rect x="35" y="30" width="30" height="55" rx="8" fill="url(#shampooGrad)" /><rect x="42" y="20" width="16" height="10" fill="#d4af37" /><path d="M40 20 h20 v-4 h-8 v-3 h-8 v7 Z" fill="#d4af37" /><rect x="37" y="42" width="26" height="28" rx="2" fill="rgba(255,255,255,0.95)" /><text x="50" y="52" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#4a001f" text-anchor="middle">SAYONA</text><text x="50" y="60" font-family="'Outfit'" font-size="5" fill="#d4af37" text-anchor="middle">ARGAN</text><circle cx="50" cy="66" r="1.5" fill="#4a001f" /></svg>`,
      "treatments": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="treatGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4a001f" /><stop offset="100%" stop-color="#1f1b1c" /></linearGradient></defs><path d="M25 40 h50 v35 c0 6-6 10-10 10 h-30 c-4 0-10-4-10-10 Z" fill="url(#treatGrad)" /><rect x="22" y="32" width="56" height="8" rx="3" fill="#d4af37" /><rect x="28" y="48" width="44" height="24" rx="2" fill="rgba(255,255,255,0.95)" /><text x="50" y="58" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#4a001f" text-anchor="middle">SAYONA</text><text x="50" y="66" font-family="'Outfit'" font-size="5" fill="#d4af37" text-anchor="middle">TREATMENT</text></svg>`,
      "styling": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="stylingGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6e0030" /><stop offset="100%" stop-color="#d4af37" /></linearGradient></defs><path d="M28 45 h44 v30 c0 4-4 7-7 7 h-30 c-3 0-7-3-7-7 Z" fill="url(#stylingGrad)" /><rect x="25" y="37" width="50" height="8" rx="2" fill="#4a001f" /><rect x="31" y="52" width="38" height="18" rx="1" fill="rgba(255,255,255,0.95)" /><text x="50" y="60" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#4a001f" text-anchor="middle">SAYONA</text><text x="50" y="67" font-family="'Outfit'" font-size="5" fill="#d4af37" text-anchor="middle">POMADE</text></svg>`,
      "appliances": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="appGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1f1b1c" /><stop offset="100%" stop-color="#4a001f" /></linearGradient></defs><path d="M44 50 l8 35 h8 l-8-35 Z" fill="url(#appGrad)" /><path d="M28 32 h36 c4 0 6 3 6 5 v18 c0 2-2 5-6 5 h-36 Z" fill="url(#appGrad)" /><rect x="24" y="36" width="4" height="15" rx="1" fill="#d4af37" /><rect x="42" y="32" width="3" height="28" fill="#d4af37" /><circle cx="58" cy="46" r="4" fill="#d4af37" /><text x="50" y="80" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#d4af37" text-anchor="middle">SAYONA PRO</text></svg>`
    };
    return CATEGORY_SVGS[category] || CATEGORY_SVGS["styling"];
  };

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, selectedSize, qty);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="product-modal-wrapper" onClick={() => setSelectedProduct(null)}>
      {/* Modal Inner Container */}
      <div 
        className="product-modal-container" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setSelectedProduct(null)} 
          aria-label="Close details"
        >
          ✕
        </button>

        <div className="modal-body-grid">
          {/* Left Panel: Image */}
          <div className="modal-image-panel">
            {product.tag && (
              <span className="modal-badge-new">{product.tag}</span>
            )}
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.title} 
                className="modal-product-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
            ) : null}
            <div style={{ display: product.image ? 'none' : 'block', width: '100%', height: '100%', padding: '20%' }}>
              <div dangerouslySetInnerHTML={{ __html: getProductSVG(product.category) }} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Right Panel: Purchase Controls */}
          <div className="modal-details-panel">
            <span className="modal-category-tag">{getCategoryLabel(product.category)}</span>
            <h2 className="modal-product-title">{product.title}</h2>
            
            <div className="modal-price-row">
              <span className="modal-rrp-label">RRP Price:</span>
              <span className="modal-product-price">
                KSh {selectedSize ? formatPrice(selectedSize.price) : '0'}
              </span>
            </div>

            <p className="modal-product-desc">{product.desc}</p>

            {/* Spec sheet accordions */}
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

            {/* Sizing dropdown & cart controls */}
            <div className="modal-purchase-controls">
              {product.sizes && product.sizes.length > 0 && (
                <div className="picker-group">
                  <label htmlFor="modal-size-select">Select Size:</label>
                  <div className="select-wrapper">
                    <select 
                      id="modal-size-select" 
                      value={selectedSizeIdx}
                      onChange={(e) => setSelectedSizeIdx(parseInt(e.target.value))}
                      aria-label="Select product size"
                      disabled={product.inStock === false}
                    >
                      {product.sizes.map((s, idx) => (
                        <option key={`${product.id}-opt-${idx}`} value={idx}>
                          {s.size} - KSh {formatPrice(s.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Quantity selectors */}
              <div className="purchase-actions-row" style={{ flexDirection: product.inStock === false ? 'column' : 'row', alignItems: 'stretch', gap: '12px' }}>
                {product.inStock !== false && (
                  <div className="qty-controller">
                    <button 
                      type="button" 
                      className="qty-btn" 
                      onClick={() => setQty(prev => Math.max(prev - 1, 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      id="modal-qty-input" 
                      value={qty} 
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1" 
                      max="99" 
                      aria-label="Product quantity"
                    />
                    <button 
                      type="button" 
                      className="qty-btn" 
                      onClick={() => setQty(prev => Math.min(prev + 1, 99))}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                )}
                
                {product.inStock === false ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    <div style={{ 
                      backgroundColor: 'rgba(220,53,69,0.08)', 
                      color: '#dc3545', 
                      padding: '10px 14px', 
                      borderRadius: '6px', 
                      fontSize: '0.85rem', 
                      fontWeight: '600',
                      textAlign: 'center',
                      border: '1px solid rgba(220,53,69,0.15)'
                    }}>
                      ⚠️ This item is currently out of stock
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-primary btn-add-to-cart" 
                      disabled
                      style={{ 
                        width: '100%',
                        backgroundColor: '#ccc', 
                        color: '#666', 
                        cursor: 'not-allowed',
                        pointerEvents: 'none',
                        border: 'none'
                      }}
                    >
                      <span>Out of Stock</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-primary btn-add-to-cart" 
                    onClick={handleAddToCart}
                  >
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
