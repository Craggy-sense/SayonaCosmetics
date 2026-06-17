"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { FALLBACK_PRODUCTS } from '@/data/products';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]); // Loaded from Firebase or Fallback
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

  // Load cart from localStorage on client-side mount
  useEffect(() => {
    const storedCart = localStorage.getItem('sayona_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing stored cart:', e);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('sayona_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, size, qty) => {
    const existingIdx = cart.findIndex(
      (item) => item.id === product.id && item.size === size.size
    );

    let newCart = [...cart];
    if (existingIdx !== -1) {
      newCart[existingIdx].qty += qty;
    } else {
      newCart.push({
        id: product.id,
        title: product.title,
        category: product.category,
        image: product.image || "",
        size: size.size,
        price: size.price,
        qty: qty,
      });
    }
    saveCart(newCart);
    setIsCartOpen(true); // Automatically slide open cart drawer
  };

  const updateQty = (id, sizeName, delta) => {
    const idx = cart.findIndex((item) => item.id === id && item.size === sizeName);
    if (idx !== -1) {
      let newCart = [...cart];
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
