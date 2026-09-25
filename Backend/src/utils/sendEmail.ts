
import { Resend } from "resend";
import { env } from "../config/env";
import { logger } from "./logger";

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });
    if (error) logger.error("sendEmail failed:", error);
  } catch (error) {
    
    logger.error("sendEmail failed:", error);
  }
};