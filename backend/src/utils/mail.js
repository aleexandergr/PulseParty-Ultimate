import nodemailer from 'nodemailer';

export async function sendResetEmail(to, resetUrl) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP no configurado; se omite envío real de correo. URL:', resetUrl);
    return { skipped: true, resetUrl };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'PulseParty · Restablece tu contraseña',
    html: `
      <div style="font-family:Arial,sans-serif;background:#0f0f0f;padding:24px;color:#fff">
        <h2>PulseParty</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#7c3aed;color:#fff;text-decoration:none">Restablecer contraseña</a></p>
        <p>Si no fuiste tú, ignora este mensaje.</p>
      </div>
    `,
  });
}
