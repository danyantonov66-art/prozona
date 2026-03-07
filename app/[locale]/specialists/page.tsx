import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { categories as allCategories } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Всички специалисти",
  description: "Разгледай всички специалисти в ProZona.",
};

const PER_PAGE = 12;

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; city?: string; page?: string }>;
}

export default async function SpecialistsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, city, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));

  const where = {
    isApproved: true,
    ...(city ? { city: { contains: city, mode: "insensitive" as const } } : {}),
    ...(category ? { categoryId: category } : {}),
  };

  const specialists = await prisma.specialist.findMany({
    where,
    include: { user: true },
    orderBy: { rating: "desc" },
    take: PER_PAGE,
    skip: (currentPage - 1) * PER_PAGE,
  });

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Всички специалисти
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((specialist) => {
            const photo = specialist.user.image || null;
            const categoryName = allCategories.find(c => c.id === specialist.categoryId)?.name || null;
            return (
              <Link
                key={specialist.id}
                href={`/${locale}/specialist/${specialist.id}`}
                className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors group"
              >
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 relative overflow-hidden bg-[#0D0D1A] flex items-center justify-center">
                    {photo ? (
                      <Image src={photo} alt={specialist.user.name || ""} fill className="object-cover" />
                    ) : (
                      <span className="text-4xl text-gray-600">
                        {specialist.user.name?.[0] || "?"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-[#1DB954] transition-colors">
                    {specialist.user.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{categoryName || "Специалист"}</p>
                  <p className="text-gray-400 text-sm">{specialist.city}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
