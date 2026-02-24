// app/api/inquiry/route.ts (добави тези редове)

import { Resend } from 'resend';
import NewInquiryEmail from '@/emails/NewInquiryEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// ... в POST функцията, след като създадеш запитването:

// Изпрати имейл до специалиста
if (specialist.user?.email) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@prozona.bg',
      to: specialist.user.email,
      subject: 'Ново запитване в ProZona',
      react: NewInquiryEmail({
        specialistName: specialist.user.name,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        message,
        inquiryLink: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/specialist/inquiries`,
      }),
    });
    console.log('✅ Имейл изпратен до специалиста');
  } catch (emailError) {
    console.error('❌ Грешка при изпращане на имейл:', emailError);
    // Не спирай процеса дори имейлът да не успее
  }
}