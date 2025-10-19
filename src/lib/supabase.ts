import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrcwryrygoopvaksvenv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY3dyeXJ5Z29vcHZha3N2ZW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzE5MzgsImV4cCI6MjA3MDg0NzkzOH0.j4Apd0CeL8o_AQsY4U3gzIcZqBv9RzbVJYEIG8gHSaQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Registration data interface
export interface RegistrationData {
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_tshirt_size: string;
  college_name: string;
  team_name: string;
  member2_name: string;
  member2_email: string;
  member2_phone: string;
  member2_tshirt_size: string;
  member3_name: string;
  member3_email: string;
  member3_phone: string;
  member3_tshirt_size: string;
  utr_number: string;
  account_holder_name: string;
  project_idea?: string;
  ip_address?: string;
  payment_screenshot_path?: string;
  email_verified?: boolean;
  verification_token?: string;
  verification_expires_at?: string;
}



// Create and download registration details as PDF-like formatted file
export function downloadRegistrationDetails(registrationData: RegistrationData) {
  try {
    console.log('📄 Starting download process...', { registrationData });
    
    // Create HTML content for better formatting
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HackVibe 2025 Registration Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
        }
        .header {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }

        .section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section h3 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .member {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #667eea;
        }
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #e9ecef;
            border-radius: 10px;
        }
        .important {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 HACKVIBE 2025 - REGISTRATION CONFIRMATION</h1>
        <p>Your registration has been successfully completed!</p>
    </div>



    <div class="section">
        <h3>🏫 TEAM INFORMATION</h3>
        <p><strong>Team Name:</strong> ${registrationData.team_name}</p>
        <p><strong>College:</strong> ${registrationData.college_name}</p>
    </div>

    <div class="section">
        <h3>👥 TEAM MEMBERS</h3>
        
        <div class="member">
            <h4>👑 Team Leader</h4>
            <p><strong>Name:</strong> ${registrationData.leader_name}</p>
            <p><strong>Email:</strong> ${registrationData.leader_email}</p>
            <p><strong>Phone:</strong> ${registrationData.leader_phone}</p>
            <p><strong>T-Shirt Size:</strong> ${registrationData.leader_tshirt_size}</p>
        </div>

        <div class="member">
            <h4>👤 Member 2</h4>
            <p><strong>Name:</strong> ${registrationData.member2_name}</p>
            <p><strong>Email:</strong> ${registrationData.member2_email}</p>
            <p><strong>Phone:</strong> ${registrationData.member2_phone}</p>
            <p><strong>T-Shirt Size:</strong> ${registrationData.member2_tshirt_size}</p>
        </div>

        <div class="member">
            <h4>👤 Member 3</h4>
            <p><strong>Name:</strong> ${registrationData.member3_name}</p>
            <p><strong>Email:</strong> ${registrationData.member3_email}</p>
            <p><strong>Phone:</strong> ${registrationData.member3_phone}</p>
            <p><strong>T-Shirt Size:</strong> ${registrationData.member3_tshirt_size}</p>
        </div>
    </div>

    <div class="section">
        <h3>💳 PAYMENT DETAILS</h3>
        <p><strong>UTR Number:</strong> ${registrationData.utr_number}</p>
        <p><strong>Account Holder:</strong> ${registrationData.account_holder_name}</p>
        <p><strong>Amount:</strong> ₹600</p>
        <p><strong>Payment Status:</strong> ✅ Confirmed</p>
    </div>

    ${registrationData.project_idea ? `
    <div class="section">
        <h3>💡 PROJECT IDEA</h3>
        <p>${registrationData.project_idea}</p>
    </div>
    ` : ''}

    <div class="important">
        <h3>📋 IMPORTANT REMINDERS</h3>
        <ul>
            <li>🆔 Bring a valid ID proof to the event</li>
            <li>📅 <strong>Event Date:</strong> September 11th, 2025</li>
            <li>📍 <strong>Venue:</strong> Vignan Institute of Technology and Science</li>
            <li>💰 <strong>Registration Fee:</strong> ₹600 (already paid)</li>
        </ul>
    </div>

    <div class="footer">
        <p>🎉 Thank you for registering for HackVibe 2025!</p>
        <p>For any queries, contact the organizing team.</p>
        <p><small>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</small></p>
    </div>
</body>
</html>`;

    console.log('📝 HTML content generated, creating blob...');
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    console.log('🔗 URL created:', url);
    
  const a = document.createElement('a');
  a.href = url;
    a.download = `HackVibe_Registration_${registrationData.team_name.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    a.style.display = 'none';
    
    console.log('📥 Download filename:', a.download);
    
  document.body.appendChild(a);
  a.click();
    
    console.log('✅ Download triggered');
    
    // Cleanup
    setTimeout(() => {
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
      console.log('🧹 Cleanup completed');
    }, 100);
    
  } catch (error) {
    console.error('❌ Download failed:', error);
    alert('Download failed. Please try again or contact support.');
  }
}

// Generate 6-digit OTP code
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email using Supabase Edge Functions
export async function sendVerificationEmail(email: string, teamName: string, verificationToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Method 1: Use Supabase Edge Function for OTP
    try {
      console.log('🚀 Calling Edge Function: swift-task');
      console.log('📧 Request data:', { email, teamName, verificationToken });
      
      const { data, error } = await supabase.functions.invoke('swift-task', {
        body: {
          email,
          teamName,
          verificationToken
        }
      });
      
      console.log('📡 Edge Function response:', { data, error });
      
      if (error) {
        console.error('❌ Edge Function error:', error);
        throw error;
      }
      
      if (data?.success) {
        console.log('✅ OTP email sent successfully via Edge Function!');
        return { success: true };
      } else {
        console.error('❌ Edge Function returned failure:', data);
        throw new Error(`Edge Function returned: ${data?.error || 'Unknown failure'}`);
      }
    } catch (edgeFunctionError) {
      console.error('❌ Edge Function failed:', edgeFunctionError);
      
      // Fallback to manual verification for now
      console.log('🔄 Falling back to manual verification...');
      
      // Store verification details in localStorage for manual verification
      const verificationData = {
        email,
        teamName,
        token: verificationToken,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('pendingVerification', JSON.stringify(verificationData));
      
      // Show manual verification instructions
      console.log('=== OTP VERIFICATION DETAILS ===');
      console.log('Email:', email);
      console.log('Team Name:', teamName);
      console.log('OTP Code:', verificationToken);
      console.log('Manual Verification: Enter the 6-digit OTP code above in the registration page');
      console.log('=====================================');
      
      return { success: true };
    }
    
    // Method 2: Fallback - Send email using EmailJS (free service)
    // You can sign up at https://www.emailjs.com/ for free
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      try {
        const templateParams = {
          to_email: email,
          team_name: teamName,
          verification_token: verificationToken
        };
        
        await (window as any).emailjs.send(
          'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
          'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
          templateParams,
          'YOUR_USER_ID' // Replace with your EmailJS user ID
        );
        
        return { success: true };
      } catch (emailjsError) {
        console.log('EmailJS failed, using manual verification');
      }
    }
    
    // Method 3: Manual verification (for immediate testing)
    // Store verification details in localStorage for manual verification
    const verificationData = {
      email,
      teamName,
      token: verificationToken,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('pendingVerification', JSON.stringify(verificationData));
    
    // Show manual verification instructions
    console.log('=== OTP VERIFICATION DETAILS ===');
    console.log('Manual Verification: Enter the 6-digit OTP code below in the registration page');
    console.log('Email:', email);
    console.log('Team Name:', teamName);
    console.log('OTP Code:', verificationToken);
    console.log('=====================================');
    
    // For immediate testing, you can manually verify by:
    // 1. Copy the OTP code above
    // 2. Enter it in the registration page OTP field
    // 3. Click "Verify OTP Code"
    
    return { success: true };
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: 'Failed to send OTP email' };
  }
}

// Verify OTP code (simple client-side verification)
export async function verifyOTPCode(enteredOTP: string, expectedOTP: string): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    // Simple OTP verification - compare entered code with expected code
    if (enteredOTP === expectedOTP) {
        return { 
          success: true, 
          data: { 
          verified: true,
          message: 'OTP verification successful'
        } 
      };
    } else {
      return { 
        success: false, 
        error: 'Invalid OTP code. Please check and try again.' 
      };
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    return { success: false, error: 'OTP verification failed' };
  }
}



// Check for duplicates
export async function checkDuplicate(field: string, value: string) {
  const { data, error } = await supabase
    .from('registrations')
    .select('id')
    .eq(field, value)
    .limit(1);
  
  if (error) {
    console.error('Duplicate check error:', error);
    return { exists: false, error: error.message };
  }
  
  return { exists: data && data.length > 0, error: null };
}

// Real-time validation for specific fields
export async function validateFieldUniqueness(field: string, value: string): Promise<{ isUnique: boolean; error?: string }> {
  if (!value || value.trim() === '') {
    return { isUnique: true };
  }

  try {
    const result = await checkDuplicate(field, value);
    if (result.error) {
      return { isUnique: false, error: result.error };
    }
    return { isUnique: !result.exists };
  } catch (error) {
    console.error('Validation error:', error);
    return { isUnique: false, error: 'Validation failed. Please try again.' };
  }
}

// Validate UTR uniqueness
export async function validateUTRUniqueness(utr: string): Promise<{ isUnique: boolean; error?: string }> {
  return validateFieldUniqueness('utr_number', utr);
}

// Validate email uniqueness (checks all email fields)
export async function validateEmailUniqueness(email: string): Promise<{ isUnique: boolean; error?: string }> {
  if (!email || email.trim() === '') {
    return { isUnique: true };
  }

  try {
    // Check against all email fields in the database
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .or(`leader_email.eq.${email},member2_email.eq.${email},member3_email.eq.${email}`)
      .limit(1);
    
    if (error) {
      console.error('Email validation error:', error);
      return { isUnique: false, error: error.message };
    }
    
    return { isUnique: !(data && data.length > 0) };
  } catch (error) {
    console.error('Email validation error:', error);
    return { isUnique: false, error: 'Email validation failed. Please try again.' };
  }
}

// Validate phone uniqueness (checks all phone fields)
export async function validatePhoneUniqueness(phone: string): Promise<{ isUnique: boolean; error?: string }> {
  if (!phone || phone.trim() === '') {
    return { isUnique: true };
  }

  try {
    // Check against all phone fields in the database
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .or(`leader_phone.eq.${phone},member2_phone.eq.${phone},member3_phone.eq.${phone}`)
      .limit(1);
    
    if (error) {
      console.error('Phone validation error:', error);
      return { isUnique: false, error: error.message };
    }
    
    return { isUnique: !(data && data.length > 0) };
  } catch (error) {
    console.error('Phone validation error:', error);
    return { isUnique: false, error: 'Phone validation failed. Please try again.' };
  }
}

// Validate team name uniqueness (case-insensitive)
export async function validateTeamNameUniqueness(teamName: string): Promise<{ isUnique: boolean; error?: string }> {
  if (!teamName || teamName.trim() === '') {
    return { isUnique: true };
  }

  try {
    // Use case-insensitive comparison with ILIKE
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .ilike('team_name', teamName)
      .limit(1);
    
    if (error) {
      console.error('Team name validation error:', error);
      return { isUnique: false, error: error.message };
    }
    
    return { isUnique: !(data && data.length > 0) };
  } catch (error) {
    console.error('Team name validation error:', error);
    return { isUnique: false, error: 'Team name validation failed. Please try again.' };
  }
}

// Upload payment screenshot to Supabase Storage
export async function uploadPaymentScreenshot(file: File, teamName: string) {
  const timestamp = new Date().getTime();
  const fileName = `payment_${teamName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${file.name.split('.').pop()}`;
  const filePath = fileName; // Remove subfolder since bucket is specifically for payment screenshots
  
  const { data, error } = await supabase.storage
    .from('payment-screenshort')
    .upload(filePath, file);
  
  if (error) {
    console.error('File upload error:', error);
    return { success: false, error: error.message, path: null };
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('payment-screenshort')
    .getPublicUrl(filePath);
  
  return { success: true, error: null, path: filePath, url: urlData.publicUrl };
}

// Submit registration
export async function submitRegistration(data: RegistrationData) {
  try {
    const { data: result, error } = await supabase
      .from('registrations')
      .insert([data])
      .select();
    
    if (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message, data: null };
    }
    
    return { success: true, error: null, data: result };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred', data: null };
  }
}