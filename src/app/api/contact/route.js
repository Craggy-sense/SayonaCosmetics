import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { contact_name, contact_phone, contact_email, contact_subject, contact_message } = await request.json();

    // Validate required fields
    if (!contact_name || !contact_phone || !contact_message) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Configure cPanel SMTP transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certificates (common on cPanel self-signed SSLs)
        rejectUnauthorized: false
      }
    });

    const mailSubject = `[Sayona Contact] ${contact_subject || 'New Storefront Inquiry'}`;
    const mailBody = `You have received a new message from the Sayona Storefront contact form:

Name: ${contact_name}
Phone: ${contact_phone}
Email: ${contact_email || 'Not provided'}

Message:
${contact_message}
`;

    // Send email via cPanel mail server
    await transporter.sendMail({
      from: `"${contact_name}" <${process.env.SMTP_USER}>`, // Send from auth user to align with SPF/DKIM
      to: process.env.SMTP_TO || process.env.SMTP_USER, // Route to destination email address
      replyTo: contact_email || undefined,
      subject: mailSubject,
      text: mailBody,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you! Your message has been sent successfully.' 
    });
  } catch (error) {
    console.error('SMTP Email Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Sorry, there was a technical error sending your message. Please contact us on WhatsApp directly.' 
      },
      { status: 500 }
    );
  }
}
