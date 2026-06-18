"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function BlogListingClient({ initialBlogs = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories dynamically from the blogs list
  const categories = ['All', ...Array.from(new Set(initialBlogs.map(b => b.category).filter(Boolean)))];

  // Filter blogs based on selected category and search query
  const filteredBlogs = initialBlogs.filter(blog => {
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="blog-page-wrapper">
      {/* Blog Hero Header */}
      <section className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <div className="blog-hero-content">
          <span className="blog-hero-tag">SAYONA BEAUTY JOURNAL</span>
          <h1 className="blog-hero-title">Elevate Your Hair Care & Grooming Science</h1>
          <p className="blog-hero-subtitle">
            Expert hair growth routines, professional shaving tips, and clinical breakdowns of premium natural ingredients from the laboratories of Sayona.
          </p>
          
          {/* Live Search Bar */}
          <div className="blog-search-container">
            <span className="blog-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search guides, treatments, ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blog-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="blog-search-clear"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="blog-main-container">
        {/* Category Selector Filter Bar */}
        <div className="blog-categories-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`blog-category-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Count Indicator */}
        <div className="blog-results-info">
          Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} 
          {activeCategory !== 'All' && ` in "${activeCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="blog-empty-state">
            <span className="blog-empty-icon">📝</span>
            <h3>No Articles Found</h3>
            <p>We couldn't find any articles matching your search query or selected category. Try checking other filters or clear your search term.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="btn btn-primary"
              style={{ marginTop: '16px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                <Link href={`/blog/${blog.id}`} className="blog-card-image-link">
                  <div className="blog-card-image-container">
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="blog-card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="blog-card-image-fallback">
                        <span>📝</span>
                      </div>
                    )}
                    {blog.tag && (
                      <span className="blog-card-badge">{blog.tag}</span>
                    )}
                  </div>
                </Link>

                <div className="blog-card-body">
                  <div className="blog-card-meta-header">
                    <span className="blog-card-category">{blog.category || 'Beauty'}</span>
                    <span className="blog-card-date">{formatDate(blog.createdAt)}</span>
                  </div>

                  <Link href={`/blog/${blog.id}`}>
                    <h2 className="blog-card-title">{blog.title}</h2>
                  </Link>

                  <p className="blog-card-excerpt">{blog.excerpt}</p>

                  <div className="blog-card-footer">
                    <span className="blog-card-author">By {blog.author || 'Sayona Experts'}</span>
                    <Link href={`/blog/${blog.id}`} className="blog-card-readmore">
                      Read Article <span className="readmore-arrow">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
