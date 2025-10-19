'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigateToRegister: () => void;
  onNavigateToHome?: () => void;
}

export function Header({ onNavigateToRegister, onNavigateToHome }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'About', 'Themes', 'Schedule', 'Contact'];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glassmorphism py-2' : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-4 sm:px-6 flex items-center justify-between min-h-[80px]">
        {/* Logo */}
        <motion.div
          className="text-3xl sm:text-2xl lg:text-3xl gradient-text cursor-pointer flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateToHome}
        >
          <span className="font-mono">HackVibe</span>
        </motion.div>

        {/* Right side content */}
        <div className="flex items-center lg:items-baseline space-x-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-baseline space-x-8">
            {navItems.map((item, index) => {
              const sectionId = item === 'Home' ? 'home' : 
                               item === 'Prizes' ? 'prizes' : 
                               item.toLowerCase();
              return (
                <motion.a
                  key={item}
                  href={`#${sectionId}`}
                  className="text-white hover:text-primary transition-colors duration-300 relative group text-base font-medium leading-none"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              );
            })}
          </div>

          {/* Desktop Register Button */}
          <motion.div
            className="hidden lg:flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={onNavigateToRegister}
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 glow-purple hover:glow-cyan transition-all duration-300 h-10 px-5 text-base font-medium leading-none"
            >
              Register
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-white hover:text-primary transition-colors flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 glassmorphism border-t border-primary/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item, index) => {
                  const sectionId = item === 'Home' ? 'home' : 
                                   item === 'Prizes' ? 'prizes' : 
                                   item.toLowerCase();
                  return (
                    <motion.a
                      key={item}
                      href={`#${sectionId}`}
                      className="text-white hover:text-primary transition-colors duration-300 text-lg py-2"
                      onClick={closeMobileMenu}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item}
                    </motion.a>
                  );
                })}
                <motion.div
                  className="pt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 glow-purple hover:glow-cyan transition-all duration-300 text-lg py-3 px-4 font-medium"
                    onClick={() => {
                      closeMobileMenu();
                      onNavigateToRegister();
                    }}
                  >
                    Register
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
