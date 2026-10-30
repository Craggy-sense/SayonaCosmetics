import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FALLBACK_PRODUCTS } from '@/data/products';
import { SITE } from '@/lib/site';

// Regenerate at most once an hour so new blog posts get picked up.
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();
  const pages = [
    { url: `${SITE.url}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/delivery-returns`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/blog`, changeFrequency: 'weekly', priority: 0.7 },
  ].map((p) => ({ ...p, lastModified: now }));

  const products = FALLBACK_PRODUCTS.map((p) => ({
    url: `${SITE.url}/products/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
    images: p.image ? [`${SITE.url}${p.image}`] : undefined,
  }));

  let blogs = [];
  try {
    const snap = await getDocs(collection(db, 'blogs'));
    snap.forEach((d) => {
      const data = d.data();
      blogs.push({
        url: `${SITE.url}/blog/${d.id}`,
        lastModified: data.updatedAt || data.createdAt ? new Date(data.updatedAt || data.createdAt) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  } catch (e) {
    console.error('Sitemap: could not load blog posts', e);
  }

  return [...pages, ...products, ...blogs];
}
