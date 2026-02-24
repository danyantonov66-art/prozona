// emails/NewInquiryEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components';

interface NewInquiryEmailProps {
  specialistName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  message: string;
  inquiryLink: string;
}

export default function NewInquiryEmail({
  specialistName,
  clientName,
  clientEmail,
  clientPhone,
  message,
  inquiryLink,
}: NewInquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ново запитване от клиент в ProZona</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ProZona</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h1}>Здравейте, {specialistName}!</Heading>
            
            <Text style={paragraph}>
              Получихте ново запитване от клиент през платформата ProZona.
            </Text>
            
            <Section style={infoBox}>
              <Text style={infoText}><strong>👤 Клиент:</strong> {clientName}</Text>
              <Text style={infoText}><strong>📧 Имейл:</strong> {clientEmail}</Text>
              {clientPhone && (
                <Text style={infoText}><strong>📞 Телефон:</strong> {clientPhone}</Text>
              )}
            </Section>
            
            <Section style={messageBox}>
              <Text style={infoText}><strong>💬 Съобщение:</strong></Text>
              <Text style={messageText}>{message}</Text>
            </Section>
            
            <Section style={buttonContainer}>
              <Button href={inquiryLink} style={button}>
                                Отговори на запитването
              </Button>
            </Section>
            
            <Hr style={hr} />
            
            <Text style={footer}>
              Това е автоматично съобщение от ProZona. Моля, не отговаряйте на този имейл.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  backgroundColor: '#0D0D1A',
  padding: '20px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#1DB954',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '0 48px',
};

const h1 = {
  color: '#0D0D1A',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 20px',
};

const paragraph = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.4',
  margin: '0 0 20px',
};

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const messageBox = {
  backgroundColor: '#f0f3f7',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const infoText = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '5px 0',
};

const messageText = {
  color: '#0D0D1A',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '10px 0 0',
  fontStyle: 'italic',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#1DB954',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '20px',
};