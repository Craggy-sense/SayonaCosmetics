"use client";

import React, { useState } from 'react';
import { useCart } from '@/components/CartContext';

export default function ContactPage() {
  const { settings } = useCart();
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    contact_subject: '',
    contact_message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({ type: 'success', message: data.message });
        setFormData({
          contact_name: '',
          contact_phone: '',
          contact_email: '',
          contact_subject: '',
          contact_message: ''
        });
      } else {
        // Fallback to WhatsApp redirection suggestion if nodemailer isn't configured/fails
        const fallbackMsg = `Hi Sayona team, I tried sending a message: "${formData.contact_message}". My phone is ${formData.contact_phone} and name is ${formData.contact_name}.`;
        const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(fallbackMsg)}`;
        
        setStatus({ 
          type: 'error', 
          message: (
            <span>
              {data.message || 'There was a technical issue.'} You can also{' '}
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--color-accent)', textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Send via WhatsApp
              </a>.
            </span>
          )
        });
      }
    } catch (error) {
      console.error('Submit Error:', error);
      const fallbackMsg = `Hi Sayona team, my name is ${formData.contact_name}. Message: "${formData.contact_message}"`;
      const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(fallbackMsg)}`;
      
      setStatus({ 
        type: 'error', 
        message: (
          <span>
            Unable to connect to email server. Please{' '}
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--color-accent)', textDecoration: 'underline', fontWeight: 'bold' }}
            >
              Contact us on WhatsApp directly
            </a>.
          </span>
        )
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* Banner */}
      <div 
        className="page-header-banner" 
        style={{ 
          background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))", 
          padding: "60px 0", 
          textAlign: "center", 
          color: "#fff", 
          borderBottom: "2px solid var(--color-accent)" 
        }}
      >
        <div className="container">
          <span 
            className="hero-tagline" 
            style={{ 
              color: "var(--color-accent)", 
              fontSize: "0.85rem", 
              fontWeight: 700, 
              letterSpacing: "3px", 
              textTransform: "uppercase" 
            }}
          >
            Get In Touch
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.8rem", marginTop: "10px" }}>
            Contact Sayona Cosmetics
          </h1>
        </div>
      </div>

      {/* Main Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <div className="contact-form-wrapper">
              <h3>Send us a Message</h3>
              
              {status.message && (
                <div 
                  style={{ 
                    padding: '16px', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    backgroundColor: status.type === 'success' ? '#e6f4ea' : '#fce8e6',
                    color: status.type === 'success' ? '#137333' : '#c5221f',
                    border: `1px solid ${status.type === 'success' ? '#ceead6' : '#fad2cf'}`
                  }}
                >
                  {status.message}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact_name">Your Name *</label>
                    <input 
                      type="text" 
                      id="contact_name" 
                      name="contact_name" 
                      required 
                      value={formData.contact_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact_phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="contact_phone" 
                      name="contact_phone" 
                      required 
                      placeholder="e.g. 0712345678"
                      value={formData.contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact_email">Email Address</label>
                    <input 
                      type="email" 
                      id="contact_email" 
                      name="contact_email" 
                      placeholder="e.g. name@example.com"
                      value={formData.contact_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact_subject">Subject</label>
                    <input 
                      type="text" 
                      id="contact_subject" 
                      name="contact_subject" 
                      placeholder="e.g. Distributor Inquiry"
                      value={formData.contact_subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact_message">Message *</label>
                  <textarea 
                    id="contact_message" 
                    name="contact_message" 
                    rows="6" 
                    required 
                    placeholder="Write your inquiry or message here..."
                    value={formData.contact_message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ alignSelf: 'flex-start', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Info Panel */}
            <div className="contact-info-panel">
              {/* Info Card */}
              <div className="info-card">
                <h3>Our Headquarters</h3>
                <ul className="info-list">
                  <li>
                    <span className="info-icon">📍</span>
                    <span className="info-text">Nairobi, Kenya</span>
                  </li>
                  <li>
                    <span className="info-icon">📞</span>
                    <span className="info-text">
                      <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                    </span>
                  </li>
                  <li>
                    <span className="info-icon">✉️</span>
                    <span className="info-text">
                      <a href={`mailto:${settings.email}`}>{settings.email}</a>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Delivery and Courier info */}
              <div className="info-card" style={{ background: 'linear-gradient(135deg, rgba(74,0,31,0.02), rgba(212,175,55,0.05))', borderColor: 'rgba(212,175,55,0.2)' }}>
                <h3>🚚 Country-Wide Delivery</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-neutral-dark)', marginBottom: '12px' }}>
                  We do delivery country wide! Get your favorite products shipped safely to your location in any county.
                </p>
                <ul className="info-list" style={{ gap: '10px' }}>
                  <li style={{ fontSize: '0.9rem' }}>
                    <strong>Nairobi Delivery:</strong> Free delivery across Nairobi on orders above KSh 3,000! Standard KSh 300 fee applies for orders below.
                  </li>
                  <li style={{ fontSize: '0.9rem' }}>
                    <strong>Upcountry Counties:</strong> Sent via reliable local couriers (G4S, Easy Coach, etc.). Delivery rates depend on packaging size/courier charges.
                  </li>
                </ul>
              </div>

              {/* Distributor Card */}
              <div className="distributor-card">
                <h3>Bulk &amp; Distributor Inquiries</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-neutral-dark)' }}>
                  Are you a salon owner or cosmetics retailer looking to purchase Sayona products in bulk? We offer competitive distributor pricing and custom logistics solutions. Get in touch via email or phone to receive our complete wholesale catalogs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
