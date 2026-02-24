// app/business-card/page.tsx
import Link from 'next/link'
import Image from 'next/image'

export default function BusinessCardPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-md">
        {/* Карта с информацията */}
        <div className="bg-[#1A1A2E] rounded-lg overflow-hidden shadow-xl">
          
          {/* Лого */}
          <div className="bg-[#1DB954] p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-[#1DB954] font-bold text-4xl">PZ</span>
            </div>
          </div>
          
          {/* Информация */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              ProZona
            </h1>
            <p className="text-gray-400 text-center mb-6">
              Намери надежден специалист близо до теб
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-[#1DB954]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>office@prozona.bg</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-[#1DB954]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>+359 883 202 922</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 bg-[#1DB954]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Видин, България</span>
              </div>
            </div>
            
            {/* QR код за визитката (опционално) */}
            <div className="border-t border-gray-700 pt-4 mb-4">
              <p className="text-gray-400 text-sm text-center mb-2">
                Сканирай с телефона
              </p>
              <div className="w-32 h-32 bg-white mx-auto rounded-lg p-2">
                {/* Тук ще сложим QR кода за самата страница */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center">
                  QR код<br/>за визитка
                </div>
              </div>
            </div>
            
            {/* Бутон за регистрация */}
            <Link
              href="/register"
              className="block w-full py-3 bg-[#1DB954] text-white text-center rounded-lg hover:bg-[#169b43] transition-colors font-medium"
            >
              Регистрирай се в ProZona
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}