'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CreditCard,
  Users, 
  User, 
  Mail, 
  Building, 
  Hash, 
  Receipt, 
  FileText,
  Phone,
  Shield,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { FloatingChatBot } from './FloatingChatBot';
import { 
  submitRegistration, 
  checkDuplicate, 
  uploadPaymentScreenshot, 
  RegistrationData,
  validateUTRUniqueness,
  validateEmailUniqueness,
  validatePhoneUniqueness,
  validateTeamNameUniqueness,
  downloadRegistrationDetails,
  sendVerificationEmail,
  verifyOTPCode,
  generateOTPCode
} from '../src/lib/supabase';

// removed unused TeamMember interface

interface FormData {
  // Team Leader Information
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderTshirtSize: string;
  collegeName: string;
  teamName: string;
  
  // Team Members Information
  member2Name: string;
  member2Email: string;
  member2Phone: string;
  member2TshirtSize: string;
  
  member3Name: string;
  member3Email: string;
  member3Phone: string;
  member3TshirtSize: string;
  
  // Payment Information
  utrNumber: string;
  accountHolderName: string;
  paymentScreenshot: File | null;
  projectIdea: string;
}

interface Validation {
  isValid: boolean;
  error: string;
  isChecking: boolean;
  timeoutId?: number;
  isUnique?: boolean;
  uniqueError?: string;
}

interface RegistrationPageProps {
  onBackToHome: () => void;
}

export function RegistrationPage({ onBackToHome }: RegistrationPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [teamLeaderEmail, setTeamLeaderEmail] = useState<string>('');
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  const [validations, setValidations] = useState<{
    emails: Validation[];
    phones: Validation[];
    utr: Validation;
    teamName: Validation;
  }>({
    emails: [
      { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' }, // Leader
      { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' }, // Member 2
      { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' }  // Member 3
    ],
    phones: [
      { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' }, // Leader
      { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' }, // Member 2
      { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' }  // Member 3
    ],
    utr: { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' },
    teamName: { isValid: false, error: '', isChecking: false, isUnique: true, uniqueError: '' }
  });
  
  const [formData, setFormData] = useState<FormData>({
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    leaderTshirtSize: '',
    collegeName: '',
    teamName: '',
    member2Name: '',
    member2Email: '',
    member2Phone: '',
    member2TshirtSize: '',
    member3Name: '',
    member3Email: '',
    member3Phone: '',
    member3TshirtSize: '',
    utrNumber: '',
    accountHolderName: '',
    paymentScreenshot: null,
    projectIdea: ''
  });

  const tshirtSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Resend cooldown timer
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

  // Auto-populate team leader email when step 2 is reached
  useEffect(() => {
    if (currentStep === 2 && teamLeaderEmail && !formData.leaderEmail) {
      setFormData(prev => ({ ...prev, leaderEmail: teamLeaderEmail }));
    }
  }, [currentStep, teamLeaderEmail, formData.leaderEmail]);

  // Send verification email to team leader
  const sendTeamLeaderVerificationEmail = async (email: string) => {
    try {
      setEmailVerificationSent(true);
      setOtpSent(true);
      setCanResend(false);
      setResendCooldown(60); // 1 minute cooldown
      
      // Generate 6-digit OTP
      const otp = generateOTPCode();
      setVerificationToken(otp);
      
      console.log('🔄 Sending OTP email to:', email);
      console.log('🔢 Generated OTP:', otp);
      
      const result = await sendVerificationEmail(email, 'Team Leader', otp);
      
      console.log('📧 Email send result:', result);
      
      if (result.success) {
        setVerificationStatus('pending');
        setTeamLeaderEmail(email);
        // Remove alert - show status in UI instead
      } else {
        setVerificationStatus('failed');
        setOtpSent(false);
        setCanResend(true);
        setResendCooldown(0);
        // Remove alert - show status in UI instead
      }
    } catch (error) {
      console.error('❌ Email verification error:', error);
      setVerificationStatus('failed');
      setOtpSent(false);
      setCanResend(true);
      setResendCooldown(0);
      // Remove alert - show status in UI instead
    }
  };

  // Verify team leader email
  const verifyTeamLeaderEmail = async (token: string) => {
    try {
      const result = await verifyOTPCode(token, verificationToken);
      
      if (result.success) {
        setVerificationStatus('verified');
        setOtpCode('');
        // Don't auto-advance - let user click continue button
      } else {
        setVerificationStatus('failed');
        setOtpCode('');
        // Remove alert - show status in UI instead
      }
    } catch (error) {
      setVerificationStatus('failed');
      setOtpCode('');
      // Remove alert - show status in UI instead
    }
  };

  // Handle OTP code input changes
  const handleOTPChange = (value: string) => {
    setOtpCode(value);
    // Reset verification status to pending when user starts typing new code
    if (verificationStatus === 'failed') {
      setVerificationStatus('pending');
    }
  };



  // Email validation function
  const validateEmail = (email: string): Validation => {
    if (!email) {
      return { isValid: false, error: 'Email is required', isChecking: false };
    }

    // Length constraints
    if (email.length < 5) {
      return { isValid: false, error: 'Email must be at least 5 characters long', isChecking: false };
    }
    if (email.length > 254) {
      return { isValid: false, error: 'Email must be less than 254 characters', isChecking: false };
    }

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address', isChecking: false };
    }

    // Check for common invalid patterns
    if (email.includes('..') || email.includes('__') || email.includes('--')) {
      return { isValid: false, error: 'Email contains invalid consecutive characters', isChecking: false };
    }

    // Allow all email domains - just check basic format
    const domain = email.split('@')[1]?.toLowerCase();
    
    // Basic domain validation - must have at least one dot and valid characters
    if (!domain || !domain.includes('.') || domain.length < 3) {
      return { isValid: false, error: 'Please enter a valid email domain', isChecking: false };
    }
    
    // Check for invalid domain patterns
    if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
      return { isValid: false, error: 'Invalid domain format', isChecking: false };
    }

    return { isValid: true, error: '', isChecking: false };
  };

  // Phone validation function
  const validatePhone = (phone: string): Validation => {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required', isChecking: false };
    }

    // Remove all non-digit characters
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // Check if it's a valid Indian mobile number (10 digits starting with 6,7,8,9)
    if (cleanPhone.length === 10 && /^[6-9][0-9]{9}$/.test(cleanPhone)) {
      return { isValid: true, error: '', isChecking: false };
    }
    
    // Also accept numbers with country code (91)
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      const numberWithoutCode = cleanPhone.substring(2);
      if (/^[6-9][0-9]{9}$/.test(numberWithoutCode)) {
        return { isValid: true, error: '', isChecking: false };
      }
    }
    
    return { isValid: false, error: 'Please enter a valid 10-digit phone number', isChecking: false };
  };

  // UTR validation function
  const validateUTR = (utr: string): Validation => {
    if (!utr) {
      return { isValid: false, error: 'UTR number is required', isChecking: false };
    }

    // Check if it's exactly 12 digits
    if (utr.length !== 12 || !/^\d{12}$/.test(utr)) {
      return { isValid: false, error: 'UTR number must be exactly 12 digits', isChecking: false };
    }

    return { isValid: true, error: '', isChecking: false };
  };

  // Debounced validation with database check
  const debouncedValidation = async (value: string, type: 'email' | 'phone', index: number) => {
    // Clear existing timeout
    if (validations[type === 'email' ? 'emails' : 'phones'][index].timeoutId) {
      clearTimeout(validations[type === 'email' ? 'emails' : 'phones'][index].timeoutId);
    }

    // Set checking state
    setValidations(prev => ({
      ...prev,
      [type === 'email' ? 'emails' : 'phones']: prev[type === 'email' ? 'emails' : 'phones'].map((v, i) => 
        i === index ? { ...v, isChecking: true } : v
      )
    }));

    // Set new timeout
    const timeoutId = setTimeout(async () => {
      const validation = type === 'email' ? validateEmail(value) : validatePhone(value);
      let uniqueCheck = { isUnique: true, uniqueError: '' };

      // Only check uniqueness if basic validation passes and value is not empty
      if (validation.isValid && value.trim() !== '') {
        try {
          const result = type === 'email' 
            ? await validateEmailUniqueness(value)
            : await validatePhoneUniqueness(value);
          
          uniqueCheck = {
            isUnique: result.isUnique,
            uniqueError: result.isUnique ? '' : 'This already exists'
          };
        } catch (error) {
          uniqueCheck = {
            isUnique: false,
            uniqueError: `Failed to validate ${type}. Please try again.`
          };
        }
      }

      setValidations(prev => ({
        ...prev,
        [type === 'email' ? 'emails' : 'phones']: prev[type === 'email' ? 'emails' : 'phones'].map((v, i) => 
          i === index ? { 
            ...validation, 
            ...uniqueCheck,
            isChecking: false,
            timeoutId: undefined 
          } : v
        )
      }));
    }, 800); // Increased delay for database calls

    // Store timeout ID
    setValidations(prev => ({
      ...prev,
      [type === 'email' ? 'emails' : 'phones']: prev[type === 'email' ? 'emails' : 'phones'].map((v, i) => 
        i === index ? { ...v, timeoutId } : v
      )
    }));
  };

  // Debounced UTR validation with database check
  const debouncedUTRValidation = async (utr: string) => {
    // Clear existing timeout
    if (validations.utr.timeoutId) {
      clearTimeout(validations.utr.timeoutId);
    }

    // Set checking state
    setValidations(prev => ({
      ...prev,
      utr: { ...prev.utr, isChecking: true }
    }));

    // Set new timeout
    const timeoutId = setTimeout(async () => {
      const validation = validateUTR(utr);
      let uniqueCheck = { isUnique: true, uniqueError: '' };

      // Only check uniqueness if basic validation passes and value is not empty
      if (validation.isValid && utr.trim() !== '') {
        try {
          const result = await validateUTRUniqueness(utr);
          uniqueCheck = {
            isUnique: result.isUnique,
            uniqueError: result.isUnique ? '' : 'This already exists'
          };
        } catch (error) {
          uniqueCheck = {
            isUnique: false,
            uniqueError: 'Failed to validate UTR. Please try again.'
          };
        }
      }

      setValidations(prev => ({
        ...prev,
        utr: { 
          ...validation, 
          ...uniqueCheck,
          isChecking: false,
          timeoutId: undefined 
        }
      }));
    }, 800);

    // Store timeout ID
    setValidations(prev => ({
      ...prev,
      utr: { ...prev.utr, timeoutId }
    }));
  };

  // Debounced team name validation with database check
  const debouncedTeamNameValidation = async (teamName: string) => {
    // Clear existing timeout
    if (validations.teamName.timeoutId) {
      clearTimeout(validations.teamName.timeoutId);
    }

    // Set checking state
    setValidations(prev => ({
      ...prev,
      teamName: { ...prev.teamName, isChecking: true }
    }));

    // Set new timeout
    const timeoutId = setTimeout(async () => {
      let validation = { isValid: true, error: '' };
      let uniqueCheck = { isUnique: true, uniqueError: '' };

      // Basic validation
      if (!teamName || teamName.trim() === '') {
        validation = { isValid: false, error: 'Team name is required' };
      } else if (teamName.length < 3) {
        validation = { isValid: false, error: 'Team name must be at least 3 characters long' };
      } else if (teamName.length > 50) {
        validation = { isValid: false, error: 'Team name must be less than 50 characters' };
      }

      // Only check uniqueness if basic validation passes
      if (validation.isValid && teamName.trim() !== '') {
        try {
          const result = await validateTeamNameUniqueness(teamName);
          uniqueCheck = {
            isUnique: result.isUnique,
            uniqueError: result.isUnique ? '' : 'This already exists'
          };
        } catch (error) {
          uniqueCheck = {
            isUnique: false,
            uniqueError: 'Failed to validate team name. Please try again.'
          };
        }
      }

      setValidations(prev => ({
        ...prev,
        teamName: { 
          ...validation, 
          ...uniqueCheck,
          isChecking: false,
          timeoutId: undefined 
        }
      }));
    }, 800);

    // Store timeout ID
    setValidations(prev => ({
      ...prev,
      teamName: { ...prev.teamName, timeoutId }
    }));
  };

  const handleEmailChange = (email: string, index: number) => {
    const fieldMap = ['leaderEmail', 'member2Email', 'member3Email'] as const;
    setFormData(prev => ({ ...prev, [fieldMap[index]]: email }));
    debouncedValidation(email, 'email', index);
  };

  const handlePhoneChange = (phone: string, index: number) => {
    const fieldMap = ['leaderPhone', 'member2Phone', 'member3Phone'] as const;
    setFormData(prev => ({ ...prev, [fieldMap[index]]: phone }));
    debouncedValidation(phone, 'phone', index);
  };

  const handleUTRChange = (utr: string) => {
    // Remove all non-digit characters
    const cleanUTR = utr.replace(/[^0-9]/g, '');
    
    // Update form data
    setFormData(prev => ({ ...prev, utrNumber: cleanUTR }));
    
    // Validate UTR with database check
    debouncedUTRValidation(cleanUTR);
  };

  const handleTeamNameChange = (teamName: string) => {
    // Update form data
    setFormData(prev => ({ ...prev, teamName }));
    
    // Validate team name with database check
    debouncedTeamNameValidation(teamName);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    
    try {
      // Check for duplicates before submitting
      console.log('Checking for duplicates...');
      
      const teamNameCheck = await checkDuplicate('team_name', formData.teamName);
      if (teamNameCheck.exists) {
        alert('Team name already exists. Please choose a different name.');
        setIsSubmitting(false);
        return;
      }
      
      const emailCheck = await checkDuplicate('leader_email', formData.leaderEmail);
      if (emailCheck.exists) {
        alert('Leader email already registered. Please use a different email.');
        setIsSubmitting(false);
        return;
      }
      
      const utrCheck = await checkDuplicate('utr_number', formData.utrNumber);
      if (utrCheck.exists) {
        alert('UTR number already exists. Please check your UTR number.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('No duplicates found, submitting registration...');
      
      // Upload payment screenshot if provided
      let paymentScreenshotPath = null;
      if (formData.paymentScreenshot) {
        console.log('Uploading payment screenshot...');
        const uploadResult = await uploadPaymentScreenshot(formData.paymentScreenshot, formData.teamName);
        
        if (uploadResult.success) {
          paymentScreenshotPath = uploadResult.path;
          console.log('Payment screenshot uploaded successfully:', uploadResult.url);
        } else {
          console.error('Payment screenshot upload failed:', uploadResult.error);
          alert('Payment screenshot upload failed. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare registration data
      const registrationData = {
        leader_name: formData.leaderName,
        leader_email: formData.leaderEmail,
        leader_phone: formData.leaderPhone,
        leader_tshirt_size: formData.leaderTshirtSize,
        college_name: formData.collegeName,
        team_name: formData.teamName,
        member2_name: formData.member2Name,
        member2_email: formData.member2Email,
        member2_phone: formData.member2Phone,
        member2_tshirt_size: formData.member2TshirtSize,
        member3_name: formData.member3Name,
        member3_email: formData.member3Email,
        member3_phone: formData.member3Phone,
        member3_tshirt_size: formData.member3TshirtSize,
        utr_number: formData.utrNumber,
        account_holder_name: formData.accountHolderName,
        project_idea: formData.projectIdea,
        payment_screenshot_path: paymentScreenshotPath,
        ip_address: '127.0.0.1' // You can get this from a service or leave as is
      };
      
      console.log('Submitting registration data:', registrationData);
      
      const result = await submitRegistration(registrationData);
      
      if (result.success) {
        console.log('Registration successful:', result.data);
        const savedData = result.data[0]; // Get the first (and only) record
        console.log('📊 Saved data:', savedData);
        
        setRegistrationData(savedData);
        setSubmitSuccess(true);
        
        console.log('✅ States updated - submitSuccess:', true);
        // Stay on current step to show success message
      } else {
        console.error('Registration failed:', result.error);
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for duplicate emails and phone numbers (only if all fields have values)
  const emails = [formData.leaderEmail, formData.member2Email, formData.member3Email].filter(email => email.trim() !== '');
  const phones = [formData.leaderPhone, formData.member2Phone, formData.member3Phone].filter(phone => phone.trim() !== '');
  const hasDuplicateEmails = emails.length > 1 && emails.length !== new Set(emails).size;
  const hasDuplicatePhones = phones.length > 1 && phones.length !== new Set(phones).size;

  const canSubmit = 
    verificationStatus === 'verified' && // Email must be verified
    formData.leaderName && 
    formData.leaderEmail && 
    formData.leaderPhone && 
    formData.leaderTshirtSize &&
    formData.collegeName && 
    formData.teamName && 
    formData.member2Name && 
    formData.member2Email && 
    formData.member2Phone && 
    formData.member2TshirtSize &&
    formData.member3Name && 
    formData.member3Email && 
    formData.member3Phone && 
    formData.member3TshirtSize &&
    formData.utrNumber && 
    formData.accountHolderName &&
    formData.paymentScreenshot;

  const steps = [
    { title: 'Email Verification', icon: Mail },
    { title: 'Team Leader', icon: User },
    { title: 'Team Members', icon: Users },
    { title: 'Payment Details', icon: CreditCard },
    { title: 'Review & Submit', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl gradient-text font-bold">HackVibe 2025 Registration</h1>
              <p className="text-muted-foreground">Join the ultimate hackathon experience</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="container mx-auto px-6 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-2 md:gap-4 mb-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${
                    index + 1 <= currentStep 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    <step.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 ${
                      index + 1 < currentStep ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            {submitSuccess ? (
    <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="glassmorphism border-green-500/30 hover:border-green-500/50 transition-all duration-300">
                  <CardContent className="p-12">
                    <motion.div
                      className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <Check className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <h2 className="text-3xl gradient-text mb-4">Registration Successful!</h2>
                    <p className="text-xl text-muted-foreground mb-8">
                      Thank you for registering for HackVibe 2025. We've received your registration and will be in touch soon with further details.
                    </p>
                    
                    <div className="space-y-4 text-left max-w-md mx-auto">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <span className="text-muted-foreground">Registration confirmed</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <span className="text-muted-foreground">Check your email for updates</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <span className="text-muted-foreground">Event details coming soon</span>
                      </div>
      </div>

                    <motion.div className="mt-8" whileHover={{ scale: 1.05 }}>
                      <Button onClick={onBackToHome} className="bg-gradient-to-r from-primary to-secondary">
                        Back to Home
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="glassmorphism border-primary/30 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl gradient-text">
                    {currentStep === 1 && 'Email Verification'}
                    {currentStep === 2 && 'Team Leader Information'}
                    {currentStep === 3 && 'Team Members Information'}
                    {currentStep === 4 && 'Payment Details'}
                    {currentStep === 5 && 'Review & Submit'}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {currentStep === 1 && 'Verify your team leader email address to proceed'}
                    {currentStep === 2 && 'Enter your team leader details'}
                    {currentStep === 3 && 'Enter details for other team members'}
                    {currentStep === 4 && 'Provide payment transaction details'}
                    {currentStep === 5 && 'Review your information and complete registration'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8">
                  {/* Step 1: Email Verification */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Mail className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold gradient-text">Email Verification Required</h2>
                        <p className="text-lg text-muted-foreground">
                          Please verify your team leader's email address to proceed with registration.
                        </p>
                      </div>

                      <div className="max-w-md mx-auto space-y-4">
                        {/* Email Input */}
                        <div className="space-y-2">
                          <Label htmlFor="teamLeaderEmail" className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <span>Team Leader Email Address *</span>
                          </Label>
                          <Input
                            id="teamLeaderEmail"
                            type="email"
                            placeholder="leader@college.edu"
                            value={teamLeaderEmail}
                            onChange={(e) => setTeamLeaderEmail(e.target.value)}
                            className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                          />
                        </div>

                        {/* OTP Input - Show after email is sent */}
                        {otpSent && (
                          <div className="space-y-2">
                            <Label htmlFor="otpCode" className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-primary" />
                              <span>Enter 6-Digit OTP Code *</span>
                            </Label>
                            <Input
                              id="otpCode"
                              type="text"
                              placeholder="123456"
                              value={otpCode}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                handleOTPChange(value);
                              }}
                              maxLength={6}
                              pattern="[0-9]{6}"
                              inputMode="numeric"
                              className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 text-center text-lg font-mono tracking-widest"
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter the 6-digit code sent to your email
                            </p>
                          </div>
                        )}

                        {/* Verification Status */}
                        {verificationStatus === 'pending' && otpSent && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>OTP Sent!</strong> Please check your inbox and enter the 6-digit code above.
                              </p>
                            </div>
                          </div>
                        )}

                        {verificationStatus === 'verified' && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <p className="text-sm text-green-700 dark:text-green-300">
                                <strong>Email Verified Successfully!</strong> You can now proceed with registration.
                              </p>
                            </div>
                          </div>
                        )}

                        {verificationStatus === 'failed' && (
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                            <div className="flex items-center space-x-2">
                              <X className="w-4 h-4 text-red-500" />
                              <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>Invalid OTP Code!</strong> Please check the code and try again.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                          {!otpSent && (
                            <Button
                              onClick={() => sendTeamLeaderVerificationEmail(teamLeaderEmail)}
                              disabled={!teamLeaderEmail || !teamLeaderEmail.includes('@')}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                            >
                              📧 Send OTP Code
                            </Button>
                          )}

                          {otpSent && verificationStatus !== 'verified' && (
                            <div className="space-y-2">
                              <Button
                                onClick={() => verifyTeamLeaderEmail(otpCode)}
                                disabled={!otpCode || otpCode.length !== 6}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                              >
                                🔍 Verify OTP Code
                              </Button>
                              
                              <Button
                                onClick={() => sendTeamLeaderVerificationEmail(teamLeaderEmail)}
                                disabled={!canResend}
                                variant="outline"
                                className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                              >
                                {canResend ? (
                                  '📧 Resend OTP Code'
                                ) : (
                                  `📧 Resend in ${resendCooldown}s`
                                )}
                              </Button>
                            </div>
                          )}

                          {verificationStatus === 'verified' && (
                            <Button
                              onClick={() => setCurrentStep(2)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                            >
                              ✅ Continue to Registration
                            </Button>
                          )}
                        </div>

                        {/* Instructions */}
                        {otpSent && (
                          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              📧 Email Instructions
                            </h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                              <li>• Check your email inbox (and spam folder)</li>
                              <li>• Look for the email from HackVibe Team</li>
                              <li>• Copy the 6-digit OTP code from the email</li>
                              <li>• Enter the code in the field above</li>
                              <li>• Click "Verify OTP Code" to proceed</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Team Leader Name */}
      <div className="space-y-4">
          <Label htmlFor="leaderName" className="flex items-center space-x-2">
            <User className="w-4 h-4 text-primary" />
                            <span>Full Name *</span>
          </Label>
            <Input
              id="leaderName"
              placeholder="Enter your full name"
              value={formData.leaderName}
              onChange={(e) => setFormData(prev => ({ ...prev, leaderName: e.target.value }))}
                            className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
        </div>

                        {/* Team Leader Email */}
                        <div className="space-y-4">
          <Label htmlFor="leaderEmail" className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-primary" />
                            <span>Email Address *</span>
          </Label>
                          <div className="relative">
              <Input
                id="leaderEmail"
                type="email"
                              placeholder="leader@example.com"
                value={formData.leaderEmail}
                              onChange={(e) => handleEmailChange(e.target.value, 0)}
                              className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                                validations.emails[0].isValid && validations.emails[0].isUnique ? 'border-green-500' : 
                                validations.emails[0].error || validations.emails[0].uniqueError ? 'border-red-500' : ''
                              }`}
                            />
                            {validations.emails[0].isChecking && (
                              <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
                            )}
                            {validations.emails[0].isValid && validations.emails[0].isUnique && (
                              <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
              )}
            </div>
                                                     {validations.emails[0].error && (
                             <p className="text-red-400 text-sm">{validations.emails[0].error}</p>
                           )}
                           {validations.emails[0].uniqueError && (
                             <p className="text-red-400 text-sm">{validations.emails[0].uniqueError}</p>
                           )}
                           {hasDuplicateEmails && formData.leaderEmail && emails.filter(email => email === formData.leaderEmail).length > 1 && (
                             <p className="text-red-400 text-sm">This email is already used by another team member</p>
                           )}
                           
                           {/* Email Verification Reminder */}
                           {validations.emails[0].isValid && validations.emails[0].isUnique && (
                             <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                               <div className="flex items-center space-x-2">
                                 <span className="text-blue-600 dark:text-blue-400">📧</span>
                                 <p className="text-sm text-blue-700 dark:text-blue-300">
                                   <strong>Email Verification Required:</strong> After registration, you'll receive a verification email at this address. Please check your inbox and click the verification link to complete your registration.
                                 </p>
                               </div>
                             </div>
                           )}

                        </div>

                        {/* Team Leader Phone */}
                        <div className="space-y-4">
                          <Label htmlFor="leaderPhone" className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-primary" />
                            <span>Phone Number *</span>
            </Label>
                          <div className="relative">
                <Input
                              id="leaderPhone"
                              type="tel"
                              placeholder="10-digit number"
                              value={formData.leaderPhone}
                              onChange={(e) => handlePhoneChange(e.target.value, 0)}
                              className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                                validations.phones[0].isValid && validations.phones[0].isUnique ? 'border-green-500' : 
                                validations.phones[0].error || validations.phones[0].uniqueError ? 'border-red-500' : ''
                              }`}
                            />
                            {validations.phones[0].isChecking && (
                              <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
                            )}
                            {validations.phones[0].isValid && validations.phones[0].isUnique && (
                              <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
                )}
              </div>
                                                     {validations.phones[0].error && (
                             <p className="text-red-400 text-sm">{validations.phones[0].error}</p>
                           )}
                           {validations.phones[0].uniqueError && (
                             <p className="text-red-400 text-sm">{validations.phones[0].uniqueError}</p>
                           )}
                           {hasDuplicatePhones && formData.leaderPhone && phones.filter(phone => phone === formData.leaderPhone).length > 1 && (
                             <p className="text-red-400 text-sm">This phone number is already used by another team member</p>
                           )}
                        </div>
                        
                        {/* Team Leader T-Shirt Size */}
                        <div className="space-y-4">
                          <Label htmlFor="leaderTshirtSize" className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-primary" />
                            <span>T-Shirt Size *</span>
                          </Label>
                                                                                   <Select
                               value={formData.leaderTshirtSize}
                               onValueChange={(value) => setFormData(prev => ({ ...prev, leaderTshirtSize: value }))}
                             >
                               <SelectTrigger className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                                 <SelectValue placeholder="Select size" />
                               </SelectTrigger>
                               <SelectContent className="bg-background border border-border text-foreground">
                                 {tshirtSizes.map(size => (
                                   <SelectItem key={size} value={size} className="text-foreground hover:bg-primary/20 focus:bg-primary/20">{size}</SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
            </div>

        {/* College Name */}
                        <div className="space-y-4">
          <Label htmlFor="collegeName" className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-primary" />
                            <span>College/Organization *</span>
          </Label>
            <Input
              id="collegeName"
                            placeholder="Enter college or organization name"
              value={formData.collegeName}
              onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                            className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
            />
        </div>

        {/* Team Name */}
                        <div className="space-y-4">
          <Label htmlFor="teamName" className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-primary" />
                            <span>Team Name *</span>
          </Label>
            <div className="relative">
              <Input
                id="teamName"
                placeholder="Enter unique team name"
                value={formData.teamName}
                onChange={(e) => handleTeamNameChange(e.target.value)}
                className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                  validations.teamName.isValid && validations.teamName.isUnique ? 'border-green-500' : 
                  validations.teamName.error || validations.teamName.uniqueError ? 'border-red-500' : ''
                }`}
              />
              {validations.teamName.isChecking && (
                <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
              )}
              {validations.teamName.isValid && validations.teamName.isUnique && (
                <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
              )}
            </div>
            {validations.teamName.error && (
              <p className="text-red-400 text-sm">{validations.teamName.error}</p>
            )}
            {validations.teamName.uniqueError && (
              <p className="text-red-400 text-sm">{validations.teamName.uniqueError}</p>
            )}
        </div>
      </div>
    </motion.div>
                  )}

                  {currentStep === 3 && (
    <motion.div
                      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {/* Member 2 */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Member 2</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <Label htmlFor="member2Name">Full Name *</Label>
                <Input
                              id="member2Name"
                              placeholder="Enter member 2 name"
                              value={formData.member2Name}
                              onChange={(e) => setFormData(prev => ({ ...prev, member2Name: e.target.value }))}
                  className="glassmorphism border-primary/30 focus:border-primary"
                />
              </div>

                          <div className="space-y-4">
                            <Label htmlFor="member2Email">Email Address *</Label>
                <div className="relative">
                  <Input
                                id="member2Email"
                    type="email"
                                placeholder="member2@example.com"
                                value={formData.member2Email}
                                onChange={(e) => handleEmailChange(e.target.value, 1)}
                                className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                                  validations.emails[1].isValid && validations.emails[1].isUnique ? 'border-green-500' : 
                                  validations.emails[1].error || validations.emails[1].uniqueError ? 'border-red-500' : ''
                                }`}
                              />
                              {validations.emails[1].isChecking && (
                                <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
                              )}
                              {validations.emails[1].isValid && validations.emails[1].isUnique && (
                                <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
                              )}
                            </div>
                                                       {validations.emails[1].error && (
                             <p className="text-red-400 text-sm">{validations.emails[1].error}</p>
                           )}
                           {validations.emails[1].uniqueError && (
                             <p className="text-red-400 text-sm">{validations.emails[1].uniqueError}</p>
                           )}
                           {hasDuplicateEmails && formData.member2Email && emails.filter(email => email === formData.member2Email).length > 1 && (
                             <p className="text-red-400 text-sm">This email is already used by another team member</p>
                           )}
                           

                        </div>
                
                          <div className="space-y-4">
                            <Label htmlFor="member2Phone">Phone Number *</Label>
                            <div className="relative">
                              <Input
                                id="member2Phone"
                                type="tel"
                                placeholder="10-digit number"
                                value={formData.member2Phone}
                                onChange={(e) => handlePhoneChange(e.target.value, 1)}
                                className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                                  validations.phones[1].isValid && validations.phones[1].isUnique ? 'border-green-500' : 
                                  validations.phones[1].error || validations.phones[1].uniqueError ? 'border-red-500' : ''
                                }`}
                              />
                              {validations.phones[1].isChecking && (
                                <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
                              )}
                              {validations.phones[1].isValid && validations.phones[1].isUnique && (
                                <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
                              )}
                            </div>
                                                         {validations.phones[1].error && (
                               <p className="text-red-400 text-sm">{validations.phones[1].error}</p>
                             )}
                             {validations.phones[1].uniqueError && (
                               <p className="text-red-400 text-sm">{validations.phones[1].uniqueError}</p>
                             )}
                             {hasDuplicatePhones && formData.member2Phone && phones.filter(phone => phone === formData.member2Phone).length > 1 && (
                               <p className="text-red-400 text-sm">This phone number is already used by another team member</p>
                )}
              </div>

                          <div className="space-y-4">
                            <Label htmlFor="member2TshirtSize">T-Shirt Size *</Label>
                <Select
                               value={formData.member2TshirtSize}
                               onValueChange={(value) => setFormData(prev => ({ ...prev, member2TshirtSize: value }))}
                             >
                               <SelectTrigger className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                               <SelectContent className="bg-background border border-border text-foreground">
                    {tshirtSizes.map(size => (
                                   <SelectItem key={size} value={size} className="text-foreground hover:bg-primary/20 focus:bg-primary/20">{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
      </div>
                      
                      {/* Member 3 */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Member 3</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <Label htmlFor="member3Name">Full Name *</Label>
                            <Input
                              id="member3Name"
                              placeholder="Enter member 3 name"
                              value={formData.member3Name}
                              onChange={(e) => setFormData(prev => ({ ...prev, member3Name: e.target.value }))}
                              className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                            />
      </div>

                          <div className="space-y-4">
                            <Label htmlFor="member3Email">Email Address *</Label>
                            <div className="relative">
                              <Input
                                id="member3Email"
                                type="email"
                                placeholder="member3@example.com"
                                value={formData.member3Email}
                                onChange={(e) => handleEmailChange(e.target.value, 2)}
                                className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                                  validations.emails[2].isValid && validations.emails[2].isUnique ? 'border-green-500' : 
                                  validations.emails[2].error || validations.emails[2].uniqueError ? 'border-red-500' : ''
                                }`}
                              />
                              {validations.emails[2].isChecking && (
                                <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
                              )}
                              {validations.emails[2].isValid && validations.emails[2].isUnique && (
                                <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
                              )}
                            </div>
                                                         {validations.emails[2].error && (
                               <p className="text-red-400 text-sm">{validations.emails[2].error}</p>
                             )}
                             {validations.emails[2].uniqueError && (
                               <p className="text-red-400 text-sm">{validations.emails[2].uniqueError}</p>
                             )}
                             {hasDuplicateEmails && formData.member3Email && emails.filter(email => email === formData.member3Email).length > 1 && (
                               <p className="text-red-400 text-sm">This email is already used by another team member</p>
                             )}
                             

                        </div>

          <div className="space-y-4">
                            <Label htmlFor="member3Phone">Phone Number *</Label>
                            <div className="relative">
                              <Input
                                id="member3Phone"
                                type="tel"
                                placeholder="10-digit number"
                                value={formData.member3Phone}
                                onChange={(e) => handlePhoneChange(e.target.value, 2)}
                                className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                                  validations.phones[2].isValid && validations.phones[2].isUnique ? 'border-green-500' : 
                                  validations.phones[2].error || validations.phones[2].uniqueError ? 'border-red-500' : ''
                                }`}
                              />
                              {validations.phones[2].isChecking && (
                                <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
                              )}
                              {validations.phones[2].isValid && validations.phones[2].isUnique && (
                                <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
                              )}
            </div>
                                                         {validations.phones[2].error && (
                               <p className="text-red-400 text-sm">{validations.phones[2].error}</p>
                             )}
                             {validations.phones[2].uniqueError && (
                               <p className="text-red-400 text-sm">{validations.phones[2].uniqueError}</p>
                             )}
                             {hasDuplicatePhones && formData.member3Phone && phones.filter(phone => phone === formData.member3Phone).length > 1 && (
                               <p className="text-red-400 text-sm">This phone number is already used by another team member</p>
                             )}
            </div>
                          
                          <div className="space-y-4">
                            <Label htmlFor="member3TshirtSize">T-Shirt Size *</Label>
                                                         <Select
                               value={formData.member3TshirtSize}
                               onValueChange={(value) => setFormData(prev => ({ ...prev, member3TshirtSize: value }))}
                             >
                               <SelectTrigger className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200">
                                 <SelectValue placeholder="Select size" />
                               </SelectTrigger>
                               <SelectContent className="bg-background border border-border text-foreground">
                                 {tshirtSizes.map(size => (
                                   <SelectItem key={size} value={size} className="text-foreground hover:bg-primary/20 focus:bg-primary/20">{size}</SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
          </div>
            </div>
            </div>
          </motion.div>
        )}

                  {currentStep === 4 && (
        <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Payment Information</h3>
                        <p className="text-muted-foreground mb-4">
                          Registration fee: <span className="text-white font-semibold">₹600 per team</span>
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Left: Payment Fields */}
                        <div className="flex-1 space-y-6 w-full">
                          <div className="space-y-4">
                            <Label htmlFor="utrNumber" className="flex items-center space-x-2">
                              <Receipt className="w-4 h-4 text-primary" />
                              <span>UTR Number *</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="utrNumber"
                                placeholder="Enter 12-digit UTR number"
                                value={formData.utrNumber}
                                onChange={(e) => handleUTRChange(e.target.value)}
                                maxLength={12}
                                className={`bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 ${
                                  validations.utr.isValid && validations.utr.isUnique ? 'border-green-500' :
                                  validations.utr.error || validations.utr.uniqueError ? 'border-red-500' : ''
                                }`}
                              />
                              {validations.utr.isChecking && (
                                <Clock className="absolute right-3 top-3 w-4 h-4 text-blue-400 animate-spin" />
                              )}
                              {validations.utr.isValid && validations.utr.isUnique && (
                                <Check className="absolute right-3 top-3 w-4 h-4 text-green-400" />
                              )}
                            </div>
                            {validations.utr.error && (
                              <p className="text-red-400 text-sm">{validations.utr.error}</p>
                            )}
                            {validations.utr.uniqueError && (
                              <p className="text-red-400 text-sm">{validations.utr.uniqueError}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Enter the 12-digit UTR number from your payment confirmation
                            </p>
                          </div>
                          <div className="space-y-4">
                            <Label htmlFor="accountHolderName" className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-primary" />
                              <span>Account Holder Name *</span>
                            </Label>
                            <Input
                              id="accountHolderName"
                              placeholder="Enter account holder name"
                              value={formData.accountHolderName}
                              onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                              className="bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label htmlFor="paymentScreenshot" className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-primary" />
                              <span>Payment Screenshot *</span>
                            </Label>
                            <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                              <input
                                type="file"
                                id="paymentScreenshot"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  setFormData(prev => ({ ...prev, paymentScreenshot: file }));
                                }}
                                className="hidden"
                              />
                              <label htmlFor="paymentScreenshot" className="cursor-pointer">
                                {formData.paymentScreenshot ? (
                                  <div className="space-y-2">
                                    <div className="text-green-400">✓ File selected: {formData.paymentScreenshot.name}</div>
                                    <div className="text-sm text-muted-foreground">Click to change file</div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="text-primary">📁 Click to upload payment screenshot</div>
                                    <div className="text-sm text-muted-foreground">Supports: JPG, PNG, JPEG</div>
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Right: QR Code */}
                        <div className="flex-1 w-full flex flex-col items-center">
                          <h4 className="text-lg font-semibold text-primary mb-2">Scan QR Code to Pay</h4>
                          <div className="max-w-xs w-full">
                            <img
                              src="/images/payments/600_payment_qr.jpeg"
                              alt="Payment QR Code"
                              className="w-full h-auto rounded-lg border-2 border-primary/30"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 text-center">
                            Scan this QR code with any UPI app to make the payment
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Review & Submit */}
                  {currentStep === 5 && !submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Check className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold gradient-text">Review Your Information</h2>
                        <p className="text-lg text-muted-foreground">
                          Please review all your details before submitting the registration.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* Team Information */}
                        <div className="glassmorphism rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Team Information
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <p><span className="text-muted-foreground">Team Name:</span> <span className="font-medium">{formData.teamName}</span></p>
                              <p><span className="text-muted-foreground">College:</span> <span className="font-medium">{formData.collegeName}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Team Leader Details */}
                        <div className="glassmorphism rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Team Leader Details
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{formData.leaderName}</span></p>
                              <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.leaderEmail}</span></p>
                              <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{formData.leaderPhone}</span></p>
                            </div>
                            <div className="space-y-2">
                              <p><span className="text-muted-foreground">T-Shirt Size:</span> <span className="font-medium">{formData.leaderTshirtSize}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Team Members Details */}
                        <div className="glassmorphism rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Team Members Details
                          </h3>
                          <div className="space-y-4">
                            {/* Member 2 */}
                            <div className="border-l-4 border-primary pl-4">
                              <h4 className="font-medium text-primary mb-2">Member 2</h4>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{formData.member2Name}</span></p>
                                  <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.member2Email}</span></p>
                                </div>
                                <div className="space-y-1">
                                  <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{formData.member2Phone}</span></p>
                                  <p><span className="text-muted-foreground">T-Shirt Size:</span> <span className="font-medium">{formData.member2TshirtSize}</span></p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Member 3 */}
                            <div className="border-l-4 border-secondary pl-4">
                              <h4 className="font-medium text-secondary mb-2">Member 3</h4>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{formData.member3Name}</span></p>
                                  <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{formData.member3Email}</span></p>
                                </div>
                                <div className="space-y-1">
                                  <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{formData.member3Phone}</span></p>
                                  <p><span className="text-muted-foreground">T-Shirt Size:</span> <span className="font-medium">{formData.member3TshirtSize}</span></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="glassmorphism rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Payment Details
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <p><span className="text-muted-foreground">UTR Number:</span> <span className="font-medium">{formData.utrNumber}</span></p>
                              <p><span className="text-muted-foreground">Account Holder:</span> <span className="font-medium">{formData.accountHolderName}</span></p>
                            </div>
                            <div className="space-y-2">
                              <p><span className="text-muted-foreground">Amount:</span> <span className="font-medium text-green-500">₹600</span></p>
                              <p><span className="text-muted-foreground">Payment Screenshot:</span> 
                                <span className={`font-medium ${formData.paymentScreenshot ? 'text-green-500' : 'text-red-500'}`}>
                                  {formData.paymentScreenshot ? '✓ Uploaded' : '❌ Not uploaded'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Project Idea */}
                        {formData.projectIdea && (
                          <div className="glassmorphism rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                              <FileText className="w-5 h-5 mr-2" />
                              Project Idea
                            </h3>
                            <p className="text-sm text-muted-foreground">{formData.projectIdea}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                          <Button
                            onClick={() => {
                              console.log('🔘 Preview download button clicked');
                              // Create a temporary registration data object for PDF
                              const tempRegistrationData = {
                                team_name: formData.teamName,
                                college_name: formData.collegeName,
                                leader_name: formData.leaderName,
                                leader_email: formData.leaderEmail,
                                leader_phone: formData.leaderPhone,
                                leader_tshirt_size: formData.leaderTshirtSize,
                                member2_name: formData.member2Name,
                                member2_email: formData.member2Email,
                                member2_phone: formData.member2Phone,
                                member2_tshirt_size: formData.member2TshirtSize,
                                member3_name: formData.member3Name,
                                member3_email: formData.member3Email,
                                member3_phone: formData.member3Phone,
                                member3_tshirt_size: formData.member3TshirtSize,
                                utr_number: formData.utrNumber,
                                account_holder_name: formData.accountHolderName,
                                project_idea: formData.projectIdea,
                                unique_code: 'PREVIEW'
                              };
                              console.log('📊 Preview data:', tempRegistrationData);
                              downloadRegistrationDetails(tempRegistrationData);
                            }}
                            variant="outline"
                            className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Download Preview PDF
                          </Button>
                          

                        </div>
                      </div>
                    </motion.div>
                  )}



                  {/* Success Step - Only show after successful registration */}
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-8 text-center"
                    >
                      {/* Success Icon */}
                      <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center glow-green">
                          <Check className="w-12 h-12 text-white" />
                        </div>
                      </div>

                      {/* Success Message */}
                      <div className="space-y-4">
                        <h2 className="text-3xl font-bold gradient-text">
                          Registration Successful! 🎉
                        </h2>
                        <p className="text-xl text-muted-foreground">
                          Welcome to HackVibe 2025! Your team has been successfully registered.
                        </p>
                      </div>



                      {/* Team Information Summary */}
                      <div className="glassmorphism rounded-2xl p-6 text-left">
                        <h3 className="text-lg font-semibold text-primary mb-4">📋 Registration Summary</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><span className="text-muted-foreground">Team Name:</span> <span className="font-medium">{registrationData?.team_name}</span></p>
                            <p><span className="text-muted-foreground">College:</span> <span className="font-medium">{registrationData?.college_name}</span></p>
                            <p><span className="text-muted-foreground">Team Leader:</span> <span className="font-medium">{registrationData?.leader_name}</span></p>
                          </div>
                          <div>
                            <p><span className="text-muted-foreground">Event Date:</span> <span className="font-medium">September 11th, 2025</span></p>
                            <p><span className="text-muted-foreground">Venue:</span> <span className="font-medium">Vignan Institute of Technology and Science</span></p>
                            <p><span className="text-muted-foreground">Registration Fee:</span> <span className="font-medium">₹600</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          onClick={() => {
                            console.log('🔘 Success section download button clicked');
                            console.log('📊 Registration data:', registrationData);
                            
                            if (registrationData) {
                              console.log('✅ Data available, calling download function...');
                              downloadRegistrationDetails(registrationData);
                            } else {
                              console.error('❌ Missing data:', { registrationData });
                              alert('Registration data not available. Please try refreshing the page.');
                            }
                          }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 glow-cyan"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Download Registration Details
                        </Button>
                        <Button
                          onClick={onBackToHome}
                          variant="outline"
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          Back to Home
                        </Button>
                      </div>

                      {/* Important Notes */}
                      <div className="glassmorphism rounded-2xl p-6 border-l-4 border-primary">
                        <h4 className="text-lg font-semibold text-primary mb-3">📋 Important Notes</h4>
                        <ul className="text-sm text-muted-foreground space-y-2 text-left">
                          <li>• Bring a valid ID proof to the event</li>
                          <li>• Event Date: <strong>September 11th, 2025</strong></li>
                          <li>• Venue: <strong>Vignan Institute of Technology and Science</strong></li>
                          <li>• Registration Fee: <strong>₹600</strong> (already paid)</li>
                          <li>• Contact organizers if you have any questions</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

              {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row sm:justify-between mt-8 gap-4">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}

                    {currentStep === 1 ? (
                      // Email verification step - no next button, handled by verification
                      null
                    ) : currentStep < 5 ? (
                    <Button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      disabled={
                          (currentStep === 2 && (!formData.leaderName || !formData.leaderEmail || !formData.leaderPhone || !formData.leaderTshirtSize || !formData.collegeName || !formData.teamName)) ||
                          (currentStep === 3 && (!formData.member2Name || !formData.member2Email || !formData.member2Phone || !formData.member2TshirtSize || !formData.member3Name || !formData.member3Email || !formData.member3Phone || !formData.member3TshirtSize)) ||
                          (currentStep === 4 && (!formData.utrNumber || !formData.accountHolderName || !formData.paymentScreenshot))
                      }
                      className="bg-gradient-to-r from-primary to-secondary sm:ml-auto"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : currentStep === 5 && !submitSuccess ? (
                    <div className="space-y-4">

                      <Button
                        onClick={() => {
                          console.log('🔘 Complete Registration button clicked');
                          console.log('📊 canSubmit:', canSubmit);
                          console.log('📊 isSubmitting:', isSubmitting);
                          console.log('📊 verificationStatus:', verificationStatus);
                          console.log('📊 formData:', formData);
                          console.log('📊 Validations:', validations);
                          console.log('📊 Has duplicate emails:', hasDuplicateEmails);
                          console.log('📊 Has duplicate phones:', hasDuplicatePhones);
                          handleSubmit();
                        }}
                        disabled={!canSubmit || isSubmitting}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 sm:ml-auto"
                      >
                        {isSubmitting ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Complete Registration
                            </>
                        )}
                      </Button>
                    </div>
                  ) : null}
                  </div>
                </CardContent>
              </Card>
              )}
            </div>
        </div>
      </div>

      <FloatingChatBot />
      {/* Features under form */}
      <div className="container mx-auto px-6 pb-20 mt-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism rounded-2xl p-6 text-center hover:glow-purple transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg gradient-text mb-2">Team Registration</h4>
              <p className="text-sm text-muted-foreground">Form teams of exactly 3 members</p>
            </div>

            <div className="glassmorphism rounded-2xl p-6 text-center hover:glow-purple transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg gradient-text mb-2">Easy Payment</h4>
              <p className="text-sm text-muted-foreground">₹600 registration fee via UPI</p>
            </div>

            <div className="glassmorphism rounded-2xl p-6 text-center hover:glow-purple transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg gradient-text mb-2">Secure Process</h4>
              <p className="text-sm text-muted-foreground">Direct registration with validation</p>
            </div>

            <div className="glassmorphism rounded-2xl p-6 text-center hover:glow-purple transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg gradient-text mb-2">24 Hour Event</h4>
              <p className="text-sm text-muted-foreground">Non-stop innovation marathon</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

