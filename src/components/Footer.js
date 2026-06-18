"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from './CartContext';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const { setActiveCategory, settings } = useCart();

  if (pathname.startsWith('/admin')) return null;

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (pathname !== '/') {
      router.push(`/?category=${cat}#catalogue`);
    } else {
      const catalog = document.getElementById('catalogue');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-brand-column">
            <div className="footer-logo">
              <Link href="/" className="footer-logo-link" style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleCategoryClick('all')}>
                <img 
                  src="/SayonaCosmeticsLogo.png" 
                  alt="Sayona Cosmetics Logo" 
                  className="footer-logo-img" 
                  onError={(e) => { e.target.src = 'SayonaCosmeticsLogo.png'; }}
                />
                <span className="sr-only">SAYONA COSMETICS</span>
              </Link>
            </div>
            <p className="footer-tagline">
              Formulated for African hair, crafted for healthy growth. Enriched with botanical oils, vitamins, and essential herbs.
            </p>
            <p className="footer-copyright">&copy; 2026 Sayona Cosmetics. All rights reserved.</p>
          </div>

          {/* Column 2: Product Lines */}
          <div className="footer-links-column">
            <h4>Product Lines</h4>
            <ul>
              <li>
                <button type="button" onClick={() => handleCategoryClick('shampoo-conditioner')}>
                  Shampoos &amp; Conditioners
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick('treatments')}>
                  Hair Treatments
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick('styling')}>
                  Dreadlock &amp; Pomades
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick('appliances')}>
                  Styling Appliances
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-links-column">
            <h4>Customer Care</h4>
            <ul>
              <li><Link href="/about">About Our Brand</Link></li>
              <li><Link href="/blog">Our Beauty Blog</Link></li>
              <li><Link href="/contact">Contact Support</Link></li>
              <li><Link href="/contact#contact">Bulk Distributor Orders</Link></li>
              <li><Link href="/#announcement-bar">Delivery &amp; Returns</Link></li>
            </ul>
          </div>

          {/* Column 4: Location & Contact */}
          <div className="footer-contact-column">
            <h4>Nairobi Office</h4>
            <p>Nairobi, Kenya</p>
            <p className="phone-link">📞 <a href={`tel:${settings.phone}`}>{settings.phone}</a></p>
            <p className="email-link">✉️ <a href={`mailto:${settings.email}`}>{settings.email}</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
