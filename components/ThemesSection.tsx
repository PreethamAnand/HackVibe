'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Zap, Target, Users, Rocket, Code, Brain, Star } from 'lucide-react';

export function ThemesSection() {
  const features = [
    { icon: Lightbulb, text: 'Creative Solutions', color: 'text-yellow-400' },
    { icon: Code, text: 'Tech Innovation', color: 'text-blue-400' },
    { icon: Brain, text: 'AI Integration', color: 'text-purple-400' },
    { icon: Rocket, text: 'Future Ready', color: 'text-green-400' }
  ];

  const floatingElements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    icon: [Zap, Target, Star, Users][i % 4],
    delay: i * 0.5,
    duration: 3 + (i % 3),
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

  return (
    <section id="themes" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute"
            style={{ left: `${element.x}%`, top: `${element.y}%` }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            <element.icon className="w-4 h-4 text-primary/40" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl gradient-text mb-4 md:mb-6">Hackathon Theme</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Unleash your creativity and build solutions that matter. This year's theme focuses on 
            open innovation and collaborative problem-solving.
          </p>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-4 md:mt-6"></div>
        </motion.div>

        {/* Main Theme Card */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }} 
          viewport={{ once: true }}
        >
                     <div className="glassmorphism rounded-3xl overflow-hidden hover:glow-purple transition-all duration-500 group relative">
             {/* Mobile Video Background - Hidden on lg+ screens */}
             <div className="lg:hidden absolute inset-0 overflow-hidden">
               <video
                 className="w-full h-full object-cover opacity-20"
                 autoPlay
                 loop
                 muted
                 playsInline
                 controls={false}
               >
                 <source src="/images/logos/openai.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
               </video>
               {/* Dark overlay for better text readability */}
               <div className="absolute inset-0 bg-black/40"></div>
             </div>

             <div className="grid lg:grid-cols-2 gap-0 relative z-10">
              {/* Left Side - Content */}
               <div className="p-6 md:p-8 lg:p-16 space-y-6 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center space-x-2 glassmorphism rounded-full px-4 py-2 mb-6">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm text-primary">Theme 2025</span>
                  </div>

                   <h3 className="text-3xl md:text-4xl lg:text-5xl gradient-text mb-4 md:mb-6 group-hover:scale-105 transition-transform duration-500">
                    Open Innovation
                  </h3>

                   <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                    Break boundaries, challenge conventions, and create solutions that can transform industries. 
                    This theme encourages participants to think beyond traditional limits and develop 
                    innovative approaches to real-world problems.
                  </p>

                  {/* Features */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.text}
                         className="flex items-center space-x-3 p-3 md:p-4 glassmorphism rounded-xl hover:border-primary/50 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                        viewport={{ once: true }}
                      >
                         <feature.icon className={`w-4 h-4 md:w-5 md:h-5 ${feature.color}`} />
                         <span className="text-xs md:text-sm font-medium">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-sm text-muted-foreground">
                      Ready to innovate? Join us for 24 hours of unlimited creativity.
                    </div>
                    
                    {/* Animated Stats */}
                     <div className="grid grid-cols-3 gap-3 md:gap-6">
                      <div className="text-center">
                        <motion.div
                           className="text-xl md:text-2xl gradient-text"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          24h
                        </motion.div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                      </div>
                      <div className="text-center">
                        <motion.div
                           className="text-xl md:text-2xl gradient-text"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          ∞
                        </motion.div>
                        <div className="text-xs text-muted-foreground">Possibilities</div>
                      </div>
                      <div className="text-center">
                        <motion.div
                           className="text-xl md:text-2xl gradient-text"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          1st
                        </motion.div>
                        <div className="text-xs text-muted-foreground">Prize</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

               {/* Right Side - OpenAI Video - Hidden on mobile, visible on lg+ screens */}
               <div className="hidden lg:block relative p-4 md:p-8 lg:p-16 flex items-center justify-center">
                <motion.div
                   className="relative w-full max-w-sm md:max-w-md aspect-video"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                   {/* Video Container */}
                  <motion.div
                    className="relative w-full h-full glassmorphism rounded-3xl overflow-hidden group-hover:glow-cyan transition-all duration-500"
                     whileHover={{ scale: 1.05 }}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-20"></div>

                     {/* Video Player */}
                     <video
                       className="w-full h-full object-cover"
                       autoPlay
                       loop
                       muted
                       playsInline
                       controls={false}
                     >
                       <source src="/images/logos/openai.mp4" type="video/mp4" />
                       Your browser does not support the video tag.
                     </video>
                     
                     {/* Overlay for better text readability */}
                     <div className="absolute inset-0 bg-black/20"></div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}