import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const id = searchParams.get("id")

    if (!token || !id) {
      return NextResponse.redirect(new URL("/bg/login?error=invalid_token", request.url))
    }

    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return NextResponse.redirect(new URL("/bg/login?error=user_not_found", request.url))
    }

    if (user.emailVerified) {
      return NextResponse.redirect(new URL("/bg/login?verified=already", request.url))
    }

    if (user.verifyToken !== token) {
      return NextResponse.redirect(new URL("/bg/login?error=invalid_token", request.url))
    }

    await prisma.user.update({
      where: { id },
      data: {
        emailVerified: new Date(),
        verifyToken: null,
      }
    })

    return NextResponse.redirect(new URL("/bg/login?verified=success", request.url))
  } catch (error) {
    console.error("Verify email error:", error)
    return NextResponse.redirect(new URL("/bg/login?error=server_error", request.url))
  }
}