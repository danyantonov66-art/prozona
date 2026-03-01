// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.prozona.bg"),
  title: {
    default: "ProZona | Намери специалист близо до теб",
    template: "%s | ProZona",
  },
  description: "Намери надежден специалист близо до теб. Строителство, ремонти, красота, фотография и още. Безплатно запитване.",
  keywords: ["специалист", "майстор", "ремонт", "строителство", "ProZona", "България"],
  authors: [{ name: "ProZona" }],
  creator: "ProZona",
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "https://www.prozona.bg",
    siteName: "ProZona",
    title: "ProZona | Намери специалист близо до теб",
    description: "Намери надежден специалист близо до теб. Строителство, ремонти, красота, фотография и още.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProZona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProZona | Намери специалист близо до теб",
    description: "Намери надежден специалист близо до теб.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
