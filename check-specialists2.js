const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const total = await prisma.specialist.count();
  const noImages = await prisma.specialist.count({ where: { GalleryImage: { none: {} } } });
  const allSpecialists = await prisma.specialist.findMany({ select: { description: true } });
  const shortDesc = allSpecialists.filter(s => !s.description || s.description.trim().length < 20).length;
  console.log('Общо специалисти:', total);
  console.log('Без снимки в галерия:', noImages);
  console.log('С много кратко описание (<20 символа):', shortDesc);
}
main().finally(() => prisma.$disconnect());
