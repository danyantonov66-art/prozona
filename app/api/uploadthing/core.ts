import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const f = createUploadthing()

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error("Unauthorized")

      return { userId: (session.user as any).id as string }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: {
          image: file.url,
          avatar: file.url,
        },
      })

      return { url: file.url }
    }),

  galleryImages: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session) throw new Error("Unauthorized")

      return { userId: (session.user as any).id as string }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const specialist = await prisma.specialist.findUnique({
        where: { userId: metadata.userId },
        select: { id: true },
      })

      if (!specialist) {
        throw new Error("Specialist not found")
      }

      const existingPrimary = await prisma.galleryImage.findFirst({
        where: {
          specialistId: specialist.id,
          isPrimary: true,
        },
        select: { id: true },
      })

      await prisma.galleryImage.create({
        data: {
          specialistId: specialist.id,
          imageUrl: file.url,
          isPrimary: !existingPrimary,
        },
      })

      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
