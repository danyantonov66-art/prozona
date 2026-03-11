export default function ForProfessionals() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">

      <h1 className="text-4xl font-bold mb-6">
        Получавай реални заявки за услуги
      </h1>

      <p className="text-gray-400 mb-10">
        Плащаш само при отключен контакт. Без дългосрочни договори.
      </p>

      <div className="space-y-6 text-lg">

        <div>1️⃣ Създаваш профил</div>

        <div>2️⃣ Получаваш заявки от клиенти</div>

        <div>3️⃣ Отключваш контакт само ако заявката ти е подходяща</div>

        <div>4️⃣ Свързваш се директно с клиента</div>

      </div>

      <div className="mt-12">

        <a
          href="/register"
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Създай безплатен профил
        </a>

      </div>

    </div>
  )
}
