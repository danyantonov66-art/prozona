const fs = require('fs');
let c = fs.readFileSync('app/api/auth/register/route.ts', 'utf8');

const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('await prisma.specialistCategory.create({') && 
      lines[i-1] && lines[i-1].includes('})')) {
    lines.splice(i, 0, '          if (dbSubcategory) {');
    // намери затварящата скоба и добави } след нея
    for (let j = i+1; j < lines.length; j++) {
      if (lines[j].trim() === '})' && lines[j+1] && lines[j+1].trim() === '}') {
        lines[j] = '          })';
        lines.splice(j+1, 0, '          }');
        break;
      }
    }
    break;
  }
}

fs.writeFileSync('app/api/auth/register/route.ts', lines.join('\n'), 'utf8');
console.log('done');