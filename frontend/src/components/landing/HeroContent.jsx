import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * HeroContent — The copy + CTA button block from the Hero section.
 * Extracted to keep Hero.jsx under the 100-line threshold.
 */
const HeroContent = () => (
  <div className="mx-auto max-w-7xl px-6 text-center w-full flex flex-col items-center justify-center">
    {/* Spotlight top header pill */}
    <div className="flex justify-center w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 rounded-full border border-pitch-green/20 bg-pitch-green/5 px-4 py-1.5 text-xs font-semibold text-pitch-green mb-8"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>AI-Powered World Cup Insights Live Now</span>
      </motion.div>
    </div>

    {/* Large Main Heading */}
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-none text-center"
    >
      The World Cup, <br />
      Reimagined by AI.
    </motion.h1>

    {/* Subtitle description */}
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 sm:text-xl leading-relaxed font-normal text-center"
    >
      Experience match analytics, community prediction sentiments, and tactical simulations driven by Gemini Pro. Built for true football fans.
    </motion.p>

    {/* Dual Actions CTA Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto w-full"
    >
      <Link
        to="/dashboard"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-gray-950 hover:bg-gray-200 transition-all duration-200 shadow-lg shadow-white/5 btn-animated cursor-pointer"
      >
        Explore Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        to="/teams"
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors duration-200 backdrop-blur-md btn-animated cursor-pointer"
      >
        Explore Contenders
      </Link>
    </motion.div>
  </div>
);

export default HeroContent;
