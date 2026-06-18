"use client";

import React, { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FALLBACK_PRODUCTS } from '@/data/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('shampoo-conditioner');
  const [desc, setDesc] = useState('');
  const [benefitsText, setBenefitsText] = useState(''); // Newline separated
  const [usage, setUsage] = useState('');
  const [tag, setTag] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState([{ size: '', price: '' }]);
  const [inStock, setInStock] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const loaded = [];
      querySnapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() });
      });
      setProducts(loaded);
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageUrl) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview('');
    }
  }, [imageFile, imageUrl]);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('shampoo-conditioner');
    setDesc('');
    setBenefitsText('');
    setUsage('');
    setTag('');
    setImageFile(null);
    setImageUrl('');
    setSizes([{ size: '', price: '' }]);
    setInStock(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setTitle(product.title || '');
    setCategory(product.category || 'shampoo-conditioner');
    setDesc(product.desc || '');
    setBenefitsText(product.benefits ? product.benefits.join('\n') : '');
    setUsage(product.usage || '');
    setTag(product.tag || '');
    setImageFile(null);
    setImageUrl(product.image || '');
    setSizes(product.sizes && product.sizes.length > 0 ? product.sizes.map(s => ({ size: s.size, price: s.price.toString() })) : [{ size: '', price: '' }]);
    setInStock(product.inStock !== false);
    setError('');
    setIsModalOpen(true);
  };

  const handleAddSizeRow = () => {
    setSizes([...sizes, { size: '', price: '' }]);
  };

  const handleRemoveSizeRow = (index) => {
    const updated = sizes.filter((_, i) => i !== index);
    setSizes(updated.length > 0 ? updated : [{ size: '', price: '' }]);
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = value;
    setSizes(updated);
  };

  const handleSeedProducts = async () => {
    if (products.length > 0) {
      if (!confirm('You already have products in the database. Are you sure you want to seed the default products? This will add them alongside existing ones.')) {
        return;
      }
    }
    
    try {
      setSeeding(true);
      const batch = writeBatch(db);
      FALLBACK_PRODUCTS.forEach((p) => {
        const docRef = doc(collection(db, 'products'));
        batch.set(docRef, p);
      });
      await batch.commit();
      alert('Fallback products successfully seeded to Firestore database!');
      loadProducts();
    } catch (e) {
      console.error('Seeding error:', e);
      alert('Failed to seed products: ' + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'products', id));
      loadProducts();
    } catch (e) {
      console.error('Delete error:', e);
      alert('Failed to delete product: ' + e.message);
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Basic Validation
    if (!title || !desc || !usage) {
      setError('Please fill in all required fields (Title, Description, Usage).');
      setSaving(false);
      return;
    }

    // Validate size variants
    const validSizes = sizes
      .filter(s => s.size.trim() !== '' && s.price.trim() !== '')
      .map(s => ({
        size: s.size.trim(),
        price: parseFloat(s.price)
      }));

    if (validSizes.length === 0) {
      setError('Please specify at least one valid size variant (e.g. "250 ml" with price).');
      setSaving(false);
      return;
    }

    try {
      let finalImageUrl = imageUrl;

      // Handle Image Upload to Firebase Storage
      if (imageFile) {
        const fileRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const productPayload = {
        title: title.trim(),
        category,
        desc: desc.trim(),
        benefits: benefitsText.split('\n').map(b => b.trim()).filter(b => b !== ''),
        usage: usage.trim(),
        tag: tag.trim(),
        image: finalImageUrl,
        sizes: validSizes,
        inStock
      };

      if (editingProduct) {
        // Update Firestore document
        await updateDoc(doc(db, 'products', editingProduct.id), productPayload);
      } else {
        // Create new Firestore document
        await addDoc(collection(db, 'products'), productPayload);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (e) {
      console.error('Save error:', e);
      setError('Failed to save product: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryName = (cat) => {
    const mapping = {
      "shampoo-conditioner": "Shampoo & Conditioner",
      "treatments": "Hair Treatment",
      "styling": "Hair Styling",
      "appliances": "Appliance & Tool"
    };
    return mapping[cat] || cat;
  };

  const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manage Products</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={handleSeedProducts}
            disabled={seeding || loading}
          >
            {seeding ? 'Seeding...' : '🌱 Seed Fallback Products'}
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={openAddModal}
            disabled={loading}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-primary)' }}>
          <p>Fetching products catalog...</p>
        </div>
      ) : (
        <div className="admin-table-container">
          {products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(31, 27, 28, 0.5)' }}>
              No products found in database. Seed fallback products or add a new one.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Preview</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price Ranges</th>
                  <th>Tag</th>
                  <th>Status</th>
                  <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
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
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }}
                          />
                        ) : null}
                        <span style={{ display: product.image ? 'none' : 'block', fontSize: '1.2rem' }}>🎁</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                      {product.title}
                    </td>
                    <td>{getCategoryName(product.category)}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {product.sizes && product.sizes.map((s, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              fontSize: '0.8rem', 
                              backgroundColor: 'rgba(74,0,31,0.05)', 
                              padding: '2px 6px', 
                              borderRadius: '4px',
                              color: 'var(--color-primary-light)'
                            }}
                          >
                            {s.size}: KSh {formatPrice(s.price)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {product.tag ? (
                        <span 
                          style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold',
                            backgroundColor: 'var(--color-primary)', 
                            color: '#fff',
                            padding: '3px 8px', 
                            borderRadius: '10px'
                          }}
                        >
                          {product.tag}
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          backgroundColor: product.inStock !== false ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)', 
                          color: product.inStock !== false ? '#28a745' : '#dc3545',
                          padding: '4px 8px', 
                          borderRadius: '10px',
                          display: 'inline-block'
                        }}
                      >
                        {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        onClick={() => openEditModal(product)}
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
                        onClick={() => handleDeleteProduct(product.id, product.title)}
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

      {/* Add/Edit Product Modal Overlay */}
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
                {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Product'}
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

            <form onSubmit={handleSaveProduct} className="admin-form-grid" style={{ border: 'none', padding: 0, boxShadow: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr', gap: '20px', alignItems: 'end' }}>
                <div className="admin-form-group">
                  <label htmlFor="prod_title">Product Title *</label>
                  <input 
                    type="text" 
                    id="prod_title" 
                    required 
                    className="admin-input" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="prod_cat">Category *</label>
                  <select 
                    id="prod_cat" 
                    className="admin-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="shampoo-conditioner">Shampoo &amp; Conditioner</option>
                    <option value="treatments">Hair Treatment</option>
                    <option value="styling">Hair Styling</option>
                    <option value="appliances">Appliance &amp; Tool</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ paddingBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', color: 'var(--color-primary)' }}>
                    <input 
                      type="checkbox" 
                      id="prod_instock" 
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                    />
                    <span>In Stock</span>
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="prod_desc">Product Description *</label>
                <textarea 
                  id="prod_desc" 
                  rows="3" 
                  required 
                  className="admin-textarea"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label htmlFor="prod_benefits">Benefits (one key benefit per line)</label>
                <textarea 
                  id="prod_benefits" 
                  rows="3" 
                  placeholder="e.g. Enriched with high-grade organic Argan Oil"
                  className="admin-textarea"
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label htmlFor="prod_usage">Usage Directions *</label>
                <textarea 
                  id="prod_usage" 
                  rows="2" 
                  required 
                  className="admin-textarea"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group">
                  <label htmlFor="prod_tag">Storefront Tag (e.g. BESTSELLER, NEW)</label>
                  <input 
                    type="text" 
                    id="prod_tag" 
                    placeholder="Leave empty for no tag" 
                    className="admin-input" 
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="prod_image">Upload Image File</label>
                  <input 
                    type="file" 
                    id="prod_image" 
                    accept="image/*"
                    className="admin-input"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                    style={{ padding: '8px' }}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="prod_image_url">Or Paste Image URL (fallback)</label>
                <input 
                  type="text" 
                  id="prod_image_url" 
                  placeholder="e.g. https://images.unsplash.com/..." 
                  className="admin-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {imagePreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: 'rgba(74,0,31,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={imagePreview} 
                      alt="Product Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }}
                    />
                    <span style={{ display: 'none', fontSize: '1.2rem' }}>⚠️</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Image Preview</span>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(31,27,28,0.6)', margin: '2px 0 0 0', wordBreak: 'break-all' }}>
                      {imageFile ? `Local upload: ${imageFile.name}` : imageUrl}
                    </p>
                  </div>
                </div>
              )}

              <div className="admin-form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Size &amp; Price Variants *</span>
                  <button 
                    type="button" 
                    onClick={handleAddSizeRow} 
                    style={{ 
                      fontSize: '0.8rem', 
                      backgroundColor: 'rgba(74,0,31,0.05)', 
                      color: 'var(--color-primary)',
                      border: 'none', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Variant Row
                  </button>
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
                  {sizes.map((s, index) => (
                    <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Size name (e.g. 250 ml, Model SBC)" 
                        required 
                        className="admin-input" 
                        value={s.size}
                        onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                        style={{ flexGrow: 2 }}
                      />
                      <input 
                        type="number" 
                        placeholder="Price (KSh)" 
                        required 
                        className="admin-input" 
                        value={s.price}
                        onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                        style={{ flexGrow: 1 }}
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSizeRow(index)}
                        style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem' }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
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
                  {saving ? 'Saving Changes...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
