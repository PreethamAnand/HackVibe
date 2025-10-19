'use client';

import { motion } from 'framer-motion';
import { Brain, Users, Lightbulb, Zap, Code, Trophy } from 'lucide-react';

export function AboutSection() {
  const features = [
    { icon: Brain, title: 'AI Innovation', description: 'Push the boundaries of artificial intelligence' },
    { icon: Users, title: 'Team Collaboration', description: 'Work with brilliant minds from diverse backgrounds' },
    { icon: Lightbulb, title: 'Creative Solutions', description: 'Transform ideas into groundbreaking applications' },
    { icon: Zap, title: 'Fast-Paced', description: '24 hours of intensive coding and innovation' },
    { icon: Code, title: 'Latest Tech', description: 'Access to cutting-edge tools and platforms' },
    { icon: Trophy, title: 'Amazing Prizes', description: 'Win cash prizes and exclusive opportunities' }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Side - Mission Card */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism rounded-2xl p-6 md:p-8 floating">
              <div className="mb-6">
                <h2 className="text-2xl md:text-4xl gradient-text mb-4">About Hack Vibe</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              </div>
              
              <div className="space-y-6 text-base md:text-lg text-muted-foreground">
                <p>
                  Hack Vibe is more than just a hackathon – it's a convergence of brilliant minds, 
                  cutting-edge technology, and limitless creativity. Join us for 24 hours of 
                  intensive innovation where AI meets human ingenuity.
                </p>
                
                <p>
                  Whether you're a seasoned developer, a design enthusiast, or an AI researcher, 
                  Hack Vibe provides the perfect platform to showcase your skills, learn from 
                  industry experts, and build solutions that could change the world.
                </p>
                
                {/* <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm">500+ Participants</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                    <span className="text-sm">24 Hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-sm">5K+ Prizes</span>
                  </div>
                </div> */}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Animated Icons Grid */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glassmorphism rounded-xl p-6 text-center group hover:glow-purple transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-base md:text-lg mb-2 gradient-text">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
