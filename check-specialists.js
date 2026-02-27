const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const specialists = await prisma.specialist.findMany({ select: { id: true, userId: true } });
  console.log(specialists);
}
main().catch(console.error).finally(() => process.exit());
