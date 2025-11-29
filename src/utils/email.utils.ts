import nodemailer from "nodemailer";
import { config } from "../config/config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    // Email options
    const mailOptions = {
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error to prevent registration/operation failure due to email issues
  }
};

/**
 * Generate event registration confirmation email
 */
export const generateEventRegistrationEmail = (
  userName: string,
  eventTitle: string,
  eventDate: Date,
  eventTime: string,
  eventLocation: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .event-details { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Event Registration Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${userName},</p>
          <p>Thank you for registering for our event. Your registration has been confirmed!</p>
          
          <div class="event-details">
            <h2>${eventTitle}</h2>
            <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
          </div>
          
          <p>We look forward to seeing you at the event!</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Virtual Event Management Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
