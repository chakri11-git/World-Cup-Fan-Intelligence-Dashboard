import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import CTA from '../components/landing/CTA';
import PageTransition from '../components/common/PageTransition';

const LandingPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-transparent font-sans text-gray-100 antialiased selection:bg-pitch-green selection:text-gray-950">
        <Navbar />
        <main>
          <Hero />
          <Stats />
          <Features />
          <CTA />
        </main>
        
        {/* Immersive Footer layout */}
        <footer className="border-t border-white/5 bg-transparent py-12 text-center text-xs text-gray-500">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 FanSphere. Powered by Gemini Pro AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#features" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#stats" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#cta" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default LandingPage;
