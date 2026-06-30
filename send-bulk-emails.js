require('dotenv').config();
const fs = require('fs');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'ProZona <office@prozona.bg>';
const SUBJECT = 'Нова функция в ProZona: AI генератор на оферти';

// Колко милисекунди пауза между всеки имейл (Resend rate limit: 5 req/s -> 250ms е безопасно)
const DELAY_MS = 300;

function htmlFor(name) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #ffffff; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: #1DB954; padding: 12px 24px; border-radius: 8px;">
          <span style="color: #0D0D1A; font-size: 24px; font-weight: bold;">PZ ProZona</span>
        </div>
      </div>
      <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">
        Здравей, ${name}! Ново в твоя акаунт
      </h1>
      <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
        Добавихме нова функция в твоя <strong style="color: #1DB954;">ProZona</strong> акаунт — генератор на професионални оферти.
      </p>
      <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Описваш накратко работата, и за 30 секунди получаваш готова, добре структурирана оферта, която можеш веднага да изпратиш на клиента.
      </p>
      <div style="background: #151528; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 18px; margin-right: 12px;">✅</span>
          <span style="color: #ffffff; font-size: 15px;">Готова оферта за 30 секунди</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 18px; margin-right: 12px;">✅</span>
          <span style="color: #ffffff; font-size: 15px;">Изпращаш като текст или PDF</span>
        </div>
        <div style="display: flex; align-items: center;">
          <span style="font-size: 18px; margin-right: 12px;">✅</span>
          <span style="color: #ffffff; font-size: 15px;">Само за Premium специалисти</span>
        </div>
      </div>
      <p style="color: #cccccc; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        Намираш я в <strong style="color: #1DB954;">Моето табло → Табло на специалист → Оферти</strong>.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.prozona.bg/bg/specialist/offers"
          style="background: #1DB954; color: #0D0D1A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
          Изпробвай сега →
        </a>
      </div>
      <p style="color: #666; font-size: 13px; text-align: center; margin-top: 32px;">
        Ако имаш въпроси, пиши ни на <a href="mailto:office@prozona.bg" style="color: #1DB954;">office@prozona.bg</a>
      </p>
      <p style="color: #444; font-size: 12px; text-align: center;">
        ProZona.bg — Платформата за професионални услуги в България
      </p>
    </div>
  `;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('ГРЕШКА: RESEND_API_KEY липсва в .env');
    process.exit(1);
  }

  if (!fs.existsSync('specialists-list.json')) {
    console.error('ГРЕШКА: specialists-list.json не съществува. Пусни първо list-specialists.js');
    process.exit(1);
  }

  const specialists = JSON.parse(fs.readFileSync('specialists-list.json', 'utf8'));

  // Поддръжка на --dry-run флаг за тест без реално изпращане
  const dryRun = process.argv.includes('--dry-run');
  // Поддръжка на --limit=N за тест с малък брой
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : specialists.length;

  const toSend = specialists.slice(0, limit);

  console.log(`Общо специалисти: ${specialists.length}`);
  console.log(`Ще изпратя до: ${toSend.length}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('---');

  const results = { sent: [], failed: [], skipped: [] };

  for (let i = 0; i < toSend.length; i++) {
    const sp = toSend[i];

    if (!sp.email || !sp.email.includes('@')) {
      console.log(`[${i + 1}/${toSend.length}] ПРОПУСНАТ (невалиден email): ${sp.name}`);
      results.skipped.push(sp);
      continue;
    }

    const displayName = (sp.name || 'специалист').trim();

    if (dryRun) {
      console.log(`[${i + 1}/${toSend.length}] (dry-run) Бих изпратил до ${sp.email} (${displayName})`);
      results.sent.push(sp);
      continue;
    }

    try {
      const result = await resend.emails.send({
        from: FROM,
        to: sp.email,
        subject: SUBJECT,
        html: htmlFor(displayName),
      });

      if (result.error) {
        console.log(`[${i + 1}/${toSend.length}] ГРЕШКА за ${sp.email}: ${JSON.stringify(result.error)}`);
        results.failed.push({ ...sp, error: result.error });
      } else {
        console.log(`[${i + 1}/${toSend.length}] ИЗПРАТЕН до ${sp.email} (${displayName}) — ID: ${result.data?.id}`);
        results.sent.push(sp);
      }
    } catch (err) {
      console.log(`[${i + 1}/${toSend.length}] ИЗКЛЮЧЕНИЕ за ${sp.email}: ${err.message}`);
      results.failed.push({ ...sp, error: err.message });
    }

    await sleep(DELAY_MS);
  }

  console.log('---');
  console.log(`Успешно изпратени: ${results.sent.length}`);
  console.log(`Неуспешни: ${results.failed.length}`);
  console.log(`Пропуснати (без email): ${results.skipped.length}`);

  fs.writeFileSync('bulk-email-results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Пълен резултат записан в bulk-email-results.json');
}

main();
