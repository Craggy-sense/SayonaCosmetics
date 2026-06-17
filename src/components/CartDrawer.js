"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    cartSubtotal, 
    cartCount,
    updateQty, 
    removeFromCart,
    settings
  } = useCart();

  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getProductSVG = (category) => {
    const CATEGORY_SVGS = {
      "shampoo-conditioner": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="shampooGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6e0030" /><stop offset="100%" stop-color="#4a001f" /></linearGradient></defs><rect x="35" y="30" width="30" height="55" rx="8" fill="url(#shampooGrad)" /><rect x="42" y="20" width="16" height="10" fill="#d4af37" /><path d="M40 20 h20 v-4 h-8 v-3 h-8 v7 Z" fill="#d4af37" /><rect x="37" y="42" width="26" height="28" rx="2" fill="rgba(255,255,255,0.95)" /><text x="50" y="52" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#4a001f" text-anchor="middle">SAYONA</text><text x="50" y="60" font-family="'Outfit'" font-size="5" fill="#d4af37" text-anchor="middle">ARGAN</text><circle cx="50" cy="66" r="1.5" fill="#4a001f" /></svg>`,
      "treatments": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="treatGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4a001f" /><stop offset="100%" stop-color="#1f1b1c" /></linearGradient></defs><path d="M25 40 h50 v35 c0 6-6 10-10 10 h-30 c-4 0-10-4-10-10 Z" fill="url(#treatGrad)" /><rect x="22" y="32" width="56" height="8" rx="3" fill="#d4af37" /><rect x="28" y="48" width="44" height="24" rx="2" fill="rgba(255,255,255,0.95)" /><text x="50" y="58" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#4a001f" text-anchor="middle">SAYONA</text><text x="50" y="66" font-family="'Outfit'" font-size="5" fill="#d4af37" text-anchor="middle">TREATMENT</text></svg>`,
      "styling": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="stylingGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6e0030" /><stop offset="100%" stop-color="#d4af37" /></linearGradient></defs><path d="M28 45 h44 v30 c0 4-4 7-7 7 h-30 c-3 0-7-3-7-7 Z" fill="url(#stylingGrad)" /><rect x="25" y="37" width="50" height="8" rx="2" fill="#4a001f" /><rect x="31" y="52" width="38" height="18" rx="1" fill="rgba(255,255,255,0.95)" /><text x="50" y="60" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#4a001f" text-anchor="middle">SAYONA</text><text x="50" y="67" font-family="'Outfit'" font-size="5" fill="#d4af37" text-anchor="middle">POMADE</text></svg>`,
      "appliances": `<svg viewBox="0 0 100 100" class="svg-product-art" aria-hidden="true" style="width: 100%; height: 100%;"><defs><linearGradient id="appGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1f1b1c" /><stop offset="100%" stop-color="#4a001f" /></linearGradient></defs><path d="M44 50 l8 35 h8 l-8-35 Z" fill="url(#appGrad)" /><path d="M28 32 h36 c4 0 6 3 6 5 v18 c0 2-2 5-6 5 h-36 Z" fill="url(#appGrad)" /><rect x="24" y="36" width="4" height="15" rx="1" fill="#d4af37" /><rect x="42" y="32" width="3" height="28" fill="#d4af37" /><circle cx="58" cy="46" r="4" fill="#d4af37" /><text x="50" y="80" font-family="'Outfit'" font-size="6" font-weight="bold" fill="#d4af37" text-anchor="middle">SAYONA PRO</text></svg>`
    };
    return CATEGORY_SVGS[category] || CATEGORY_SVGS["styling"];
  };

  const executeCheckout = async () => {
    if (cart.length === 0) return;

    // Compile WhatsApp checkout details
    const phone = settings.whatsappNumber;
    let listStr = "";
    cart.forEach((item, idx) => {
      const rowCost = item.price * item.qty;
      listStr += `${idx + 1}. *${item.title}* (${item.size})\n   Qty: ${item.qty} x KSh ${formatPrice(item.price)} = *KSh ${formatPrice(rowCost)}*\n\n`;
    });

    const limit = 3000;
    const isFree = cartSubtotal >= limit;
    const deliveryFee = isFree ? 0 : 300;
    const total = cartSubtotal + deliveryFee;
    const dateStr = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" });

    let text = `*NEW ORDER - SAYONA COSMETICS STOREFRONT*\n`;
    text += `_Placed on: ${dateStr}_\n`;
    text += `--------------------------------------\n\n`;
    text += `🛒 *MY SHOPPING LIST:*\n`;
    text += `${listStr}`;
    text += `--------------------------------------\n`;
    text += `Subtotal: KSh ${formatPrice(cartSubtotal)}\n`;
    text += `Delivery Fee: ${isFree ? '*FREE (Nairobi)*' : 'Standard Rate (Country-wide)'}\n`;
    text += `*TOTAL ORDER VALUE: ${isFree ? `KSh ${formatPrice(total)}` : `KSh ${formatPrice(cartSubtotal)} + Standard Delivery`}*\n\n`;
    text += `--------------------------------------\n`;
    text += `📞 *DELIVERY INFORMATION:*\n`;
    text += `Name: [Enter Your Name]\n`;
    text += `Phone: [Enter Your Phone]\n`;
    text += `Delivery Address/Location: [Enter Your Town / Address for Country-wide Delivery]\n\n`;
    text += `_Please complete your contact info above and press send._`;

    const whatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    // Unconditional redirect wrapped in try-catch database logger
    try {
      // Log order to Firebase Firestore database
      await addDoc(collection(db, 'orders'), {
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          size: item.size,
          price: item.price,
          qty: item.qty
        })),
        subtotal: cartSubtotal,
        totalValue: total,
        deliveryType: isFree ? 'Free Nairobi' : 'Standard Delivery',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      console.log('Order successfully logged in database.');
    } catch (e) {
      console.error('Failed to log order to database. Proceeding directly to WhatsApp:', e);
    } finally {
      // Launch WhatsApp unconditionally
      window.open(whatsAppUrl, '_blank');
      setIsCartOpen(false);
    }
  };

  const limit = 3000;
  const percent = Math.min((cartSubtotal / limit) * 100, 100);
  const balance = limit - cartSubtotal;

  return (
    <>
      {/* Drawer Backdrop Overlay */}
      {isCartOpen && (
        <div 
          className="cart-drawer-backdrop active" 
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Drawer Panel */}
      <aside 
        className={`cart-drawer ${isCartOpen ? 'active' : ''}`}
        role="dialog" 
        aria-labelledby="cart-title" 
        aria-modal="true"
        style={{ display: isCartOpen ? 'flex' : 'none' }}
      >
        <div className="cart-header">
          <h2 id="cart-title">Your Cart (<span id="cart-count-title">{cartCount}</span>)</h2>
          <button 
            type="button" 
            className="cart-close-btn" 
            onClick={() => setIsCartOpen(false)} 
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {cart.length > 0 ? (
          <>
            {/* Free Shipping Progress Meter */}
            <div className="shipping-meter-container" style={{ display: 'block' }}>
              <p className="shipping-meter-text">
                {cartSubtotal >= limit ? (
                  <span>🎉 Congratulations! Your order qualifies for <strong>FREE delivery</strong> in Nairobi!</span>
                ) : (
                  <span>Add <strong>KSh {formatPrice(balance)}</strong> more to unlock <strong>FREE Nairobi delivery</strong>!</span>
                )}
              </p>
              <div className="shipping-meter-bar">
                <div 
                  className="shipping-meter-progress" 
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Scrollable list of items */}
            <div className="cart-items-list" style={{ display: 'flex' }}>
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="cart-item-card">
                  <div className="cart-item-img-wrapper">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="cart-item-img" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div style={{ display: item.image ? 'none' : 'block', width: '100%', height: '100%', padding: '4px' }}>
                      <div dangerouslySetInnerHTML={{ __html: getProductSVG(item.category) }} style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <span className="cart-item-meta">Size: {item.size}</span>
                    <div className="cart-item-actions-row">
                      <div className="qty-controller qty-mini">
                        <button 
                          type="button" 
                          className="qty-btn" 
                          onClick={() => updateQty(item.id, item.size, -1)}
                        >
                          −
                        </button>
                        <input 
                          type="text" 
                          className="qty-val" 
                          value={item.qty} 
                          readOnly 
                          aria-label="Quantity"
                        />
                        <button 
                          type="button" 
                          className="qty-btn" 
                          onClick={() => updateQty(item.id, item.size, 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">KSh {formatPrice(item.price * item.qty)}</span>
                    </div>
                    <button 
                      type="button" 
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id, item.size)}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="cart-footer">
              <div className="subtotal-row">
                <span className="subtotal-label">Subtotal:</span>
                <span className="subtotal-price">KSh {formatPrice(cartSubtotal)}</span>
              </div>
              <p className="cart-vat-note">Recommended Retail Prices (RRP) inclusive of VAT where applicable.</p>
              
              <button 
                type="button" 
                className="btn btn-primary checkout-btn" 
                onClick={executeCheckout}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="checkout-whatsapp-icon">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span>Checkout via WhatsApp</span>
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline continue-shopping-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="cart-empty-state" style={{ display: 'flex' }}>
            <div className="cart-empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Explore our premium collections and add your favorite shampoos and treatments.</p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Shop Now
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
