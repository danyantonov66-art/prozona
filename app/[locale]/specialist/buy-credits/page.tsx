// app/specialist/buy-credits/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CheckoutButton from '@/components/payment/CheckoutButton';
import { getDualPrice, isTransitionPeriod } from '@/lib/currency';

export default function BuyCreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const showBothCurrencies = isTransitionPeriod();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white">Зареждане...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/login?callbackUrl=/specialist/buy-credits');
    return null;
  }

  const creditPackages = [
    { 
      id: 'credits_5', 
      credits: 5, 
      priceEur: 2.99,
      popular: false,
      description: 'За пробни запитвания'
    },
    { 
      id: 'credits_15', 
      credits: 15, 
      priceEur: 6.99,
      popular: true,
      description: 'Най-популярен'
    },
    { 
      id: 'credits_30', 
      credits: 30, 
      priceEur: 11.99,
      popular: false,
      description: 'Най-изгоден'
    },
  ];

  const subscriptionPackages = [
    {
      id: 'basic_monthly',
      name: 'Базов месечен',
      priceEur: 4.99,
      credits: 5,
      features: ['5 кредита/месец', '15 снимки', 'До 10 цени'],
    },
    {
      id: 'premium_monthly',
      name: 'Премиум месечен',
      priceEur: 9.99,
      credits: 15,
      features: [
        '15 кредита/месец',
        'Неограничени снимки',
        'Неограничени цени',
        'Приоритет при запитвания',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/specialist/dashboard" className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Планове и кредити
        </h1>

        {/* Абонаменти */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Месечни абонаменти</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {subscriptionPackages.map((pkg) => {
              const price = getDualPrice(pkg.priceEur);
              
              return (
                <div
                  key={pkg.id}
                  className="bg-[#1A1A2E] rounded-lg p-8 text-center border border-gray-700 hover:border-[#1DB954] transition-colors"
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-[#1DB954] mb-2">{price.eur}</div>
                    {showBothCurrencies && (
                      <div className="text-gray-400 text-sm">{price.bgn}</div>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4">{pkg.credits} кредита/месец</p>
                  <ul className="text-left space-y-2 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="text-gray-400 flex items-start gap-2">
                        <span className="text-[#1DB954] mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton
                    planType={pkg.id}
                    label={`Абонирай се за ${price.eur}`}
                    className="w-full px-4 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Кредитни пакети */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Кредитни пакети</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {creditPackages.map((pkg) => {
              const price = getDualPrice(pkg.priceEur);
              
              return (
                <div
                  key={pkg.id}
                  className={`bg-[#1A1A2E] rounded-lg p-6 text-center relative ${
                    pkg.popular ? 'border-2 border-[#1DB954]' : 'border border-gray-700'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1DB954] text-white text-xs px-3 py-1 rounded-full">
                      {pkg.description}
                    </div>
                  )}
                  <div className="text-4xl mb-4">💎</div>
                  <h2 className="text-2xl font-bold text-white mb-2">{pkg.credits} кредита</h2>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-[#1DB954]">{price.eur}</div>
                    {showBothCurrencies && (
                      <div className="text-gray-400 text-sm">{price.bgn}</div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {(pkg.priceEur / pkg.credits).toFixed(2)} €/кредит
                  </p>
                  
                  <CheckoutButton
                    planType={pkg.id}
                    label="Закупи"
                    className="w-full px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Информация за преходния период */}
        {showBothCurrencies && (
          <div className="mt-8 bg-blue-500/10 border border-blue-500 text-blue-500 rounded-lg p-4 text-center">
            <p className="text-sm">
              ⏳ До юни 2026 г. показваме цени и в евро, и в лева за улеснение на прехода.
              <br />
              <span className="text-xs opacity-75">Курс: 1 EUR = 1.95583 BGN</span>
            </p>
          </div>
        )}

        <div className="mt-12 bg-[#1A1A2E] rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Как работят кредитите?</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-[#1DB954]">•</span>
              Всеки отговор на запитване от клиент струва 1 кредит
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1DB954]">•</span>
              Кредитите нямат срок на валидност
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1DB954]">•</span>
              При абонамент получавате месечни безплатни кредити
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}