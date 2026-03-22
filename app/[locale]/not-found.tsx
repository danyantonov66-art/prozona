export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1DB954]">404</h1>
        <p className="mt-4 text-gray-400">Страницата не е намерена</p>
        <a href="/bg" className="mt-6 inline-block text-[#1DB954] hover:underline">
          ← Начална страница
        </a>
      </div>
    </div>
  )
}