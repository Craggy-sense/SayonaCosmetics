import Link from 'next/link';
import { SITE } from '@/lib/site';
import { DELIVERY_ZONES, FREE_DELIVERY_FROM } from '@/data/delivery';

export const metadata = {
  title: 'Delivery & Returns',
  description:
    'Sayona Cosmetics delivery and returns policy: free Nairobi delivery on orders above KSh 3,000, countrywide courier, same-day dispatch, and a 7-day return window on unopened products.',
  alternates: { canonical: '/delivery-returns' },
};

// ── Policy settings (edit here) ─────────────────────────────
const POLICY = {
  freeNairobiFrom: FREE_DELIVERY_FROM,
  returnDays: 7,
  reportDamageHours: 48,
  refundWorkingDays: 5,
  upcountryDays: '1–3 working days',
};

const ksh = (n) => 'KSh ' + n.toLocaleString('en-KE');

const FAQS = [
  {
    q: 'How much is delivery?',
    a: `Delivery within Nairobi is free on orders of ${ksh(POLICY.freeNairobiFrom)} or more. Otherwise: ${DELIVERY_ZONES.map((z) => `${z.label} ${ksh(z.fee)}`).join(', ')}. The fee is shown in your cart before you order.`,
  },
  {
    q: 'How long does delivery take?',
    a: `Confirmed orders are dispatched the same day where possible. Nairobi orders usually arrive the same or next working day. Countrywide courier deliveries take ${POLICY.upcountryDays}, depending on your town.`,
  },
  {
    q: 'Can I return a product?',
    a: `Yes. You can return products within ${POLICY.returnDays} days of delivery if they are unopened, with the seal intact and in the original packaging. For hygiene reasons, opened or used hair-care products can only be returned if they are faulty.`,
  },
  {
    q: 'What if my order arrives damaged, leaking or wrong?',
    a: `Send us a photo on WhatsApp within ${POLICY.reportDamageHours} hours of delivery and we will replace the item at no extra cost, including delivery.`,
  },
  {
    q: 'How do I get my refund?',
    a: `Once we receive and inspect your return, we refund you through your original payment method within ${POLICY.refundWorkingDays} working days, or exchange the item if you prefer.`,
  },
  {
    q: 'Do Black November deals have a different return policy?',
    a: 'No. Products bought at Black November and Black Friday Weekend prices follow the same delivery and returns policy as any other order.',
  },
];

export default function DeliveryReturnsPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi Sayona Cosmetics, I need help with a delivery / return for my order.')}`;

  return (
    <div className="policy-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />

      <section className="policy-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span>/</span> <span aria-current="page">Delivery &amp; Returns</span>
          </nav>
          <h1>Delivery &amp; Returns</h1>
          <p>Fast delivery across Kenya, and a simple, fair returns promise.</p>
          <div className="policy-highlights">
            <div><strong>Free Nairobi delivery</strong><span>on orders above {ksh(POLICY.freeNairobiFrom)}</span></div>
            <div><strong>Same-day dispatch</strong><span>on confirmed orders, where possible</span></div>
            <div><strong>{POLICY.returnDays}-day returns</strong><span>on unopened products</span></div>
            <div><strong>Damaged or wrong?</strong><span>we replace it free</span></div>
          </div>
        </div>
      </section>

      <div className="container policy-body">
        <section aria-labelledby="delivery">
          <h2 id="delivery">🚚 Delivery</h2>
          <div className="policy-table" role="table" aria-label="Delivery options">
            <div className="policy-row policy-head" role="row">
              <span role="columnheader">Where</span><span role="columnheader">Delivery time</span><span role="columnheader">Cost</span>
            </div>
            {DELIVERY_ZONES.map((z) => (
              <div className="policy-row" role="row" key={z.id}>
                <span role="cell"><strong>{z.label}</strong></span>
                <span role="cell">{z.note}</span>
                <span role="cell">
                  {ksh(z.fee)}
                  {z.freeFrom != null && <> · <strong>FREE</strong> on orders of {ksh(z.freeFrom)}+</>}
                </span>
              </div>
            ))}
          </div>
          <ul className="policy-list">
            <li><strong>How to order:</strong> add products to your cart and check out on WhatsApp, or message us directly. Our team confirms stock, the total and delivery details before dispatch.</li>
            <li><strong>Payment:</strong> payment options are confirmed with you on WhatsApp when your order is confirmed.</li>
            <li><strong>Tracking:</strong> we share dispatch updates and courier details on WhatsApp.</li>
            <li><strong>Courier pick-up:</strong> for countrywide orders, you may need to collect your parcel from the courier&apos;s office in your town — please bring your ID and order details.</li>
            <li><strong>Salons, barbers &amp; distributors:</strong> for bulk orders, <Link href="/contact#contact">contact our team</Link> for delivery arrangements.</li>
          </ul>
        </section>

        <section aria-labelledby="returns">
          <h2 id="returns">↩️ Returns &amp; refunds</h2>
          <div className="policy-cards">
            <div className="policy-card ok">
              <h3>✅ You can return</h3>
              <ul>
                <li>Unopened products within <strong>{POLICY.returnDays} days</strong> of delivery, seal intact, in original packaging</li>
                <li>Items that arrive <strong>damaged, leaking or wrong</strong> — reported within {POLICY.reportDamageHours} hours with a photo</li>
                <li>Appliances that are <strong>faulty on arrival</strong>, returned with all parts and the box</li>
              </ul>
            </div>
            <div className="policy-card no">
              <h3>❌ We can&apos;t accept</h3>
              <ul>
                <li>Opened or used hair-care products (for hygiene), unless faulty</li>
                <li>Returns after {POLICY.returnDays} days from delivery</li>
                <li>Appliances damaged through misuse, drops or incorrect voltage</li>
              </ul>
            </div>
          </div>

          <h3 className="policy-subhead">How to return an item</h3>
          <ol className="policy-steps">
            <li><strong>Message us</strong> on <a href={waLink} target="_blank" rel="noopener noreferrer">WhatsApp</a> or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with your name, order details and photos.</li>
            <li><strong>Get approval</strong> — we confirm your return and how to send it back.</li>
            <li><strong>Send the item</strong> — if the item is damaged or we made a mistake, we cover the return delivery. For change-of-mind returns, return delivery is at your cost.</li>
            <li><strong>Refund or exchange</strong> — after inspection, we refund through your original payment method within {POLICY.refundWorkingDays} working days, or exchange the item.</li>
          </ol>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq">Frequently asked questions</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="policy-contact">
          <h2>Need help with an order?</h2>
          <p>Our team is in Nairobi and replies fastest on WhatsApp.</p>
          <div className="policy-contact-actions">
            <a className="btn btn-primary" href={waLink} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            <a className="btn btn-secondary" href={`tel:${SITE.phone}`}>Call {SITE.phoneDisplay}</a>
          </div>
        </section>
      </div>
    </div>
  );
}
