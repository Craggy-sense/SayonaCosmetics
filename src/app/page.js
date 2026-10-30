"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import ProductCard from '@/components/ProductCard';
import { Countdown } from '@/components/ShopUI';
import { useNow } from '@/lib/useNow';
import { CAMPAIGN, campaignPhase, dealPrice, formatKsh, headlinePercents, isComingSoon } from '@/data/campaign';

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
  const [paused, setPaused] = useState(false);
  const now = useNow();
  const phase = campaignPhase(now);
  const pct = headlinePercents(now);
  const weekendPct = CAMPAIGN.discounts.weekend;
  const live = phase === 'november' || phase === 'weekend';
  const campaignOn = live || phase === 'before' || phase === null;
  const hc = pct.hairCare;
  const ap = pct.appliances;
  const priceLabel = live ? 'Deal price' : 'Black November price from 1 Nov';

  const goToCategory = (cat) => {
    setActiveCategory(cat);
    const catalog = document.getElementById('catalogue');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  const alertsUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hi Sayona Cosmetics! Please add me to your Black November deal alerts.')}`;

  const campaignSlides = [
    {
      key: 'black-november',
      tag: phase === 'before' || phase === null ? 'STARTS 1 NOVEMBER' : phase === 'weekend' ? 'BLACK FRIDAY WEEKEND · LIVE' : 'LIVE ALL NOVEMBER',
      title: phase === 'weekend' ? 'Black Friday Weekend' : 'Black November',
      subtitle: phase === 'weekend'
        ? `${hc}% off every Sayona hair-care formula and ${ap}% off pro appliances — this weekend only, until 30 November.`
        : `${hc}% off every Sayona shampoo, conditioner, treatment and styling formula — all month. ${ap}% off pro appliances. Black Friday Weekend (27–30 Nov) goes deeper: up to ${weekendPct.hairCare}% off.`,
      images: ['/product-images/argan-shampoo.jpg', '/product-images/olive-leave-in.jpg', '/product-images/argan-hair-food.jpg', '/product-images/protein-treatment.jpg'],
      countdown: true,
      cta: { label: live ? 'Shop the Deals' : 'Preview the Deals', onClick: () => goToCategory('offers') },
      secondary: { label: 'Get deal alerts on WhatsApp', href: alertsUrl },
    },
    {
      key: 'wash-day',
      tag: 'WASH DAY DUO',
      title: 'Wash Day, Sorted',
      subtitle: 'Argan Oil Shampoo + Coconut Oil Conditioner — cleanse, moisturise and detangle, made for African hair.',
      images: ['/product-images/argan-shampoo.jpg', '/product-images/coconut-conditioner.jpg'],
      price: { label: `${priceLabel} · 1 ltr each`, was: 125 + 150, now: dealPrice(125, hc) + dealPrice(150, hc) },
      cta: { label: 'Shop Shampoo & Conditioner', onClick: () => goToCategory('shampoo-conditioner') },
    },
    {
      key: 'salon',
      tag: 'FOR SALONS & BARBERS',
      title: 'Salon Stock-Up',
      subtitle: 'Our 5 ltr shampoos and conditioner are built for busy salons. Stock up for the festive rush at Black November prices.',
      images: ['/product-images/olive-shampoo.jpg'],
      price: { label: `${priceLabel} · 5 ltr shampoo`, was: 395, now: dealPrice(395, hc) },
      cta: { label: 'Shop Salon Sizes', onClick: () => goToCategory('shampoo-conditioner') },
      secondary: { label: 'Bulk & distributor orders', href: '/contact#contact' },
    },
    {
      key: 'blowout',
      tag: 'PRO APPLIANCES',
      title: 'The Pro Blowout',
      subtitle: '2000W Sayona hair dryer with adjustable heat and speed, nozzles and comb included. Three models to choose from.',
      images: ['/product-images/hair-dryer.jpg'],
      price: { label: `${priceLabel} · from`, was: 4300, now: dealPrice(4300, ap) },
      cta: { label: 'Shop Appliances', onClick: () => goToCategory('appliances') },
    },
  ];
  const evergreenSlides = campaignSlides.slice(1).map((sl) => ({ ...sl, price: sl.price ? { label: sl.price.label.replace(priceLabel, 'Price'), now: sl.price.was } : undefined }));
  const slides = campaignOn ? campaignSlides : evergreenSlides;
  const slide = slides[currentSlide % slides.length];

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

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
        const dealEligible = !isComingSoon(prod) && prod.inStock !== false &&
          ['shampoo-conditioner', 'treatments', 'styling', 'appliances'].includes(prod.category);
        if (!dealEligible) return false;
      } else if (activeCategory === 'new-arrivals') {
        const isNew = prod.tag === 'NEW' || isComingSoon(prod) || ['olive-shampoo', 'foam-wrap'].includes(prod.id);
        if (!isNew) return false;
      } else if (prod.category !== activeCategory) {
        return false;
      }
    }
    // 2. Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (prod.title || '').toLowerCase().includes(q);
      const matchDesc = (prod.desc || '').toLowerCase().includes(q);
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
    return Number(isComingSoon(a)) - Number(isComingSoon(b)); // default: keep order, coming-soon last
  });

  const getCategoryLabel = (cat) => {
    const mapping = {
      "shampoo-conditioner": "Shampoo & Conditioner",
      "treatments": "Hair Treatment",
      "styling": "Hair Styling",
      "appliances": "Appliance & Tool",
      "offers": "Black November Deals",
      "new-arrivals": "New Arrivals"
    };
    if (mapping[cat]) return mapping[cat];
    if (!cat || cat === 'all') return "All Categories";
    return cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getCategoryEmoji = (cat) => {
    const mapping = {
      "shampoo-conditioner": "🧴",
      "treatments": "🌿",
      "styling": "👑",
      "appliances": "✂️",
      "offers": "🔥",
      "new-arrivals": "✨"
    };
    return mapping[cat] || "✨";
  };

  const baseCategories = [
    { slug: 'shampoo-conditioner', label: 'Shampoo & Conditioner', emoji: '🧴' },
    { slug: 'treatments', label: 'Hair Treatments', emoji: '🌿' },
    { slug: 'styling', label: 'Hair Styling', emoji: '👑' },
    { slug: 'appliances', label: 'Appliances & Tools', emoji: '✂️' }
  ];

  // Build the list of categories dynamically from products
  const customCats = [];
  const defaultSlugs = ['shampoo-conditioner', 'treatments', 'styling', 'appliances'];
  products.forEach(p => {
    if (p.category && !defaultSlugs.includes(p.category) && !customCats.some(c => c.slug === p.category)) {
      customCats.push({
        slug: p.category,
        label: getCategoryLabel(p.category),
        emoji: getCategoryEmoji(p.category)
      });
    }
  });

  const categoriesList = [...baseCategories, ...customCats];

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
          <div className="hero-sidebar-col">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <h3>Shop By Category</h3>
                <p>Everything you need for beautiful hair.</p>
              </div>
              <div className="sidebar-list">
                {categoriesList.map(cat => (
                  <button 
                    key={cat.slug}
                    className={`sidebar-item ${activeCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(cat.slug);
                      const catalog = document.getElementById('catalogue');
                      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span className="item-label">{cat.emoji} {cat.label}</span>
                    <span className="item-arrow">&rsaquo;</span>
                  </button>
                ))}
                <a 
                  href="https://gifthaus.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="sidebar-item"
                >
                  <span className="item-label">🌸 Perfumes <small className="ext-note">Gift Haus ↗</small></span>
                  <span className="item-arrow">&rsaquo;</span>
                </a>
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

          {/* Right Column: Campaign Showcase Slider */}
          <div className="hero-banner-col">
            <div
              className={`wide-showcase-card ${campaignOn ? 'theme-black' : ''}`}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="showcase-card-content" key={slide.key}>
                <div className="showcase-card-left">
                  <div className="showcase-sponsor-logos">
                    <span className="sponsor-brand">SAYONA</span>
                    <div className="sponsor-divider" />
                    <span className="sponsor-tag">{campaignOn ? 'BLACK NOVEMBER' : 'FEATURED'}</span>
                  </div>
                  <span className="showcase-tag">{slide.tag}</span>
                  <h2 className="showcase-title">{slide.title}</h2>
                  <p className="showcase-subtitle">{slide.subtitle}</p>

                  {slide.countdown && <Countdown />}

                  {slide.price && (
                    <div className="showcase-price-block">
                      <span className="showcase-price-label">{slide.price.label}</span>
                      <div className="showcase-price-row">
                        {slide.price.was && slide.price.was !== slide.price.now && (
                          <span className="showcase-old-price">{formatKsh(slide.price.was)}</span>
                        )}
                        <span className="showcase-price">{formatKsh(slide.price.now)}</span>
                      </div>
                    </div>
                  )}

                  <div className="showcase-actions-row">
                    <button type="button" className="btn btn-primary showcase-buy-btn" onClick={slide.cta.onClick}>
                      {slide.cta.label}
                    </button>
                    {slide.secondary ? (
                      <a
                        className="showcase-secondary-link"
                        href={slide.secondary.href}
                        {...(slide.secondary.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {slide.secondary.label} →
                      </a>
                    ) : (
                      <div className="delivery-pill">
                        <span className="delivery-icon">🚚</span>
                        <span className="delivery-text">Free Nairobi delivery over <strong>KSh 3,000</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`showcase-card-right showcase-collage count-${slide.images.length}`}>
                  {slide.images.map((src) => (
                    <div className="collage-tile" key={src}>
                      <img src={src} alt="" className="showcase-wide-img" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="slider-nav">
                <button
                  type="button"
                  className="slider-arrow prev"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <div className="slider-dots">
                  {slides.map((sl, idx) => (
                    <button
                      key={sl.key}
                      type="button"
                      className={`slider-dot ${idx === currentSlide % slides.length ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}: ${sl.title}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="slider-arrow next"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  aria-label="Next slide"
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
            <span className="section-eyebrow">The Sayona Collection</span>
            <h1 className="section-title">Hair Care &amp; Styling Made for African Hair</h1>
            <p className="section-subtitle">
              Shampoos, conditioners, deep treatments, anti-dandruff pomades, dreadlock wax and professional
              appliances — enriched with argan, olive and coconut oils, made in Kenya and delivered across the country.
            </p>
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
              {categoriesList.map(cat => (
                <button 
                  key={cat.slug}
                  className={`category-tab ${activeCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.slug)}
                  role="tab" 
                  aria-selected={activeCategory === cat.slug}
                >
                  {cat.label}
                </button>
              ))}
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
                    <span>Search: &ldquo;{searchQuery}&rdquo;</span>
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

      {/* Fragrance partner band — Gift Haus stays its own shop */}
      <section className="fragrance-band" aria-labelledby="fragrance-title">
        <div className="container fragrance-inner">
          <div className="fragrance-copy">
            <span className="section-eyebrow">Complete the look</span>
            <h2 id="fragrance-title">Fragrance &amp; Gift Sets at Gift Haus</h2>
            <p>
              Finish your routine with a signature scent. Our perfumes live at Gift Haus — perfect gifting for
              the festive season.
            </p>
            <a className="btn btn-primary" href="https://gifthaus.netlify.app" target="_blank" rel="noopener noreferrer">
              Shop Perfumes at Gift Haus ↗
            </a>
            <small className="fragrance-note">Opens Gift Haus in a new tab. Perfume orders are placed there.</small>
          </div>
          <div className="fragrance-art" aria-hidden="true">
            <span className="bottle b1" />
            <span className="bottle b2" />
            <span className="bottle b3" />
          </div>
        </div>
      </section>

      {/* SEO / trust copy */}
      <section className="seo-copy">
        <div className="container seo-copy-grid">
          <div>
            <h2>Why Sayona hair care?</h2>
            <p>
              Sayona Cosmetics formulates hair care for the needs of African hair textures — natural, relaxed, locs and
              coils. Our Argan Oil and Olive Oil shampoos cleanse without stripping, the Coconut Oil conditioner restores
              moisture and elasticity, and treatments like Hair Protein, Cholesterol and Deep Penetrating Treatment help
              repair dry, damaged hair.
            </p>
          </div>
          <div>
            <h2>Delivery across Kenya</h2>
            <p>
              Order online or on WhatsApp. We offer free delivery within Nairobi on orders above KSh 3,000 and
              countrywide courier delivery. Read our <a href="/delivery-returns">Delivery &amp; Returns policy</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
