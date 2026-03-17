import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Статията не е намерена</h2>
      <p className="text-gray-400 mb-8">Съжаляваме, но не можем да открием статията, която търсите.</p>
      <Link 
        href="/bg/blog" 
        className="px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors font-medium"
      >
        Към всички статии
      </Link>
    </div>
  )
}