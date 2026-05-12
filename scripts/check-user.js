const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.user.findUnique({
  where: { id: 'cmmf2cgod0000u508nfbopi7b' },
  include: { specialist: true }
}).then(u => {
  console.log('Role:', u?.role);
  console.log('Specialist:', u?.specialist ? 'ДА' : 'НЕ');
}).finally(() => p.$disconnect());