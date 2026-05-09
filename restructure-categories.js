const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  console.log("Започвам преструктуриране...");

  await p.category.update({ where: { id: 9 }, data: { name: "Ремонти и строителство", slug: "remonti-i-stroitelstvo", sortOrder: 1 } });
  await p.category.update({ where: { id: 11 }, data: { sortOrder: 2 } });
  await p.category.update({ where: { id: 12 }, data: { name: "Монтаж и инсталации", slug: "montaj-i-instalacii", sortOrder: 4 } });
  await p.category.update({ where: { id: 8 }, data: { sortOrder: 6 } });
  await p.category.update({ where: { id: 4 }, data: { name: "Авто услуги", slug: "avto-uslugi", sortOrder: 7, isActive: true } });
  await p.category.update({ where: { id: 14 }, data: { name: "Компютърни и IT услуги", slug: "kompyutarni-uslugi", sortOrder: 8 } });
  await p.category.update({ where: { id: 6 }, data: { name: "Мебели и обзавеждане", slug: "mebeli-i-obzavejdane", description: "Изработка и монтаж на мебели по поръчка", icon: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", sortOrder: 5, isActive: true } });

  const prem = await p.category.upsert({ where: { slug: "premestване-i-transport" }, update: {}, create: { name: "Преместване и транспорт", slug: "premestване-i-transport", description: "Хамали, извозване и транспорт", icon: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", sortOrder: 3, isActive: true } });

  await p.subcategory.updateMany({ where: { categoryId: 1 }, data: { categoryId: 9 } });
  await p.subcategory.updateMany({ where: { id: { in: [46, 47, 76] } }, data: { categoryId: prem.id } });
  await p.subcategory.update({ where: { id: 11 }, data: { categoryId: prem.id } });
  await p.subcategory.update({ where: { id: 41 }, data: { categoryId: 6 } });
  await p.subcategory.updateMany({ where: { id: { in: [66, 73, 79, 185] } }, data: { isActive: false } });

  console.log("Готово!");
}

main().catch(e => { console.error(e.message); process.exit(1); }).finally(() => p.$disconnect());
