const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

p.user.findFirst({ 
  where: { role: 'ADMIN' },
  select: { id: true, name: true }
}).then(r => { console.log(r); p.$disconnect() })