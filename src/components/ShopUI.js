"use client";

import React, { useState } from 'react';
import { track } from '@/lib/track';
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

/** Index of the size shown first (card photo + price). */
export function defaultSizeIdx(product) {
  const n = product?.sizes?.length || 0;
  const d = Number.isInteger(product?.defaultSize) ? product.defaultSize : 0;
  return d >= 0 && d < n ? d : 0;
}

/** Photo for a given size: its own photo, else the range photo, else the main photo. */
export function sizeImage(product, idx) {
  const s = product?.sizes?.[idx];
  return s?.image || product?.groupImage || product?.image || '';
}

/** Distinct photos for a product: each size photo (with its size label), then the range photo. */
export function productPhotos(product) {
  const out = [];
  const seen = new Set();
  (product?.sizes || []).forEach((s, idx) => {
    if (s.image && !seen.has(s.image)) { seen.add(s.image); out.push({ src: s.image, label: s.size, sizeIdx: idx }); }
  });
  [product?.groupImage, product?.image].forEach((src) => {
    if (src && !seen.has(src)) { seen.add(src); out.push({ src, label: out.length ? 'All sizes' : '', sizeIdx: null }); }
  });
  return out;
}

/** Main photo + thumbnails. Clicking a size thumbnail selects that size. */
export function ProductGallery({ product, sizeIdx, onSelectSize, badge }) {
  const photos = productPhotos(product);
  // A non-size photo the user tapped; cleared automatically when the size changes.
  const [manualPick, setManualPick] = useState(null);
  const manual = manualPick && manualPick.idx === sizeIdx ? manualPick.src : null;
  const setManual = (src) => setManualPick(src ? { src, idx: sizeIdx } : null);
  const current = manual || sizeImage(product, sizeIdx);
  const selectedSize = product?.sizes?.[sizeIdx]?.size;
  const hasOwnPhoto = !!product?.sizes?.[sizeIdx]?.image;

  return (
    <div className="gallery">
      <div className="gallery-main">
        {badge}
        {current && <img src={current} alt={`${product.title}${selectedSize && !manual ? ` ${selectedSize}` : ''}`} className="modal-product-image" />}
        {selectedSize && !manual && (hasOwnPhoto || product.groupImage) && (
          <span className="gallery-size-chip">{hasOwnPhoto ? selectedSize : `${selectedSize} · range photo`}</span>
        )}
      </div>
      {photos.length > 1 && (
        <div className="gallery-thumbs" role="list">
          {photos.map((ph) => {
            const active = manual ? manual === ph.src : ph.sizeIdx === sizeIdx || (ph.sizeIdx === null && !hasOwnPhoto && current === ph.src);
            return (
              <button
                key={ph.src}
                type="button"
                role="listitem"
                className={`gallery-thumb ${active ? 'active' : ''}`}
                onClick={() => {
                  if (ph.sizeIdx !== null) { setManual(null); onSelectSize(ph.sizeIdx); } else { setManual(ph.src); }
                }}
                aria-label={ph.label ? `Show ${ph.label}` : 'Show photo'}
              >
                <img src={ph.src} alt="" loading="lazy" />
                {ph.label && <small>{ph.label}</small>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Size buttons (pills). */
export function SizePills({ product, sizeIdx, onSelect, compact = false }) {
  const sizes = product?.sizes || [];
  if (sizes.length < 2) return null;
  return (
    <div className={`size-pills ${compact ? 'compact' : ''}`} role="radiogroup" aria-label="Choose size">
      {sizes.map((s, idx) => (
        <button
          key={`${product.id}-pill-${idx}`}
          type="button"
          role="radio"
          aria-checked={idx === sizeIdx}
          className={`size-pill ${idx === sizeIdx ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onSelect(idx); }}
        >
          {s.size}
        </button>
      ))}
    </div>
  );
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
          <s className="price-was" title="Our regular online price, charged again from 1 December">{formatKsh(basePrice)}</s>
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
export function ProductPurchase({ product, onAdded, sizeIdx: controlledIdx, onSizeChange }) {
  const { addToCart, settings } = useCart();
  const [ownIdx, setOwnIdx] = useState(() => defaultSizeIdx(product));
  const sizeIdx = controlledIdx ?? ownIdx;
  const setSizeIdx = (i) => { setOwnIdx(i); if (onSizeChange) onSizeChange(i); };
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
    addToCart({ ...product, image: sizeImage(product, sizeIdx) }, { ...selected, price, rrp: selected.price }, qty);
    track('add_to_cart', { value: price * qty, items: [{ id: product.id, title: product.title, size: selected.size, price, qty }] });
    if (onAdded) onAdded();
  };

  return (
    <div className="purchase-block">
      <div className="modal-price-row">
        <span className="modal-rrp-label">{percent ? 'Black November price:' : 'Price:'}</span>
        {selected && <PriceTag product={product} basePrice={selected.price} size="lg" />}
      </div>
      {percent > 0 && <p className="regular-price-note">Crossed-out price is our regular online price, which returns on 1 December.</p>}

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
              <span className="picker-label">{product.category === 'appliances' ? 'Model' : 'Size'}: <strong>{selected?.size}</strong></span>
              {sizes.length > 1 ? (
                <div className="size-options" role="radiogroup" aria-label={product.category === 'appliances' ? 'Choose model' : 'Choose size'}>
                  {sizes.map((s, idx) => (
                    <button
                      key={`${product.id}-opt-${idx}`}
                      type="button"
                      role="radio"
                      aria-checked={idx === sizeIdx}
                      className={`size-option ${idx === sizeIdx ? 'active' : ''}`}
                      onClick={() => setSizeIdx(idx)}
                      disabled={outOfStock}
                    >
                      <span className="size-option-name">{s.size}</span>
                      <span className="size-option-price">{formatKsh(dealPrice(s.price, percent))}</span>
                    </button>
                  ))}
                </div>
              ) : null}
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
