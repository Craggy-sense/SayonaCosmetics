"use client";

import { useCart } from '@/components/CartContext';
import { ProductPurchase } from '@/components/ShopUI';

// Uses the live (Firestore) version of the product when it has loaded, so admin price/stock edits apply here too.
export default function LivePurchase({ product }) {
  const { products } = useCart();
  const live = products.find((p) => p.id === product.id) || product;
  return <ProductPurchase key={live.id} product={live} />;
}
