import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#1DB954] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Страницата не е намерена</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Страницата, която търсите, не съществува или е преместена.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/bg"
            className="px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors font-medium"
          >
            Начална страница
          </Link>
          <Link
            href="/bg/specialists"
            className="px-6 py-3 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a] transition-colors font-medium"
          >
            Намери специалист
          </Link>
        </div>
      </div>
    </div>
  )
}
