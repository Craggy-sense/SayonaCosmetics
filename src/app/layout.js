import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";
import { SITE, absoluteUrl } from "@/lib/site";
import Analytics from "@/components/Analytics";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Sayona Cosmetics | Hair Care for African Hair in Kenya",
    template: "%s | Sayona Cosmetics",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "hair products Kenya", "African hair care", "argan oil shampoo Kenya", "olive oil shampoo",
    "coconut oil conditioner", "hair treatment Kenya", "anti-dandruff pomade", "dreadlock wax Kenya",
    "hair dryer Kenya", "Sayona Cosmetics", "Nairobi beauty shop",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE.url,
    siteName: SITE.name,
    title: "Sayona Cosmetics | Hair Care for African Hair in Kenya",
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Sayona Cosmetics hair care products" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayona Cosmetics | Hair Care for African Hair in Kenya",
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/SayonaCosmeticsLogo.png",
    apple: "/SayonaCosmeticsLogo.png",
  },
};

export const viewport = {
  themeColor: "#e14a12",
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: absoluteUrl(SITE.logo),
      email: SITE.email,
      telephone: SITE.phone,
      address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country },
      contactPoint: [{ "@type": "ContactPoint", telephone: SITE.phone, contactType: "customer service", areaServed: "KE", availableLanguage: ["en", "sw"] }],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: { "@id": `${SITE.url}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE.url}/?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-KE" className={`${outfit.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c") }}
        />
        <CartProvider>
          <Header />
          <main>
            {children}
          </main>
          <CartDrawer />
          <ProductModal />
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
