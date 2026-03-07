import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { categories } from "@/lib/constants";
import {
  StarIcon,
  MapPinIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

interface Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!specialist) return { title: "Специалист не е намерен" };
  const name = specialist.businessName || specialist.user.name || "Специалист";
  const category = categories.find(c => c.id === specialist.categoryId)?.name || "Специалист";
  const desc = specialist.description?.slice(0, 160) || `${name} - ${category} в ${specialist.city || "България"}`;
  return {
    title: `${name} | ProZona`,
    description: desc,
  };
}

export default async function SpecialistProfilePage({ params }: Props) {
  const { id, locale } = await params;
  const session = await getServerSession(authOptions);

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!specialist) notFound();

  const isOwner = !!session && (session.user as any)?.id === specialist.userId;
  const averageRating =
    specialist.reviews.length > 0
      ? specialist.reviews.reduce((acc, r) => acc + r.rating, 0) / specialist.reviews.length
      : 0;

  const displayName = specialist.businessName || specialist.user.name || "Специалист";
  const category = categories.find(c => c.id === specialist.categoryId);
  const subcategory = category?.subcategories.find(s => s.id === specialist.subcategoryId);

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#141428] to-[#0D0D1A]">
        <div className="container mx-auto px-4 pt-28 pb-10">
          <div className="mb-6">
            <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">
              ← Обратно към специалистите
            </Link>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl bg-[#25253a] flex items-center justify-center">
                  {specialist.user.image ? (
                    <Image
                      src={specialist.user.image}
                      alt={displayName}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-[#1DB954]">
                      {displayName.charAt(0)}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{displayName}</h1>
                    {specialist.isVerified && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#1DB954]/10 px-3 py-1 text-sm text-[#1DB954]">
                        <CheckBadgeIcon className="h-5 w-5" />
                        Верифициран профил
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-base mb-4">
                    <div className="flex items-center gap-2 text-white">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold">
                        {averageRating > 0 ? averageRating.toFixed(1) : "Няма"}
                      </span>
                      <span className="text-gray-400">({specialist.reviews.length} отзива)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPinIcon className="h-5 w-5 text-[#1DB954]" />
                      <span>{specialist.city || "Не е посочен град"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category && (
                      <Link
                        href={`/${locale}/categories/${category.id}`}
                        className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10"
                      >
                        {category.icon} {category.name}
                      </Link>
                    )}
                    {subcategory && (
                      <span className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-gray-400">
                        {subcategory.icon} {subcategory.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="shrink-0">
                  <Link
                    href={`/${locale}/specialist/profile/edit`}
                    className="inline-flex items-center rounded-xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-white hover:bg-[#169b43]"
                  >
                    Редактирай профила
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {specialist.description && (
              <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6">
                <h2 className="text-xl font-semibold text-white mb-4">За мен</h2>
                <p className="text-gray-300 whitespace-pre-line">{specialist.description}</p>
              </div>
            )}

            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Отзиви ({specialist.reviews.length})
              </h2>
              {specialist.reviews.length === 0 ? (
                <p className="text-gray-400">Все още няма отзиви.</p>
              ) : (
                <div className="space-y-4">
                  {specialist.reviews.map((review) => (
                    <div key={review.id} className="border-b border-white/5 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <StarIcon key={i} className="h-4 w-4" />
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString("bg-BG")}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-300">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6">
              <Link
                href={`/${locale}/specialist/${id}/inquiry`}
                className="w-full block text-center bg-[#1DB954] hover:bg-[#169b43] text-white font-semibold py-3 px-6 rounded-xl transition"
              >
                Изпрати запитване
              </Link>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Бърза информация</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Име</span>
                  <span className="text-white text-right">{displayName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Град</span>
                  <span className="text-white text-right">{specialist.city || "Не е посочен"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Статус</span>
                  <span className={specialist.isVerified ? "text-[#1DB954]" : "text-gray-300"}>
                    {specialist.isVerified ? "Верифициран" : "Неверифициран"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Отзиви</span>
                  <span className="text-white">{specialist.reviews.length}</span>
                </div>
                {specialist.experience && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Опит</span>
                    <span className="text-white">{specialist.experience} год.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

