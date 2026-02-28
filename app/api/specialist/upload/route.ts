import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

export const config = {
  api: { bodyParser: false }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = (session.user as any)?.id
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadFile = new File([buffer], file.name, { type: file.type })

    const response = await utapi.uploadFiles(uploadFile)
    if (response.error) return NextResponse.json({ error: response.error.message }, { status: 500 })

    const url = response.data.url

    if (type === "profile") {
      await prisma.user.update({ where: { id: userId }, data: { image: url } })
    } else if (type === "gallery") {
      const specialist = await prisma.specialist.findUnique({ where: { userId } })
      if (specialist) {
        const count = await prisma.galleryImage.count({ where: { specialistId: specialist.id } })
        if (count >= 5) return NextResponse.json({ error: "Max 5 images" }, { status: 400 })
        await prisma.galleryImage.create({
          data: { specialistId: specialist.id, imageUrl: url, sortOrder: count }
        })
      }
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
