const { PrismaClient } = require('./node_modules/@prisma/client');
const bcrypt = require('./node_modules/bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('Admin123!', 10);
  const user = await prisma.user.create({
    data: { email: 'admin@prozona.bg', password: hash, name: 'Admin', role: 'ADMIN' }
  });
  console.log('Created:', user.email);
}
main().catch(console.error).finally(() => process.exit());
