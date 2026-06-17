"use client";

import React from 'react';
import { useCart } from '@/components/CartContext';

export default function AboutPage() {
  const { settings } = useCart();

  return (
    <div className="about-page-wrapper">
      {/* Banner */}
      <div 
        className="page-header-banner" 
        style={{ 
          background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))", 
          padding: "60px 0", 
          textAlign: "center", 
          color: "#fff", 
          borderBottom: "2px solid var(--color-accent)" 
        }}
      >
        <div className="container">
          <span 
            className="hero-tagline" 
            style={{ 
              color: "var(--color-accent)", 
              fontSize: "0.85rem", 
              fontWeight: 700, 
              letterSpacing: "3px", 
              textTransform: "uppercase" 
            }}
          >
            About Sayona
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.8rem", marginTop: "10px" }}>
            Our Heritage &amp; Vision
          </h1>
        </div>
      </div>

      {/* Story Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <div className="about-img-frame">
                <img 
                  src="/sayona_hero_bg.png" 
                  alt="Sayona Cosmetics Premium Products Display" 
                  className="about-image"
                  onError={(e) => { e.target.src = 'sayona_hero_bg.png'; }}
                />
              </div>
            </div>
            <div className="about-content">
              <span className="section-tag">Since 2011</span>
              <h2>Healthy Scalp, Stunning Hair</h2>
              <p style={{ whiteSpace: "pre-line" }}>{settings.aboutStory}</p>
              
              <div className="brand-stats">
                <div className="stat-item">
                  <span className="stat-num">100%</span>
                  <span className="stat-label">Organic Oils Enriched</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">NBO</span>
                  <span className="stat-label">Proudly Kenyan Brand</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">15+</span>
                  <span className="stat-label">Beauty Catalogue Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outlets Spotlight */}
      <section className="branches-section" style={{ padding: "80px 0", backgroundColor: "#fff", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "50px" }}>
            <span 
              className="section-tag" 
              style={{ 
                color: "var(--color-accent-dark)", 
                fontSize: "0.8rem", 
                fontWeight: 700, 
                letterSpacing: "2px", 
                textTransform: "uppercase" 
              }}
            >
              Visit Us
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)", fontSize: "2.2rem", marginTop: "8px" }}>
              Our Nairobi Outlets
            </h2>
            <p style={{ color: "rgba(31, 27, 28, 0.7)", maxWidth: "600px", margin: "12px auto 0" }}>
              Experience personalized cosmetic consultations and shop our complete professional line at any of our primary locations.
            </p>
          </div>

          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
            {/* Westlands Branch */}
            <div className="branch-card" style={{ background: "var(--color-neutral-light)", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-lg)", padding: "32px", boxShadow: "var(--glass-shadow)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "16px" }}>🛍️</span>
              <h3 style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)", fontSize: "1.4rem", marginBottom: "12px" }}>
                Sarit Centre Mall
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(31, 27, 28, 0.8)", marginBottom: "20px" }}>
                Located in the vibrant Westlands shopping district, our premier Sarit Centre outlet stocks our full professional hair care and appliance catalog.
              </p>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem", color: "rgba(31, 27, 28, 0.7)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>📍 First Floor, Westlands, Nairobi</li>
                <li>⏰ Mon - Sat: 9:00 AM - 8:00 PM | Sun: 11:00 AM - 6:00 PM</li>
                <li>📞 <a href={`tel:${settings.phone}`}>{settings.phone}</a></li>
              </ul>
            </div>

            {/* CBD Branch */}
            <div className="branch-card" style={{ background: "var(--color-neutral-light)", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-lg)", padding: "32px", boxShadow: "var(--glass-shadow)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: "16px" }}>🏢</span>
              <h3 style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)", fontSize: "1.4rem", marginBottom: "12px" }}>
                Nairobi CBD Outlet
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(31, 27, 28, 0.8)", marginBottom: "20px" }}>
                Conveniently located in Nairobi's Central Business District along Koinange Street, perfect for quick pick-ups and professional retail support.
              </p>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem", color: "rgba(31, 27, 28, 0.7)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>📍 Koinange Street, Central Business District, Nairobi</li>
                <li>⏰ Mon - Sat: 8:00 AM - 7:00 PM | Sun: Closed</li>
                <li>📞 <a href={`tel:${settings.phone}`}>{settings.phone}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
