const fs = require("fs");
const t = fs.readFileSync("lib/constants.ts", "utf8");

const i = t.search(/klimati/i);
if (i >= 0) {
  console.log(t.slice(Math.max(0, i - 600), i + 1200));
} else {
  console.log("не намерих 'klimati'; дължина на файла:", t.length);
  console.log("--- Първите 1500 символа: ---");
  console.log(t.slice(0, 1500));
}
