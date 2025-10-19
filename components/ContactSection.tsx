'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export function ContactSection() {
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTyping(true);
    setSubmitStatus('idle');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('_subject', `Hack Vibe Contact: ${formData.subject}`);
      formDataToSend.append('_captcha', 'false');
      formDataToSend.append('_template', 'table');
      const response = await fetch('https://formsubmit.co/vgnt@hackvibe.in', {
        method: 'POST',
        body: formDataToSend,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsTyping(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'vgnt@hackvibe.in', href: 'mailto:vgnt@hackvibe.in' },
    { icon: Phone, label: 'Phone', value: '+91 7569127836', href: 'tel:+917569127836' },
    { icon: MapPin, label: 'Location', value: 'near Ramoji film city, Deshmuki Village, Yadadri, Bhuvanagiri, Telangana 508284', href: 'https://maps.app.goo.gl/CP4LF4NzsBNY6fV56', newTab: true }
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <defs>
            <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 0v20M0 10h20" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
              <circle cx="10" cy="10" r="2" fill="currentColor" className="text-secondary"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl gradient-text mb-6">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? Reach out and let's make this hackathon amazing together!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Info */}
            <motion.div className="space-y-8" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              {/* Contact Information */}
              <div className="glassmorphism rounded-2xl p-8">
                <h3 className="text-2xl gradient-text mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((contact, index) => (
                    <motion.a
                      key={contact.label}
                      href={contact.href}
                      {...(contact.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex items-center space-x-4 p-4 glassmorphism rounded-xl hover:border-primary/50 transition-all duration-300 group"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary group-hover:scale-110 transition-transform">
                        <contact.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{contact.label}</p>
                        <p className={`transition-colors ${contact.label === 'Location' ? 'text-white text-sm' : 'text-white group-hover:text-primary'}`}>{contact.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
              <form onSubmit={handleSubmit} className="glassmorphism rounded-2xl p-8 space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl gradient-text mb-2">Send us a Message</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Name</label>
                    <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" className="glassmorphism border-primary/30 focus:border-primary" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Email</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" className="glassmorphism border-primary/30 focus:border-primary" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Subject</label>
                  <Input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="What's this about?" className="glassmorphism border-primary/30 focus:border-primary" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Message</label>
                  <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us more about your question or feedback..." className="glassmorphism border-primary/30 focus:border-primary resize-none" rows={6} required />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" disabled={isTyping} className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 glow-purple hover:glow-cyan transition-all duration-300 text-lg py-6">
                    {isTyping ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
                                 {submitStatus === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
                     <CheckCircle className="w-5 h-5" />
                     <span>Message Sent Successfully</span>
                   </motion.div>
                 )}
                {submitStatus === 'error' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Error sending message. Please try again.</span>
                  </motion.div>
                )}
                <div className="text-center text-sm text-muted-foreground">
                  <p>🔒 Your message will be sent to vgnt@hackvibe.in. We respect your privacy and will never share your information.</p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* FAQ Preview */}
        <motion.div className="mt-16 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} viewport={{ once: true }}>
          <div className="glassmorphism rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl gradient-text mb-4">Need Quick Help?</h3>
            <p className="text-muted-foreground mb-4">Use our floating AI assistant for instant answers to common questions. For complex queries, our human team will respond within 24 hours.</p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span>AI Assistant: Available</span></div>
              <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div><span>Human Response: &lt; 24h</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
