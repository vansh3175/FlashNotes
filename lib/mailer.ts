import { Resend } from 'resend';

// This check ensures the app fails fast in development if the key is missing.
if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

// Or, if you are sure it's set, you can use a non-null assertion:
// const resend = new Resend(process.env.RESEND_API_KEY!);

const resend = new Resend(process.env.RESEND_API_KEY);

// Define an interface for cleaner props
interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
}

// Use lowercase 'string' for the types
export const sendEmail = async ({ to, subject, text }: SendEmailProps) => {
    const res = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: to,
        subject: subject,
        html: `<p>${text}</p>`
    });
    console.log(res);
};