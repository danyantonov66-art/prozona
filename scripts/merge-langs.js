const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

const NAME = "\u0415\u0437\u0438\u043a\u043e\u0432\u043e \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435";
const DESC = "\u0427\u0430\u0441\u0442\u043d\u0438 \u0443\u0440\u043e\u0446\u0438 \u043f\u043e \u0447\u0443\u0436\u0434\u0438 \u0435\u0437\u0438\u0446\u0438 \u2014 \u0430\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u0438, \u043d\u0435\u043c\u0441\u043a\u0438, \u0438\u0441\u043f\u0430\u043d\u0441\u043a\u0438, \u0444\u0440\u0435\u043d\u0441\u043a\u0438 \u0438 \u0434\u0440\u0443\u0433\u0438. \u0412\u0435\u0440\u0438\u0444\u0438\u0446\u0438\u0440\u0430\u043d\u0438 \u043f\u0440\u0435\u043f\u043e\u0434\u0430\u0432\u0430\u0442\u0435\u043b\u0438 \u0437\u0430 \u0432\u0441\u0438\u0447\u043a\u0438 \u043d\u0438\u0432\u0430.";

async function main() {
  const renamed = await p.subcategory.update({
    where: { id: 237 },
    data: { name: NAME, slug: "ezikovo-obuchenie", description: DESC, updatedAt: new Date() },
  });
  console.log("OK: id 237 renamed ->", renamed.slug);

  const moved = await p.specialistCategory.updateMany({
    where: { subcategoryId: 238 },
    data: { subcategoryId: 237 },
  });
  if (moved.count > 0) console.log("Moved links:", moved.count);

  await p.subcategory.delete({ where: { id: 238 } });
  console.log("OK: id 238 deleted");

  const cPath = "lib/constants.ts";
  let t = fs.readFileSync(cPath, "utf8");
  const enLine = /[ \t]*\{ id: "angliyski-ezik",[^\n]*\n/;
  const deLine = /[ \t]*\{ id: "nemski-ezik",[^\n]*\n/;

  if (!enLine.test(t) || !deLine.test(t)) {
    console.log("WARN: lines not found in constants.ts - check manually");
  } else {
    const newLine = '      { id: "ezikovo-obuchenie", name: "' + NAME + '", slug: "ezikovo-obuchenie", icon: "\uD83C\uDF0D" },\n';
    t = t.replace(enLine, newLine);
    t = t.replace(deLine, "");
    fs.writeFileSync(cPath, t, "utf8");
    console.log("OK: constants.ts updated");
  }
  console.log("DONE");
}

main()
  .catch((e) => { console.error("ERR", e); process.exit(1); })
  .finally(() => p.$disconnect());
