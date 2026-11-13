import { NextResponse } from "next/server";
import { ContactTransmissionSchema } from "@/schemas/contact";
import { resend, CONTACT_RECIPIENT_EMAIL } from "@/lib/email/resend";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = ContactTransmissionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { senderName, senderEmail, subject, message, transmissionVector } = result.data;

    // Honeypot spam defense check
    if (transmissionVector && transmissionVector.length > 0) {
      return NextResponse.json({ message: "Message received." }, { status: 200 });
    }

    // Escape HTML to prevent injection in email clients
    const safeSenderName = escapeHtml(senderName);
    const safeSenderEmail = escapeHtml(senderEmail);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    // Check if Resend API key is configured
    if (!resend) {
      console.log("-----------------------------------------");
      console.log("[Contact API] Local Fallback Delivery:");
      console.log(`From: ${senderName} <${senderEmail}>`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log("-----------------------------------------");

      return NextResponse.json(
        {
          success: true,
          message: "Message received and logged locally. Set RESEND_API_KEY for live delivery.",
        },
        { status: 200 }
      );
    }

    // Dispatch email via Resend
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [CONTACT_RECIPIENT_EMAIL],
      replyTo: senderEmail,
      subject: `[Portfolio] ${safeSubject}`,
      html: `
        <div style="font-family: sans-serif; background: #0c1018; color: #ece7dc; padding: 32px; border-radius: 8px;">
          <h2 style="color: #38f2e6; margin-top: 0;">New Message Received</h2>
          <p style="font-size: 14px; color: #a3a8b3;">
            <strong>Sender:</strong> ${safeSenderName} (<a href="mailto:${safeSenderEmail}" style="color: #f0a35e;">${safeSenderEmail}</a>)<br/>
            <strong>Topic:</strong> ${safeSubject}
          </p>
          <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #f0a35e; padding: 16px; margin: 20px 0; font-size: 15px; line-height: 1.6;">
            ${safeMessage}
          </div>
          <p style="font-size: 12px; color: #747c8e; font-family: monospace; margin-bottom: 0;">
            DIMENSION-K PORTFOLIO // DIRECT DISPATCH
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend API Error]:", error);
      return NextResponse.json(
        { error: "Failed to dispatch email transmission through provider." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Transmission successfully delivered to station inbox." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Contact API Exception]:", err);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}

