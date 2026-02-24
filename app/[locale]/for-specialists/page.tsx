// app/for-specialists/page.tsx
import Link from 'next/link'

export default function ForSpecialistsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          За професионалисти
        </h1>
        <p className="text-xl text-gray-400 mb-12 text-center">
          Предложете вашите услуги на хиляди клиенти в цяла България
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#1A1A2E] p-6 rounded-lg text-center">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-white mb-2">Повече клиенти</h3>
            <p className="text-gray-400">Достигнете до хиляди търсещи клиенти всеки ден</p>
          </div>
          <div className="bg-[#1A1A2E] p-6 rounded-lg text-center">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Безплатно в началото</h3>
            <p className="text-gray-400">0% комисиона при стартиране на платформата</p>
          </div>
          <div className="bg-[#1A1A2E] p-6 rounded-lg text-center">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Изграждане на доверие</h3>
            <p className="text-gray-400">Отзиви и рейтинг от реални клиенти</p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/become-specialist"
            className="inline-block px-8 py-4 bg-[#1DB954] text-white text-lg font-semibold rounded-lg hover:bg-[#169b43] transition-colors"
          >
            Регистрирай се като професионалист
          </Link>
        </div>
      </div>
    </div>
  )
}