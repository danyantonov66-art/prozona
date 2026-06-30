require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const TEST_RECIPIENT = 'danyantonov66@gmail.com'; 

const FROM = 'ProZona <office@prozona.bg>';

const SUBJECT = 'Нова функция в ProZona: AI генератор на оферти';

const HTML_BODY = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #ffffff; padding: 40px; border-radius: 12px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: #1DB954; padding: 12px 24px; border-radius: 8px;">
        <span style="color: #0D0D1A; font-size: 24px; font-weight: bold;">PZ ProZona</span>
      </div>
    </div>
    <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">
      Здравей! Ново в твоя акаунт
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

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('ГРЕШКА: RESEND_API_KEY липсва в .env');
    process.exit(1);
  }

  console.log(`Изпращам тестов имейл до ${TEST_RECIPIENT} ...`);

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: TEST_RECIPIENT,
      subject: SUBJECT,
      html: HTML_BODY,
    });

    if (result.error) {
      console.error('ГРЕШКА от Resend:', result.error);
      process.exit(1);
    }

    console.log('УСПЕХ! Имейл изпратен.');
    console.log('Resend ID:', result.data && result.data.id);
  } catch (err) {
    console.error('ГРЕШКА:', err);
    process.exit(1);
  }
}

main();
