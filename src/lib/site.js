// Core business details used for SEO metadata, structured data and server-rendered pages.
export const SITE = {
  name: 'Sayona Cosmetics',
  url: 'https://www.sayonacosmetics.com',
  description:
    'Hair care made for African hair: argan, olive and coconut oil shampoos and conditioners, deep treatments, anti-dandruff pomade, dreadlock wax and pro styling appliances. Free Nairobi delivery over KSh 3,000 and countrywide courier across Kenya.',
  logo: '/SayonaCosmeticsLogo.png',
  ogImage: '/og-image.jpg',
  phone: '+254745807623',
  phoneDisplay: '0745 807 623',
  whatsapp: '254745807623',
  email: 'info@sayonacosmetics.com',
  city: 'Nairobi',
  country: 'KE',
};

// ── Tracking IDs ────────────────────────────────────────────
// Paste your IDs here (or set the matching NEXT_PUBLIC_* environment variables on your host).
// Leave empty to keep a tracker switched off.
export const TRACKING = {
  ga4: process.env.NEXT_PUBLIC_GA4_ID || 'G-7TG02B6M56',   // Google Analytics 4
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',   // Meta (Facebook/Instagram) Pixel, e.g. '1234567890123456'
  tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '', // TikTok Pixel, e.g. 'CABCDEFG123456789'
};

export const absoluteUrl = (path = '/') => new URL(path, SITE.url).toString();
