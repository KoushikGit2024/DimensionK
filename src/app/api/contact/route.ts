import { NextResponse } from "next/server";
import { ContactTransmissionSchema } from "@/schemas/contact";
import { resend, CONTACT_RECIPIENT_EMAIL } from "@/lib/email/resend";

// In-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a minute before transmitting again." },
        { status: 429 }
      );
    }

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
      return NextResponse.json({ message: "Transmission acknowledged." }, { status: 200 });
    }

    // Check if Resend API key is configured
    if (!resend) {
      // In development or when no key is set yet, log securely to console and return success
      console.log("-----------------------------------------");
      console.log("[Observatory Contact API] Local Fallback Delivery:");
      console.log(`From: ${senderName} <${senderEmail}>`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log("-----------------------------------------");

      return NextResponse.json(
        {
          success: true,
          message: "Transmission received and logged to local terminal. (Configure RESEND_API_KEY in .env.local for live inbox delivery).",
        },
        { status: 200 }
      );
    }

    // Dispatch email via Resend
    const { error } = await resend.emails.send({
      from: "Dimension-K Transmission <onboarding@resend.dev>",
      to: [CONTACT_RECIPIENT_EMAIL],
      replyTo: senderEmail,
      subject: `[Dimension-K] ${subject}`,
      html: `
        <div style="font-family: sans-serif; background: #0c1018; color: #ece7dc; padding: 32px; border-radius: 8px;">
          <h2 style="color: #38f2e6; margin-top: 0;">New Transmission Received</h2>
          <p style="font-size: 14px; color: #a3a8b3;">
            <strong>Sender:</strong> ${senderName} (<a href="mailto:${senderEmail}" style="color: #f0a35e;">${senderEmail}</a>)<br/>
            <strong>Topic:</strong> ${subject}
          </p>
          <div style="background: rgba(255,255,255,0.04); border-left: 3px solid #f0a35e; padding: 16px; margin: 20px 0; font-size: 15px; line-height: 1.6;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
          <p style="font-size: 12px; color: #747c8e; font-family: monospace; margin-bottom: 0;">
            DIMENSION-K OBSERVATORY // DIRECT DISPATCH
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

