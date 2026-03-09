export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-white">
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
            <li>✖ Контакти скрити</li>
            <li>✖ Без приоритет</li>
          </ul>

          <button className="mt-8 w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black">
            Започни безплатно
          </button>
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

          <button className="mt-8 w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black">
            Избери план
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
            €12.99<span className="text-base text-gray-400">/месец</span>
          </div>

          <ul className="space-y-3 text-sm text-gray-300">
            <li>✔ Неограничени снимки</li>
            <li>✔ Топ позиция в търсене</li>
            <li>✔ Препоръчан на начална страница</li>
            <li>✔ Верифициран бадж</li>
            <li>✔ +25 кредита месечно</li>
          </ul>

          <button className="mt-8 w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black">
            Избери Premium
          </button>
        </div>
      </div>

      {/* Credits */}
      <div className="mt-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Кредити</h2>

        <p className="mb-10 text-center text-gray-400">
          1 кредит отключва контакт на клиент. Плащаш само когато имаш интерес
          към заявката.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center">
            <div className="text-4xl font-bold">5</div>
            <p className="text-gray-400">кредита</p>
            <div className="mt-3 text-xl font-semibold text-[#1DB954]">
              €2.99
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#1DB954] bg-[#151528] p-8 text-center">
            <div className="text-4xl font-bold">15</div>
            <p className="text-gray-400">кредита</p>
            <div className="mt-3 text-xl font-semibold text-[#1DB954]">
              €6.99
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center">
            <div className="text-4xl font-bold">30</div>
            <p className="text-gray-400">кредита</p>
            <div className="mt-3 text-xl font-semibold text-[#1DB954]">
              €11.99
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}