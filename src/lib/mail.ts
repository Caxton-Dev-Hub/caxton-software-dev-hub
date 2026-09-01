import "server-only";

/**
 * Transactional email.
 * With RESEND_API_KEY unset, emails are logged to the server console so local
 * development works without an email provider.
 */

type Mail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendMail(mail: Mail): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "Caxton Software Dev Hub <onboarding@resend.dev>";

  if (!apiKey) {
    console.info(
      [
        "",
        "──────── email (not sent: RESEND_API_KEY unset) ────────",
        `To:      ${mail.to}`,
        `Subject: ${mail.subject}`,
        "",
        mail.text,
        "────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return { delivered: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      reply_to: mail.replyTo,
    }),
  });

  if (!response.ok) {
    console.error("Email delivery failed", await response.text());
    return { delivered: false };
  }
  return { delivered: true };
}

export const salesInbox = process.env.MAIL_TO_SALES ?? "hello@caxtondevhub.xyz";
