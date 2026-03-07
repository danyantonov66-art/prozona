import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import InquiryForm from './InquiryForm'

interface Props {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function InquiryPage({ params }: Props) {
  const { id, locale } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!specialist) notFound()

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-400 flex-wrap">
          <Link href={`/${locale}`} className="hover:text-[#1DB954]">Начало</Link>
          <span>/</span>
          <Link href={`/${locale}/specialist/${id}`} className="hover:text-[#1DB954]">
            {specialist.businessName || specialist.user.name}
          </Link>
          <span>/</span>
          <span className="text-white">Запитване</span>
        </div>
      </div>
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1A1A2E] rounded-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Изпрати запитване до</h1>
            <p className="text-xl text-[#1DB954] mb-6">
              {specialist.businessName || specialist.user.name}
            </p>
            <InquiryForm
              specialistId={id}
              specialistName={specialist.businessName || specialist.user.name || ''}
              specialistCity={specialist.city}
              categoryId={specialist.categoryId}
              locale={locale}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
