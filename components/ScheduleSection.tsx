'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Trophy, Coffee, Presentation } from 'lucide-react';

export function ScheduleSection() {
  const schedule = [
    {
      day: 'Day 1',
      date: 'Kickoff & Development',
      events: [
        {
          time: '09:30 - 10:00',
          title: 'Opening Ceremony',
          description: 'Welcome and event kickoff.',
          icon: Users,
          type: 'ceremony'
        },
        {
          time: '10:00 - 10:30',
          title: 'Idea Presentation & Team Formation',
          description: 'Present ideas and form teams.',
          icon: Presentation,
          type: 'planning'
        },
        {
          time: '10:30 - 12:30',
          title: 'Development Session 1',
          description: 'First coding and development phase.',
          icon: Users,
          type: 'hack'
        },
        {
          time: '12:30 - 01:00',
          title: 'First Evaluation (Initial Check-in)',
          description: 'Initial progress assessment.',
          icon: Coffee,
          type: 'evaluation'
        },
        {
          time: '01:00 - 02:00',
          title: 'Lunch (Bring Your Own)',
          description: 'Lunch break and networking.',
          icon: Clock,
          type: 'break'
        },
        {
          time: '02:00 - 04:00',
          title: 'Development Session 2',
          description: 'Second development phase.',
          icon: Calendar,
          type: 'hack'
        },
        {
          time: '04:00 - 05:00',
          title: 'Second Evaluation (Team Elimination Round)',
          description: 'Assessment and team elimination.',
          icon: Coffee,
          type: 'evaluation'
        },
        {
          time: '05:00 - 05:30',
          title: 'Snacks Break',
          description: 'Quick refreshments.',
          icon: Clock,
          type: 'break'
        },
        {
          time: '05:30 - 08:00',
          title: 'Development Session 3 (Part 1)',
          description: 'Evening development phase.',
          icon: Coffee,
          type: 'hack'
        },
        {
          time: '08:00 - 08:30',
          title: 'Dinner (Provided)',
          description: 'Dinner break and networking.',
          icon: Clock,
          type: 'break'
        },
        {
          time: '08:30 - 12:00',
          title: 'Development Session 3 (Part 2)',
          description: 'Late evening development phase.',
          icon: Clock,
          type: 'hack'
        }
      ]
    },
    {
      day: 'Day 2',
      date: 'Final Sprint & Presentations',
      events: [
        {
          time: '12:00 - 06:00',
          title: 'Development Session 4 (Overnight Work)',
          description: 'Overnight coding and development.',
          icon: Users,
          type: 'hack'
        },
        {
          time: '06:00 - 07:00',
          title: 'Morning Evaluation & Selection of Top 10',
          description: 'Final assessment and top 10 selection.',
          icon: Presentation,
          type: 'evaluation'
        },
        {
          time: '07:00 - 07:30',
          title: 'Breakfast (Provided)',
          description: 'Morning breakfast and preparation.',
          icon: Presentation,
          type: 'break'
        },
        {
          time: '07:30 - 08:30',
          title: 'Top 10 Presentations',
          description: 'Final project presentations.',
          icon: Trophy,
          type: 'demo'
        },
        {
          time: '08:30 - 09:30',
          title: 'Results Announcement & Closing',
          description: 'Winner announcement and closing ceremony.',
          icon: Trophy,
          type: 'ceremony'
        }
      ]
    }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ceremony': return 'from-purple-500 to-pink-500';
      case 'hack': return 'from-green-500 to-emerald-500';
      case 'break': return 'from-orange-500 to-yellow-500';
      case 'mentor': return 'from-blue-500 to-cyan-500';
      case 'demo': return 'from-red-500 to-pink-500';
      case 'deadline': return 'from-red-500 to-orange-500';
      case 'planning': return 'from-indigo-500 to-purple-500';
      case 'evaluation': return 'from-amber-500 to-orange-500';
      case 'prep': return 'from-teal-500 to-cyan-500';
      case 'general': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section id="schedule" className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl gradient-text mb-4 sm:mb-6">Event Schedule</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            2 days of intensive innovation, learning, and collaboration. 
            Here's your roadmap to hackathon success.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-4 sm:mt-6"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {schedule.map((day, dayIndex) => (
            <motion.div
              key={day.day}
              className="mb-12 sm:mb-16 last:mb-0"
              initial={{ opacity: 0, x: dayIndex % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: dayIndex * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Day Header */}
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center space-x-3 sm:space-x-4 glassmorphism rounded-2xl px-6 sm:px-8 py-3 sm:py-4 mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <div>
                    <h3 className="text-xl sm:text-2xl gradient-text">{day.day}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{day.date}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Central Timeline Line - Hidden on mobile */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent rounded-full"></div>

                {/* Events */}
                <div className="space-y-4 sm:space-y-8">
                  {day.events.map((event, eventIndex) => (
                    <motion.div
                      key={`${day.day}-${eventIndex}`}
                      className={`flex items-center ${eventIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} lg:${eventIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: eventIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {/* Event Card */}
                      <div className="w-full lg:w-5/12">
                        <motion.div
                          className="glassmorphism rounded-2xl p-4 sm:p-6 group hover:glow-purple transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${getEventColor(event.type)} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                              <event.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xs sm:text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                  {event.time}
                                </span>
                              </div>
                              <h4 className="text-base sm:text-lg gradient-text mb-2">{event.title}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">{event.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Timeline Node - Hidden on mobile */}
                      <div className="hidden lg:flex w-2/12 justify-center">
                        <motion.div
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background shadow-lg pulse-glow"
                          whileHover={{ scale: 1.5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      </div>

                      {/* Spacer - Hidden on mobile */}
                      <div className="hidden lg:block w-5/12"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-12 sm:mt-16 space-y-6 sm:space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="glassmorphism rounded-xl p-4 sm:p-6 text-center">
              <div className="text-xl sm:text-2xl gradient-text mb-2">2</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Days of Innovation</div>
            </div>
            <div className="glassmorphism rounded-xl p-4 sm:p-6 text-center">
              <div className="text-xl sm:text-2xl gradient-text mb-2">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Mentor Support</div>
            </div>
            <div className="glassmorphism rounded-xl p-4 sm:p-6 text-center">
              <div className="text-xl sm:text-2xl gradient-text mb-2">∞</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Possibilities</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
