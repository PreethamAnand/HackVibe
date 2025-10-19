'use client';

import { motion } from 'framer-motion';
import { Linkedin, Instagram, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

interface FooterProps {
	isRegistrationPage?: boolean;
	onNavigateToHome?: () => void;
	onNavigateToRegister?: () => void;
}

export function Footer({ isRegistrationPage = false, onNavigateToHome, onNavigateToRegister }: FooterProps) {
  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Themes', href: '#themes' },
    { name: 'Register', href: '#register' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/hackvibe2025?igsh=dG56d3NoaHdlZWJw&utm_source=qr', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/hackvibe/?fbclid=PAQ0xDSwMAfVBleHRuA2FlbQIxMQABp7vuUApCtQ5-jDuqhPg2eDkxsu9kSennINmv_CFUlzS5hCdbjO8fCcMrfxAE_aem_nD_Z2zbMIgzJWmSwseg3Bg', label: 'LinkedIn' },
    { icon: MessageCircle, href: 'https://chat.whatsapp.com/GWz6UpADG2W83ndEeCO7Dc?mode=ac_t', label: 'WhatsApp Chat' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'vgnt@hackvibe.in' },
    { icon: Phone, text: '+91 7569127836' },
    { icon: MapPin, text: 'Hyderabad, Telangana' },
  ];

  const handleQuickLinkClick = (href: string, name?: string) => {
		// Special handling for Register – navigate instead of anchor scroll
		if (name === 'Register' && onNavigateToRegister) {
			onNavigateToRegister();
			return;
		}

		if (isRegistrationPage && onNavigateToHome) {
			// If on registration page, navigate to home first, then scroll to section
			onNavigateToHome();
			// Use setTimeout to ensure navigation completes before scrolling
			setTimeout(() => {
				const element = document.querySelector(href);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
		} else {
			// If on home page, just scroll to section
			const element = document.querySelector(href);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}
	};

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background to-primary/10">
      {/* Neon Border Top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
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

      <div className="relative z-10 pt-16 pb-8">
        <div className="container mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Description */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <div 
                  className="text-3xl gradient-text mb-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={onNavigateToHome}
                >
                  <span className="font-mono">HackVibe</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The premier AI-focused hackathon bringing together the brightest minds 
                  to build the future of technology. Innovation meets creativity.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Registration Open</span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg gradient-text">Quick Links</h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300 text-sm relative group text-left w-full"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => handleQuickLinkClick(link.href, link.name)}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg gradient-text">Contact</h3>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <contact.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{contact.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Media & Newsletter */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg gradient-text">Follow Us</h3>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 glassmorphism rounded-xl hover:glow-purple transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.a>
                ))}
              </div>

              {/* Newsletter removed as requested */}
            </motion.div>
          </div>

          {/* Divider with Neon Effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-6 glassmorphism rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-sm text-muted-foreground">
              © 2025 Hack Vibe. All rights reserved.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Neon Border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
    </footer>
  );
}
