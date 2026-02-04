import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_name, user_email, subject, message } = body;

        // Basic validation
        if (!user_name || !user_email || !subject || !message) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Configure transporter with environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: `"${user_name}" <${process.env.SMTP_USER}>`, // Gmail usually rewrites this to the auth user, but setting a display name helps
            to: process.env.SMTP_USER, // Send to yourself
            replyTo: user_email, // Allow replying directly to the sender
            subject: `Portfolio Contact: ${subject}`,
            text: `
Name: ${user_name}
Email: ${user_email}
Subject: ${subject}

Message:
${message}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${user_name}</p>
                    <p><strong>Email:</strong> ${user_email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; color: #555;">${message}</p>
                </div>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: 'Email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('SMTP Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email. Please check server logs.' },
            { status: 500 }
        );
    }
}
