const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const total = await prisma.specialist.count();
    const noPhoto = await prisma.specialist.count({ where: { OR: [{ photo: null }, { photo: '' }] } });
    const noDesc = await prisma.specialist.count({ where: { OR: [{ description: null }, { description: '' }] } });
    const empty = await prisma.specialist.count({ where: { AND: [{ OR: [{ photo: null }, { photo: '' }] }, { OR: [{ description: null }, { description: '' }] }] } });
    console.log('Общо специалисти:', total);
    console.log('Без снимка:', noPhoto);
    console.log('Без описание:', noDesc);
    console.log('Празни (без и двете):', empty);
  } catch(e) {
    console.log('Грешка:', e.message);
  }
}
main().finally(() => prisma.$disconnect());
