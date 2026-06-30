const fs = require('fs');
const path = require('path');

const filePath = path.join('app', '[locale]', 'specialist', 'dashboard', 'page.tsx');

let content = fs.readFileSync(filePath, 'utf8');
const usesCRLF = content.includes('\r\n');

// Нормализираме към \n за надеждно търсене/замяна, връщаме \r\n накрая ако трябва
let normalized = content.replace(/\r\n/g, '\n');

const before = normalized;

if (normalized.includes('href="/bg/specialist/offers"')) {
  console.log('Картата "Оферти" вече съществува в файла — нищо не променям.');
  process.exit(0);
}

// 1. Смяна на grid-cols-4 на grid-cols-5 (само реда с бързите действия, не stats реда който вече е 5)
const oldGrid = '<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">';
const newGrid = '<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">';

if (!normalized.includes(oldGrid)) {
  console.error('ГРЕШКА: Не намерих очаквания grid div (4 колони). Файлът може вече да е променен.');
  process.exit(1);
}
normalized = normalized.replace(oldGrid, newGrid);

// 2. Добавяне на новата карта "Оферти" след картата "Купи кредити"
const anchor = [
  '          <Link href="/bg/specialist/buy-credits"',
  '            className="rounded-xl border border-white/10 bg-[#151528] p-4 text-center hover:border-[#1DB954]/40 transition">',
  '            <div className="text-2xl mb-1">🪙</div>',
  '            <div className="text-sm font-medium">Купи кредити</div>',
  '          </Link>',
].join('\n');

if (!normalized.includes(anchor)) {
  console.error('ГРЕШКА: Не намерих картата "Купи кредити" с очаквания формат.');
  console.error('Първите 300 символа около "buy-credits":');
  const idx = normalized.indexOf('buy-credits');
  if (idx >= 0) {
    console.error(JSON.stringify(normalized.slice(Math.max(0, idx - 150), idx + 250)));
  }
  process.exit(1);
}

const newCard = anchor + '\n' +
  '          <Link href="/bg/specialist/offers"\n' +
  '            className="rounded-xl border border-[#1DB954]/30 bg-[#151528] p-4 text-center hover:border-[#1DB954]/60 transition relative">\n' +
  '            <div className="absolute -top-2 -right-2 rounded-full bg-[#1DB954] px-2 py-0.5 text-[10px] font-bold text-black">\n' +
  '              Ново\n' +
  '            </div>\n' +
  '            <div className="text-2xl mb-1">📋</div>\n' +
  '            <div className="text-sm font-medium">Оферти</div>\n' +
  '          </Link>';

normalized = normalized.replace(anchor, newCard);

if (normalized === before) {
  console.error('ГРЕШКА: Нищо не се промени.');
  process.exit(1);
}

const finalContent = usesCRLF ? normalized.replace(/\n/g, '\r\n') : normalized;

fs.writeFileSync(filePath + '.backup', content, 'utf8');
fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('УСПЕХ: Добавена е картата "Оферти" в dashboard-а.');
console.log('Бекъп на оригинала: ' + filePath + '.backup');
