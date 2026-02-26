const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.update({
    where: { email: 'admin@prozona.bg' },
    data: { role: 'ADMIN' }
  });
  console.log('Updated:', user.email, user.role);
}
main().catch(console.error).finally(() => process.exit());
