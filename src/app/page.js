"use client";

import React, { useEffect } from 'react';
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
    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
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
      "appliances": "Appliance & Tool"
    };
    return mapping[cat] || "All Categories";
  };

  return (
    <div className="shop-page-wrapper">
      {/* Hero Banner Section */}
      <section 
        className="hero-section" 
        id="hero" 
        style={{ backgroundImage: "url('/sayona_hero_bg.png')" }}
      >
        <div className="hero-bg-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-tagline">Formulated for African Hair</span>
            <h1 className="hero-title">{settings.heroTitle}</h1>
            <p className="hero-desc">{settings.heroDesc}</p>
            <div className="hero-ctas">
              <a href="#catalogue" className="btn btn-primary" id="hero-cta-shop">Shop Hair Care</a>
              <a href="#catalogue" className="btn btn-outline" id="hero-cta-appliances">Explore Appliances</a>
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
              <h3>Enriched with Natural Oils</h3>
              <p>Infused with Argan, Castor, Tea Tree, Eucalyptus, Mint, and Coconut essential oils.</p>
            </div>
            <div className="prop-card">
              <div className="prop-icon">👑</div>
              <h3>Formulated for African Hair</h3>
              <p>Tailored molecular formulas that restore elasticity, detangle, and deeply hydrate curly and coily textures.</p>
            </div>
            <div className="prop-card">
              <div className="prop-icon">💎</div>
              <h3>Professional Standard</h3>
              <p>Salon-tested formulas and high-performance, durable ceramic and titanium styling tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalogue Section */}
      <section className="catalogue-section" id="catalogue">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Product Catalogue</h2>
            <p className="section-subtitle">Browse Recommended Retail Prices (RRP) and find the perfect match for your hair goals.</p>
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
