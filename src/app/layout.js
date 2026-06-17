import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductModal from "@/components/ProductModal";

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
  title: "Sayona Cosmetics | Premium Hair Care & Styling Solutions",
  description: "Discover Sayona Cosmetics' collection of premium hair shampoos, conditioners, deep treatments, anti-dandruff pomades, and professional styling appliances. Enriched with natural oils and vitamins, formulated specifically for African hair.",
  icons: {
    icon: "/SayonaCosmeticsLogo.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <link rel="shortcut icon" href="/SayonaCosmeticsLogo.png" type="image/png" />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main>
            {children}
          </main>
          <CartDrawer />
          <ProductModal />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
