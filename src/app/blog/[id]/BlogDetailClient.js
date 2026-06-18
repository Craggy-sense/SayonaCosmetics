"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

export default function BlogDetailClient({ blog, allProducts = [] }) {
  const { setSelectedProduct } = useCart();

  // Helper: Format Dates
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-KE', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  // Helper: Parse Markdown elements in content
  const parseMarkdown = (text = '') => {
    if (!text) return [];
    
    const blocks = text.split(/\n\n+/);
    
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      
      // H2 Headings
      if (trimmed.startsWith('## ')) {
        const headingText = trimmed.replace(/^##\s+/, '');
        return <h2 key={idx} className="blog-detail-h2">{headingText}</h2>;
      }
      
      // H3 Headings
      if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace(/^###\s+/, '');
        return <h3 key={idx} className="blog-detail-h3">{headingText}</h3>;
      }
      
      // Paragraphs with inline bold and italics replacement
      const htmlContent = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
      return (
        <p 
          key={idx} 
          className="blog-detail-p" 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      );
    }).filter(Boolean);
  };

  // Helper: Select related products based on blog content matching
  const getRelatedProducts = () => {
    if (allProducts.length === 0) return [];
    
    const textToScan = (blog.title + ' ' + (blog.focusKeyword || '') + ' ' + blog.content).toLowerCase();
    
    let targetCategory = '';
    if (textToScan.includes('clipper') || textToScan.includes('trimmer') || textToScan.includes('fade') || textToScan.includes('barber')) {
      targetCategory = 'appliances';
    } else if (textToScan.includes('argan') || textToScan.includes('shampoo') || textToScan.includes('conditioner') || textToScan.includes('wash')) {
      targetCategory = 'shampoo-conditioner';
    } else if (textToScan.includes('leave-in') || textToScan.includes('treatment') || textToScan.includes('growth') || textToScan.includes('restore') || textToScan.includes('hair food')) {
      targetCategory = 'treatments';
    } else if (textToScan.includes('pomade') || textToScan.includes('gel') || textToScan.includes('wax') || textToScan.includes('styling') || textToScan.includes('hemp')) {
      targetCategory = 'styling';
    }

    // Filter products by matched category
    let matched = allProducts.filter(p => p.category === targetCategory);
    
    // Fallback: If no products in category or not enough, fill with other products
    if (matched.length < 3) {
      const extra = allProducts.filter(p => !matched.find(m => m.id === p.id));
      matched = [...matched, ...extra];
    }
    
    return matched.slice(0, 3);
  };

  const relatedProducts = getRelatedProducts();

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.image || "https://sayonacosmetics.com/SayonaCosmeticsLogo.png",
    "datePublished": blog.createdAt,
    "dateModified": blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.author || "Sayona Beauty Experts"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sayona Cosmetics",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sayonacosmetics.com/SayonaCosmeticsLogo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sayonacosmetics.com/blog/${blog.id}`
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="blog-detail-wrapper">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="blog-detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="blog-breadcrumb">
          <Link href="/">Shop</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/blog">Blog</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{blog.title}</span>
        </nav>

        {/* Article Header */}
        <header className="blog-detail-header">
          <span className="blog-detail-category-badge">{blog.category || 'Hair Care'}</span>
          <h1 className="blog-detail-title">{blog.title}</h1>
          
          <div className="blog-detail-meta">
            <span className="blog-detail-author">By <strong>{blog.author || 'Sayona Experts'}</strong></span>
            <span className="meta-dot">•</span>
            <span className="blog-detail-date">{formatDate(blog.createdAt)}</span>
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div className="blog-detail-image-container">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="blog-detail-image"
            />
          </div>
        )}

        {/* Main Article Body */}
        <main className="blog-detail-content">
          {parseMarkdown(blog.content)}
        </main>

        <hr className="blog-detail-divider" />

        {/* CTA Segment promoting products */}
        <section className="blog-detail-cta">
          <h3>Formulated for Clinical Results</h3>
          <p>
            Sayona Cosmetics designs high-performance hair foods, anti-dandruff pomades, organic shampoos, and precision clippers optimized to nurture thick, coily, and natural hair textures. Upgrade your routine today.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link href="/" className="btn btn-primary">
              Browse Sayona Catalogue
            </Link>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="blog-related-products">
            <h2 className="related-title">Recommended Products For You</h2>
            <p className="related-subtitle">Featured solutions mentioned or recommended in this article.</p>
            
            <div className="related-products-grid">
              {relatedProducts.map((prod) => {
                const startPrice = prod.sizes && prod.sizes[0] ? prod.sizes[0].price : 0;
                return (
                  <div key={prod.id} className="related-product-card">
                    <div className="related-product-image-box" onClick={() => setSelectedProduct(prod)}>
                      {prod.image ? (
                        <img src={prod.image} alt={prod.title} />
                      ) : (
                        <div className="related-fallback-art">🛍️</div>
                      )}
                      {prod.tag && <span className="related-product-badge">{prod.tag}</span>}
                    </div>
                    <div className="related-product-info">
                      <span className="related-product-cat">
                        {prod.category === 'shampoo-conditioner' ? 'Shampoo & Conditioner' : 
                         prod.category === 'treatments' ? 'Hair Treatment' : 
                         prod.category === 'styling' ? 'Styling Formula' : 'Appliance & Tool'}
                      </span>
                      <h4 onClick={() => setSelectedProduct(prod)} className="related-product-title">
                        {prod.title}
                      </h4>
                      <div className="related-product-footer">
                        <span className="related-product-price">From KSh {formatPrice(startPrice)}</span>
                        <button 
                          onClick={() => setSelectedProduct(prod)}
                          className="related-product-buy-btn"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Post Footer Navigation */}
        <footer className="blog-detail-footer-nav">
          <Link href="/blog" className="back-to-blogs-link">
            ← Back to All Articles
          </Link>
        </footer>
      </div>
    </div>
  );
}
