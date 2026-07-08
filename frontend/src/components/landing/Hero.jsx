import React from 'react';
import HeroContent from './HeroContent';
import HeroStats from './HeroStats';

/**
 * Hero — Landing page hero section.
 * Composed from HeroContent (copy + CTAs) and HeroStats (dashboard preview).
 */
const Hero = () => (
  <section className="relative overflow-hidden pt-24 pb-20 glow-spotlight grid-bg flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
    <HeroContent />
    <HeroStats />
  </section>
);

export default Hero;
