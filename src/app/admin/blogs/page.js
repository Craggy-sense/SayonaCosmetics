"use client";

import React, { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SAMPLE_BLOGS = [
  {
    title: "How to Grow and Strengthen Relaxed African Hair",
    excerpt: "Nourish and protect your relaxed locks. Learn how to prevent breakage, retain hydration, and style safely using natural botanical oils.",
    content: "Relaxed hair requires extra care to stay strong and healthy. Because the relaxing process alters the hair's protein structure, it makes fibers more porous and prone to breakage. To counteract this, a consistent moisture-protein balance is essential.\n\nHere are key steps to follow:\n\n1. Deep Hydration: Use shampoos and conditioners enriched with antioxidants like Olive Oil to soothe the scalp and coat dry strands.\n2. Leave-In Treatment: Apply lightweight treatments regularly to safeguard cuticles against heating tools.\n3. Daily Moisture Sealant: Use pomades or hair food that contains Argan Oil to feed the scalp and locks, preventing splitting.",
    author: "Sayona Beauty Experts",
    category: "Hair Care Tips",
    tag: "POPULAR",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    title: "The Ultimate Guide to Getting Rid of Scalp Dandruff",
    excerpt: "Tired of persistent scalp flaking and itchiness? Discover how medicinal herbs and mint extracts in pomades solve dandruff at the roots.",
    content: "Scalp dandruff is a common condition characterized by dry flaking skin accompanied by mild itchiness. In many cases, it is caused by the overgrowth of a naturally occurring yeast-like fungus that feeds on sebum.\n\nHow to solve it:\n1. Keep it clean: Use a 2-in-1 clarifying shampoo regularly.\n2. Herb & Oil Infusions: Look for pomades that contain active peppermint and tea tree oils. Menthol provides immediate soothing relief to scalp tension and tightness while tea tree oil fights the fungal sources.\n3. Avoid heavy greases: Apply oil directly to the scalp rather than clogging hair shafts.",
    author: "Sayona Scalp Therapy",
    category: "Scalp Health",
    tag: "NEW",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
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
        image: finalImageUrl,
        createdAt: editingBlog ? (editingBlog.createdAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (editingProduct => editingBlog) {
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
              maxWidth: '650px', 
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

            <form onSubmit={handleSaveBlog} className="admin-form-grid" style={{ border: 'none', padding: 0, boxShadow: 'none' }}>
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
                  rows="6" 
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
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
