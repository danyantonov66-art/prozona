const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });
async function main() {
  const count = await prisma.user.count();
  console.log('User count:', count);
  const user = await prisma.user.findUnique({ where: { email: 'admin@prozona.bg' } });
  console.log('Admin user:', user);
}
main().catch(console.error).finally(() => process.exit());
