import { z } from "zod";

export const ContactTransmissionSchema = z.object({
  senderName: z.string().min(2, "Name must be at least 2 characters").max(80),
  senderEmail: z.string().email("Please provide a valid return email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Transmission message must be at least 10 characters").max(3000),
  // Honeypot field for bot spam filtering (must be empty)
  transmissionVector: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export type ContactTransmission = z.infer<typeof ContactTransmissionSchema>;

