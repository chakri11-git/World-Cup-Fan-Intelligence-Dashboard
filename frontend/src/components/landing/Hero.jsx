import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 glow-spotlight grid-bg">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Spotlight top header pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-pitch-green/20 bg-pitch-green/5 px-4 py-1.5 text-xs font-semibold text-pitch-green mb-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI-Powered World Cup Insights Live Now</span>
        </motion.div>

        {/* Large Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-none"
        >
          The World Cup, <br />
          Reimagined by AI.
        </motion.h1>

        {/* Subtitle description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 sm:text-xl leading-relaxed font-normal"
        >
          Experience match analytics, community prediction sentiments, and tactical simulations driven by Gemini Pro. Built for true football fans.
        </motion.p>

        {/* Dual Actions CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
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

        {/* Dashboard Preview skeleton mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto mt-20 max-w-5xl rounded-2xl border border-white/5 bg-gray-900/40 p-4 backdrop-blur-xl shadow-2xl border-beam"
        >
          <div className="rounded-xl border border-white/5 bg-gray-950 p-6 text-left">
            {/* Mock Dashboard Layout */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Live Feed Mode</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 rounded-lg bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase">Match Tracker</span>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">ARG 2 - 1 BRA</span>
                  <span className="text-xs text-red-500 font-extrabold animate-pulse">74' LIVE</span>
                </div>
              </div>
              <div className="h-32 rounded-lg bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase">Gemini AI Engine</span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-pitch-green">Tactical Analysis Ready</span>
                  <span className="text-xs text-gray-500">Click to run prediction report...</span>
                </div>
              </div>
              <div className="h-32 rounded-lg bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase">Community Sentiment</span>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-bold text-pitch-green">POSITIVE (78%)</span>
                  <span className="text-xs text-gray-500">2.4k messages/min</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
