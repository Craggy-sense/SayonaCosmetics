import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FALLBACK_PRODUCTS } from '@/data/products';
import { SITE, absoluteUrl } from '@/lib/site';
import LivePurchase, { LiveGallery, SizeScope } from './LivePurchase';

const CATEGORY_LABELS = {
  'shampoo-conditioner': 'Shampoo & Conditioner',
  treatments: 'Hair Treatments',
  styling: 'Hair Styling',
  appliances: 'Appliances & Tools',
};

export const dynamicParams = false;

export function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((p) => ({ id: p.id }));
}

const getProduct = (id) => FALLBACK_PRODUCTS.find((p) => p.id === id);

const shortText = (text, max = 155) => {
  if (!text || text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)) + '…';
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  const prices = (product.sizes || []).map((s) => s.price);
  const from = prices.length ? Math.min(...prices) : null;
  const title = `${product.title}${product.comingSoon ? ' (Coming Soon)' : ''}`;
  const description = shortText(
    `${product.title}${from && !product.comingSoon ? ` from KSh ${from.toLocaleString('en-KE')}` : ''}. ${product.desc} Delivered across Kenya.`
  );
  return {
    title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: 'website',
      url: `/products/${product.id}`,
      title,
      description,
      images: product.image ? [{ url: product.image, width: 1000, height: 1000, alt: product.title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: product.image ? [product.image] : undefined },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const prices = (product.sizes || []).map((s) => s.price);
  const related = FALLBACK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const categoryName = CATEGORY_LABELS[product.category] || 'Products';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.desc,
    image: [...new Set([product.image, ...(product.sizes || []).map((s) => s.image), product.groupImage].filter(Boolean))].map(absoluteUrl),
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Sayona' },
    category: categoryName,
    ...(prices.length && !product.comingSoon
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'KES',
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            url: absoluteUrl(`/products/${product.id}`),
            seller: { '@id': `${SITE.url}/#organization` },
          },
        }
      : {}),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: categoryName, item: absoluteUrl(`/?category=${product.category}`) },
      { '@type': 'ListItem', position: 3, name: product.title, item: absoluteUrl(`/products/${product.id}`) },
    ],
  };
  const ld = (obj) => ({ __html: JSON.stringify(obj).replace(/</g, '\\u003c') });

  return (
    <div className="product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(productJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(breadcrumbJsonLd)} />

      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span>/</span>{' '}
          <Link href={`/?category=${product.category}#catalogue`}>{categoryName}</Link> <span>/</span>{' '}
          <span aria-current="page">{product.title}</span>
        </nav>

        <SizeScope product={product}>
        <div className="product-page-grid">
          <div className="product-page-media">
            <LiveGallery product={product} />
          </div>

          <div className="product-page-info">
            <span className="modal-category-tag">{categoryName}</span>
            <h1 className="product-page-title">{product.title}</h1>
            <p className="product-page-lead">{product.desc}</p>

            <LivePurchase product={product} />

            <ul className="product-page-perks">
              <li>🚚 Free Nairobi delivery over KSh 3,000</li>
              <li>📦 Countrywide courier, same-day dispatch</li>
              <li>↩️ 7-day returns on unopened products — <Link href="/delivery-returns">details</Link></li>
            </ul>

            {product.benefits && product.benefits.length > 0 && (
              <section className="product-page-section">
                <h2>Key benefits</h2>
                <ul className="spec-list">
                  {product.benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </section>
            )}
            {product.usage && (
              <section className="product-page-section">
                <h2>How to use</h2>
                <p>{product.usage}</p>
              </section>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <section className="product-page-section">
                <h2>{product.category === 'appliances' ? 'Models & prices' : 'Sizes & prices'}</h2>
                <table className="size-table">
                  <tbody>
                    {product.sizes.map((s) => (
                      <tr key={s.size}>
                        <th scope="row">{s.size}</th>
                        <td>{product.comingSoon ? 'Coming soon' : `KSh ${s.price.toLocaleString('en-KE')}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </div>
        </SizeScope>

        {related.length > 0 && (
          <section className="related-products">
            <h2>More {categoryName.toLowerCase()}</h2>
            <div className="related-grid">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="related-card">
                  {p.image && <img src={p.image} alt={p.title} loading="lazy" width="300" height="300" />}
                  <span>{p.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
