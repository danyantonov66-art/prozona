const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

p.category
  .update({
    where: { id: 27 },
    data: { image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" },
  })
  .then((r) => console.log("OK:", r.image))
  .catch((e) => console.error("❌", e))
  .finally(() => p.$disconnect());
