// app/[locale]/page.tsx
import Link from "next/link";
import ProZonaHeader from "@/components/header/ProZonaHeader";
import ProZonaFooter from "@/components/footer/ProZonaFooter";
import Hero from "@/components/hero";

interface Props {
  params: {
    locale: string;
  };
}

export default function HomePage({ params }: Props) {
  const { locale } = params;

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      <ProZonaHeader locale={locale} />

      {/* Top info bar */}
      <div className="bg-[#1A1A2E] text-white text-center py-2 px-4">
        <p className="text-sm">
          Стартов период: до 20 безплатни специалисти в категория.
          <Link
            href={`/${locale}/how-it-works`}
            className="ml-2 text-[#1DB954] font-semibold hover:underline"
          >
            Виж как работи →
          </Link>
        </p>
      </div>

      {/* Hero section */}
      <Hero locale={locale} />

      {/* Example categories block (ако имаш подобен код) */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Популярни категории
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href={`/${locale}/categories/stroitelstvo`}
            className="p-4 bg-[#1A1A2E] rounded-lg text-white hover:bg-[#25253a]"
          >
            Строителство
          </Link>

          <Link
            href={`/${locale}/categories/remonti`}
            className="p-4 bg-[#1A1A2E] rounded-lg text-white hover:bg-[#25253a]"
          >
            Ремонти
          </Link>

          <Link
            href={`/${locale}/categories/fotografiya`}
            className="p-4 bg-[#1A1A2E] rounded-lg text-white hover:bg-[#25253a]"
          >
            📸 Фотография
          </Link>
        </div>
      </section>

      <ProZonaFooter />
    </main>
  );
}