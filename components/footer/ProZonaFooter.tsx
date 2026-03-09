import Link from "next/link"

interface Props {
  locale?: string
}

export default function ProZonaFooter({ locale = "bg" }: Props) {
  return (
    <footer className="border-t border-white/10 bg-[#0D0D1A] text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* LOGO + TEXT */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954] font-bold text-black">
                PZ
              </div>
              <span className="text-lg font-semibold text-white">
                ProZona
              </span>
            </div>

            <p className="max-w-sm text-sm text-gray-400">
              Намери надежден специалист близо до теб
            </p>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Категории
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={`/${locale}/categories/remonti-i-maistori`}
                  className="hover:text-[#1DB954]"
                >
                  Ремонти и майстори
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/categories/pochistvane`}
                  className="hover:text-[#1DB954]"
                >
                  Почистване
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/categories/montazh-i-drebni-uslugi`}
                  className="hover:text-[#1DB954]"
                >
                  Монтаж и дребни услуги
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/categories/gradina-i-dvor`}
                  className="hover:text-[#1DB954]"
                >
                  Градина и двор
                </Link>
              </li>
            </ul>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Платформа
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={`/${locale}/specialists`}
                  className="hover:text-[#1DB954]"
                >
                  Намери специалист
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/become-specialist`}
                  className="hover:text-[#1DB954]"
                >
                  Стани специалист
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/how-it-works`}
                  className="hover:text-[#1DB954]"
                >
                  Как работи
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="hover:text-[#1DB954]"
                >
                  Блог
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ProZona.bg. Всички права запазени.
        </div>
      </div>
    </footer>
  )
}