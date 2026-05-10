const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Лино Спасов -> София
  await p.specialist.updateMany({
    where: { user: { email: 'navi_thor@abv.bg' } },
    data: { city: 'София', serviceAreas: ['София'] }
  });
  console.log('✓ Лино Спасов -> София');

  // Строителство Варна -> Варна  
  await p.specialist.updateMany({
    where: { user: { email: 'vasilrysev90@gmail.com' } },
    data: { city: 'Варна', serviceAreas: ['Варна'] }
  });
  console.log('✓ Строителство Варна -> Варна');

  // Василеви -> Варна (по контекст)
  await p.specialist.updateMany({
    where: { user: { email: 'vasilev3291@gmail.com' } },
    data: { city: 'Варна', serviceAreas: ['Варна'] }
  });
  console.log('✓ Василеви -> Варна');
}

main().finally(() => p.$disconnect());