'use client'

import { useParams } from 'next/navigation'
import ProZonaHeader from '@/components/header/ProZonaHeader'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

export default function AddServicePage() {
  const params = useParams()
  const locale = (params as any)?.locale ?? 'bg'

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Предложи нова услуга
        </h1>

        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-gray-300">Име на услугата</label>
            <input
              type="text"
              placeholder="Например: Поставяне на плочки"
              className="w-full p-3 rounded-lg bg-[#1A1A2E] border border-[#2a2a40]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Към коя категория?</label>
            <select className="w-full p-3 rounded-lg bg-[#1A1A2E] border border-[#2a2a40]">
              <option value="construction">Строителство и ремонт</option>
              <option value="home">Домашни услуги</option>
              <option value="beauty">Красота и грижа</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">Кратко описание</label>
            <textarea
              rows={4}
              placeholder="Опиши услугата..."
              className="w-full p-3 rounded-lg bg-[#1A1A2E] border border-[#2a2a40]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1DB954] rounded-lg font-semibold hover:bg-[#169b43]"
          >
            Изпрати предложение
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Новите услуги се преглеждат от администратор преди да се добавят.
        </p>
      </section>

      <ProZonaFooter />
    </main>
  )
}