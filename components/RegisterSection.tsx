'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { Button } from './ui/button';
import { Users, CreditCard, Shield, Calendar, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface RegisterSectionProps {
  onNavigateToRegister: () => void;
}
// ...existing code...



export function RegisterSection({ onNavigateToRegister }: RegisterSectionProps) {
  const [counts, setCounts] = React.useState<{ teams: number; participants: number }>({ teams: 0, participants: 0 });
  const [loadingCounts, setLoadingCounts] = React.useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const res = await fetch('/get-counts.php');
        const data = await res.json();
        if (isMounted && data?.success) {
          setCounts({ teams: data.teams ?? 0, participants: data.participants ?? 0 });
        }
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) setLoadingCounts(false);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);
  const features = [
    {
      icon: Users,
      title: 'Team Registration',
      description: 'Form teams of exactly 3 members',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: CreditCard,
      title: 'Easy Payment',
      description: '₹600 registration fee via UPI',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure Process',
      description: 'Direct registration with validation',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      title: '24 Hour Event',
      description: 'Non-stop innovation marathon',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    'Free meals and refreshments',
    'Exclusive hackathon swag',
    'Certificates for all participants',
    'Networking opportunities',
    'Mentorship from industry experts',
    'Amazing prizes and recognition'
  ];

  return (
    <section id="register" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
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

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl gradient-text mb-6">Join the Revolution</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to build the future? Register your team for the ultimate AI hackathon experience. 
            Limited spots available - secure your place now!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6"></div>
        </motion.div>

        {/* Main CTA Section */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glassmorphism rounded-3xl p-8 md:p-12 text-center mb-12 hover:glow-purple transition-all duration-500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>

            <h3 className="text-3xl gradient-text mb-4">Registration Open!</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of brilliant minds in the most exciting AI hackathon of 2025. 
              Build, innovate, and compete for amazing prizes!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="text-4xl gradient-text">₹600</div>
              <div className="text-muted-foreground">
                <div>per team</div>
                <div className="text-sm">(3 members)</div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onNavigateToRegister}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 glow-purple hover:glow-cyan transition-all duration-300 text-lg px-12 py-6"
              >
                Register Your Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>🔒 Secure registration with validation</p>
              <p>⚡ Quick and easy process</p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glassmorphism rounded-2xl p-6 text-center hover:glow-purple transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg gradient-text mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* What's Included */}
          <motion.div
            className="glassmorphism rounded-2xl p-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl gradient-text text-center mb-8">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Registration Stats (Dynamic) */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism rounded-xl p-6 text-center hover:glow-cyan transition-all duration-300">
              <div className="text-3xl gradient-text mb-2">{loadingCounts ? '...' : counts.participants}</div>
              <div className="text-sm text-muted-foreground">Participants Registered</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center hover:glow-purple transition-all duration-300">
              <div className="text-3xl gradient-text mb-2">{loadingCounts ? '...' : counts.teams}</div>
              <div className="text-sm text-muted-foreground">Teams Registered</div>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center hover:glow-pink transition-all duration-300">
              <div className="text-3xl gradient-text mb-2">24hrs</div>
              <div className="text-sm text-muted-foreground">Non-stop Innovation</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}