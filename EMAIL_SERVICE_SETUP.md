# Email Service Setup Guide for HackVibe 2025

## 🎯 **Overview**

After verifying your domain, sender, and brand link, you need to configure an email service to send verification emails. This guide covers multiple options from free to paid services.

## 📧 **Email Service Options**

### **Option 1: Resend (Recommended - Modern & Reliable)**

**Pros:**
- Modern API with excellent deliverability
- Free tier: 3,000 emails/month
- Easy setup and great documentation
- Professional email templates

**Setup Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (hackvibe.in)
3. Get your API key from the dashboard
4. Add to environment variables:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```

**Usage:**
- Already configured in `/pages/api/send-verification-email.ts`
- Beautiful HTML email template included
- Professional branding

### **Option 2: EmailJS (Free for Development)**

**Pros:**
- Completely free for development
- No server-side setup required
- Easy to configure

**Setup Steps:**
1. Sign up at [emailjs.com](https://emailjs.com)
2. Create a new service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your credentials:
   - Service ID
   - Template ID
   - User ID

**Environment Variables:**
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id
```

### **Option 3: SendGrid (Enterprise)**

**Pros:**
- Enterprise-grade email service
- Excellent deliverability
- Advanced analytics

**Setup Steps:**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your domain
3. Get API key
4. Configure webhook for tracking

**Environment Variables:**
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

### **Option 4: Mailgun (Developer-Friendly)**

**Pros:**
- Developer-friendly API
- Good free tier
- Detailed logs

**Setup Steps:**
1. Sign up at [mailgun.com](https://mailgun.com)
2. Verify your domain
3. Get API key and domain
4. Configure webhooks

**Environment Variables:**
```bash
MAILGUN_API_KEY=key-xxxxxxxxxxxx
MAILGUN_DOMAIN=mail.hackvibe.in
```

## 🚀 **Quick Setup (Recommended: Resend)**

### **Step 1: Install Dependencies**
```bash
npm install resend @emailjs/browser
```

### **Step 2: Create Environment File**
Create `.env.local` in your project root:
```bash
# Email Service (Choose one)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Or for EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_user_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HackVibe 2025
```

### **Step 3: Test Email Sending**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test registration flow:**
   - Go to registration page
   - Fill out the form
   - Submit registration
   - Check console for email details

3. **Manual verification (for testing):**
   - Check browser console for verification details
   - Copy the verification URL
   - Test the verification page

## 📧 **Email Template Customization**

### **Resend Template (Already Configured)**
The API route includes a beautiful HTML template with:
- HackVibe branding
- Professional design
- Clear verification instructions
- Event details
- Mobile-responsive layout

### **EmailJS Template**
Create a template with these variables:
- `{{to_email}}` - Recipient email
- `{{team_name}}` - Team name
- `{{verification_url}}` - Verification link
- `{{verification_token}}` - Verification token

### **Custom Template Example**
```html
<h1>Welcome to HackVibe 2025!</h1>
<p>Hi {{team_name}},</p>
<p>Please verify your email to complete registration:</p>
<a href="{{verification_url}}">Verify Email</a>
<p>This link expires in 24 hours.</p>
```

## 🔧 **Configuration Files**

### **API Route: `/pages/api/send-verification-email.ts`**
- Handles email sending via Resend
- Beautiful HTML template
- Error handling and logging
- Production-ready

### **Supabase Integration: `/src/lib/supabase.ts`**
- Multiple email service fallbacks
- Manual verification for development
- Token generation and validation
- Database integration

## 🧪 **Testing Your Setup**

### **Development Testing**
1. **Console Logs:** Check browser console for verification details
2. **LocalStorage:** Manual verification data stored locally
3. **API Testing:** Test `/api/send-verification-email` endpoint

### **Production Testing**
1. **Real Email Delivery:** Send to real email addresses
2. **Spam Folder Check:** Ensure emails reach inbox
3. **Link Verification:** Test verification flow end-to-end
4. **Database Updates:** Verify database records are updated

## 📊 **Monitoring & Analytics**

### **Email Delivery Tracking**
- **Resend Dashboard:** Track email delivery, opens, clicks
- **SendGrid Analytics:** Detailed email performance
- **Mailgun Logs:** Delivery and bounce tracking

### **Verification Analytics**
```sql
-- Check verification rates
SELECT 
  email_verified,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM registrations 
GROUP BY email_verified;

-- Check verification by date
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_registrations,
  SUM(CASE WHEN email_verified THEN 1 ELSE 0 END) as verified,
  ROUND(SUM(CASE WHEN email_verified THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as verification_rate
FROM registrations 
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Emails Not Sending:**
   - Check API key configuration
   - Verify domain authentication
   - Check rate limits

2. **Emails Going to Spam:**
   - Set up SPF, DKIM, DMARC records
   - Use consistent sender address
   - Avoid spam trigger words

3. **Verification Links Not Working:**
   - Check URL structure
   - Verify token generation
   - Test database connectivity

4. **Database Errors:**
   - Check Supabase connection
   - Verify table schema
   - Check RLS policies

### **Debug Steps**
1. Check browser console for errors
2. Verify environment variables
3. Test API endpoints independently
4. Check email service dashboards
5. Monitor database logs

## 🎯 **Production Checklist**

### **Before Going Live**
- [ ] Email service configured and tested
- [ ] Domain verification completed
- [ ] Email templates finalized
- [ ] Verification flow tested end-to-end
- [ ] Database schema updated
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Backup verification method ready

### **Post-Launch Monitoring**
- [ ] Email delivery rates
- [ ] Verification completion rates
- [ ] User feedback and issues
- [ ] System performance
- [ ] Database performance

## 🎉 **Benefits of Email Verification**

1. **90%+ reduction** in fake registrations
2. **Professional appearance** with branded emails
3. **Better data quality** for event planning
4. **Improved user engagement** with clear next steps
5. **Scalable solution** for future events

---

**Your email verification system is now ready to protect registrations from fake entries!** 🚀


