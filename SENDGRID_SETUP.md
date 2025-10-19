# SendGrid Setup for HackVibe 2025 Email Verification

## 🎯 **Overview**

Your email verification system is now configured to use SendGrid. Follow these steps to complete the setup.

## 📧 **Step 1: Create Environment File**

Create a file named `.env.local` in your project root (`FINAL/FINAL/.env.local`) with your SendGrid API key:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HackVibe 2025

# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://mrcwryrygoopvaksvenv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY3dyeXJ5Z29vcHZha3N2ZW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzE5MzgsImV4cCI6MjA3MDg0NzkzOH0.j4Apd0CeL8o_AQsY4U3gzIcZqBv9RzbVJYEIG8gHSaQ
```

## 🔑 **Step 2: Get Your SendGrid API Key**

1. **Log into your SendGrid account** at [sendgrid.com](https://sendgrid.com)
2. **Go to Settings → API Keys**
3. **Create a new API Key** with "Mail Send" permissions
4. **Copy the API key** (starts with `SG.`)
5. **Replace `SG.your_actual_sendgrid_api_key_here`** with your actual API key

## 🌐 **Step 3: Verify Your Domain**

1. **In SendGrid dashboard, go to Settings → Sender Authentication**
2. **Click "Authenticate Your Domain"**
3. **Enter your domain:** `hackvibe.in`
4. **Add the DNS records** provided by SendGrid to your domain
5. **Wait for verification** (can take up to 48 hours)

## 📧 **Step 4: Configure Sender Email**

The system is configured to send from `noreply@hackvibe.in`. Make sure this email is verified in SendGrid:

1. **Go to Settings → Sender Authentication**
2. **Click "Verify a Single Sender"**
3. **Add:** `noreply@hackvibe.in`
4. **Complete verification process**

## 🚀 **Step 5: Test Your Setup**

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test email sending:**
   - Go to registration page
   - Fill out the form
   - Submit registration
   - Check your email inbox

3. **Check console logs** for SendGrid status

## 🧪 **Quick Test**

You can also test the email API directly:

1. **Open browser console**
2. **Run this test:**
   ```javascript
   fetch('/api/send-verification-email', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'your-email@example.com',
       teamName: 'Test Team',
       verificationUrl: 'http://localhost:3000/verify-email?token=test123'
     })
   }).then(r => r.json()).then(console.log)
   ```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"API Key Invalid"**
   - Check your API key is correct
   - Ensure API key has "Mail Send" permissions

2. **"Sender Not Verified"**
   - Verify your domain in SendGrid
   - Add DNS records as instructed

3. **"Email Not Delivered"**
   - Check spam folder
   - Verify sender email is authenticated
   - Check SendGrid activity logs

### **SendGrid Dashboard Monitoring:**

- **Activity → Mail** - See email delivery status
- **Settings → Mail Settings** - Configure delivery settings
- **Settings → Sender Authentication** - Manage verified senders

## 📊 **Expected Results**

After setup, when someone registers:

1. ✅ **Registration data saved** to Supabase
2. ✅ **Verification email sent** via SendGrid
3. ✅ **Email arrives in inbox** (not spam)
4. ✅ **User clicks verification link**
5. ✅ **Registration becomes active**

## 🎉 **Benefits of SendGrid**

- **Professional email delivery**
- **Detailed analytics and logs**
- **High deliverability rates**
- **Spam protection**
- **Email templates support**

---

**Your SendGrid email verification system is ready!** 🚀

Once you add your API key to `.env.local`, restart the server and test the registration flow.


