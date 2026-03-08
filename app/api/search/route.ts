import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const q = searchParams.get("q")?.trim() || ""
    const city = searchParams.get("city")?.trim() || ""

    const specialists = await prisma.specialist.findMany({
      where: {
        verified: true,
        AND: [
          city
            ? {
                city: {
                  contains: city,
                  mode: "insensitive",
                },
              }
            : {},
          q
            ? {
                OR: [
                  {
                    businessName: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                  {
                    user: {
                      name: {
                        contains: q,
                        mode: "insensitive",
                      },
                    },
                  },
                  {
                    SpecialistCategory: {
                      some: {
                        Category: {
                          name: {
                            contains: q,
                            mode: "insensitive",
                          },
                        },
                      },
                    },
                  },
                  {
                    SpecialistCategory: {
                      some: {
                        Subcategory: {
                          is: {
                            name: {
                              contains: q,
                              mode: "insensitive",
                            },
                          },
                        },
                      },
                    },
                  },
                  {
                    SpecialistCategory: {
                      some: {
                        Category: {
                          slug: {
                            contains: q.toLowerCase(),
                          },
                        },
                      },
                    },
                  },
                  {
                    SpecialistCategory: {
                      some: {
                        Subcategory: {
                          is: {
                            slug: {
                              contains: q.toLowerCase(),
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              }
            : {},
        ],
      },
      include: {
        user: true,
        reviews: true,
        GalleryImage: true,
        SpecialistCategory: {
          include: {
            Category: true,
            Subcategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const result = specialists.map((specialist) => {
      const averageRating =
        specialist.reviews.length > 0
          ? specialist.reviews.reduce((acc, r) => acc + r.rating, 0) /
            specialist.reviews.length
          : 0

      return {
        id: specialist.id,
        businessName: specialist.businessName,
        name: specialist.user?.name || null,
        city: specialist.city,
        description: specialist.description,
        phone: specialist.phone,
        image:
          specialist.GalleryImage?.[0]?.imageUrl || specialist.user?.image || null,
        rating: averageRating,
        reviewsCount: specialist.reviews.length,
        categories: specialist.SpecialistCategory.map((item) => ({
          category: item.Category?.name || null,
          categorySlug: item.Category?.slug || null,
          subcategory: item.Subcategory?.name || null,
          subcategorySlug: item.Subcategory?.slug || null,
        })),
      }
    })

    return NextResponse.json({
      success: true,
      count: result.length,
      query: q,
      city,
      specialists: result,
    })
  } catch (error) {
    console.error("Search API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to search specialists",
      },
      { status: 500 }
    )
  }
}