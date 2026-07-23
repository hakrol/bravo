import "server-only";

type ContactEmailInput = {
  name: string;
  email: string;
  message: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";

export class ContactEmailError extends Error {
  constructor(readonly status?: number) {
    super("Kunne ikke sende kontakthenvendelsen.");
    this.name = "ContactEmailError";
  }
}

export async function sendContactEmail(input: ContactEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !toEmail || !fromEmail) {
    throw new ContactEmailError();
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
      "User-Agent": "lonnsinnsikt-contact/1.0",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: input.email,
      subject: "Ny henvendelse fra kontaktskjemaet",
      text: [
        "Ny henvendelse fra kontaktskjemaet på Lønnsinnsikt",
        "",
        `Navn: ${input.name}`,
        `E-post: ${input.email}`,
        "",
        "Melding:",
        input.message,
      ].join("\n"),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ContactEmailError(response.status);
  }
}
