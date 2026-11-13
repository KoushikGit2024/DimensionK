import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const CONTACT_RECIPIENT_EMAIL =
  process.env.CONTACT_RECIPIENT_EMAIL || "koushikkar712@gmail.com";

