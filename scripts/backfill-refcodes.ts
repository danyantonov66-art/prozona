// Еднократен backfill: генерира refCode за специалисти, които нямат такъв.
// Пуска се с: npx tsx scripts/backfill-refcodes.ts
//
// Използва СЪЩАТА логика за генериране като app/api/auth/register/route.ts
// (crypto random hex, retry на P2002 колизия), за да са кодовете консистентни.

import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

function generateRefCode(): string {
  return crypto.randomBytes(5).toString("hex").toUpperCase()
}

async function assignUniqueRefCode(specialistId: string): Promise<string> {
  const MAX_ATTEMPTS = 5
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const refCode = generateRefCode()
    try {
      await prisma.specialist.update({
        where: { id: specialistId },
        data: { refCode },
      })
      return refCode
    } catch (err: any) {
      const isRefCodeCollision = err?.code === "P2002" && err?.meta?.target?.includes?.("refCode")
      if (isRefCodeCollision && attempt < MAX_ATTEMPTS) continue
      throw err
    }
  }
  throw new Error("unreachable")
}

async function main() {
  console.log("DB host:", new URL(process.env.DATABASE_URL!).host)

  const specialists = await prisma.specialist.findMany({
    where: { refCode: null },
    select: { id: true },
  })

  console.log(`Намерени ${specialists.length} специалист(а) без refCode.`)

  let updated = 0
  for (const specialist of specialists) {
    const refCode = await assignUniqueRefCode(specialist.id)
    console.log(`  ${specialist.id} -> ${refCode}`)
    updated++
  }

  console.log(`\nГотово. Обновени ${updated} от ${specialists.length} записа.`)
}

main()
  .catch((err) => {
    console.error("Backfill-ът се провали:", err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
