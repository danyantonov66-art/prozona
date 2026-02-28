'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProZonaHeader from '@/components/header/ProZonaHeader'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

export default function PricingPage() {
  const params = useParams()
  const locale = params.locale as string

  const plans = [
    {
      name: 'Безплатен',
      price: '0',
      period: 'завинаги',
      badge: null,
      current: true,
      description: 'Идеален за начало',
      features: [
        { text: 'Публичен профил', included: true },
        { text: 'До 5 снимки в галерията', included: true },
        { text: 'Видим в търсенето', included: true },
        { text: 'Контакти видими за клиенти', included: true },
        { text: 'Верифициран бейдж', included: false },
        { text: 'Приоритет в търсенето', included: false },
        { text: 'Препоръчан на главната страница', included: false },
      ],
      cta: 'Започни безплатно',
      ctaHref: `/${locale}/register/specialist`,
      ctaStyle: 'border',
    },
    {
      name: 'Базов',
      price: '4.99',
      period: 'месец',
      badge: 'Скоро',
      current: false,
      description: 'За активни специалисти',
      features: [
        { text: 'Публичен профил', included: true },
        { text: 'До 20 снимки в галерията', included: true },
        { text: 'Видим в търсенето', included: true },
        { text: 'Контакти видими за клиенти', included: true },
        { text: 'Верифициран бейдж', included: true },
        { text: 'Приоритет в търсенето', included: true },
        { text: 'Препоръчан на главната страница', included: false },
      ],
      cta: 'Скоро',
      ctaHref: '#',
      ctaStyle: 'disabled',
    },
    {
      name: 'Премиум',
      price: '9.99',
      period: 'месец',
      badge: 'Най-популярен',
      current: false,
      description: 'За топ специалисти',
      features: [
        { text: 'Публичен профил', included: true },
        { text: 'Неограничени снимки', included: true },
        { text: 'Видим в търсенето', included: true },
        { text: 'Контакти видими за клиенти', included: true },
        { text: 'Верифициран бейдж', included: true },
        { text: 'Топ позиция в търсенето', included: true },
        { text: 'Препоръчан на главната страница', included: true },
      ],
      cta: 'Скоро',
      ctaHref: '#',
      ctaStyle: 'disabled',
    },
  ]

  const credits = [
    { amount: '5', price: '2.99', popular: false },
    { amount: '15', price: '6.99', popular: true },
    { amount: '30', price: '11.99', popular: false },
  ]

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <ProZonaHeader locale={locale} />

      {/* HERO */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954]/20 border border-[#1DB954]/30 rounded-full text-[#1DB954] text-sm mb-6">
          🎉 В момента всички функции са напълно безплатни
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Прости и честни цени
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Започни безплатно. Premium плановете идват скоро — ще бъдеш уведомен предварително.
        </p>
      </section>

      {/* PLANS */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-[#1A1A2E] rounded-2xl p-8 flex flex-col ${
                plan.badge === 'Най-популярен'
                  ? 'border-2 border-[#1DB954] shadow-lg shadow-[#1DB954]/20'
                  : 'border border-gray-800'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold ${
                  plan.badge === 'Най-популярен'
                    ? 'bg-[#1DB954] text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">€{plan.price}</span>
                  <span className="text-gray-400 mb-1">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <span className="w-5 h-5 rounded-full bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-gray-800 text-gray-600 flex items-center justify-center text-xs flex-shrink-0">✕</span>
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.ctaStyle === 'disabled' ? (
                <button disabled className="w-full py-3 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed font-semibold">
                  Скоро
                </button>
              ) : plan.ctaStyle === 'border' ? (
                <Link
                  href={plan.ctaHref}
                  className="w-full py-3 rounded-xl border border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-white transition-colors font-semibold text-center block"
                >
                  {plan.cta}
                </Link>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className="w-full py-3 rounded-xl bg-[#1DB954] text-white hover:bg-[#169b43] transition-colors font-semibold text-center block"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CREDITS */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Кредити</h2>
            <p className="text-gray-400">Купи кредити за допълнителни функции. Скоро налични.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {credits.map((credit) => (
              <div
                key={credit.amount}
                className={`relative bg-[#1A1A2E] rounded-2xl p-6 text-center ${
                  credit.popular
                    ? 'border-2 border-[#1DB954] shadow-lg shadow-[#1DB954]/20'
                    : 'border border-gray-800'
                }`}
              >
                {credit.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1DB954] text-white rounded-full text-xs font-semibold">
                    Най-изгоден
                  </div>
                )}
                <div className="text-5xl font-bold text-white mb-1">{credit.amount}</div>
                <div className="text-gray-400 mb-4">кредита</div>
                <div className="text-2xl font-bold text-[#1DB954] mb-6">€{credit.price}</div>
                <button disabled className="w-full py-2 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed text-sm font-semibold">
                  Скоро
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Често задавани въпроси</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Кога ще бъдат активирани Premium плановете?',
                a: 'Работим активно по тях. Всички регистрирани специалисти ще бъдат уведомени поне 30 дни преди въвеждането им.'
              },
              {
                q: 'Ще трябва ли да плащам за съществуващия ми профил?',
                a: 'Не. Безплатният план остава безплатен завинаги с основните функции.'
              },
              {
                q: 'За какво се използват кредитите?',
                a: 'Кредитите ще се използват за допълнителни функции като промотиране на профила. Повече детайли скоро.'
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#1A1A2E] rounded-xl p-6 border border-gray-800">
                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProZonaFooter />
    </div>
  )
}
