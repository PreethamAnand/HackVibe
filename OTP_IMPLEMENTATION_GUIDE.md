# OTP-Based Email Verification Implementation Guide

## 🎯 **Overview**

This guide explains how to implement the new OTP-based email verification system for the HackVibe 2025 registration page. The system now uses 6-digit OTP codes instead of verification links.

## ✨ **New Features**

- **6-digit OTP codes** sent via email
- **Real-time verification** on the registration page
- **1-minute resend cooldown** to prevent spam
- **Enhanced security** with time-limited codes
- **Better user experience** with immediate feedback

## 🔄 **Updated Verification Flow**

### **Step 1: User Enters Email**
1. User enters team leader email address
2. Clicks "Send OTP Code" button
3. System generates 6-digit OTP code
4. Email is sent with OTP code

### **Step 2: User Enters OTP**
1. User receives email with 6-digit code
2. User enters code in the OTP input field
3. Clicks "Verify OTP Code" button
4. System validates the code

### **Step 3: Verification Complete**
1. If OTP matches, verification is successful
2. User can proceed to next registration step
3. If OTP doesn't match, error is shown
4. User can request new OTP after 1-minute cooldown

## 🚀 **Implementation Steps**

### **1. Update Supabase Edge Function**

Replace your existing edge function with the new OTP version:

```bash
# Navigate to your Supabase project
cd supabase/functions

# Create or update the swift-task function
# Copy the content from: supabase-edge-function-otp.ts
```

**File: `supabase/functions/swift-task/index.ts`**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY'
const FROM_EMAIL = 'team@hackvibe.in'

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
      })
    }

    const { email, teamName, verificationToken } = await req.json()
    
    // Email template with OTP code
    const emailData = {
      personalizations: [{
        to: [{ email: email }],
        subject: `Your HackVibe 2025 OTP Code - ${teamName} Team Registration`
      }],
      from: { email: FROM_EMAIL },
      content: [{
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
              
              <!-- 6-Digit OTP Code Section -->
              <div style="background: #f8f9fa; border: 2px solid #667eea; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Your 6-Digit OTP Code</h3>
                <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 10px 0; display: inline-block;">
                  <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${verificationToken}</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Enter this 6-digit code in the registration page to verify your email</p>
              </div>
              
              <div style="background: #e8f4fd; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">How to verify:</h4>
                <ol style="color: #666; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>Go back to the registration page</li>
                  <li>Enter the 6-digit OTP code above in the verification field</li>
                  <li>Click "Verify OTP Code"</li>
                  <li>Once verified, you can proceed with your registration</li>
                </ol>
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4 style="color: #333; margin: 0 0 10px 0; font-size: 14px;">⚠️ Important Security Notice:</h4>
                <ul style="color: #666; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>This OTP code will expire in 24 hours</li>
                  <li>Never share this code with anyone</li>
                  <li>If you didn't request this code, please ignore this email</li>
                </ul>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  <strong>Event Details:</strong><br>
                  📅 Date: September 11th, 2025<br>
                  📍 Venue: Vignan Institute of Technology and Science<br>
                  🎯 Near Ramoji Film City, Deshmuki Village<br>
                  📧 Contact: vgnt@hackvibe.in
                </p>
              </div>
              
              <div style="margin-top: 20px; text-align: center;">
                <p style="color: #666; margin: 0;">Best regards,<br><strong>HackVibe Team</strong></p>
              </div>
            </div>
          </div>
        `
      }]
    }
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`SendGrid API error: ${response.status} - ${errorData}`)
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP email sent successfully via SendGrid',
        verificationToken,
        emailSent: true,
        fromEmail: FROM_EMAIL,
        toEmail: email,
        otpCode: verificationToken
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-client-trace-id'
        }
      }
    )
  } catch (error) {
    console.error('❌ Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send OTP email' 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-client-trace-id'
        }
      }
    )
  }
})
```

### **2. Deploy the Edge Function**

```bash
# Deploy to Supabase
supabase functions deploy swift-task

# Or if you're using the Supabase CLI
supabase functions deploy swift-task --project-ref YOUR_PROJECT_REF
```

### **3. Update Environment Variables**

Make sure your SendGrid API key is configured in your Supabase project:

```bash
# Set environment variables in Supabase
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here
```

### **4. Test the Implementation**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the OTP flow:**
   - Go to the registration page
   - Enter an email address
   - Click "Send OTP Code"
   - Check your email for the 6-digit code
   - Enter the code in the OTP field
   - Click "Verify OTP Code"

3. **Test the resend functionality:**
   - Wait for the 1-minute cooldown
   - Click "Resend OTP Code"
   - Verify you receive a new code

## 🔧 **Code Changes Summary**

### **RegistrationPage.tsx Changes:**

1. **New State Variables:**
   ```typescript
   const [otpCode, setOtpCode] = useState<string>('');
   const [otpSent, setOtpSent] = useState(false);
   const [resendCooldown, setResendCooldown] = useState(0);
   const [canResend, setCanResend] = useState(true);
   ```

2. **Resend Cooldown Timer:**
   ```typescript
   useEffect(() => {
     let interval: NodeJS.Timeout;
     if (resendCooldown > 0) {
       interval = setInterval(() => {
         setResendCooldown(prev => {
           if (prev <= 1) {
             setCanResend(true);
             return 0;
           }
           return prev - 1;
         });
       }, 1000);
     }
     return () => {
       if (interval) clearInterval(interval);
     };
   }, [resendCooldown]);
   ```

3. **OTP Generation:**
   ```typescript
   const otp = Math.floor(100000 + Math.random() * 900000).toString();
   ```

4. **Updated UI Components:**
   - OTP input field with 6-digit validation
   - Resend button with countdown timer
   - Enhanced status messages
   - Better user instructions

### **supabase.ts Changes:**

1. **Updated sendVerificationEmail function** to handle OTP codes
2. **Enhanced error handling** for OTP verification
3. **Improved logging** for debugging

## 🎨 **UI/UX Improvements**

### **Visual Enhancements:**
- **Monospace font** for OTP input field
- **Centered text** with letter spacing
- **Real-time validation** feedback
- **Countdown timer** for resend button
- **Clear instructions** for users

### **User Experience:**
- **Immediate feedback** on OTP entry
- **1-minute cooldown** prevents spam
- **Clear error messages** for invalid codes
- **Step-by-step instructions** in email
- **Professional email template** with branding

## 🔒 **Security Features**

1. **6-digit OTP codes** - harder to guess than shorter codes
2. **Time-limited codes** - expire after 24 hours
3. **Resend cooldown** - prevents abuse
4. **Input validation** - only accepts numeric input
5. **Secure email delivery** - via SendGrid

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **OTP not received:**
   - Check spam folder
   - Verify email address is correct
   - Check SendGrid API key configuration

2. **Edge function errors:**
   - Check Supabase function logs
   - Verify environment variables
   - Test function locally first

3. **Resend not working:**
   - Wait for 1-minute cooldown
   - Check browser console for errors
   - Verify email validation

### **Debug Steps:**

1. **Check browser console** for error messages
2. **Verify edge function logs** in Supabase dashboard
3. **Test email delivery** with a test email address
4. **Check network requests** in browser dev tools

## 📧 **Email Template Features**

The new email template includes:

- **Professional HackVibe branding**
- **Large, easy-to-read OTP code**
- **Step-by-step instructions**
- **Security warnings**
- **Event details**
- **Responsive design**

## 🚀 **Production Deployment**

1. **Update edge function** in production Supabase project
2. **Set environment variables** for SendGrid
3. **Test thoroughly** with real email addresses
4. **Monitor logs** for any issues
5. **Update documentation** for users

## 📋 **Testing Checklist**

- [ ] OTP generation works correctly
- [ ] Email is sent with 6-digit code
- [ ] OTP input field accepts only numbers
- [ ] Verification works with correct code
- [ ] Error message shows for incorrect code
- [ ] Resend button has 1-minute cooldown
- [ ] UI updates correctly for all states
- [ ] Email template looks professional
- [ ] Mobile responsiveness works
- [ ] Error handling works properly

## 🎉 **Success Metrics**

After implementation, you should see:

- **Improved user engagement** with immediate feedback
- **Reduced support requests** due to clearer instructions
- **Better security** with time-limited codes
- **Enhanced user experience** with professional UI
- **Faster verification process** compared to link-based system

---

**Need Help?** If you encounter any issues during implementation, check the troubleshooting section above or contact the development team.
