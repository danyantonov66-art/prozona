const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Оправи "София " -> "София"
  await p.specialist.updateMany({
    where: { city: 'София ' },
    data: { city: 'София' }
  });

  // Оправи "Sofia" -> "София"
  await p.specialist.updateMany({
    where: { city: 'Sofia' },
    data: { city: 'София' }
  });

  // Оправи "България" -> "" (ще трябва ръчно да се уточни)
  console.log('Специалисти с "България" като град:');
  const bg = await p.specialist.findMany({
    where: { city: 'България' },
    include: { user: { select: { name: true, email: true } } }
  });
  bg.forEach(s => console.log('-', s.user.name, s.user.email));

  console.log('\nГотово — провери "България" ръчно в админ панела.');
}

main().finally(() => p.$disconnect());