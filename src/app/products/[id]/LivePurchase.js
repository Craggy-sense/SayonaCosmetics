"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { track } from '@/lib/track';
import { useCart } from '@/components/CartContext';
import { ProductGallery, ProductPurchase, defaultSizeIdx } from '@/components/ShopUI';

// Shared selected-size state for the product page, so the photo follows the chosen size.
const SizeCtx = createContext(null);

// Use the live (Firestore) version of the product once loaded, so admin price/stock edits apply here too.
function useLiveProduct(product) {
  const { products } = useCart();
  return products.find((p) => p.id === product.id) || product;
}

export function SizeScope({ product, children }) {
  const state = useState(() => defaultSizeIdx(product));
  useEffect(() => {
    const s = product.sizes?.[defaultSizeIdx(product)];
    track('view_item', { value: s?.price || 0, items: [{ id: product.id, title: product.title, size: s?.size, price: s?.price || 0 }] });
  }, [product]);
  return <SizeCtx.Provider value={state}>{children}</SizeCtx.Provider>;
}

export function LiveGallery({ product }) {
  const live = useLiveProduct(product);
  const [sizeIdx, setSizeIdx] = useContext(SizeCtx);
  return (
    <ProductGallery
      product={{ ...product, ...live }}
      sizeIdx={sizeIdx}
      onSelectSize={setSizeIdx}
      badge={live.tag ? <span className="modal-badge-new">{live.tag}</span> : null}
    />
  );
}

export default function LivePurchase({ product }) {
  const live = useLiveProduct(product);
  const [sizeIdx, setSizeIdx] = useContext(SizeCtx);
  return <ProductPurchase product={live} sizeIdx={sizeIdx} onSizeChange={setSizeIdx} />;
}
