// ─────────────────────────────────────────────────────────────
// BUNDLES / KITS — each item points at a product id + size from products.js.
// Price = sum of the items' current prices (incl. any Black November deal)
// minus BUNDLE_SAVING percent. Edit here.
// ─────────────────────────────────────────────────────────────

export const BUNDLE_SAVING = 10; // % off the items bought separately

export const BUNDLES = [
  {
    id: 'bundle-wash-day',
    title: 'Wash Day Kit',
    tagline: 'Cleanse, condition, moisturise',
    desc: 'Everything for a full wash day: Argan Oil Shampoo to cleanse, Coconut Oil Conditioner to detangle, and Olive Oil Leave-In to lock in moisture.',
    image: '/product-images/bundle-wash-day.jpg',
    items: [
      { productId: 'argan-shampoo', size: '500 ml' },
      { productId: 'coconut-conditioner', size: '500 ml' },
      { productId: 'olive-leave-in', size: '500 ml' },
    ],
  },
  {
    id: 'bundle-repair',
    title: 'Repair & Restore Kit',
    tagline: 'For dry, weak or damaged hair',
    desc: 'A strengthening routine: Argan Oil Shampoo, Hair Protein Treatment to rebuild weak hair, and Deep Penetrating Treatment for deep moisture.',
    image: '/product-images/bundle-repair.jpg',
    items: [
      { productId: 'argan-shampoo', size: '500 ml' },
      { productId: 'protein-treatment', size: '250 ml' },
      { productId: 'deep-penetrating-treatment', size: '250 ml' },
    ],
  },
  {
    id: 'bundle-locs',
    title: 'Loc Care Kit',
    tagline: 'Clean, firm, itch-free locs',
    desc: 'Olive Oil Shampoo for clean locs, Extra Hold Dreadlock Wax for neat retwists, and Indian Hemp Anti-Dandruff Pomade to soothe the scalp.',
    image: '/product-images/bundle-locs.jpg',
    items: [
      { productId: 'olive-shampoo', size: '250 ml' },
      { productId: 'dreadlock-wax', size: '250 ml' },
      { productId: 'indian-hemp-pomade', size: '250 ml' },
    ],
  },
  {
    id: 'bundle-family',
    title: 'Family Wash Duo',
    tagline: 'Big bottles for the whole house',
    desc: 'Argan Oil Shampoo 1 ltr with Coconut Oil Conditioner 500 ml — enough for the whole family.',
    image: '/product-images/bundle-family.jpg',
    items: [
      { productId: 'argan-shampoo', size: '1 ltr' },
      { productId: 'coconut-conditioner', size: '500 ml' },
    ],
  },
];
