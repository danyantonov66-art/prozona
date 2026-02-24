// app/cookies/page.tsx
import Link from 'next/link'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Политика за бисквитки
        </h1>

        <div className="bg-[#1A1A2E] rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Какво са бисквитките?</h2>
            <p className="text-gray-300">
              Бисквитките са малки текстови файлове, които се съхраняват на вашето устройство при посещение на уебсайтове. Те помагат за подобряване на потребителското изживяване и анализ на трафика.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Какви бисквитки използваме?</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Необходими бисквитки</h3>
                <p className="text-gray-300">Осигуряват основната функционалност на сайта - вход, навигация, сигурност.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Аналитични бисквитки</h3>
                <p className="text-gray-300">Събират информация как потребителите използват сайта, за да подобрим услугите си.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Функционални бисквитки</h3>
                <p className="text-gray-300">Запомнят вашите предпочитания и настройки.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Как да управлявате бисквитките?</h2>
            <p className="text-gray-300">
              Можете да контролирате и изтривате бисквитките чрез настройките на вашия браузър. Имайте предвид, че деактивирането на някои бисквитки може да повлияе на функционалността на сайта.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}