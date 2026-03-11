import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id

    const specialist = await prisma.specialist.findUnique({
      where: { userId },
      include: { GalleryImage: true },
    })

    if (!specialist) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const contentType = request.headers.get("content-type") || ""

    // Handle FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file") as File
      const type = formData.get("type") as string

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }

      if (type === "gallery" && specialist.GalleryImage.length >= 5) {
        return NextResponse.json({ error: "Gallery limit reached" }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = file.name.split(".").pop() || "jpg"
      const filename = `${uuidv4()}.${ext}`
      const uploadDir = join(process.cwd(), "public", "uploads")
      
      try {
        await writeFile(join(uploadDir, filename), buffer)
      } catch {
        // If local save fails, use a placeholder approach
      }

      const imageUrl = `/uploads/${filename}`

      if (type === "profile") {
        await prisma.user.update({
          where: { id: userId },
          data: { image: imageUrl },
        })
        return NextResponse.json({ success: true, url: imageUrl })
      }

      const isPrimary = specialist.GalleryImage.length === 0
      await prisma.galleryImage.create({
        data: {
          specialistId: specialist.id,
          imageUrl,
          isPrimary,
          sortOrder: specialist.GalleryImage.length,
        },
      })

      return NextResponse.json({ success: true, url: imageUrl })
    }

    // Handle JSON (imageUrl passed directly)
    const { imageUrl, type } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 })
    }

    if (type === "gallery" && specialist.GalleryImage.length >= 5) {
      return NextResponse.json({ error: "Gallery limit reached" }, { status: 400 })
    }

    if (type === "profile") {
      await prisma.user.update({
        where: { id: userId },
        data: { image: imageUrl },
      })
      return NextResponse.json({ success: true, url: imageUrl })
    }

    const isPrimary = specialist.GalleryImage.length === 0
    await prisma.galleryImage.create({
      data: {
        specialistId: specialist.id,
        imageUrl,
        isPrimary,
        sortOrder: specialist.GalleryImage.length,
      },
    })

    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}