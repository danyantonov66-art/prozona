export default function LaunchBanner() {

  const endDate = process.env.NEXT_PUBLIC_LAUNCH_END_DATE || "2026-09-30"
  const freeUnlocks = process.env.NEXT_PUBLIC_FREE_UNLOCKS_PER_MONTH || "20"

  return (
    <div className="w-full bg-green-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-2 text-sm text-center">

        Стартов период до {endDate} – 
        до {freeUnlocks} безплатни отключвания месечно за професионалисти.

        <a
          href="/for-professionals"
          className="ml-2 underline font-semibold"
        >
          Виж как работи →
        </a>

      </div>
    </div>
  )
}
