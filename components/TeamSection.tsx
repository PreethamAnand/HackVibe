'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Users } from 'lucide-react';

export function TeamSection() {
  // Placeholder team members
  const teamMembers = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: 'Coming Soon',
    role: '',
    description: 'Stay tuned'
  }));

  return (
    <section id="team" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* Circuit Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="team-circuit" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M12.5 0v25M0 12.5h25" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
              <circle cx="12.5" cy="12.5" r="3" fill="currentColor" className="text-secondary"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#team-circuit)"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl gradient-text mb-6">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Behind every great hackathon is an amazing team. We're assembling the perfect crew 
            to make Hack Vibe 2025 unforgettable.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="glassmorphism rounded-2xl p-4 md:p-8 text-center group hover:glow-purple transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                viewport={{ once: true }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Avatar Section */}
                <div className="relative mb-3 md:mb-6 flex justify-center">
                  <div className="relative">
                    {/* Main Avatar Circle */}
                    <div className="w-16 h-16 md:w-32 md:h-32 rounded-full glassmorphism border-2 border-primary/50 flex items-center justify-center group-hover:border-primary group-hover:glow-purple transition-all duration-500 relative z-10 group-hover:scale-[3] transform">
                      <HelpCircle className="w-8 h-8 md:w-16 md:h-16 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    
                    {/* Outer Glow Ring */}
                    <div className="absolute -inset-2 md:-inset-3 rounded-full border-2 border-secondary/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                    
                    {/* Inner Pulse Ring */}
                    <div className="absolute -inset-1 rounded-full border border-accent/50 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-2 md:space-y-4">
                  <div>
                    <h3 className="text-sm md:text-xl gradient-text group-hover:text-white transition-colors duration-300 mb-1 md:mb-2">
                      {member.name}
                    </h3>
                    
                    {member.role && (
                      <p className="text-xs md:text-sm text-secondary group-hover:text-accent transition-colors duration-300 mb-1 md:mb-2">
                        {member.role}
                      </p>
                    )}
                    
                    <p className="text-xs md:text-sm text-muted-foreground group-hover:text-gray-300 transition-colors duration-300">
                      {member.description}
                    </p>
                  </div>

                  {/* Placeholder for Social Links */}
                  <div className="flex justify-center space-x-2 md:space-x-3 opacity-50">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full glassmorphism border border-primary/30 flex items-center justify-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-primary/50 rounded-full"></div>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full glassmorphism border border-secondary/30 flex items-center justify-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-secondary/50 rounded-full"></div>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full glassmorphism border border-accent/30 flex items-center justify-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-accent/50 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Digital Corner Accents */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 w-3 h-3 md:w-4 md:h-4 border-l-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-2 right-2 md:top-3 md:right-3 w-3 h-3 md:w-4 md:h-4 border-r-2 border-t-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-3 h-3 md:w-4 md:h-4 border-l-2 border-b-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-3 h-3 md:w-4 md:h-4 border-r-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Hover Effect Lines */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* Team Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism rounded-xl p-4 md:p-6 text-center">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2 md:mb-3" />
              <div className="text-lg md:text-2xl gradient-text mb-1">2+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Team Members</div>
            </div>
            
            <div className="glassmorphism rounded-xl p-4 md:p-6 text-center">
              <div className="text-lg md:text-2xl mb-2 md:mb-3">🏆</div>
              <div className="text-lg md:text-2xl gradient-text mb-1">2+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Years Experience</div>
            </div>
            
            <div className="glassmorphism rounded-xl p-4 md:p-6 text-center">
              <div className="text-lg md:text-2xl mb-2 md:mb-3">❤️</div>
              <div className="text-lg md:text-2xl gradient-text mb-1">∞</div>
              <div className="text-xs md:text-sm text-muted-foreground">Passion for Innovation</div>
            </div>
          </motion.div>

          {/* Coming Soon Message */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-3 glassmorphism rounded-full px-8 py-4">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Meet the amazing team behind HackVibe soon!</span>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
