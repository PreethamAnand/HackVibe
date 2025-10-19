'use client';

import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Building2, Award } from 'lucide-react';

const partnerLogo1 = new URL('../images/logos/logo1.png', import.meta.url).href;
const partnerLogo2 = new URL('../images/logos/logo3.png', import.meta.url).href;
const partnerLogo4 = new URL('../images/logos/logo4.png', import.meta.url).href;
const partnerLogo5 = new URL('../images/logos/logo5.png', import.meta.url).href;
const partnerLogo6 = new URL('../images/logos/logo6.png', import.meta.url).href;
const partnerLogo7 = new URL('../images/logos/logo7.png', import.meta.url).href;
const partnerLogo8 = new URL('../images/logos/logo8.png', import.meta.url).href;
const partnerLogo9 = new URL('../images/logos/logo9.png', import.meta.url).href;

export function GuestsSection() {
  const TBACard = ({
    title,
    description,
    icon: Icon,
    size = "medium"
  }: {
    title: string,
    description: string,
    icon: any,
    size?: "small" | "medium" | "large"
  }) => {
    // Define size-specific classes
    const sizeClasses = {
      small: {
        container: "p-4",
        imageContainer: "w-[6.3rem] h-[6.3rem]",
        icon: "w-12 h-12",
        title: "text-lg",
        description: "text-sm",
        clock: "w-3 h-3",
        comingSoon: "text-xs"
      },
      medium: {
        container: "p-4",
        imageContainer: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32",
        icon: "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16",
        title: "text-lg sm:text-xl md:text-2xl",
        description: "text-sm md:text-base",
        clock: "w-3 h-3 md:w-4 md:h-4",
        comingSoon: "text-xs md:text-sm"
      },
      large: {
        container: "p-4 md:p-6",
        imageContainer: "w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32",
        icon: "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16",
        title: "text-xl md:text-2xl",
        description: "text-sm md:text-lg",
        clock: "w-4 h-4 md:w-5 md:h-5",
        comingSoon: "text-sm md:text-base"
      }
    };
    
    const classes = sizeClasses[size];
    
    return (
      <motion.div
        className={`glassmorphism rounded-2xl ${classes.container} text-center space-y-3 hover:glow-cyan transition-all duration-300 group`}
        whileHover={{ scale: 1.02, y: -5 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={`relative mx-auto ${classes.imageContainer}`}>
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Icon className={`${classes.icon} text-primary`} />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div>
          <h4 className={`gradient-text ${classes.title} mb-1`}>TBA</h4>
          <p className={`hidden md:block text-muted-foreground mb-2 leading-relaxed ${classes.description}`}>{description}</p>
          <div className="flex items-center justify-center space-x-2 text-primary">
            <span className={`font-medium ${classes.comingSoon}`}>Coming Soon</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const PartnerCard = ({
    src,
    name,
  }: {
    src: string;
    name: string;
  }) => (
    <motion.div
      className="glassmorphism rounded-2xl p-4 text-center space-y-3 hover:glow-purple transition-all duration-300 group"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className={`relative mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden border-4 border-primary group-hover:border-primary shadow-lg flex items-center justify-center ${name === "Knowation Learning" || name === "HYD DAO" || name === "Code for India Foundation" || name === "Student Tribe" ? "bg-transparent p-1" : "bg-white p-2 sm:p-3 md:p-4"}`}>
        <img src={src} alt={name} className="w-full h-full object-contain max-h-full max-w-full" />
      </div>
      <h4 className="gradient-text text-xs sm:text-sm lg:text-base font-semibold leading-tight">{name}</h4>
    </motion.div>
  );
  
  const JudgeCard = ({
    src,
    name,
    title,
  }: {
    src?: string;
    name: string;
    title: string;
  }) => (
    <motion.div
      className="glassmorphism rounded-2xl p-4 md:p-6 text-center space-y-3 md:space-y-4 hover:glow-purple transition-all duration-300 group"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {src ? (
        <div className="relative mx-auto w-[6.3rem] h-[6.3rem] md:w-[8.4rem] md:h-[8.4rem] rounded-full overflow-hidden border-4 border-primary group-hover:border-primary shadow-lg">
          <img src={src} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative mx-auto w-[6.3rem] h-[6.3rem] md:w-[8.4rem] md:h-[8.4rem] rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Award className="w-12 h-12 md:w-16 md:h-16 text-primary" />
        </div>
      )}
      <div>
        <h4 className="gradient-text text-lg md:text-xl font-semibold mb-1">{name}</h4>
        <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <section id="guests" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl gradient-text mb-4 md:mb-6">Our Community</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Meet the incredible sponsors and jury who make Hack Vibe 2025 possible. 
            Their expertise and support drive innovation and excellence.
          </p>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-4 md:mt-6"></div>
        </motion.div>

        <Tabs defaultValue="sponsors" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 glassmorphism mb-8 md:mb-12">
            <TabsTrigger
              value="sponsors"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Partners
            </TabsTrigger>
            <TabsTrigger
              value="jury"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
            >
              <Award className="w-4 h-4 mr-2" />
              Jury
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sponsors" className="space-y-6 md:space-y-8">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl gradient-text mb-3 md:mb-4">Strategic Partners</h3>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                Leading companies supporting innovation and providing resources for participants.
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <PartnerCard src={partnerLogo1} name="Code for India Foundation" />
              <PartnerCard src={partnerLogo2} name="Edventure Park" />
              <PartnerCard src={partnerLogo4} name="Knowation Learning" />
              <PartnerCard src={partnerLogo5} name="HYD DAO" />
              <PartnerCard src={partnerLogo6} name="Review" />
              <PartnerCard src={partnerLogo7} name="Freedom With AI" />
              <PartnerCard src={partnerLogo8} name="GeeksforGeeks" />
              <PartnerCard src={partnerLogo9} name="Repeatless" />
            </div>
          </TabsContent>

          <TabsContent value="jury" className="space-y-6 md:space-y-8">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl gradient-text mb-3 md:mb-4">Expert Jury</h3>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                Industry leaders and experts who will evaluate projects and select winners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <JudgeCard
                src="/images/jury/jury1.jpg"
                name="Avinash Mada"
                title="Founder - freedom with ai"
              />
              <JudgeCard
                src="/images/jury/jury2.jpg"
                name="Dr Shruti Bhargava Choubey"
                title = "Ceo sreenidhi Ascend, center for Innovation and entrepreneurship"
              />
              <JudgeCard
                src="/images/jury/jury3.jpg"
                name="Chandan Kumar Cheripally"
                title = "Founder - Repeatless agency"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}