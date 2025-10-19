'use client';


import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  onNavigateToRegister: () => void;
}

export function HeroSection({ onNavigateToRegister }: HeroSectionProps) {
  // Countdown timer for September 11th
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2025-09-11T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const particles = Array.from({ length: 50 }, (_, i) => i);
  const pad2 = (value: number) => String(value).padStart(2, '0');

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid pt-24">
      {/* Mobile Video Background - Hidden on lg+ screens */}
      <div className="lg:hidden absolute inset-0 overflow-hidden">
        <video
          className="w-full h-full object-cover opacity-30"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Binary Rain Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 opacity-20 font-mono text-xs"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{ y: [-100, window.innerHeight + 100] }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          >
            {Math.random().toString(2).substr(2, 8)}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-left">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl gradient-text mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Unleash the Future
              <br />
            </motion.h1>

            <motion.p
              className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AI-Infused Innovation Marathon
              <br />
              <span className="text-secondary">Where Code Meets Creativity</span>
            </motion.p>

            {/* Organizer Badge */}
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 glassmorphism glow-purple">
                <span className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground/80">Organized by</span>
                <span className="text-sm sm:text-base font-semibold gradient-text">Vignan Institute of Technology and Science</span>
              </div>
            </motion.div>

            {/* Fees Information */}
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <div className="relative inline-flex items-center gap-3 rounded-full px-4 py-2 glassmorphism glow-cyan border-float">
                {/* Floating dash border overlay */}
                <svg className="border-float-svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                  <rect x="1" y="1" width="98" height="38" rx="20" ry="20" className="border-float-path" stroke="url(#grad1)" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground/80">Early bird offer</span>
                <span className="text-sm sm:text-base font-semibold gradient-text">₹600</span>
                <span className="text-xs sm:text-sm text-muted-foreground/80">per team</span>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 glow-purple hover:glow-cyan transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                onClick={onNavigateToRegister}
              >
                Register Now
              </Button>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              className="mt-8 sm:mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <p className="text-sm sm:text-base text-muted-foreground">Event Starts In:</p>
                </div>
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 max-w-md mx-auto font-mono">
                  <div className="bg-black rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px] text-center">
                    <div className="text-2xl sm:text-3xl gradient-text font-bold">{pad2(timeLeft.days)}</div>
                  </div>
                  <div className="text-3xl sm:text-4xl gradient-text font-bold">:</div>
                  <div className="bg-black rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px] text-center">
                    <div className="text-2xl sm:text-3xl gradient-text font-bold">{pad2(timeLeft.hours)}</div>
                  </div>
                  <div className="text-3xl sm:text-4xl gradient-text font-bold">:</div>
                  <div className="bg-black rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px] text-center">
                    <div className="text-2xl sm:text-3xl gradient-text font-bold">{pad2(timeLeft.minutes)}</div>
                  </div>
                  <div className="text-3xl sm:text-4xl gradient-text font-bold">:</div>
                  <div className="bg-black rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px] text-center">
                    <div className="text-2xl sm:text-3xl gradient-text font-bold">{pad2(timeLeft.seconds)}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs sm:text-sm text-primary font-medium">September 11th, 2025</p>
                </div>
              </div>
            </motion.div>
          </div>

                     {/* Right Content - Video Player - Hidden on mobile, visible on lg+ screens */}
           <motion.div
             className="hidden lg:block relative"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.8 }}
           >
             <div className="relative w-full max-w-[280px] mx-auto aspect-square sm:max-w-none sm:h-80 lg:h-96 glassmorphism rounded-2xl overflow-hidden floating">
                               <video
                  className="w-full h-full object-cover rounded-2xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload nofullscreen noremoteplayback"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                  <source src="/hero-video.webm" type="video/webm" />
                  {/* Fallback text if video doesn't load */}
                  <div className="flex items-center justify-center h-full">
                    <div className="text-3xl sm:text-5xl lg:text-6xl gradient-text">
                      {'< AI />'}
                    </div>
                  </div>
                </video>
               <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse pointer-events-none"></div>
               <div className="absolute -inset-4 rounded-2xl border border-secondary opacity-50 animate-ping pointer-events-none"></div>
             </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
