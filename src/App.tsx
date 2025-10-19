import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingChatBot } from '../components/FloatingChatBot';
import { Skeleton } from '../components/ui/skeleton';

const HeroSection = lazy(() => import('../components/HeroSection').then(module => ({ default: module.HeroSection })));
const AboutSection = lazy(() => import('../components/AboutSection').then(module => ({ default: module.AboutSection })));
const ThemesSection = lazy(() => import('../components/ThemesSection').then(module => ({ default: module.ThemesSection })));
const ScheduleSection = lazy(() => import('../components/ScheduleSection').then(module => ({ default: module.ScheduleSection })));
const GuestsSection = lazy(() => import('../components/GuestsSection').then(module => ({ default: module.GuestsSection })));
const PrizePoolSection = lazy(() => import('../components/PrizePoolSection').then(module => ({ default: module.PrizePoolSection })));
const TeamSection = lazy(() => import('../components/TeamSection').then(module => ({ default: module.TeamSection })));
const ContactSection = lazy(() => import('../components/ContactSection').then(module => ({ default: module.ContactSection })));
const RegistrationPage = lazy(() => import('../components/RegistrationPage').then(module => ({ default: module.RegistrationPage })));
const ImageGallerySection = lazy(() => import('../components/ImageGallerySection').then(module => ({ default: module.ImageGallerySection })));

const LoadingFallback = () => (
  <div className="space-y-8 p-8">
    <Skeleton className="h-64 w-full" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'register'>('home');

  // Prefetch RegistrationPage to avoid visible fallback during navigation
  useEffect(() => {
    import('../components/RegistrationPage');
  }, []);

  const handleNavigateToRegister = () => {
    setCurrentPage('register');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'register') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <RegistrationPage onBackToHome={handleBackToHome} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onNavigateToRegister={handleNavigateToRegister} onNavigateToHome={handleBackToHome} />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <HeroSection onNavigateToRegister={handleNavigateToRegister} />
          <AboutSection />
          <ThemesSection />
          <ScheduleSection />
          <GuestsSection />
          <PrizePoolSection />
          <TeamSection />
          <ImageGallerySection />
          <ContactSection />
        </Suspense>
      </main>
      <Footer isRegistrationPage={false} onNavigateToRegister={handleNavigateToRegister} onNavigateToHome={handleBackToHome} />
      <FloatingChatBot />
    </div>
  );
}