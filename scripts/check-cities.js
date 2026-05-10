const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.specialist.groupBy({
  by: ['city'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } },
  take: 10
}).then(r => {
  r.forEach(x => console.log(x.city, '-', x._count.id, 'специалисти'));
}).finally(() => p.$disconnect());