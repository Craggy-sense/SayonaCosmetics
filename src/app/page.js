"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    sortBy, 
    setSortBy,
    settings 
  } = useCart();

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      tag: "🏆 WORLD CUP 2026 SPECIAL 🏆",
      title: "CHAMPIONSHIP GROOMING ⚽",
      subtitle: "Score big with KSh 700 off on our Pro-Clipper Series. Get the sharp, match-day fade like the pros.",
      image: "/world_cup_grooming.png",
      oldPrice: "KSh 3,500",
      price: "KSh 2,800",
      stars: "★★★★★",
      ratingVal: "4.8 (114 reviews)",
      buttonText: "Claim Clipper Deal",
      action: () => {
        setActiveCategory('appliances');
        const catalog = document.getElementById('catalogue');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      },
      deliveryText: "Same-day Nairobi <strong>Free Delivery</strong>"
    },
    {
      tag: "HAIR MAINTENANCE SPECIAL",
      title: "DEEP MOISTURE ROUTINE",
      subtitle: "Restore your scalp's health and maintain strong, hydrated locks with our organic Argan Deep Treatment.",
      image: "/hair_maintenance.png",
      oldPrice: "KSh 1,500",
      price: "KSh 950",
      stars: "★★★★★",
      ratingVal: "4.9 (142 reviews)",
      buttonText: "Shop Maintenance",
      action: () => {
        setActiveCategory('treatments');
        const catalog = document.getElementById('catalogue');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      },
      deliveryText: "Same-day Nairobi <strong>Free Delivery</strong>"
    },
    {
      tag: "BESTSELLER FORMULA",
      title: "HERBAL SCALP POMADE",
      subtitle: "Nourishing organic tea tree and cooling mint formula. Promotes hair growth and smooth styling.",
      image: "/scalp_pomade.png",
      oldPrice: "KSh 600",
      price: "KSh 450",
      stars: "★★★★★",
      ratingVal: "4.9 (96 reviews)",
      buttonText: "Shop Styling",
      action: () => {
        setActiveCategory('styling');
        const catalog = document.getElementById('catalogue');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      },
      deliveryText: "Same-day Nairobi <strong>Free Delivery</strong>"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 45000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Parse search/category query params from URL (e.g. on navigation redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
      const catParam = urlParams.get('category');
      if (catParam) {
        setActiveCategory(catParam);
      }
    }
  }, [setSearchQuery, setActiveCategory]);

  // Handle active filters listing
  const handleRemoveCategory = () => {
    setActiveCategory('all');
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('default');
  };

  // Filter products dynamically
  const filteredProducts = products.filter((prod) => {
    // 1. Category Filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'offers') {
        const isOffer = ['argan-shampoo', 'indian-hemp-pomade', 'coconut-conditioner', 'cordless-clippers', 'deep-penetrating-treatment'].includes(prod.id) || 
                        ['BESTSELLER', 'HOT', 'POPULAR'].includes(prod.tag);
        if (!isOffer) return false;
      } else if (activeCategory === 'new-arrivals') {
        const isNew = prod.tag === 'NEW' || ['olive-shampoo', 'foam-wrap', 'cordless-clippers'].includes(prod.id);
        if (!isNew) return false;
      } else if (activeCategory === 'clearance') {
        const isClearance = ['straightener', 'hair-dryer', 'corded-clippers'].includes(prod.id) || 
                            ['HEAVY DUTY', 'ELECTRONIC'].includes(prod.tag);
        if (!isClearance) return false;
      } else if (prod.category !== activeCategory) {
        return false;
      }
    }
    // 2. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchDesc = prod.desc.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) {
        return false;
      }
    }
    return true;
  });

  // Sort products dynamically
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getStartingPrice = (p) => (p.sizes && p.sizes.length > 0 ? p.sizes[0].price : 0);
    
    if (sortBy === 'price-asc') {
      return getStartingPrice(a) - getStartingPrice(b);
    } else if (sortBy === 'price-desc') {
      return getStartingPrice(b) - getStartingPrice(a);
    } else if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0; // default sorting (preserve order)
  });

  const getCategoryLabel = (cat) => {
    const mapping = {
      "shampoo-conditioner": "Shampoo & Conditioner",
      "treatments": "Hair Treatment",
      "styling": "Hair Styling",
      "appliances": "Appliance & Tool",
      "offers": "Offers",
      "new-arrivals": "New Arrivals",
      "clearance": "Clearance"
    };
    return mapping[cat] || "All Categories";
  };

  return (
    <div className="shop-page-wrapper">
      {/* Hero Banner Section */}
      <section className="hero-section" id="hero">
        {/* Horizontal Benefits Bar */}
        <div className="benefits-bar">
          <div className="benefit-item">
            <div className="benefit-icon-badge">🚚</div>
            <div className="benefit-text">
              <span className="benefit-title">Free Nairobi Delivery</span>
              <span className="benefit-desc">On orders above KSh 3,000</span>
            </div>
          </div>
          <div className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon-badge">📦</div>
            <div className="benefit-text">
              <span className="benefit-title">Country-wide Courier</span>
              <span className="benefit-desc">Dispatched same-day</span>
            </div>
          </div>
          <div className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon-badge">💬</div>
            <div className="benefit-text">
              <span className="benefit-title">WhatsApp Orders</span>
              <span className="benefit-desc">Chat &amp; order instantly</span>
            </div>
          </div>
          <div className="benefit-divider" />
          <div className="benefit-item">
            <div className="benefit-icon-badge">👑</div>
            <div className="benefit-text">
              <span className="benefit-title">Salon-Grade Quality</span>
              <span className="benefit-desc">100% genuine products</span>
            </div>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="hero-split-grid">
          {/* Left Column: Category Sidebar */}
          <div className="hero-sidebar-col">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <h3>Shop By Category</h3>
                <p>Everything you need for beautiful hair.</p>
              </div>
              <div className="sidebar-list">
                <button 
                  className={`sidebar-item ${activeCategory === 'shampoo-conditioner' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('shampoo-conditioner');
                    const catalog = document.getElementById('catalogue');
                    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="item-label">🧴 Shampoo &amp; Conditioner</span>
                  <span className="item-arrow">&rsaquo;</span>
                </button>
                <button 
                  className={`sidebar-item ${activeCategory === 'treatments' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('treatments');
                    const catalog = document.getElementById('catalogue');
                    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="item-label">🌿 Hair Treatments</span>
                  <span className="item-arrow">&rsaquo;</span>
                </button>
                <button 
                  className={`sidebar-item ${activeCategory === 'styling' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('styling');
                    const catalog = document.getElementById('catalogue');
                    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="item-label">👑 Hair Styling</span>
                  <span className="item-arrow">&rsaquo;</span>
                </button>
                <button 
                  className={`sidebar-item ${activeCategory === 'appliances' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('appliances');
                    const catalog = document.getElementById('catalogue');
                    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="item-label">✂️ Appliances &amp; Tools</span>
                  <span className="item-arrow">&rsaquo;</span>
                </button>
                <button 
                  className={`sidebar-item ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('all');
                    const catalog = document.getElementById('catalogue');
                    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="item-label">🛍️ All Products</span>
                  <span className="item-arrow">&rsaquo;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Wide Showcase Banner Slider */}
          <div className="hero-banner-col">
            <div className="wide-showcase-card">
              {/* Fade content wrapper */}
              <div className="showcase-card-content" key={currentSlide}>
                {/* Left side text info */}
                <div className="showcase-card-left">
                  <div className="showcase-sponsor-logos">
                    <span className="sponsor-brand">SAYONA</span>
                    <div className="sponsor-divider" />
                    <span className="sponsor-tag">OFFICIAL DEAL</span>
                  </div>
                  <span className="showcase-tag">{slides[currentSlide].tag}</span>
                  <h2 className="showcase-title">{slides[currentSlide].title}</h2>
                  <p className="showcase-subtitle">{slides[currentSlide].subtitle}</p>
                  
                  <div className="showcase-price-row">
                    <span className="showcase-old-price">{slides[currentSlide].oldPrice}</span>
                    <span className="showcase-price">{slides[currentSlide].price}</span>
                  </div>
                  
                  <div className="showcase-rating">
                    <span className="stars">{slides[currentSlide].stars}</span>
                    <span className="rating-val">{slides[currentSlide].ratingVal}</span>
                  </div>
                  
                  <div className="showcase-actions-row">
                    <button 
                      type="button" 
                      className="btn btn-primary showcase-buy-btn" 
                      onClick={slides[currentSlide].action}
                    >
                      {slides[currentSlide].buttonText}
                    </button>
                    
                    <div className="delivery-pill">
                      <span className="delivery-icon">🚚</span>
                      <span className="delivery-text" dangerouslySetInnerHTML={{ __html: slides[currentSlide].deliveryText }}></span>
                    </div>
                  </div>
                </div>

                {/* Right side banner image */}
                {slides[currentSlide].image && (
                  <div className="showcase-card-right">
                    <img 
                      src={slides[currentSlide].image} 
                      alt={slides[currentSlide].title} 
                      className="showcase-wide-img" 
                    />
                  </div>
                )}
              </div>

              {/* Slider Navigation Controls */}
              <div className="slider-nav">
                <button 
                  type="button" 
                  className="slider-arrow prev" 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  aria-label="Previous Slide"
                >
                  ‹
                </button>
                
                <div className="slider-dots">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button 
                  type="button" 
                  className="slider-arrow next" 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  aria-label="Next Slide"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Value Propositions */}
      <section className="value-props" id="value-props">
        <div className="container">
          <div className="props-grid">
            <div className="prop-card">
              <div className="prop-icon">🌿</div>
              <h3>Nourished by Pure Nature</h3>
              <p>Infused with rich organic botanical oils including Argan, Castor, Tea Tree, and Mint to cultivate natural hair health.</p>
            </div>
            <div className="prop-card">
              <div className="prop-icon">👑</div>
              <h3>Celebrating Textured Beauty</h3>
              <p>Custom molecular formulas designed to deeply hydrate, define, and honor the unique beauty of natural curls and coils.</p>
            </div>
            <div className="prop-card">
              <div className="prop-icon">💎</div>
              <h3>Salon-Grade Sophistication</h3>
              <p>Experience professional-grade performance and durability, trusted by hair stylists to deliver runway-ready results.</p>
            </div>
          </div>
        </div>
      </section>
 
      {/* Main Catalogue Section */}
      <section className="catalogue-section" id="catalogue">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">The Beauty Collection</h2>
            <p className="section-subtitle">Discover our premium formulas and professional tools designed to manifest your ultimate hair goals.</p>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls" id="filter-controls">
            <div className="category-tabs" role="tablist" aria-label="Product Categories">
              <button 
                className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
                role="tab" 
                aria-selected={activeCategory === 'all'}
              >
                All Products
              </button>
              <button 
                className={`category-tab ${activeCategory === 'shampoo-conditioner' ? 'active' : ''}`}
                onClick={() => setActiveCategory('shampoo-conditioner')}
                role="tab" 
                aria-selected={activeCategory === 'shampoo-conditioner'}
              >
                Shampoo &amp; Conditioner
              </button>
              <button 
                className={`category-tab ${activeCategory === 'treatments' ? 'active' : ''}`}
                onClick={() => setActiveCategory('treatments')}
                role="tab" 
                aria-selected={activeCategory === 'treatments'}
              >
                Hair Treatments
              </button>
              <button 
                className={`category-tab ${activeCategory === 'styling' ? 'active' : ''}`}
                onClick={() => setActiveCategory('styling')}
                role="tab" 
                aria-selected={activeCategory === 'styling'}
              >
                Hair Styling
              </button>
              <button 
                className={`category-tab ${activeCategory === 'appliances' ? 'active' : ''}`}
                onClick={() => setActiveCategory('appliances')}
                role="tab" 
                aria-selected={activeCategory === 'appliances'}
              >
                Appliances &amp; Tools
              </button>
            </div>

            <div className="catalogue-utilities" id="catalogue-utilities">
              <div className="select-wrapper">
                <select 
                  id="sort-select" 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="alphabetical">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Visual Status Header */}
          {(activeCategory !== 'all' || searchQuery.trim() !== '') && (
            <div className="filter-status-row">
              <span className="results-count">
                Showing {sortedProducts.length} product{sortedProducts.length === 1 ? '' : 's'}
              </span>
              <div className="active-filters-list">
                {activeCategory !== 'all' && (
                  <div className="active-filter-badge">
                    <span>Category: {getCategoryLabel(activeCategory)}</span>
                    <button type="button" className="remove-filter-btn" onClick={handleRemoveCategory}>✕</button>
                  </div>
                )}
                {searchQuery.trim() !== '' && (
                  <div className="active-filter-badge">
                    <span>Search: "{searchQuery}"</span>
                    <button type="button" className="remove-filter-btn" onClick={() => setSearchQuery('')}>✕</button>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                className="reset-all-filters-btn"
                onClick={handleClearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Catalog Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="products-grid" id="products-grid">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="empty-catalogue-state" id="empty-catalogue-state">
              <div className="empty-icon">🔍</div>
              <h3>No products match your criteria</h3>
              <p>Try refining your search terms or clearing active filters to view our full collection.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleClearAllFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
