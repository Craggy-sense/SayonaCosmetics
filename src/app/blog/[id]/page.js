import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import BlogDetailClient from './BlogDetailClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const blog = docSnap.data();
      return {
        title: `${blog.title} | Sayona Beauty Journal`,
        description: blog.excerpt || "Read our latest article on Sayona Cosmetics.",
        openGraph: {
          title: blog.title,
          description: blog.excerpt,
          type: "article",
          url: `https://sayonacosmetics.com/blog/${id}`,
          images: blog.image ? [{ url: blog.image }] : [
            {
              url: "/SayonaCosmeticsLogo.png",
              width: 800,
              height: 600,
              alt: blog.title,
            }
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: blog.title,
          description: blog.excerpt,
        }
      };
    }
  } catch (e) {
    console.error("Error generating metadata:", e);
  }
  return {
    title: "Sayona Beauty Blog",
    description: "Read our latest beauty and hair care articles."
  };
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  let blog = null;
  let allProducts = [];

  try {
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      blog = { 
        id: docSnap.id, 
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt || new Date().toISOString()
      };
    }

    const prodSnapshot = await getDocs(collection(db, 'products'));
    prodSnapshot.forEach((doc) => {
      allProducts.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error("Error fetching detail on server:", e);
  }

  if (!blog) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>⚠️</span>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '12px' }}>Article Not Found</h2>
        <p style={{ color: 'rgba(31, 27, 28, 0.7)', marginBottom: '24px' }}>The blog article you are looking for does not exist or has been deleted by the administrator.</p>
        <Link href="/blog" className="btn btn-primary" style={{ display: 'inline-block' }}>
          Back to Blog Listing
        </Link>
      </div>
    );
  }

  return <BlogDetailClient blog={blog} allProducts={allProducts} />;
}
