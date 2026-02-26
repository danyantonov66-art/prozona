const { PrismaClient } = require('./node_modules/@prisma/client');
const bcrypt = require('./node_modules/bcryptjs');

process.env.DATABASE_URL = 'postgresql://postgres:660905@localhost:5432/prozona?schema=public';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:660905@localhost:5432/prozona?schema=public'
    }
  }
});

async function main() {
  const hash = await bcrypt.hash('Admin123!', 10);
  const user = await prisma.user.create({
    data: {
      email: 'admin@prozona.bg',
      password: hash,
      name: 'Admin',
      role: 'ADMIN'
    }
  });
  console.log('Created:', user);
}
main().catch(console.error).finally(() => process.exit());
