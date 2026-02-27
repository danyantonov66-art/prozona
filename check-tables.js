const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.categorySuggestion.count();
  console.log('CategorySuggestion count:', count);
}
main().catch(console.error).finally(() => process.exit());
