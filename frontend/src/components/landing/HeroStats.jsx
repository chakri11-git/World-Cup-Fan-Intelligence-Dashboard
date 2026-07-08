import React from 'react';
import { motion } from 'framer-motion';

/**
 * HeroStats — The animated dashboard preview / mock stats skeleton
 * displayed below the CTA in the Hero section.
 * Extracted to keep Hero.jsx under the 100-line threshold.
 */
const HeroStats = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 40 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.4 }}
    className="mx-auto mt-20 max-w-5xl rounded-2xl border border-white/5 bg-gray-900/40 p-4 backdrop-blur-xl shadow-2xl border-beam w-full"
  >
    <div className="rounded-xl border border-white/5 bg-gray-950 p-6 text-left">
      {/* Mock Dashboard title-bar chrome */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase">
          Live Feed Mode
        </span>
      </div>

      {/* Three stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 rounded-lg bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-semibold uppercase">Match Tracker</span>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold">ARG 2 - 1 BRA</span>
            <span className="text-xs text-red-500 font-extrabold animate-pulse">74&apos; LIVE</span>
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
);

export default HeroStats;
