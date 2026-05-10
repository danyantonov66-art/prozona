const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || require('../.env.local').RESEND_API_KEY);

async function main() {
  // Вземи .env.local ръчно ако няма process.env
  require('dotenv').config({ path: '.env.local' });
  const resendClient = new Resend(process.env.RESEND_API_KEY);

  const specialists = await prisma.specialist.findMany({
    where: { 
      verified: true,
      subscriptionPlan: 'PREMIUM'
    },
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: { user: true }
  });

  console.log(`Намерени ${specialists.length} специалисти за имейл`);

  let sent = 0;
  let failed = 0;

  for (const s of specialists) {
    const email = s.user?.email;
    const name = s.user?.name || 'Специалист';
    const profileUrl = `https://www.prozona.bg/bg/specialist/${s.id}`;
    const dashboardUrl = `https://www.prozona.bg/bg/specialist/dashboard`;

    if (!email) {
      console.log(`✗ Пропуснат ${s.id} — няма имейл`);
      continue;
    }

    try {
      await resendClient.emails.send({
        from: 'ProZona <office@prozona.bg>',
        to: email,
        subject: '🎁 Вашият ProZona профил е активиран + 6 месеца Premium безплатно',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #ffffff; padding: 40px; border-radius: 12px;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: #1DB954; padding: 12px 24px; border-radius: 8px;">
                <span style="color: #0D0D1A; font-size: 24px; font-weight: bold;">ProZona</span>
              </div>
            </div>

            <h1 style="color: #1DB954; font-size: 26px; margin-bottom: 16px;">Здравей, ${name}! 👋</h1>

            <p style="color: #cccccc; font-size: 16px; line-height: 1.7; margin-bottom: 16px;">
              Благодарим ти, че се регистрира в <strong style="color: #1DB954;">ProZona.bg</strong> — платформата, която свързва специалисти с клиенти в цяла България.
            </p>

            <p style="color: #cccccc; font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
              Искаме да се извиним за забавянето при активирането на профила ти. Работихме усилено по подобряването на платформата и днес с радост ти съобщаваме, че всичко е готово!
            </p>

            <div style="background: #1a2e1a; border: 1px solid #1DB954; border-radius: 12px; padding: 24px; margin-bottom: 28px; text-align: center;">
              <p style="color: #1DB954; font-size: 20px; font-weight: bold; margin: 0 0 8px;">🎁 6 месеца Premium — безплатно!</p>
              <p style="color: #cccccc; font-size: 14px; margin: 0;">
                Като един от първите 200 специалисти в ProZona, получаваш <strong style="color: #1DB954;">6 месеца Premium абонамент напълно безплатно.</strong>
              </p>
            </div>

            <p style="color: #aaaaaa; font-size: 15px; line-height: 1.7; margin-bottom: 8px;">С Premium профила си получаваш:</p>
            <ul style="color: #cccccc; font-size: 14px; line-height: 2; margin-bottom: 28px; padding-left: 20px;">
              <li>✅ По-висока позиция в резултатите от търсене</li>
              <li>✅ Верификационен badge на профила</li>
              <li>✅ Приоритетно показване пред клиенти</li>
              <li>✅ Достъп до всички запитвания в твоя град</li>
              <li>✅ Галерия с до 20 снимки</li>
            </ul>

            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${dashboardUrl}" style="display: inline-block; background: #1DB954; color: #0D0D1A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-bottom: 12px;">
                Влез в таблото си →
              </a>
              <br/>
              <a href="${profileUrl}" style="color: #1DB954; font-size: 13px; text-decoration: underline;">
                Виж публичния си профил
              </a>
            </div>

            <hr style="border: 1px solid #333; margin: 28px 0;" />

            <p style="color: #888; font-size: 13px; line-height: 1.6; text-align: center;">
              Имаш въпроси? Пиши ни на 
              <a href="mailto:office@prozona.bg" style="color: #1DB954;">office@prozona.bg</a>
              <br/>
              ProZona.bg — Намери специалист. Стани специалист.
            </p>

          </div>
        `
      });

      sent++;
      console.log(`✓ Изпратен до ${email} (${name})`);

      // Пауза 300ms между имейли за да не hit-нем rate limit
      await new Promise(r => setTimeout(r, 300));

    } catch (err) {
      failed++;
      console.log(`✗ Грешка за ${email}: ${err.message}`);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Изпратени: ${sent}`);
  console.log(`❌ Грешки:    ${failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());