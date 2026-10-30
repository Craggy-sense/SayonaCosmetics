"use client";

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { FALLBACK_PRODUCTS } from '@/data/products';

const CartContext = createContext();

// ── Cart store backed by localStorage (server render sees an empty cart; syncs across tabs) ──
const CART_KEY = 'sayona_cart';
const EMPTY_CART = [];
let cachedRaw = null;
let cachedCart = EMPTY_CART;
const cartListeners = new Set();

function readCart() {
  let raw = null;
  try { raw = window.localStorage.getItem(CART_KEY); } catch { raw = null; }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try { cachedCart = raw ? JSON.parse(raw) : EMPTY_CART; } catch { cachedCart = EMPTY_CART; }
    if (!Array.isArray(cachedCart)) cachedCart = EMPTY_CART;
  }
  return cachedCart;
}

function subscribeCart(callback) {
  cartListeners.add(callback);
  const onStorage = (e) => { if (e.key === CART_KEY) callback(); };
  window.addEventListener('storage', onStorage);
  return () => {
    cartListeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

function writeCart(newCart) {
  try { window.localStorage.setItem(CART_KEY, JSON.stringify(newCart)); } catch (e) { console.error('Could not save cart:', e); }
  cartListeners.forEach((l) => l());
}

export function CartProvider({ children }) {
  const cart = useSyncExternalStore(subscribeCart, readCart, () => EMPTY_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  // Start from the catalogue so the server-rendered HTML lists every product (SEO); Firestore data replaces it on load.
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [settings, setSettings] = useState({
    announcement: "🚚 Free delivery across Nairobi on orders above KSh 3,000! Country-wide courier service available.",
    whatsappNumber: "254745807623",
    heroTitle: "Enriched with Natural Oils, Herbs & Vitamins",
    heroDesc: "Discover the ultimate luxury hair care products and professional styling appliances designed to restore, strengthen, and nourish your hair.",
    aboutStory: "At Sayona Cosmetics, we believe that beautiful hair starts with a healthy scalp foundation. We design our products carefully to tackle the unique challenges of African hair textures—balancing intense moisture retention with deep root strengthening. Enriched with essential botanical oils, vitamins, and minerals, our shampoos, leave-in treatments, and pomades deeply penetrate hair fibers to protect them against heating damage, flaking, and dryness.",
    phone: "0745807623",
    email: "info@sayonacosmetics.com"
  });

  // Fetch products from Firestore dynamically, fall back to static list
  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.empty) {
          console.log('No products found in Firestore. Loading fallbacks.');
          setProducts(FALLBACK_PRODUCTS);
          return;
        }
        const loaded = [];
        querySnapshot.forEach((doc) => {
          loaded.push({ id: doc.id, ...doc.data() });
        });
        setProducts(loaded);
      } catch (e) {
        console.error('Error fetching Firestore products:', e);
        setProducts(FALLBACK_PRODUCTS);
      }
    }
    fetchProducts();
  }, []);

  // Fetch storefront settings from Firestore dynamically
  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', 'storefront');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (e) {
        console.error('Error fetching Firestore settings:', e);
      }
    }
    fetchSettings();
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (newCart) => writeCart(newCart);

  const addToCart = (product, size, qty) => {
    const existingIdx = cart.findIndex(
      (item) => item.id === product.id && item.size === size.size
    );

    let newCart = cart.map((item) => ({ ...item }));
    if (existingIdx !== -1) {
      newCart[existingIdx].qty += qty;
      newCart[existingIdx].price = size.price;
    } else {
      newCart.push({
        id: product.id,
        title: product.title,
        category: product.category,
        image: product.image || "",
        size: size.size,
        price: size.price,
        rrp: size.rrp || size.price,
        qty: qty,
      });
    }
    saveCart(newCart);
    setIsCartOpen(true); // Automatically slide open cart drawer
  };

  const updateQty = (id, sizeName, delta) => {
    const idx = cart.findIndex((item) => item.id === id && item.size === sizeName);
    if (idx !== -1) {
      let newCart = cart.map((item) => ({ ...item }));
      newCart[idx].qty += delta;
      if (newCart[idx].qty <= 0) {
        newCart.splice(idx, 1);
      }
      saveCart(newCart);
    }
  };

  const removeFromCart = (id, sizeName) => {
    const newCart = cart.filter((item) => !(item.id === id && item.size === sizeName));
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        products,
        setProducts,
        settings,
        setSettings,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
