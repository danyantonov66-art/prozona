const fs = require('fs');
const path = require('path');

const filePath = path.join('app', '[locale]', 'specialist', 'dashboard', 'page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

const before = content;

// 1. Смяна на grid-cols-4 на grid-cols-5 (само за реда с бързите действия)
const oldGrid = '<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">';
const newGrid = '<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">';

if (!content.includes(oldGrid)) {
  console.error('ГРЕШКА: Не намерих очаквания grid div. Файлът може вече да е променен.');
  process.exit(1);
}
content = content.replace(oldGrid, newGrid);

// 2. Добавяне на новата карта "Оферти" след картата "Купи кредити"
const anchor = `<Link href="/bg/specialist/buy-credits"
            className="rounded-xl border border-white/10 bg-[#151528] p-4 text-center hover:border-[#1DB954]/40 transition">
            <div className="text-2xl mb-1">🪙</div>
            <div className="text-sm font-medium">Купи кредити</div>
          </Link>`;

const newCard = `${anchor}
          <Link href="/bg/specialist/offers"
            className="rounded-xl border border-[#1DB954]/30 bg-[#151528] p-4 text-center hover:border-[#1DB954]/60 transition relative">
            <div className="absolute -top-2 -right-2 rounded-full bg-[#1DB954] px-2 py-0.5 text-[10px] font-bold text-black">
              Ново
            </div>
            <div className="text-2xl mb-1">📋</div>
            <div className="text-sm font-medium">Оферти</div>
          </Link>`;

if (!content.includes(anchor)) {
  console.error('ГРЕШКА: Не намерих картата "Купи кредити". Файлът може вече да е променен.');
  process.exit(1);
}

if (content.includes('Генератор на оферти'.normalize()) && content.includes('href="/bg/specialist/offers"')) {
  console.log('Картата "Оферти" вече съществува в файла — нищо не променям.');
  process.exit(0);
}

content = content.replace(anchor, newCard);

if (content === before) {
  console.error('ГРЕШКА: Нищо не се промени.');
  process.exit(1);
}

// Бекъп преди запис
fs.writeFileSync(filePath + '.backup', before, 'utf8');
fs.writeFileSync(filePath, content, 'utf8');

console.log('УСПЕХ: Добавена е картата "Оферти" в dashboard-а.');
console.log('Бекъп на оригинала: ' + filePath + '.backup');
