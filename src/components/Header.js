"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from './CartContext';

export default function Header() {
  const { 
    cartCount, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery, 
    products, 
    setSelectedProduct,
    setActiveCategory,
    activeCategory,
    settings
  } = useCart();
  
  const pathname = usePathname();
  const router = useRouter();
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter suggestions when search query or products change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = products.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q)
    ).slice(0, 5);
    setSuggestions(matches);
  }, [searchQuery, products]);

  // Close suggestions box when clicking outside search container
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsFocused(false);
    
    // Redirect to home/catalog page with search focus
    if (pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(searchQuery)}#catalogue`);
    } else {
      const catalog = document.getElementById('catalogue');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSuggestionClick = (product) => {
    setSelectedProduct(product);
    setIsFocused(false);
    setSearchQuery('');
  };

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

  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar" id="announcement-bar">
        <p>{settings.announcement}</p>
      </div>

      {/* Two-Tier Clean Brand Header */}
      <header className="main-header" id="main-header">
        
        {/* Tier 1: Top Row (Logo, Search, Cart Actions) */}
        <div className="header-top-row">
          <div className="header-container">
            {/* Logo */}
            <Link href="/" className="logo-container" aria-label="Sayona Cosmetics Homepage" onClick={() => handleCategoryClick('all')}>
              <img 
                src="/SayonaCosmeticsLogoOnly.png" 
                alt="Sayona Cosmetics Logo" 
                className="brand-logo" 
                onError={(e) => { e.target.src = 'SayonaCosmeticsLogoOnly.png'; }}
              />
              <span className="brand-name">
                SAYONA<span className="brand-sub">COSMETICS</span>
              </span>
            </Link>

            {/* Central Search Wrapper */}
            <div className="search-wrapper" ref={searchContainerRef}>
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  id="search-input" 
                  placeholder="Search hair care, deep treatments, clippers..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  autoComplete="off" 
                  aria-label="Search product catalogue"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="clear-search-btn" 
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
                <button type="submit" className="search-submit-btn" aria-label="Submit search">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </form>

              {/* Autocomplete Search Suggestions */}
              {isFocused && suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(p)}
                    >
                      <span>{p.title}</span>
                      <span className="suggestion-cat">
                        {p.category === 'shampoo-conditioner' ? 'Shampoo & Conditioner' :
                         p.category === 'treatments' ? 'Hair Treatment' :
                         p.category === 'styling' ? 'Hair Styling' : 'Appliance & Tool'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Trigger */}
            <div className="header-actions">
              <button 
                type="button" 
                className="cart-trigger-btn" 
                onClick={() => setIsCartOpen(true)}
                aria-label="Open shopping cart"
              >
                <span className="cart-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="cart-svg">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span className="cart-badge">{cartCount}</span>
                </span>
                <span className="cart-text">My Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Category & Page Navigation Bar */}
        <div className="header-navigation-row">
          <div className="header-container" style={{ justifyContent: 'center', paddingBlock: '0' }}>
            <nav className="main-navigation" aria-label="Product Category Navigation">
              <ul className="nav-menu-list">
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleCategoryClick('offers')}
                    className={pathname === '/' && activeCategory === 'offers' ? 'active' : ''}
                  >
                    Offers
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleCategoryClick('all')}
                    className={pathname === '/' && activeCategory === 'all' ? 'active' : ''}
                  >
                    All Products
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleCategoryClick('new-arrivals')}
                    className={pathname === '/' && activeCategory === 'new-arrivals' ? 'active' : ''}
                  >
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleCategoryClick('clearance')}
                    className={pathname === '/' && activeCategory === 'clearance' ? 'active' : ''}
                  >
                    Clearance
                  </button>
                </li>
                <li className="nav-separator">|</li>
                <li>
                  <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

      </header>
    </>
  );
}
