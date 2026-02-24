// app/about/page.tsx
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          За ProZona
        </h1>
        <p className="text-xl text-gray-400 mb-12 text-center">
          Платформата, която свързва клиенти с най-добрите специалисти
        </p>

        <div className="bg-[#1A1A2E] rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Нашата мисия</h2>
          <p className="text-gray-400 mb-6">
            ProZona създадохме с една проста цел - да направим намирането на 
            качествен специалист лесно, бързо и надеждно. Вярваме, че всеки 
            заслужава достъп до професионални услуги, а всеки майстор заслужава 
            да намери клиенти, които оценяват труда му.
          </p>
          <p className="text-gray-400">
            Нашата платформа използва модерна система за верификация, рейтинг и 
            отзиви, която гарантира, че ще намерите точно този специалист, от 
            който имате нужда.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Точност</h3>
            <p className="text-gray-400">Намерете точно това, което търсите</p>
          </div>
          <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Бързина</h3>
            <p className="text-gray-400">Свържете се с професионалист за минути</p>
          </div>
          <div className="bg-[#1A1A2E] rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Сигурност</h3>
            <p className="text-gray-400">Верифицирани профили и реални отзиви</p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/for-specialists" 
            className="inline-block px-8 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
          >
            Стани част от нас
          </Link>
        </div>
      </div>
    </div>
  )
}