const fs = require("fs");
const path = require("path");
const https = require("https");
const { PrismaClient } = require("@prisma/client");

const IMAGE_URL = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80";
const IMAGE_PATH = path.join("public", "images", "categories", "uroci.png");
const ICON_DB_PATH = "/images/categories/uroci.png";

const NEW_BLOCK = `  {
    id: "uroci-i-obuchenie",
    slug: "uroci-i-obuchenie",
    name: "Уроци и обучение",
    nameEn: "Tutoring & Education",
    description: "Частни уроци, подготовка за изпити и курсове",
    icon: "/images/categories/uroci.png",
    color: "#F39C12",
    subcategories: [
      { id: "matematika", name: "Математика", slug: "matematika", icon: "📐" },
      { id: "angliyski-ezik", name: "Английски език", slug: "angliyski-ezik", icon: "🇬🇧" },
      { id: "nemski-ezik", name: "Немски език", slug: "nemski-ezik", icon: "🇩🇪" },
      { id: "balgarski-ezik-i-literatura", name: "Български език и литература", slug: "balgarski-ezik-i-literatura", icon: "📖" },
      { id: "fizika-i-himiya", name: "Физика и химия", slug: "fizika-i-himiya", icon: "🧪" },
      { id: "programirane", name: "Програмиране", slug: "programirane", icon: "💻" },
      { id: "muzikalni-instrumenti", name: "Музикални инструменти", slug: "muzikalni-instrumenti", icon: "🎹" },
      { id: "podgotovka-za-maturi", name: "Подготовка за матури и кандидатстване", slug: "podgotovka-za-maturi", icon: "🎓" },
    ],
  },
`;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
      file.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  // 1. Сваляне на снимката
  fs.mkdirSync(path.dirname(IMAGE_PATH), { recursive: true });
  if (fs.existsSync(IMAGE_PATH)) {
    console.log("⚠️  Снимката вече съществува — пропускам свалянето.");
  } else {
    await download(IMAGE_URL, IMAGE_PATH);
    console.log("✅ Снимка свалена:", IMAGE_PATH, `(${(fs.statSync(IMAGE_PATH).size / 1024).toFixed(0)} KB)`);
  }

  // 2. Обновяване на icon в базата
  const p = new PrismaClient();
  try {
    const r = await p.category.update({
      where: { id: 27 },
      data: { icon: ICON_DB_PATH, updatedAt: new Date() },
    });
    console.log("✅ Базата обновена, icon:", r.icon);
  } finally {
    await p.$disconnect();
  }

  // 3. Вмъкване в constants.ts
  const cPath = "lib/constants.ts";
  let t = fs.readFileSync(cPath, "utf8");
  if (t.includes('"uroci-i-obuchenie"')) {
    console.log("⚠️  constants.ts вече съдържа категорията — пропускам.");
    return;
  }
  const anchor = t.indexOf('id: "klimatici-new"');
  if (anchor < 0) throw new Error("Не намерих анкера klimatici-new в constants.ts");
  const braceIdx = t.lastIndexOf("{", anchor);
  const lineStart = t.lastIndexOf("\n", braceIdx) + 1;
  t = t.slice(0, lineStart) + NEW_BLOCK + t.slice(lineStart);
  fs.writeFileSync(cPath, t, "utf8");
  console.log("✅ constants.ts обновен — категорията е вмъкната преди 'Климатици'.");

  console.log("\n🎉 Готово! Провери с: npm run build");
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
