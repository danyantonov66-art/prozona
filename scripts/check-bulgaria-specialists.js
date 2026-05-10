const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const specialists = await p.specialist.findMany({
    where: { city: 'България' },
    include: { user: { select: { name: true, email: true } } }
  });

  specialists.forEach(s => {
    console.log('---');
    console.log('Име:', s.user.name);
    console.log('Имейл:', s.user.email);
    console.log('ServiceAreas:', s.serviceAreas);
    console.log('Адрес:', s.address);
  });
}

main().finally(() => p.$disconnect());