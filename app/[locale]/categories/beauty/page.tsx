import { categories } from '@/lib/constants'

export default function BeautyPage({ params }: { params: { locale: string } }) {
  const category = categories.find(c => c.slug === 'beauty')
  return (
    <div className="min-h-screen bg-[#0D0D1A] pt-24">
      <h1 className="text-3xl font-bold text-white">{category?.name}</h1>
    </div>
  )
}
