const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

const SUBCATEGORIES = [
  { name: "Математика", slug: "matematika", description: "Частни уроци по математика за ученици от 1 до 12 клас, подготовка за НВО и матура. Верифицирани преподаватели с индивидуален подход." },
  { name: "Английски език", slug: "angliyski-ezik", description: "Уроци по английски език за всички нива — деца, ученици и възрастни. Верифицирани преподаватели, подготовка за сертификати и разговорен английски." },
  { name: "Немски език", slug: "nemski-ezik", description: "Частни уроци по немски език — начинаещи и напреднали, подготовка за Goethe сертификати. Верифицирани преподаватели с доказан опит." },
  { name: "Български език и литература", slug: "balgarski-ezik-i-literatura", description: "Уроци по БЕЛ — подготовка за НВО след 7 клас и матура след 12 клас. Верифицирани преподаватели с опит в изпитния формат." },
  { name: "Физика и химия", slug: "fizika-i-himiya", description: "Частни уроци по физика и химия за ученици и кандидат-студенти. Верифицирани преподаватели за медицина, фармация и технически специалности." },
  { name: "Програмиране", slug: "programirane", description: "Уроци по програмиране за деца и възрастни — Python, JavaScript, Scratch и др. Верифицирани преподаватели с практически подход." },
  { name: "Музикални инструменти", slug: "muzikalni-instrumenti", description: "Уроци по пиано, китара, цигулка и други инструменти. Верифицирани музикални педагози за деца и възрастни." },
  { name: "Подготовка за матури и кандидатстване", slug: "podgotovka-za-maturi", description: "Целенасочена подготовка за НВО, ДЗИ и кандидатстудентски изпити. Верифицирани преподаватели с високи резултати на учениците си." },
];

async function main() {
  console.log("🚀 Създаване на категория 'Уроци и обучение'...\n");

  // Проверка дали вече съществува (idempotent)
  let category = await p.category.findFirst({ where: { slug: "uroci-i-obuchenie" } });

  if (category) {
    console.log(`⚠️  Категорията вече съществува (id: ${category.id}) — продължавам само с подкатегориите.`);
  } else {
    category = await p.category.create({
      data: {
        name: "Уроци и обучение",
        slug: "uroci-i-obuchenie",
        description: "Частни уроци и подготовка за изпити — математика, езици, програмиране и още. Верифицирани преподаватели онлайн и присъствено.",
        isActive: true, updatedAt: new Date(),
      },
    });
    console.log(`✅ Категория създадена: id ${category.id}`);
  }

  console.log("\nДобавяне на подкатегории:");
  for (const sub of SUBCATEGORIES) {
    const existing = await p.subcategory.findFirst({
      where: { categoryId: category.id, slug: sub.slug },
    });
    if (existing) {
      console.log(`⚠️  ${sub.name} — вече съществува (id: ${existing.id})`);
      continue;
    }
    const created = await p.subcategory.create({
      data: {
        categoryId: category.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description, updatedAt: new Date(),
      },
    });
    console.log(`✅ ${sub.name} (id: ${created.id})`);
  }

  console.log("\n🎉 Готово! Провери на /bg/categories");
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => p.$disconnect());
