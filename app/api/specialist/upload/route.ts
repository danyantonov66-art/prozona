import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { UTApi } from "uploadthing/server"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const utapi = new UTApi()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.formData()
    const file = data.get("file") as File | null
    const type = String(data.get("type") || "")

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (type !== "profile" && type !== "gallery") {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId },
      include: {
        GalleryImage: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!specialist) {
      return NextResponse.json({ error: "Specialist not found" }, { status: 404 })
    }

    if (type === "gallery" && specialist.GalleryImage.length >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 gallery images allowed" },
        { status: 400 }
      )
    }

    const uploaded = await utapi.uploadFiles(file)

    const result = Array.isArray(uploaded) ? uploaded[0] : uploaded

    if (!result || result.error || !result.data) {
      console.error("UploadThing upload error:", result?.error)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const url =
      result.data.ufsUrl ||
      result.data.url ||
      result.data.appUrl ||
      null

    if (!url) {
      console.error("UploadThing returned no usable URL:", result.data)
      return NextResponse.json(
        { error: "Upload succeeded but no file URL was returned" },
        { status: 500 }
      )
    }

    if (type === "profile") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          image: url,
        },
      })
    }

    if (type === "gallery") {
      await prisma.galleryImage.create({
        data: {
          specialistId: specialist.id,
          imageUrl: url,
          isPrimary: specialist.GalleryImage.length === 0,
        },
      })
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}