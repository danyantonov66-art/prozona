// app/how-it-works/page.tsx
import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Как работи ProZona?</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Намери специалист</h3>
            <p className="text-gray-400">Търси по категория, град и рейтинг</p>
          </div>
          
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Свържи се</h3>
            <p className="text-gray-400">Изпрати запитване и получи оферта</p>
          </div>
          
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Остави отзив</h3>
            <p className="text-gray-400">Помогни на другите с твоя опит</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/categories" 
            className="inline-block px-8 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]"
          >
            Започни сега
          </Link>
        </div>
      </div>
    </div>
  )
}