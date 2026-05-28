import { Inter } from 'next/font/google'
import { Providers } from '../providers'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'bg') {
    return {
      robots: { index: false, follow: false }
    }
  }
  return {}
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <Providers>
      {children}
    </Providers>
  )
}