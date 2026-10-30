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

export const absoluteUrl = (path = '/') => new URL(path, SITE.url).toString();
