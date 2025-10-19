'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageGallerySection() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    '/images/gallery/img0.jpg',
    '/images/gallery/img1.jpg',
    '/images/gallery/img2.jpg',
    '/images/gallery/img3.jpg',
    '/images/gallery/img4.jpg',
    '/images/gallery/img5.jpg',
    '/images/gallery/img6.jpg',
    '/images/gallery/img7.jpg',
    '/images/gallery/img8.jpg',
    '/images/gallery/img9.jpg',
    '/images/gallery/img10.jpg'
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl gradient-text mb-6">Previous Year Hackathons</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Take a look at the amazing moments from our previous events and get excited for what's coming!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-6"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Main Image Carousel */}
          <div className="relative">
            <motion.div
              className="relative aspect-[3/2] sm:aspect-[4/3] md:aspect-[16/10] max-w-4xl mx-auto rounded-2xl overflow-hidden glassmorphism border border-primary/20 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={images[currentImage]}
                  alt={`Gallery image ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glassmorphism border border-primary/30 flex items-center justify-center text-white hover:bg-primary/20 hover:border-primary transition-all duration-300 group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glassmorphism border border-primary/30 flex items-center justify-center text-white hover:bg-primary/20 hover:border-primary transition-all duration-300 group"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            className="mt-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-full bg-gray-700 rounded-full h-1">
              <motion.div
                className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentImage + 1) / images.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
