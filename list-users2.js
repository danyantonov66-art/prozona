const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log('Count:', users.length);
  console.log(users.map(u => u.email));
}
main().catch(console.error).finally(() => process.exit());
