// lib/email.ts

const RESEND_API_KEY = process.env.RESEND_API_KEY!
const FROM_EMAIL = 'ProZona <admin@prozona.bg>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@prozona.bg'

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
  }
}

// Имейл до ADMIN при нова регистрация на специалист
export async function sendNewSpecialistNotification({
  specialistName,
  specialistEmail,
  city,
  category,
  specialistId,
}: {
  specialistName: string
  specialistEmail: string
  city: string
  category: string
  specialistId: string
}) {
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🆕 Нов специалист чака одобрение — ${specialistName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1DB954; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">ProZona — Нов специалист</h1>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333;">Нов специалист се е регистрирал и чака одобрение:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px; color: #666; width: 140px;">Име:</td>
              <td style="padding: 8px; font-weight: bold; color: #333;">${specialistName}</td>
            </tr>
            <tr style="background: #eee;">
              <td style="padding: 8px; color: #666;">Имейл:</td>
              <td style="padding: 8px; color: #333;">${specialistEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #666;">Град:</td>
              <td style="padding: 8px; color: #333;">${city}</td>
            </tr>
            <tr style="background: #eee;">
              <td style="padding: 8px; color: #666;">Категория:</td>
              <td style="padding: 8px; color: #333;">${category}</td>
            </tr>
          </table>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://www.prozona.bg/bg/admin/specialists" 
               style="background: #1DB954; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Прегледай и одобри →
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

// Имейл до СПЕЦИАЛИСТА — потвърждение за получена заявка
export async function sendSpecialistRegistrationConfirmation({
  specialistEmail,
  specialistName,
}: {
  specialistEmail: string
  specialistName: string
}) {
  await sendEmail({
    to: specialistEmail,
    subject: 'Заявката ти е получена — ProZona',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1DB954; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Добре дошъл в ProZona!</h1>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333;">Здравей, <strong>${specialistName}</strong>!</p>
          <p style="color: #555;">Заявката ти за регистрация като специалист е получена успешно.</p>
          <p style="color: #555;">Нашият екип ще прегледа профила ти и ще получиш потвърждение в рамките на <strong>24 часа</strong>.</p>
          <div style="background: #e8f8ee; border-left: 4px solid #1DB954; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333;">📌 Можеш да влезеш в профила си и да допълниш информацията докато чакаш одобрение.</p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://www.prozona.bg/bg/specialist/dashboard" 
               style="background: #1DB954; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Виж профила си →
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">ProZona.bg — Намери специалист близо до теб</p>
        </div>
      </div>
    `,
  })
}

// Имейл до СПЕЦИАЛИСТА — одобрен профил
export async function sendSpecialistApprovedEmail({
  specialistEmail,
  specialistName,
}: {
  specialistEmail: string
  specialistName: string
}) {
  await sendEmail({
    to: specialistEmail,
    subject: '✅ Профилът ти е одобрен — ProZona',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1DB954; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Профилът ти е одобрен! 🎉</h1>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333;">Здравей, <strong>${specialistName}</strong>!</p>
          <p style="color: #555;">Профилът ти в ProZona е одобрен и вече е видим за клиентите.</p>
          <p style="color: #555;">Можеш да започнеш да получаваш запитвания от клиенти в твоя град.</p>
          <div style="background: #e8f8ee; border-left: 4px solid #1DB954; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333;">💡 Съвет: Добави снимки на работата си за да привлечеш повече клиенти!</p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://www.prozona.bg/bg/specialist/dashboard" 
               style="background: #1DB954; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Към таблото →
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">ProZona.bg — Намери специалист близо до теб</p>
        </div>
      </div>
    `,
  })
}