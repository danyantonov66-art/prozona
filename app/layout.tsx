// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.prozona.bg"),
  title: {
    default: "ProZona | Намери специалист близо до теб",
    template: "%s | ProZona",
  },
  description: "Намери надежден специалист близо до теб. Ремонти, почистване, монтаж, градина и още. Безплатно запитване. Верифицирани майстори в целия град.",
  keywords: [
    "специалист", "майстор", "ремонт", "почистване", "монтаж", "градина",
    "ВиК", "електро", "боядисване", "хамали", "климатици", "ProZona", "България",
    "София", "Пловдив", "Варна", "Бургас"
  ],
  authors: [{ name: "ProZona" }],
  creator: "ProZona",
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "https://www.prozona.bg",
    siteName: "ProZona",
    title: "ProZona | Намери специалист близо до теб",
    description: "Намери надежден специалист близо до теб. Ремонти, почистване, монтаж и още. Безплатно запитване.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ProZona" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProZona | Намери специалист близо до теб",
    description: "Намери надежден специалист близо до теб.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1975831049728243');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}