import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import BlogListingClient from './BlogListingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Sayona Beauty Blog | Hair Care Secrets & Styling Tips",
  description: "Unlock the secrets to healthy hair growth and perfect fades. Read expert guides, product tutorials, and styling tips from Sayona Cosmetics.",
  openGraph: {
    title: "Sayona Beauty Blog | Hair Care Secrets & Styling Tips",
    description: "Unlock the secrets to healthy hair growth and perfect fades. Read expert guides, product tutorials, and styling tips from Sayona Cosmetics.",
    type: "website",
    url: "https://sayonacosmetics.com/blog",
    images: [
      {
        url: "/SayonaCosmeticsLogo.png",
        width: 800,
        height: 600,
        alt: "Sayona Cosmetics Blog",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayona Beauty Blog | Hair Care Secrets & Styling Tips",
    description: "Unlock the secrets to healthy hair growth and perfect fades. Read expert guides, product tutorials, and styling tips from Sayona Cosmetics.",
  }
};

export default async function BlogPage() {
  let blogs = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'blogs'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      blogs.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    // Sort by createdAt descending
    blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    console.error("Error fetching blogs on server:", e);
  }

  return <BlogListingClient initialBlogs={blogs} />;
}
