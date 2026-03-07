import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TrackPhoneLink from "@/components/analytics/TrackPhoneLink";
import {
  StarIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

interface Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

function toAbsoluteUrl(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://www.prozona.bg${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: { user: true, categories: { include: { category: true }, take: 1 } },
  });

  if (!specialist) return { title: "Специалист не е намерен" };

  const name = specialist.businessName || specialist.user.name || "Специалист";
  const category = specialist.categories[0]?.category?.name || "Специалист";
  const rawPhoto = specialist.user.image || (specialist.user as any).avatar || undefined;
  const photo = toAbsoluteUrl(rawPhoto);

  const desc =
    specialist.description?.slice(0, 160) ||
    `${name} - ${category} в ${specialist.city || "България"}`;

  const canonicalUrl = `https://www.prozona.bg/${locale}/specialist/${id}`;

  return {
    title: `${name} - ${category}`,
    description: desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${name} | ProZona`,
      description: desc,
      url: canonicalUrl,
      images: photo ? [{ url: photo, width: 400, height: 400, alt: name }] : [],
    },
  };
}

export default async function SpecialistProfilePage({ params }: Props) {
  const { id, locale } = await params;
  const session = await getServerSession(authOptions);

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      categories: { include: { category: true } },
      reviews: {
        include: { client: true },
        orderBy: { createdAt: "desc" },
      },
      gallery: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!specialist) notFound();

  const isOwner = !!session && (session.user as any)?.id === specialist.userId;

  const averageRating =
    specialist.reviews.length > 0
      ? specialist.reviews.reduce((acc, review) => acc + review.rating, 0) /
        specialist.reviews.length
      : 0;

  const displayName =
    specialist.businessName || specialist.user.name || "Специалист";

  const completedJobs = specialist.reviews.length;
  const galleryCount = (specialist as any).gallery?.length || 0;
  const categoriesCount = specialist.categories.length;

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#141428] to-[#0D0D1A]">
        <div className="container mx-auto px-4 pt-28 pb-10">
          <div className="mb-6">
            <Link
              href={`/${locale}/specialists`}
              className="text-[#1DB954] hover:underline"
            >
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
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {displayName}
                    </h1>

                    {specialist.verified && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#1DB954]/10 px-3 py-1 text-sm text-[#1DB954]">
                        <CheckBadgeIcon className="h-5 w-5" />
                        Проверен профил
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-base mb-4">
                    <div className="flex items-center gap-2 text-white">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold">
                        {averageRating > 0 ? averageRating.toFixed(1) : "Няма"}
                      </span>
                      <span className="text-gray-400">
                        ({specialist.reviews.length} отзива)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPinIcon className="h-5 w-5 text-[#1DB954]" />
                      <span>{specialist.city || "Не е посочен град"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {specialist.categories.map((sc) => (
                      <Link
                        key={sc.category.id}
                        href={`/${locale}/categories/${sc.category.slug}`}
                        className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10"
                      >
                        {sc.category.name}
                      </Link>
                    ))}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-[#1DB954]/10 p-2">
                  <StarIcon className="h-5 w-5 text-[#1DB954]" />
                </div>
                <span className="text-sm text-gray-400">Рейтинг</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {averageRating > 0 ? averageRating.toFixed(1) : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-[#1DB954]/10 p-2">
                  <BriefcaseIcon className="h-5 w-5 text-[#1DB954]" />
                </div>
                <span className="text-sm text-gray-400">Завършени работи</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedJobs}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-[#1DB954]/10 p-2">
                  <PhotoIcon className="h-5 w-5 text-[#1DB954]" />
                </div>
                <span className="text-sm text-gray-400">Снимки</span>
              </div>
              <p className="text-2xl font-bold text-white">{galleryCount}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-[#1DB954]/10 p-2">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-[#1DB954]" />
                </div>
                <span className="text-sm text-gray-400">Категории</span>
              </div>
              <p className="text-2xl font-bold text-white">{categoriesCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">За специалиста</h2>
              <p className="text-gray-300 whitespace-pre-line leading-7">
                {specialist.description || "Все още няма добавено описание."}
              </p>
            </div>

            {galleryCount > 0 && (
              <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Галерия</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(specialist as any).gallery.map((img: any, i: number) => (
                    <div
                      key={img.id}
                      className="group aspect-square overflow-hidden rounded-xl bg-[#25253a]"
                    >
                      <Image
                        src={img.imageUrl}
                        alt={img.title || `Снимка ${i + 1}`}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Услуги и категории</h2>
              <div className="flex flex-wrap gap-3">
                {specialist.categories.map((sc) => (
                  <Link
                    key={sc.category.id}
                    href={`/${locale}/categories/${sc.category.slug}`}
                    className="rounded-xl bg-[#25253a] px-4 py-2 text-sm text-[#1DB954] hover:bg-[#2d2d44]"
                  >
                    {sc.category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-2xl font-semibold text-white">Отзиви</h2>
                <span className="text-sm text-gray-400">
                  {specialist.reviews.length} общо
                </span>
              </div>

              {specialist.reviews.length === 0 ? (
                <div className="rounded-xl bg-[#25253a] p-5 text-gray-400">
                  Все още няма отзиви за този специалист.
                </div>
              ) : (
                <div className="space-y-4">
                  {specialist.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl bg-[#25253a] p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-[#1A1A2E] flex items-center justify-center">
                          {review.client?.image ? (
                            <Image
                              src={review.client.image}
                              alt={review.client?.name ?? "Клиент"}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-[#1DB954]">
                              {review.client?.name?.charAt(0) || "К"}
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-white font-medium">
                            {review.client?.name || "Клиент"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("bg-BG")}
                          </p>
                        </div>

                        <div className="ml-auto flex items-center gap-1 text-yellow-400">
                          <StarIcon className="h-4 w-4" />
                          <span className="text-sm font-semibold text-white">
                            {review.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 leading-6">
                        {review.comment || "Няма текст към отзива."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6">
                <div className="text-center pb-5 border-b border-white/5">
                  <p className="text-3xl font-bold text-[#1DB954]">По договаряне</p>
                  <p className="text-sm text-gray-400 mt-1">ориентировъчна цена</p>
                </div>

                <div className="pt-5 space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <EnvelopeIcon className="h-5 w-5 text-[#1DB954]" />
                    <span className="break-all">{specialist.user.email}</span>
                  </div>

                  <div className="flex items-start gap-3 text-gray-300">
                    <MapPinIcon className="h-5 w-5 text-[#1DB954] mt-0.5" />
                    <span>{specialist.city || "Не е посочен град"}</span>
                  </div>

                  {specialist.phone && (
                    <div className="flex items-start gap-3">
                      <PhoneIcon className="h-5 w-5 text-[#1DB954] mt-0.5" />
                      <div>
                        <TrackPhoneLink
                          phone={specialist.phone}
                          specialistId={specialist.id}
                          specialistName={displayName}
                          city={specialist.city}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href={`/${locale}/specialist/${specialist.id}/inquiry`}
                    className="block w-full rounded-xl bg-[#1DB954] px-4 py-3 text-center font-semibold text-white hover:bg-[#169b43]"
                  >
                    Изпрати запитване
                  </Link>

                  <Link
                    href={`/${locale}/specialist/${specialist.id}/review`}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-white hover:bg-white/10"
                  >
                    Остави отзив
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#1A1A2E] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Бърза информация
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Име</span>
                    <span className="text-white text-right">{displayName}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Град</span>
                    <span className="text-white text-right">
                      {specialist.city || "Не е посочен"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Статус</span>
                    <span className={specialist.verified ? "text-[#1DB954]" : "text-gray-300"}>
                      {specialist.verified ? "Проверен" : "Непроверен"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Отзиви</span>
                    <span className="text-white">{specialist.reviews.length}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Снимки</span>
                    <span className="text-white">{galleryCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}