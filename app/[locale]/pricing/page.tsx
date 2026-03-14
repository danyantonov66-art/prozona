"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: { locale: string }
}

export default function PricingPage({ params }: Props) {
  const locale = params?.locale || "bg"
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(planType: string) {
    setLoading(planType)
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/${locale}/login`)
          return
        }
        alert(data.error || "Грешка при плащане")
        return
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert("Грешка при свързване със Stripe")
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="mb-3 text-center text-4xl font-bold">
          Прости и честни цени
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          Започни безплатно. Плащаш само когато получаваш клиенти.
        </p>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Free */}
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8">
            <h3 className="mb-2 text-xl font-semibold">Безплатен</h3>
            <p className="mb-6 text-gray-400">Идеален за старт</p>
            <div className="mb-6 text-4xl font-bold">€0</div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>✔ Публичен профил</li>
              <li>✔ До 5 снимки</li>
              <li>✔ Видим в търсене</li>
              <li>✔ 20 стартови кредита</li>
              <li>✖ Без приоритет</li>
            </ul>
            <Link
              href={`/${locale}/become-specialist`}
              className="mt-8 block w-full rounded-xl bg-[#1DB954] py-3 text-center font-semibold text-black transition hover:bg-[#1ed760]"
            >
              Започни безплатно
            </Link>
          </div>

          {/* Basic */}
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8">
            <h3 className="mb-2 text-xl font-semibold">Базов</h3>
            <p className="mb-6 text-gray-400">За активни специалисти</p>
            <div className="mb-6 text-4xl font-bold">
              €4.99<span className="text-base text-gray-400">/месец</span>
            </div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>✔ Публичен профил</li>
              <li>✔ До 20 снимки</li>
              <li>✔ Контакти видими</li>
              <li>✔ Верифициран бадж</li>
              <li>✔ +10 кредита месечно</li>
            </ul>
            <button
              onClick={() => handleCheckout("basic_monthly")}
              disabled={loading === "basic_monthly"}
              className="mt-8 w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60"
            >
              {loading === "basic_monthly" ? "Зареждане..." : "Избери план"}
            </button>
          </div>

          {/* Premium */}
          <div className="rounded-2xl border-2 border-[#1DB954] bg-[#151528] p-8">
            <div className="mb-2 inline-block rounded-full bg-[#1DB954] px-3 py-1 text-xs font-semibold text-black">
              Най-популярен
            </div>
            <h3 className="mb-2 text-xl font-semibold">Премиум</h3>
            <p className="mb-6 text-gray-400">За топ специалисти</p>
            <div className="mb-6 text-4xl font-bold">
              €9.99<span className="text-base text-gray-400">/месец</span>
            </div>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>✔ Неограничени снимки</li>
              <li>✔ Топ позиция в търсене</li>
              <li>✔ Препоръчан на начална страница</li>
              <li>✔ Верифициран бадж</li>
              <li>✔ +25 кредита месечно</li>
            </ul>
            <button
              onClick={() => handleCheckout("premium_monthly")}
              disabled={loading === "premium_monthly"}
              className="mt-8 w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60"
            >
              {loading === "premium_monthly" ? "Зареждане..." : "Избери Premium"}
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-20">
          <h2 className="mb-4 text-center text-3xl font-bold">Купи кредити</h2>
          <p className="mb-10 text-center text-gray-400">
            1 кредит = 1 отключен контакт. Плащаш само когато имаш интерес към заявката.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center">
              <div className="text-4xl font-bold">5</div>
              <p className="text-gray-400">кредита</p>
              <div className="mt-3 text-xl font-semibold text-[#1DB954]">€2.99</div>
              <button
                onClick={() => handleCheckout("credits_5")}
                disabled={loading === "credits_5"}
                className="mt-6 w-full rounded-xl bg-[#1DB954] py-2 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60"
              >
                {loading === "credits_5" ? "Зареждане..." : "Купи"}
              </button>
            </div>

            <div className="rounded-2xl border-2 border-[#1DB954] bg-[#151528] p-8 text-center">
              <div className="mb-1 inline-block rounded-full bg-[#1DB954] px-2 py-0.5 text-xs font-semibold text-black">Най-добра стойност</div>
              <div className="text-4xl font-bold">15</div>
              <p className="text-gray-400">кредита</p>
              <div className="mt-3 text-xl font-semibold text-[#1DB954]">€6.99</div>
              <button
                onClick={() => handleCheckout("credits_15")}
                disabled={loading === "credits_15"}
                className="mt-6 w-full rounded-xl bg-[#1DB954] py-2 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60"
              >
                {loading === "credits_15" ? "Зареждане..." : "Купи"}
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center">
              <div className="text-4xl font-bold">30</div>
              <p className="text-gray-400">кредита</p>
              <div className="mt-3 text-xl font-semibold text-[#1DB954]">€11.99</div>
              <button
                onClick={() => handleCheckout("credits_30")}
                disabled={loading === "credits_30"}
                className="mt-6 w-full rounded-xl bg-[#1DB954] py-2 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60"
              >
                {loading === "credits_30" ? "Зареждане..." : "Купи"}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 rounded-2xl border border-white/10 bg-[#151528] p-8">
          <h2 className="mb-6 text-2xl font-bold">Често задавани въпроси</h2>
          <div className="space-y-4">
            {[
              { q: "Как работят кредитите?", a: "1 кредит = 1 отключен контакт на клиент. Харчиш кредит само когато решиш да се свържеш с клиент." },
              { q: "Мога ли да отменя абонамента?", a: "Да, по всяко време. Кредитите остават в акаунта ти." },
              { q: "Как се плаща?", a: "Чрез Stripe — карта (Visa, Mastercard). Сигурно и криптирано." },
              { q: "Какво е ранната програма?", a: "Първите 200 специалисти получават Premium безплатно за 6 месеца + топ позиция." },
            ].map((item, i) => (
              <div key={i} className="border-b border-white/5 pb-4">
                <p className="font-semibold text-white">{item.q}</p>
                <p className="mt-1 text-sm text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}