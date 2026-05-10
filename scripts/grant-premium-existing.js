const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  const specialists = await prisma.specialist.findMany({
    where: { verified: true },
    orderBy: { createdAt: 'asc' },
    take: 200,
  });

  console.log(`Намерени ${specialists.length} одобрени специалисти`);

  let updated = 0;
  for (const s of specialists) {
    await prisma.specialist.update({
      where: { id: s.id },
      data: {
        subscriptionPlan: 'PREMIUM',
        subscriptionExpiresAt: sixMonthsFromNow,
        isFeatured: true,
        featuredExpiresAt: sixMonthsFromNow,
      }
    });
    updated++;
    console.log(`✓ ${s.id} → PREMIUM`);
  }

  console.log(`\nГотово — ${updated} специалисти получиха Premium до ${sixMonthsFromNow.toLocaleDateString('bg-BG')}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());