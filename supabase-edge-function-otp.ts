import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SENDGRID_API_KEY = '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';
const FROM_EMAIL = 'vgnt@hackvibe.in';

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-client-trace-id'
        }
      });
    }

    const { email, teamName, verificationToken } = await req.json();
    console.log(' Sending OTP email to:', email);
    console.log(' OTP code:', verificationToken);

    const emailData = {
      personalizations: [
        {
          to: [{ email: email }],
          subject: `Your HackVibe 2025 OTP Code - ${teamName} Team Registration`
        }
      ],
      from: {
        email: FROM_EMAIL,
        name: 'HackVibe'
      },
      content: [
        {
          type: 'text/html',
          value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; text-align: center;">HackVibe 2025</h1>
              <p style="margin: 10px 0 0 0; text-align: center; opacity: 0.9;">Email Verification OTP</p>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hello from Team ${teamName}!</h2>
              <p style="color: #666; line-height: 1.6;">Thank you for registering for HackVibe 2025! To complete your registration, please use the OTP code below to verify your email address.</p>
              
              <!-- OTP Code Section -->
              <div style="background: #f8f9fa; border: 2px solid #667eea; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Your 6-Digit OTP Code</h3>
                <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; display: inline-block;">
                  <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${verificationToken}</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Enter this 6-digit code in the registration page to verify your email</p>
              </div>
              
              <!-- Instructions -->
              <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">How to verify:</h4>
                <ol style="color: #666; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>Return to the registration page</li>
                  <li>Enter the 6-digit OTP code above in the verification field</li>
                  <li>Click "Verify OTP Code"</li>
                  <li>Once verified, you can proceed with your registration</li>
                </ol>
              </div>
              
              <!-- Security Notice -->
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">⚠️ Important Security Notice:</h4>
                <ul style="color: #666; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>This OTP code will expire in 24 hours</li>
                  <li>Never share this code with anyone</li>
                  <li>If you didn't request this code, please ignore this email</li>
                </ul>
              </div>
              
              <!-- Event Details -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  <strong>Event Details:</strong><br>
                  📅 Date: September 11th, 2025<br>
                  📍 Venue: Vignan Institute of Technology and Science<br>
                  🎯 Near Ramoji Film City, Deshmuki Village<br>
                  📧 Contact: vgnt@hackvibe.in
                </p>
              </div>

              <!-- WhatsApp Group CTA -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://chat.whatsapp.com/GWz6UpADG2W83ndEeCO7Dc?mode=ac_t"
                   style="background-color: #25D366; 
                          color: white; 
                          padding: 14px 24px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px;
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  💬 Join our WhatsApp Group
                </a>
                <p style="color: #666; font-size: 13px; margin-top: 10px;">
                  Stay updated with announcements and get instant support from the HackVibe Team.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 20px; text-align: center;">
                <p style="color: #666; margin: 0;">Best regards,<br><strong>HackVibe Team</strong></p>
              </div>
            </div>
          </div>
        `
        }
      ]
    };

    console.log('📤 Sending OTP email via SendGrid...');
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    console.log('📡 SendGrid response status:', response.status);
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ SendGrid error:', errorData);
      throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
    }

    console.log('✅ OTP email sent successfully via SendGrid');
    return new Response(JSON.stringify({
      success: true,
      message: 'OTP email sent successfully via SendGrid',
      verificationToken,
      emailSent: true,
      fromEmail: FROM_EMAIL,
      toEmail: email,
      otpCode: verificationToken
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-client-trace-id'
      }
    });
  } catch (error) {
    console.error('❌ Function error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to send OTP email'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-client-trace-id'
      }
    });
  }
});
