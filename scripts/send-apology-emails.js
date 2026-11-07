// scripts/send-apology-emails.js
// Изпраща извинителни имейли през Resend от office@prozona.bg.
//
// Сухо пускане (само показва, не праща):  node scripts/send-apology-emails.js
// Реално изпращане:                         node scripts/send-apology-emails.js --send

const fs = require('fs')
const path = require('path')

// Минимално зареждане на .env.local и .env (без допълнителни пакети)
function loadEnv(file) {
  const p = path.join(process.cwd(), file)
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let value = m[2]
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value
  }
}
loadEnv('.env.local')
loadEnv('.env')

const { Resend } = require('resend')

const SEND = process.argv.includes('--send')
const FROM = 'ProZona <office@prozona.bg>'
const PAID_CREDITS = 15
const COMPENSATION_CREDITS = 5 // трябва да съвпада със SQL-а в Neon

const recipients = [
  { firstName: 'Ирина', email: 'info@mcleanandrepair.eu', paidOn: '24 септември' },
  { firstName: 'Хаят', email: 'hayat.nesheli1986@gmail.com', paidOn: '20 август' },
]

function buildText(r) {
  return [
    `Здравей, ${r.firstName},`,
    '',
    `Благодарим ти, че плати на ${r.paidOn} за кредити в ProZona. Поради техническа грешка при потвърждаването на плащането кредитите не бяха добавени автоматично, и се извиняваме, че не го забелязахме по-рано.`,
    '',
    `Вече е поправено. В профила ти са добавени платените ${PAID_CREDITS} кредита, а като извинение за забавянето добавихме и още ${COMPENSATION_CREDITS} кредита. Можеш да ги видиш в таблото си.`,
    '',
    'Ако видиш нещо нередно или имаш въпрос, отговори на това съобщение и ще се погрижим.',
    '',
    'Поздрави,',
    'Екипът на ProZona',
  ].join('\n')
}

function buildHtml(r) {
  const p = (t) => `<p style="margin:0 0 14px 0;line-height:1.5;">${t}</p>`
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#222;max-width:560px;">
${p(`Здравей, ${r.firstName},`)}
${p(`Благодарим ти, че плати на ${r.paidOn} за кредити в ProZona. Поради техническа грешка при потвърждаването на плащането кредитите не бяха добавени автоматично, и се извиняваме, че не го забелязахме по-рано.`)}
${p(`Вече е поправено. В профила ти са добавени платените <strong>${PAID_CREDITS} кредита</strong>, а като извинение за забавянето добавихме и още <strong>${COMPENSATION_CREDITS} кредита</strong>. Можеш да ги видиш в таблото си.`)}
${p('Ако видиш нещо нередно или имаш въпрос, отговори на това съобщение и ще се погрижим.')}
${p('Поздрави,<br>Екипът на ProZona')}
</div>`
}

async function main() {
  const subject = 'ProZona: кредитите ти са добавени, и извинение за забавянето'

  if (!SEND) {
    console.log('=== СУХО ПУСКАНЕ (нищо не се изпраща). За реално изпращане добави --send ===\n')
    for (const r of recipients) {
      console.log(`До: ${r.email}`)
      console.log(`Тема: ${subject}\n`)
      console.log(buildText(r))
      console.log('\n----------------------------------------\n')
    }
    return
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('Не е намерен RESEND_API_KEY в .env.local или .env. Нищо не е изпратено.')
    process.exit(1)
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  for (const r of recipients) {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: r.email,
      replyTo: 'office@prozona.bg',
      subject,
      text: buildText(r),
      html: buildHtml(r),
    })
    if (error) {
      console.error(`ГРЕШКА при ${r.email}:`, error)
    } else {
      console.log(`Изпратено до ${r.email} (id: ${data && data.id})`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
