import { Inter } from 'next/font/google'
import { Providers } from '../providers'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-W3JYCB8NJS"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-W3JYCB8NJS');
        `}
      </Script>
      <Providers>
        {children}
      </Providers>
    </>
  )
}