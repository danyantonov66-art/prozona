const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const posts = await p.blogPost.findMany({
    select: { title: true, category: true, published: true },
    orderBy: { category: "asc" },
  });
  const cats = await p.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { id: "asc" },
  });

  console.log("=== BLOG POSTS:", posts.length, "===\n");
  const byCat = {};
  for (const post of posts) {
    const key = post.category || "(null)";
    byCat[key] = byCat[key] || [];
    byCat[key].push((post.published ? "[pub] " : "[draft] ") + post.title);
  }
  for (const key of Object.keys(byCat).sort()) {
    console.log("--- " + key + " (" + byCat[key].length + ") ---");
    byCat[key].forEach((t) => console.log("   " + t));
  }

  console.log("\n=== ACTIVE CATEGORIES:", cats.length, "===\n");
  const blogKeys = Object.keys(byCat).map((k) => k.toLowerCase());
  for (const c of cats) {
    const hasArticles =
      blogKeys.includes(c.slug.toLowerCase()) ||
      blogKeys.includes(c.name.toLowerCase());
    console.log((hasArticles ? "[OK]   " : "[NONE] ") + c.id + " | " + c.name + " | " + c.slug);
  }
  console.log("\nNB: sravnenieto e po slug/ime - ako blog category poleto polzva drugi stoynosti, vij gornoto grupirane.");
}

main()
  .catch((e) => { console.error("ERR", e); process.exit(1); })
  .finally(() => p.$disconnect());
