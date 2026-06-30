const fs = require('fs');
let content = fs.readFileSync('app/[locale]/specialists/[id]/page.tsx', 'utf8');

content = content.replace(
  '  const canonicalUrl = `https://prozona.bg/bg/specialists/\\$\\{id\\}`',
  '  const canonicalUrl = `https://prozona.bg/bg/specialist/${specialist.slug || id}`'
);

fs.writeFileSync('app/[locale]/specialists/[id]/page.tsx', content);
const lines = fs.readFileSync('app/[locale]/specialists/[id]/page.tsx', 'utf8').split('\n');
console.log(lines[30]);
