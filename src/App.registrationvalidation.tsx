import React, { useState } from 'react';
import { RegistrationPage } from '../components/RegistrationPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'register'>('register');

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'register') {
    return <RegistrationPage onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Registration Validation Demo</h1>
        <button 
          onClick={() => setCurrentPage('register')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        >
          Go to Registration
        </button>
      </div>
    </div>
  );
}