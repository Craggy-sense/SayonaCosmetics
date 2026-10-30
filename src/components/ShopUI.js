"use client";

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNow } from '@/lib/useNow';
import {
  campaignCountdown,
  dealPercent,
  dealPrice,
  formatKsh,
  isComingSoon,
} from '@/data/campaign';

export const CATEGORY_LABELS = {
  'shampoo-conditioner': 'Shampoo & Conditioner',
  treatments: 'Hair Treatment',
  styling: 'Hair Styling',
  appliances: 'Appliance & Tool',
};

export function categoryLabel(cat) {
  if (CATEGORY_LABELS[cat]) return CATEGORY_LABELS[cat];
  if (!cat) return 'Cosmetics';
  return cat.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function whatsappNotifyUrl(number, product) {
  const text = `Hi Sayona Cosmetics! Please notify me when the ${product.title} is available.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Live deal info for a product + base price. */
export function useDeal(product, basePrice) {
  const now = useNow();
  const percent = dealPercent(product, now);
  return { percent, price: dealPrice(basePrice, percent), basePrice };
}

/** Price with Black November strike-through when a deal is live. */
export function PriceTag({ product, basePrice, prefix = '', size = 'md' }) {
  const { percent, price } = useDeal(product, basePrice);
  if (isComingSoon(product)) {
    return <span className={`price-tag price-tag-${size}`}><span className="price-coming">Coming soon</span></span>;
  }
  return (
    <span className={`price-tag price-tag-${size}`}>
      {prefix && <span className="price-prefix">{prefix}</span>}
      <span className={`price-now ${percent ? 'is-deal' : ''}`}>{formatKsh(price)}</span>
      {percent > 0 && (
        <>
          <s className="price-was">{formatKsh(basePrice)}</s>
          <span className="price-off">-{percent}%</span>
        </>
      )}
    </span>
  );
}

/** Ticking countdown to the next campaign moment. Renders nothing on the server. */
export function Countdown({ variant = 'boxes' }) {
  const now = useNow(1000);
  const info = campaignCountdown(now);
  if (!info) return null;
  const diff = Math.max(0, info.target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');

  if (variant === 'inline') {
    return (
      <span className="countdown-inline">
        {info.label} {d > 0 ? `${d}d ` : ''}{pad(h)}h {pad(m)}m {pad(s)}s
      </span>
    );
  }
  return (
    <div className="countdown" role="timer" aria-live="off">
      <span className="countdown-label">{info.label}</span>
      <div className="countdown-boxes">
        {[[d, 'Days'], [h, 'Hrs'], [m, 'Min'], [s, 'Sec']].map(([v, l]) => (
          <span className="countdown-box" key={l}>
            <strong>{pad(v)}</strong>
            <small>{l}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Size picker, quantity and Add to Cart / Notify / Out of stock. Used by quick view and product pages. */
export function ProductPurchase({ product, onAdded }) {
  const { addToCart, settings } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const now = useNow();

  const sizes = product.sizes || [];
  const selected = sizes[sizeIdx] || null;
  const percent = dealPercent(product, now);
  const comingSoon = isComingSoon(product);
  const outOfStock = product.inStock === false;

  const handleAdd = () => {
    if (!selected) return;
    const price = dealPrice(selected.price, percent);
    addToCart(product, { ...selected, price, rrp: selected.price }, qty);
    if (onAdded) onAdded();
  };

  return (
    <div className="purchase-block">
      <div className="modal-price-row">
        <span className="modal-rrp-label">{percent ? 'Black November price:' : 'RRP Price:'}</span>
        {selected && <PriceTag product={product} basePrice={selected.price} size="lg" />}
      </div>

      {comingSoon ? (
        <div className="coming-soon-panel">
          <p><strong>Coming soon to Sayona.</strong> Be the first to know when it lands — we&apos;ll message you on WhatsApp.</p>
          <a
            className="btn btn-primary btn-add-to-cart"
            href={whatsappNotifyUrl(settings.whatsappNumber, product)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Notify me on WhatsApp
          </a>
        </div>
      ) : (
        <div className="modal-purchase-controls">
          {sizes.length > 0 && (
            <div className="picker-group">
              <label htmlFor={`size-${product.id}`}>Select {product.category === 'appliances' ? 'Model' : 'Size'}:</label>
              <div className="select-wrapper">
                <select
                  id={`size-${product.id}`}
                  value={sizeIdx}
                  onChange={(e) => setSizeIdx(parseInt(e.target.value, 10))}
                  disabled={outOfStock}
                >
                  {sizes.map((s, idx) => (
                    <option key={`${product.id}-opt-${idx}`} value={idx}>
                      {s.size} - {formatKsh(dealPrice(s.price, percent))}
                      {percent ? ` (was ${formatKsh(s.price)})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {outOfStock ? (
            <>
              <div className="stock-warning">⚠️ This item is currently out of stock</div>
              <a
                className="btn btn-secondary btn-add-to-cart"
                href={whatsappNotifyUrl(settings.whatsappNumber, product)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Notify me when it&apos;s back
              </a>
            </>
          ) : (
            <div className="purchase-actions-row">
              <div className="qty-controller">
                <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.max(q - 1, 1))} aria-label="Decrease quantity">−</button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.min(99, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                  min="1"
                  max="99"
                  aria-label="Product quantity"
                />
                <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.min(q + 1, 99))} aria-label="Increase quantity">+</button>
              </div>
              <button type="button" className="btn btn-primary btn-add-to-cart" onClick={handleAdd}>
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
