require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const specialists = await prisma.user.findMany({
    where: { role: 'SPECIALIST' },
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Намерени специалисти: ${specialists.length}`);
  console.log('---');

  const fs = require('fs');
  fs.writeFileSync(
    'specialists-list.json',
    JSON.stringify(specialists, null, 2),
    'utf8'
  );

  console.log('Записано в specialists-list.json');
  console.log('Първите 5 за проверка:');
  console.log(specialists.slice(0, 5));
}

main()
  .catch((e) => {
    console.error('ГРЕШКА:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
