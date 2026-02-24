// app/faq/page.tsx
import Link from 'next/link'

export default function FAQPage() {
  const faqs = [
    {
      question: "Как да намеря специалист?",
      answer: "Можете да използвате търсачката в началната страница или да разгледате категориите. След като намерите подходящ специалист, кликнете върху 'Виж профил' и след това 'Изпрати запитване'."
    },
    {
      question: "Колко струва да използвам ProZona като клиент?",
      answer: "За клиентите платформата е напълно безплатна. Можете да търсите специалисти, да разглеждате профили и да изпращате запитвания без никакви такси."
    },
    {
      question: "Как да стана специалист в ProZona?",
      answer: "Регистрирайте се като клиент, след това влезте в 'Моето табло' и кликнете 'Предлагай услуги'. Попълнете вашите данни и започнете да предлагате услугите си. Първите 3 месеца са напълно безплатни!"
    },
    {
      question: "Как работят кредитите за специалисти?",
      answer: "Кредитите се използват за отговаряне на запитвания от клиенти. Всеки отговор струва 1 кредит. В безплатния план кредитите са 0, Базовият план включва 5 кредита месечно, а Премиум - 15 кредита."
    },
    {
      question: "Мога ли да променя плана си?",
      answer: "Да, можете да надграждате или понижавате плана си по всяко време от настройките на профила."
    },
    {
      question: "Как се заплащат услугите?",
      answer: "Плащанията между клиенти и специалисти се договарят директно. ProZona не обработва плащания за услугите, а само предоставя платформа за връзка."
    }
  ]

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Често задавани въпроси
        </h1>
        <p className="text-xl text-gray-400 mb-12 text-center">
          Намерете отговори на най-честите въпроси
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#1A1A2E] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Не намирате отговор на въпроса си?
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
          >
            Свържете се с нас
          </Link>
        </div>
      </div>
    </div>
  )
}