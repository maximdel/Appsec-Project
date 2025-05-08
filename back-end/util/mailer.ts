import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        // allow self-signed certs (optional)
        rejectUnauthorized: false,
    },
    connectionTimeout: 15_000,
});

transporter
    .verify()
    .then(() => console.log('SMTP connection OK'))
    .catch((err) => console.error('SMTP connection FAILED', err));

export async function sendMail(opts: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
    });
}
