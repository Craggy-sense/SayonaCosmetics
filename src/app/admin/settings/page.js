"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCart } from '@/components/CartContext';

export default function AdminSettingsPage() {
  const { settings, setSettings } = useCart();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Form states
  const [announcement, setAnnouncement] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [aboutStory, setAboutStory] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Populate form states from context settings initially
    if (settings) {
      setAnnouncement(settings.announcement || '');
      setWhatsappNumber(settings.whatsappNumber || '');
      setHeroTitle(settings.heroTitle || '');
      setHeroDesc(settings.heroDesc || '');
      setAboutStory(settings.aboutStory || '');
      setPhone(settings.phone || '');
      setEmail(settings.email || '');
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    if (!announcement || !whatsappNumber || !heroTitle || !heroDesc || !aboutStory || !phone || !email) {
      setStatus({ type: 'error', message: 'All settings fields are required.' });
      setSaving(false);
      return;
    }

    try {
      const settingsPayload = {
        announcement: announcement.trim(),
        whatsappNumber: whatsappNumber.trim().replace(/\+/g, ''), // Strip '+' sign if entered
        heroTitle: heroTitle.trim(),
        heroDesc: heroDesc.trim(),
        aboutStory: aboutStory.trim(),
        phone: phone.trim(),
        email: email.trim()
      };

      // Save to Firestore
      const docRef = doc(db, 'settings', 'storefront');
      await setDoc(docRef, settingsPayload);

      // Update global context so header/footer/homepage updates immediately
      setSettings(settingsPayload);
      setStatus({ type: 'success', message: 'Storefront configurations saved successfully! Changes are now live.' });
    } catch (err) {
      console.error('Settings save error:', err);
      setStatus({ type: 'error', message: 'Failed to save settings: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Page &amp; Brand Settings</h1>
        <div style={{ color: 'rgba(31, 27, 28, 0.6)', fontSize: '0.9rem' }}>
          Manage global store copy, contact details, and checkout targets
        </div>
      </div>

      {status.message && (
        <div 
          style={{ 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            fontSize: '0.95rem',
            backgroundColor: status.type === 'success' ? '#e6f4ea' : '#fce8e6',
            color: status.type === 'success' ? '#137333' : '#c5221f',
            border: `1px solid ${status.type === 'success' ? '#ceead6' : '#fad2cf'}`
          }}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="admin-form-grid" style={{ gap: '28px' }}>
        
        {/* Core Store Info */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            📢 Announcement &amp; Checkout Channels
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label htmlFor="set_announcement">Top Bar Announcement Banner</label>
              <input 
                type="text" 
                id="set_announcement" 
                required 
                className="admin-input" 
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Free delivery on orders above KSh 3,000!"
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="set_whatsapp">WhatsApp Checkout Number (Format: 254...)</label>
              <input 
                type="text" 
                id="set_whatsapp" 
                required 
                className="admin-input" 
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 254745807623"
              />
              <small style={{ color: 'rgba(31, 27, 28, 0.5)', fontSize: '0.8rem', marginTop: '2px' }}>
                Must include country code without "+" (e.g. 254 for Kenya).
              </small>
            </div>
          </div>
        </div>

        {/* Hero Section copy */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            ✨ Hero Banner Content
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-form-group">
              <label htmlFor="set_hero_title">Hero Headline Title</label>
              <input 
                type="text" 
                id="set_hero_title" 
                required 
                className="admin-input" 
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="set_hero_desc">Hero Subtitle / Description</label>
              <textarea 
                id="set_hero_desc" 
                rows="2" 
                required 
                className="admin-textarea"
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            📞 Public Contact Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-form-group">
              <label htmlFor="set_phone">Contact Phone Number</label>
              <input 
                type="text" 
                id="set_phone" 
                required 
                className="admin-input" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0745807623"
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="set_email">Contact Email Address</label>
              <input 
                type="email" 
                id="set_email" 
                required 
                className="admin-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. info@sayonacosmetics.com"
              />
            </div>
          </div>
        </div>

        {/* Brand Heritage copy */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            📜 Brand Heritage Story (About Us page)
          </h3>
          <div className="admin-form-group">
            <label htmlFor="set_about">Our Story Copy</label>
            <textarea 
              id="set_about" 
              rows="5" 
              required 
              className="admin-textarea"
              value={aboutStory}
              onChange={(e) => setAboutStory(e.target.value)}
              style={{ lineHeight: 1.6 }}
            ></textarea>
          </div>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
            style={{ paddingInline: '48px', paddingBlock: '14px', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving Configurations...' : 'Save Live Settings'}
          </button>
        </div>

      </form>
    </>
  );
}
