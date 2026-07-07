const fs = require("fs");
const path = require("path");
const https = require("https");
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

const TARGETS = [
  { match: "IT", fallbackFile: "it.png", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
  { match: "\u041a\u0440\u0430\u0441\u043e\u0442\u0430", fallbackFile: "krasota.png", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error("HTTP " + res.statusCode + " for " + url));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
      file.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  const cats = await p.category.findMany({ where: { isActive: true }, select: { id: true, name: true, icon: true } });

  for (const t of TARGETS) {
    const cat = cats.find((c) => c.name.includes(t.match));
    if (!cat) { console.log("WARN: not found:", t.match); continue; }
    console.log("Category:", cat.id, cat.name, "| icon:", cat.icon || "(empty)");

    let iconPath = cat.icon;
    if (!iconPath || !iconPath.startsWith("/images/")) {
      iconPath = "/images/categories/" + t.fallbackFile;
      await p.category.update({ where: { id: cat.id }, data: { icon: iconPath, updatedAt: new Date() } });
      console.log("  icon set to:", iconPath);
    }

    const localPath = path.join("public", iconPath.replace(/^\//, "").split("/").join(path.sep));
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    if (fs.existsSync(localPath) && fs.statSync(localPath).size > 5000) {
      console.log("  file already exists:", localPath);
      continue;
    }
    await download(t.url, localPath);
    const kb = (fs.statSync(localPath).size / 1024).toFixed(0);
    console.log("  downloaded:", localPath, kb + " KB");
    if (kb < 5) console.log("  WARN: file too small, image may be broken");
  }
  console.log("DONE");
}

main()
  .catch((e) => { console.error("ERR", e); process.exit(1); })
  .finally(() => p.$disconnect());
