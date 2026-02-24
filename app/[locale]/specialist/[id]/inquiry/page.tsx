// app/specialist/[id]/inquiry/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import InquiryForm from './InquiryForm'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InquiryPage({ params }: Props) {
  const { id } = await params
  
  // Вземи данни за специалиста, включително категориите
  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  if (!specialist) {
    notFound()
  }

  // Намери първата категория на специалиста (за примерните съобщения)
  const specialistCategory = specialist.categories[0]?.category?.slug || 'default'

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/categories" className="text-gray-300 hover:text-white">Категории</Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white">Как работи</Link>
            <Link href="/for-specialists" className="text-gray-300 hover:text-white">За специалисти</Link>
          </nav>
          
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-white hover:text-[#1DB954]">Вход</Link>
            <Link href="/register" className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]">Регистрация</Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Link href="/" className="hover:text-[#1DB954]">Начало</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#1DB954]">Категории</Link>
          <span>/</span>
          <Link href={`/specialist/${id}`} className="hover:text-[#1DB954]">{specialist.user.name}</Link>
          <span>/</span>
          <span className="text-white">Запитване</span>
        </div>
      </div>

      {/* Основно съдържание */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1A1A2E] rounded-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Изпрати запитване до</h1>
            <p className="text-xl text-[#1DB954] mb-6">{specialist.user.name}</p>
            
            {/* Подаваме и категорията на формата */}
            <InquiryForm 
              specialistId={id} 
              specialistName={specialist.user.name}
              category={specialistCategory}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#1DB954] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PZ</span>
                </div>
                <span className="text-white font-semibold">ProZona</span>
              </div>
              <p className="text-gray-400 text-sm">Намери надежден специалист близо до теб</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Категории</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/categories/construction" className="hover:text-[#1DB954]">Строителство</a></li>
                <li><a href="/categories/home" className="hover:text-[#1DB954]">Домашни услуги</a></li>
                <li><a href="/categories/beauty" className="hover:text-[#1DB954]">Красота и здраве</a></li>
                <li><a href="/categories/photography" className="hover:text-[#1DB954]">Фотография</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">За нас</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-[#1DB954]">За ProZona</a></li>
                <li><a href="/how-it-works" className="hover:text-[#1DB954]">Как работи</a></li>
                <li><a href="/contact" className="hover:text-[#1DB954]">Контакти</a></li>
                <li><a href="/faq" className="hover:text-[#1DB954]">Често задавани въпроси</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Свържи се</h4>
              <ul className="space-y-2 text-gray-400">
                <li>office@prozona.bg</li>
                <li>+359 888 123 456</li>
                <li>София, България</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 ProZona. Всички права запазени.
          </div>
        </div>
      </footer>
    </main>
  )
}