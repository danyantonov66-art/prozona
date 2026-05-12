const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.blogPost.findMany({
  select: { slug: true, title: true },
  take: 50,
  orderBy: { createdAt: 'asc' }
})
.then(r => console.log(JSON.stringify(r, null, 2)))
.finally(async () => { await p.$disconnect(); });