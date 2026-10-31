"use client";

// Sends one e-commerce event to every tracker that is switched on.
// Event names follow GA4; Meta and TikTok get their equivalent names.
const META = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', generate_lead: 'Lead' };
const TIKTOK = { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', generate_lead: 'Contact' };

export function track(event, { value = 0, items = [] } = {}) {
  if (typeof window === 'undefined') return;
  const currency = 'KES';
  try {
    if (window.gtag) {
      window.gtag('event', event, {
        currency,
        value,
        items: items.map((i) => ({ item_id: i.id, item_name: i.title, item_variant: i.size, price: i.price, quantity: i.qty || 1 })),
      });
    }
    const ids = items.map((i) => i.id);
    if (window.fbq && META[event]) {
      window.fbq('track', META[event], { currency, value, content_ids: ids, content_type: 'product', num_items: items.reduce((n, i) => n + (i.qty || 1), 0) });
    }
    if (window.ttq && TIKTOK[event]) {
      window.ttq.track(TIKTOK[event], {
        currency,
        value,
        contents: items.map((i) => ({ content_id: i.id, content_name: i.title, price: i.price, quantity: i.qty || 1 })),
        content_type: 'product',
      });
    }
  } catch (e) {
    console.error('Tracking error', e);
  }
}
