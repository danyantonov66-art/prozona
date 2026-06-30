require('dotenv').config();

const key = process.env.RESEND_API_KEY || '';
console.log('Дължина на ключа:', key.length);
console.log('Първи 12 символа:', key.slice(0, 12));
console.log('Последни 6 символа:', key.slice(-6));
console.log('Има ли скрити whitespace/newline накрая:', JSON.stringify(key.slice(-10)));
