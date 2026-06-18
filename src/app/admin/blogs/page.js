"use client";

import React, { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SAMPLE_BLOGS = [
  {
    title: "The Ultimate 5-Step Routine for Healthy African Hair Growth",
    excerpt: "Unlock the secrets to faster African hair growth. Learn how to retain moisture, prevent split ends, and nurture your scalp using high-grade organic oils.",
    content: "Growing healthy African hair requires a routine focused on moisture retention and scalp care. Coarser hair textures have unique coils that make it harder for natural scalp oils to travel down the shaft, leading to dryness and breakage. By implementing this five-step routine, you can maximize your hair length and strength.\n\n## 1. Cleanse with a Gentle Moisturizing Shampoo\nStart your routine with a sulfate-free shampoo. Shampoos containing natural antioxidants like Olive Oil cleanse your hair without stripping away its vital moisture. Wash every 7 to 10 days to keep your hair follicles clear and healthy.\n\n## 2. Deep Condition Weekly\nConditioning is non-negotiable for coily hair. Use a deep conditioning treatment containing cholesterol or natural lipids. This restores elasticity to your hair fibers, helping them bend rather than snap during detangling and styling.\n\n## 3. Apply a Hydrating Leave-In Treatment\nAfter washing, apply a lightweight leave-in protein treatment. Active proteins help rebuild the damaged areas of your hair cuticle. It forms a protective shield that safeguards relaxed or natural hair against blow-drying and flat ironing heat.\n\n## 4. Feed Your Scalp Daily\nHealthy hair starts at the roots. Massage a nourishing hair food containing organic Argan Oil or tea tree oil directly into your scalp. Scalp stimulation increases blood circulation to your hair follicles, encouraging consistent length growth.\n\n## 5. Lock in Moisture (The LOC Method)\nTo prevent dryness, apply a water-based leave-in, followed by an oil, and seal with a hair pomade or dreadlock gel wax if styling. This locks in hydration for days, eliminating itchiness and dryness. Try out this simple daily routine and watch your hair reach its maximum growth potential!",
    author: "Sayona Beauty Experts",
    category: "Hair Care Tips",
    tag: "POPULAR",
    focusKeyword: "African hair growth",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    title: "How to Choose the Right Hair Clippers for Barbershop-Quality Fades",
    excerpt: "Want a clean match-day fade at home? Discover what to look for when choosing hair clippers, from electromagnetic motors to precision cordless clippers.",
    content: "Achieving a sharp, professional fade at home depends heavily on the tools you use. Standard trimmers can snag on coarse, thick hair textures, leading to uneven cuts and scalp irritation. To get barbershop-quality results, you need high-performance clippers designed for precision.\n\n## 1. Look for a Powerful Motor\nFor thick, coily hair, look for clippers with a heavy-duty electromagnetic motor or a high-torque rotary motor. A powerful motor ensures the blades cut cleanly through the hair in a single pass without pulling or snagging.\n\n## 2. Precision Self-Sharpening Blades\nThe quality of the blades determines the sharpness of the cut. Premium titanium or carbon steel blades stay sharp longer. Look for clippers with self-sharpening blades that maintain a close balding alignment without heating up excessively during use.\n\n## 3. Corded vs. Cordless Clippers\nCordless clippers provide ultimate maneuverability, allowing you to reach difficult angles around the back of your head without cords getting in the way. Ensure they have a long-lasting lithium battery. If you cut hair frequently or run a professional shop, heavy-duty corded balding clippers are ideal as they deliver continuous, uninterrupted cutting power.\n\n## 4. Choose Adjustable Taper Levers and Guards\nA built-in taper lever allows you to micro-adjust blade lengths on the fly, which is crucial for blending different sections of a fade. Having a complete set of guide combs/guards gives you the versatility to style everything from close skin cuts to longer styles. Invest in a professional gold clipper set to maintain a neat match-day grooming routine!",
    author: "Sayona Barber Shop",
    category: "Grooming Guides",
    tag: "NEW",
    focusKeyword: "hair clippers",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    title: "Why Argan Oil is a Game-Changer for Dry, Damaged Hair",
    excerpt: "Struggling with dry, frizzy, or chemically damaged hair? Learn how organic Argan Oil repairs hair cuticles, locks in moisture, and restores natural shine.",
    content: "Argan Oil is widely celebrated as 'liquid gold' in the cosmetics industry, and for good reason. Extracted from the kernels of the Moroccan Argan tree, it is packed with essential fatty acids, vitamin E, and natural antioxidants. For anyone dealing with dry, damaged, or brittle hair, Argan Oil offers a complete restoration therapy.\n\n## 1. Deeply Penetrates the Hair Shaft\nUnlike heavier mineral oils that sit on top of the hair and clog the scalp, Argan Oil has a lightweight molecular structure. It penetrates deep into the inner cortex of the hair shaft, delivering rich nutrients where they are needed most. This heals damage from the inside out, making hair softer and more manageable.\n\n## 2. Lock in Intense Moisture\nFrizz is caused when dry hair absorbs humidity from the air, causing the outer cuticles to swell. Argan Oil forms a lightweight moisture seal around each hair strand. This locks in vital hydration while repelling external humidity, keeping your hair smooth and frizz-free all day long.\n\n## 3. Protects Against Heat Styling\nUsing blow dryers, straighteners, and flat irons can strip your hair of its natural oils, leading to severe breakage. Applying a few drops of an Argan Oil hair food or using an Argan-infused shampoo before styling creates a thermal barrier. This minimizes heat damage and preserves your hair's natural elasticity.\n\n## 4. Promotes Healthy Hair Growth\nArgan Oil is rich in phenols and antioxidants, which soothe dry, irritated scalps and stimulate hair follicles. Massaging it regularly onto your scalp supports healthy blood circulation and combats flakiness, creating the perfect foundation for strong, shiny hair. Upgrade your hair care routine with organic Argan Oil and enjoy healthy, glowing locks!",
    author: "Sayona Laboratory",
    category: "Ingredient Spotlight",
    tag: "ESSENTIAL",
    focusKeyword: "Argan Oil",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString()
  }
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Sayona Admin');
  const [category, setCategory] = useState('Hair Care Tips');
  const [tag, setTag] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const loaded = [];
      querySnapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() });
      });
      // Sort client-side by date descending
      loaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBlogs(loaded);
    } catch (e) {
      console.error('Error fetching blogs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setAuthor('Sayona Admin');
    setCategory('Hair Care Tips');
    setTag('');
    setImageFile(null);
    setImageUrl('');
    setFocusKeyword('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title || '');
    setExcerpt(blog.excerpt || '');
    setContent(blog.content || '');
    setAuthor(blog.author || 'Sayona Admin');
    setCategory(blog.category || 'Hair Care Tips');
    setTag(blog.tag || '');
    setFocusKeyword(blog.focusKeyword || '');
    setImageFile(null);
    setImageUrl(blog.image || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSeedBlogs = async () => {
    if (blogs.length > 0) {
      if (!confirm('You already have blog posts. Are you sure you want to seed sample posts?')) {
        return;
      }
    }
    
    try {
      setSeeding(true);
      const batch = writeBatch(db);
      SAMPLE_BLOGS.forEach((blog) => {
        const docRef = doc(collection(db, 'blogs'));
        batch.set(docRef, blog);
      });
      await batch.commit();
      alert('Sample blog posts successfully seeded to Firestore database!');
      loadBlogs();
    } catch (e) {
      console.error('Seeding error:', e);
      alert('Failed to seed blogs: ' + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteBlog = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'blogs', id));
      loadBlogs();
    } catch (e) {
      console.error('Delete error:', e);
      alert('Failed to delete blog: ' + e.message);
      setLoading(false);
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!title || !excerpt || !content) {
      setError('Please fill in all required fields (Title, Excerpt, Content).');
      setSaving(false);
      return;
    }

    const { score: currentScore } = calculateSEOScore();
    if (currentScore < 50) {
      if (!confirm(`Your article has a Weak SEO score (${currentScore}/100). We highly recommend optimizing the content (e.g. extending word count, using the focus keyword in title and excerpt, or adding headings) to rank better on Google.\n\nDo you want to publish it anyway?`)) {
        setSaving(false);
        return;
      }
    }

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const fileRef = ref(storage, `blogs/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const blogPayload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        author: author.trim(),
        category: category.trim(),
        tag: tag.trim(),
        focusKeyword: focusKeyword.trim(),
        image: finalImageUrl,
        createdAt: editingBlog ? (editingBlog.createdAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (editingBlog) {
        await updateDoc(doc(db, 'blogs', editingBlog.id), blogPayload);
      } else {
        await addDoc(collection(db, 'blogs'), blogPayload);
      }

      setIsModalOpen(false);
      loadBlogs();
    } catch (e) {
      console.error('Save error:', e);
      setError('Failed to save blog post: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const calculateSEOScore = () => {
    let score = 0;
    const details = [];

    // 1. Title Check (max 20 points)
    const titleLen = title.length;
    if (titleLen === 0) {
      details.push({ test: "Title length", score: 0, max: 20, desc: "Title is missing", status: "fail" });
    } else if (titleLen >= 30 && titleLen <= 60) {
      score += 20;
      details.push({ test: "Title length", score: 20, max: 20, desc: `Title length (${titleLen} chars) is perfect`, status: "pass" });
    } else {
      score += 10;
      details.push({ test: "Title length", score: 10, max: 20, desc: `Title is ${titleLen < 30 ? 'too short' : 'too long'} (aim for 30-60 chars)`, status: "warn" });
    }

    // 2. Excerpt / Meta Description Check (max 20 points)
    const excerptLen = excerpt.length;
    if (excerptLen === 0) {
      details.push({ test: "Excerpt / Meta Description", score: 0, max: 20, desc: "Excerpt is missing", status: "fail" });
    } else if (excerptLen >= 80 && excerptLen <= 160) {
      score += 20;
      details.push({ test: "Excerpt / Meta Description", score: 20, max: 20, desc: `Excerpt length (${excerptLen} chars) is perfect`, status: "pass" });
    } else {
      score += 10;
      details.push({ test: "Excerpt / Meta Description", score: 10, max: 20, desc: `Excerpt is ${excerptLen < 80 ? 'too short' : 'too long'} (aim for 80-160 chars)`, status: "warn" });
    }

    // 3. Content Length (max 20 points)
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (words === 0) {
      details.push({ test: "Word count", score: 0, max: 20, desc: "Content is empty", status: "fail" });
    } else if (words >= 300) {
      score += 20;
      details.push({ test: "Word count", score: 20, max: 20, desc: `Word count (${words} words) is excellent (ideal >= 300 words)`, status: "pass" });
    } else {
      const pts = Math.min(10, Math.floor(words / 30));
      score += pts;
      details.push({ test: "Word count", score: pts, max: 20, desc: `Word count (${words} words) is low (aim for >= 300 words)`, status: "warn" });
    }

    // 4. Focus Keyword check (max 30 points if keyword is set)
    if (focusKeyword.trim() !== '') {
      const kw = focusKeyword.toLowerCase().trim();
      
      // Keyword in Title (10 pts)
      const kwInTitle = title.toLowerCase().includes(kw);
      if (kwInTitle) {
        score += 10;
        details.push({ test: "Keyword in Title", score: 10, max: 10, desc: `Focus keyword "${focusKeyword}" found in title`, status: "pass" });
      } else {
        details.push({ test: "Keyword in Title", score: 0, max: 10, desc: `Focus keyword "${focusKeyword}" not found in title`, status: "fail" });
      }

      // Keyword in Excerpt (10 pts)
      const kwInExcerpt = excerpt.toLowerCase().includes(kw);
      if (kwInExcerpt) {
        score += 10;
        details.push({ test: "Keyword in Excerpt", score: 10, max: 10, desc: `Focus keyword "${focusKeyword}" found in excerpt`, status: "pass" });
      } else {
        details.push({ test: "Keyword in Excerpt", score: 0, max: 10, desc: `Focus keyword "${focusKeyword}" not found in excerpt`, status: "fail" });
      }

      // Keyword Density in Content (10 pts)
      if (words > 0) {
        const matches = (content.toLowerCase().match(new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || []).length;
        const density = (matches / words) * 100;
        if (density >= 0.5 && density <= 2.5) {
          score += 10;
          details.push({ test: "Keyword Density", score: 10, max: 10, desc: `Keyword density (${density.toFixed(1)}%) is ideal (aim for 0.5% - 2.5%)`, status: "pass" });
        } else if (density > 2.5) {
          score += 5;
          details.push({ test: "Keyword Density", score: 5, max: 10, desc: `Keyword density (${density.toFixed(1)}%) is high (potential keyword stuffing)`, status: "warn" });
        } else {
          score += 2;
          details.push({ test: "Keyword Density", score: 2, max: 10, desc: `Keyword density (${density.toFixed(1)}%) is low (occurs ${matches} times)`, status: "fail" });
        }
      } else {
        details.push({ test: "Keyword Density", score: 0, max: 10, desc: "Add content to measure keyword density", status: "fail" });
      }
    } else {
      details.push({ test: "Focus Keyword Analysis", score: 0, max: 30, desc: "Enter a Focus Keyword to enable keyword verification", status: "neutral" });
    }

    // 5. Structure & Headings check (max 10 points)
    const hasHeadings = /^(#{2,4}\s|\n#{2,4}\s)/m.test(content) || /<h[2-4]/i.test(content);
    if (hasHeadings) {
      score += 10;
      details.push({ test: "Content structure", score: 10, max: 10, desc: "Content contains structural headings (H2, H3, H4)", status: "pass" });
    } else {
      details.push({ test: "Content structure", score: 0, max: 10, desc: "No subheadings found. Add ## or ### elements to organize", status: "warn" });
    }

    return { score, details };
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Blogs</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={handleSeedBlogs}
            disabled={seeding || loading}
          >
            {seeding ? 'Seeding...' : '🌱 Seed Sample Blogs'}
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={openAddModal}
            disabled={loading}
          >
            ✍️ Add Blog Post
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-primary)' }}>
          <p>Fetching articles feed...</p>
        </div>
      ) : (
        <div className="admin-table-container">
          {blogs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(31, 27, 28, 0.5)' }}>
              No blog posts found in database. Seed sample posts or create your first draft!
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '8px', 
                          overflow: 'hidden', 
                          background: 'var(--color-neutral-light)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {blog.image ? (
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }}
                          />
                        ) : null}
                        <span style={{ display: blog.image ? 'none' : 'block', fontSize: '1.2rem' }}>📝</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--color-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {blog.title}
                    </td>
                    <td>{blog.author}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(31, 27, 28, 0.7)' }}>
                        {blog.category}
                      </span>
                    </td>
                    <td>{formatDate(blog.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        onClick={() => openEditModal(blog)}
                        style={{ 
                          marginRight: '8px', 
                          backgroundColor: 'rgba(212,175,55,0.1)', 
                          color: 'var(--color-accent-dark)', 
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteBlog(blog.id, blog.title)}
                        style={{ 
                          backgroundColor: 'rgba(220,53,69,0.1)', 
                          color: '#dc3545', 
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add/Edit Blog Modal */}
      {isModalOpen && (
        <div className="product-modal-wrapper" onClick={() => setIsModalOpen(false)}>
          <div 
            className="product-modal-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '1100px', 
              width: '95%',
              padding: '32px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.6rem' }}>
                {editingBlog ? 'Edit Blog Post' : 'Write New Blog Post'}
              </h2>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="login-error-alert" style={{ margin: 0 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: 'none', padding: 0, boxShadow: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                {/* Left Column - Form Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="admin-form-group">
                    <label htmlFor="blog_title">Post Title *</label>
                    <input 
                      type="text" 
                      id="blog_title" 
                      required 
                      className="admin-input" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 5 Hair Washing Mistakes to Avoid"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="admin-form-group">
                      <label htmlFor="blog_author">Author *</label>
                      <input 
                        type="text" 
                        id="blog_author" 
                        required 
                        className="admin-input" 
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                    
                    <div className="admin-form-group">
                      <label htmlFor="blog_cat">Category *</label>
                      <input 
                        type="text" 
                        id="blog_cat" 
                        required 
                        className="admin-input" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Hair Care Tips, Salon Trends"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="blog_excerpt">Short Excerpt * (renders in cards/teasers)</label>
                    <input 
                      type="text" 
                      id="blog_excerpt" 
                      required 
                      className="admin-input" 
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="A short one or two sentence summary..."
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="blog_content">Article Content *</label>
                    <textarea 
                      id="blog_content" 
                      rows="10" 
                      required 
                      className="admin-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write the full body of the post here..."
                    ></textarea>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="admin-form-group">
                      <label htmlFor="blog_tag">Label Tag (e.g. TRENDING, FEATURED)</label>
                      <input 
                        type="text" 
                        id="blog_tag" 
                        placeholder="Optional label" 
                        className="admin-input" 
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                      />
                    </div>
                    
                    <div className="admin-form-group">
                      <label htmlFor="blog_image">Upload Cover Image</label>
                      <input 
                        type="file" 
                        id="blog_image" 
                        accept="image/*"
                        className="admin-input"
                        onChange={(e) => setImageFile(e.target.files[0] || null)}
                        style={{ padding: '8px' }}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="blog_image_url">Or Paste Cover Image URL</label>
                    <input 
                      type="text" 
                      id="blog_image_url" 
                      placeholder="e.g. https://images.unsplash.com/..." 
                      className="admin-input"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right Column - SEO Strength Scorecard */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '24px', 
                  backgroundColor: 'var(--color-neutral-light)', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--color-border)', 
                  height: 'fit-content'
                }}>
                  {/* Focus Keyword Input */}
                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label htmlFor="blog_focus_keyword" style={{ fontWeight: '700', color: 'var(--color-primary)' }}>Focus Keyword</label>
                    <input 
                      type="text" 
                      id="blog_focus_keyword" 
                      placeholder="e.g. African hair growth" 
                      className="admin-input"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'rgba(31, 27, 28, 0.6)', marginTop: '4px', display: 'block' }}>
                      Define a primary search term to audit this post's optimization levels.
                    </span>
                  </div>

                  {/* SEO Score Meter */}
                  {(() => {
                    const seo = calculateSEOScore();
                    const scoreColor = seo.score < 50 ? '#dc3545' : seo.score < 85 ? '#d4af37' : '#2e7d32';
                    const scoreLabel = seo.score < 50 ? 'Weak' : seo.score < 85 ? 'Good' : 'Excellent';
                    
                    return (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-primary)' }}>SEO Strength Score</span>
                            <span style={{ fontWeight: '800', fontSize: '1.3rem', color: scoreColor }}>{seo.score}/100 ({scoreLabel})</span>
                          </div>
                          <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: `${seo.score}%`, height: '100%', backgroundColor: scoreColor, transition: 'width 0.3s ease' }}></div>
                          </div>
                        </div>

                        {/* Checklist */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: 'var(--color-primary)' }}>Optimization Checklist</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {seo.details.map((item, idx) => {
                              let icon = '❌';
                              let textColor = '#dc3545';
                              if (item.status === 'pass') {
                                icon = '✅';
                                textColor = '#2e7d32';
                              } else if (item.status === 'warn') {
                                icon = '⚠️';
                                textColor = '#b28900';
                              } else if (item.status === 'neutral') {
                                icon = 'ℹ️';
                                textColor = 'var(--color-primary)';
                              }
                              return (
                                <div key={idx} style={{ 
                                  display: 'flex', 
                                  gap: '10px', 
                                  alignItems: 'flex-start', 
                                  padding: '10px', 
                                  borderRadius: '8px', 
                                  backgroundColor: '#fff', 
                                  border: '1px solid var(--color-border)' 
                                }}>
                                  <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>{icon}</span>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                                      {item.test} ({item.score}/{item.max} pts)
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: textColor }}>
                                      {item.desc}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Publishing Post...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
