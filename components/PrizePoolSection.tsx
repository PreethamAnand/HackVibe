'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';

export function PrizePoolSection() {
  const prizes = [
    {
      id: 1,
      position: '1st Place',
      icon: Trophy,
      gradient: 'from-yellow-400 to-orange-500',
      glow: 'hover:glow-yellow',
      amount: 15000
    },
    {
      id: 2,
      position: '2nd Place', 
      icon: Award,
      gradient: 'from-gray-300 to-gray-500',
      glow: 'hover:glow-cyan',
      amount: 10000
    },
    {
      id: 3,
      position: '3rd Place',
      icon: Star,
      gradient: 'from-amber-600 to-yellow-700',
      glow: 'hover:glow-pink',
      amount: 5000
    }
  ];

  return (
    <section id="prizes" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10"></div>
      <div className="absolute inset-0 cyber-grid opacity-30"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl gradient-text mb-4 md:mb-6">Prize Pool</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Get ready for incredible rewards! We're preparing amazing prizes for our winners. 
            The anticipation is building...
          </p>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-4 md:mt-6"></div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-8">
            {prizes.map((prize, index) => (
              <motion.div
                key={prize.id}
                className={`relative group`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.03, y: -6 }}
                viewport={{ once: true }}
              >
                <div className={`glassmorphism rounded-2xl p-3 md:p-8 text-center transition-all duration-500 ${prize.glow}`}>
                  {/* Prize Icon */}
                  <div className="mb-3 md:mb-8 flex justify-center">
                    <div className={`relative`}>
                      <div className={`p-3 md:p-6 rounded-2xl bg-gradient-to-br ${prize.gradient} transition-transform duration-300 shadow-lg group-hover:scale-110 md:group-hover:scale-110`}> 
                        <prize.icon className="w-6 h-6 md:w-10 md:h-10 text-white" />
                      </div>
                      
                      {/* Animated Ring */}
                      <div className="absolute -inset-2 md:-inset-3 rounded-2xl border-2 border-primary/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Prize Position */}
                  <div className="mb-3 md:mb-6">
                    <h3 className="text-sm md:text-2xl gradient-text mb-1 md:mb-2 group-hover:text-white transition-colors duration-300">
                      {prize.position}
                    </h3>
                    <div className="w-10 md:w-16 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
                  </div>

                  {/* Prize Amount */}
                  <div className="mb-3 md:mb-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto glassmorphism rounded-full border-2 border-primary/50 flex items-center justify-center group-hover:border-primary group-hover:glow-purple transition-all duration-300">
                      <span className="text-sm md:text-2xl font-semibold gradient-text">₹{prize.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Prize Label */}
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-lg text-muted-foreground group-hover:text-white transition-colors duration-300">
                      Cash Prize
                    </p>
                  </div>

                  {/* Digital Corner Accents */}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 w-3 h-3 md:w-4 md:h-4 border-l-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 w-3 h-3 md:w-4 md:h-4 border-r-2 border-t-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-3 h-3 md:w-4 md:h-4 border-l-2 border-b-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-3 h-3 md:w-4 md:h-4 border-r-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Hover Effect Lines */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="glassmorphism rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-lg md:text-xl gradient-text mb-4">What to Expect</h3>
              <div className="grid grid-cols-3 gap-4 md:gap-6 text-sm text-muted-foreground">
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <p>Cash Prizes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎁</div>
                  <p>Exclusive Swag</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🌟</div>
                  <p>Recognition</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">The wait is over. The prizes are revealed.</span>
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
