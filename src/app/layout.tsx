import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { PageTransition } from "@/components/ui/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casa Bombora | Luxury Villa Investment in Uluwatu, Bali",
  description: "End-to-end luxury villa investment and management solution in Uluwatu, Bali with 16-20% annual ROI. From land lease to property management.",
  keywords: "Bali villa investment, Uluwatu property, luxury villa management, Bali real estate investment, villa construction Bali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfairDisplay.variable}`}
      >
        <PageTransition>
          {children}
        </PageTransition>
        <ScrollToTopButton />
        <CustomCursor />
      </body>
    </html>
  );
}
