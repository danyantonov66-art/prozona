import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.specialist.update({
    where: { id: (await params).id },
    data: {
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: (session.user as any).id,
      verificationBadge: true,
      badgeType: "BASIC",
    },
  });

  return NextResponse.json({ ok: true });
}
