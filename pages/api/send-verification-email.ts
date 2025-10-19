import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, teamName, verificationUrl } = req.body;

    if (!email || !teamName || !verificationUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // SendGrid email configuration
    const msg = {
      to: email,
      from: 'noreply@hackvibe.in', // Make sure this domain is verified in SendGrid
      subject: 'Verify Your HackVibe 2025 Registration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your HackVibe 2025 Registration</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to HackVibe 2025!</h1>
              <p>Verify your email to complete your registration</p>
            </div>
            <div class="content">
              <h2>Hi ${teamName}!</h2>
              <p>Thank you for registering for <strong>HackVibe 2025</strong>! To complete your registration and activate your unique code, please verify your email address.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">✅ Verify Email Address</a>
              </div>
              
              <div class="highlight">
                <strong>⚠️ Important:</strong> This verification link expires in 24 hours. If you don't verify your email within this time, you'll need to contact the organizing team.
              </div>
              
              <h3>What happens next?</h3>
              <ul>
                <li>Click the verification button above</li>
                <li>Your email will be verified instantly</li>
                <li>Your registration will become active</li>
                <li>You'll receive event details via email</li>
              </ul>
              
              <p><strong>Event Details:</strong></p>
              <ul>
                <li>📅 Date: September 11th, 2025</li>
                <li>📍 Venue: Vignan Institute of Technology and Science</li>
                <li>🎯 Near Ramoji Film City, Deshmuki Village</li>
                <li>📧 Contact: vgnt@hackvibe.in</li>
              </ul>
              
              <p>If you have any questions, feel free to reach out to our organizing team.</p>
              
              <p>Best regards,<br>The HackVibe 2025 Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email} for HackVibe 2025 registration verification.</p>
              <p>If you didn't register for HackVibe 2025, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await sgMail.send(msg);

    console.log('Email sent successfully via SendGrid');
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('SendGrid error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
