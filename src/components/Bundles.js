"use client";

import React from 'react';
import { useCart } from './CartContext';
import { useNow } from '@/lib/useNow';
import { track } from '@/lib/track';
import { BUNDLES, BUNDLE_SAVING } from '@/data/bundles';
import { dealPercent, dealPrice, formatKsh } from '@/data/campaign';

/** Works out a bundle's contents and price from the live product list. Returns null if any item is unavailable. */
export function priceBundle(bundle, products, now) {
  const lines = [];
  for (const it of bundle.items) {
    const p = products.find((x) => x.id === it.productId);
    const s = p?.sizes?.find((x) => x.size === it.size);
    if (!p || !s || p.inStock === false || p.comingSoon) return null;
    const unit = dealPrice(Number(s.price) || 0, dealPercent(p, now));
    lines.push({ title: p.title, size: it.size, price: unit });
  }
  const separate = lines.reduce((n, l) => n + l.price, 0);
  const raw = separate * (100 - BUNDLE_SAVING) / 100;
  const price = Math.floor(raw / 10) * 10 - 1; // e.g. 1,284 -> 1,279
  return { lines, separate, price, saving: separate - price };
}

export default function Bundles() {
  const { products, addToCart } = useCart();
  const now = useNow();

  const add = (b, priced) => {
    const contents = priced.lines.map((l) => `${l.title.replace(/^Sayona /, '')} ${l.size}`).join(' + ');
    addToCart(
      { id: b.id, title: b.title, category: 'bundle', image: b.image },
      { size: contents, price: priced.price, rrp: priced.separate },
      1,
      { open: false }
    );
    track('add_to_cart', { value: priced.price, items: [{ id: b.id, title: b.title, size: 'Kit', price: priced.price, qty: 1 }] });
  };

  const cards = BUNDLES.map((b) => ({ b, priced: priceBundle(b, products, now) })).filter((x) => x.priced);
  if (cards.length === 0) return null;

  return (
    <section className="bundles-section" id="bundles" aria-labelledby="bundles-title">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Kits &amp; bundles</span>
          <h2 id="bundles-title" className="section-title">Complete routines, better value</h2>
          <p className="section-subtitle">Hand-picked combinations — save {BUNDLE_SAVING}% compared with buying each product separately.</p>
        </div>
        <div className="bundles-grid">
          {cards.map(({ b, priced }) => (
            <article key={b.id} className="bundle-card">
              <div className="bundle-media">
                <span className="bundle-save">Save {formatKsh(priced.saving)}</span>
                <img src={b.image} alt={`${b.title}: ${priced.lines.map((l) => `${l.title} ${l.size}`).join(', ')}`} loading="lazy" />
              </div>
              <div className="bundle-body">
                <span className="bundle-tagline">{b.tagline}</span>
                <h3>{b.title}</h3>
                <ul className="bundle-items">
                  {priced.lines.map((l) => (
                    <li key={l.title + l.size}><span>{l.title.replace(/^Sayona /, '')}</span><span>{l.size}</span></li>
                  ))}
                </ul>
                <div className="bundle-price-row">
                  <strong>{formatKsh(priced.price)}</strong>
                  <span className="bundle-separate">{formatKsh(priced.separate)} separately</span>
                </div>
                <button type="button" className="btn btn-primary bundle-btn" onClick={() => add(b, priced)}>Add kit to cart</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
