"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from './CartContext';

const Icon = ({ d }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

/** Bottom tab bar + "added to cart" toast for phones. Hidden on desktop via CSS. */
export default function MobileBar() {
  const { cartCount, setIsCartOpen, setActiveCategory, settings, toast, setToast } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast, setToast]);

  if (pathname.startsWith('/admin')) return null;

  const goto = (cat, anchor) => {
    if (cat) setActiveCategory(cat);
    if (pathname !== '/') {
      router.push(`/${cat ? `?category=${cat}` : ''}#${anchor}`);
      return;
    }
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const wa = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hi Sayona Cosmetics! I would like to place an order / ask a question.')}`;

  return (
    <>
      {toast && (
        <div className="mobile-toast" role="status" key={toast.id}>
          <span>✓ Added <strong>{toast.title}</strong>{toast.size ? ` · ${toast.size}` : ''}</span>
          <button type="button" onClick={() => { setToast(null); setIsCartOpen(true); }}>View cart</button>
        </div>
      )}
      <nav className="mobile-tabbar" aria-label="Quick navigation">
        <button type="button" onClick={() => goto('all', 'catalogue')}>
          <Icon d={<><path d="M3 9l1-5h16l1 5" /><path d="M4 9v11h16V9" /><path d="M9 20v-6h6v6" /></>} />
          <span>Shop</span>
        </button>
        <button type="button" onClick={() => goto('offers', 'catalogue')}>
          <Icon d={<><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>} />
          <span>Deals</span>
        </button>
        <button type="button" onClick={() => goto(null, 'bundles')}>
          <Icon d={<><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M12 8S10 3 7.5 4.5 9 8 12 8zm0 0s2-5 4.5-3.5S15 8 12 8z" /></>} />
          <span>Kits</span>
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer">
          <Icon d={<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z" />} />
          <span>WhatsApp</span>
        </a>
        <button type="button" className="tab-cart" onClick={() => setIsCartOpen(true)}>
          <Icon d={<><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>} />
          {cartCount > 0 && <b className="tab-badge">{cartCount}</b>}
          <span>Cart</span>
        </button>
      </nav>
    </>
  );
}
