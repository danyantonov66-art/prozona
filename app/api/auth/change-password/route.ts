// app/api/auth/change-password/route.ts
//
// Смяна на парола за ВЛЯЗЪЛ потребител.
// Приема { currentPassword, newPassword }, проверява текущата срещу хеша в
// базата (bcrypt.compare) и записва новата хеширана.
//
// Пасва на съществуващия ти auth pattern:
//   - getServerSession(authOptions) от "@/lib/auth"
//   - session.user.email за идентификация
//   - bcryptjs + prisma.user

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка" }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;

  // Валидации
  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Моля, попълни текущата и новата парола." },
      { status: 400 }
    );
  }
  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "Новата парола трябва да е поне 6 символа." },
      { status: 400 }
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { error: "Новата парола е същата като текущата." },
      { status: 400 }
    );
  }

  // Взима потребителя
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Потребителят не е намерен." }, { status: 404 });
  }

  // Ако акаунтът е създаден през Google (няма парола) — не може да сменя така
  if (!user.password) {
    return NextResponse.json(
      { error: "Този акаунт използва вход през Google и няма парола за смяна." },
      { status: 400 }
    );
  }

  // Проверява текущата парола
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Текущата парола е грешна." }, { status: 400 });
  }

  // Записва новата
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ ok: true, message: "Паролата е сменена успешно." });
}