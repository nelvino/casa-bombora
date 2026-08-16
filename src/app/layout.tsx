import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PageTransition } from "@/components/ui/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { StructuredData } from "@/components/seo/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://casabombora.com"),
  title: {
    default: "Casa Bombora | Luxury Villa Investment in Uluwatu, Bali",
    template: "%s | Casa Bombora",
  },
  description:
    "End-to-end luxury villa investment and management in Uluwatu, Bali. From land acquisition and design to construction and property management with 18-28% annual ROI.",
  keywords: [
    "Bali villa investment",
    "Uluwatu property",
    "luxury villa management",
    "Bali real estate investment",
    "villa construction Bali",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Casa Bombora",
    title: "Casa Bombora | Luxury Villa Investment in Uluwatu, Bali",
    description:
      "Invest in a luxury villa in Uluwatu, Bali. End-to-end land, build and management with 18-28% annual ROI.",
    images: [
      {
        url: "/images/backgrounds/Hero_bg.desktop.webp",
        alt: "Casa Bombora luxury villa investment in Uluwatu, Bali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Bombora | Luxury Villa Investment in Uluwatu, Bali",
    description:
      "Invest in a luxury villa in Uluwatu, Bali. End-to-end land, build and management with 18-28% annual ROI.",
    images: ["/images/backgrounds/Hero_bg.desktop.webp"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#1D2632",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/images/backgrounds/Hero_bg.mobile.webp"
          as="image"
          type="image/webp"
          media="(max-width: 768px)"
        />
        <link
          rel="preload"
          href="/images/backgrounds/Hero_bg.desktop.webp"
          as="image"
          type="image/webp"
          media="(min-width: 769px)"
        />
      </head>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${dancingScript.variable}`}
      >
        <StructuredData />
        <PageTransition>
          {children}
        </PageTransition>
        <WhatsAppButton />
        <ScrollToTopButton />
        <CustomCursor />
      </body>
    </html>
  );
}
