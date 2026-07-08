import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, MessageSquare, ShieldAlert, Award } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gray-950/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-pitch-green uppercase">Comprehensive Features</h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Take command of the match</p>
        </div>

        {/* Bento Grid Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Tactical Analyst (Spans 2 columns) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 rounded-2xl border border-white/5 bg-gradient-to-b from-gray-900/60 to-gray-950 p-8 flex flex-col justify-between hover:border-pitch-green/20 transition-colors duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <Cpu className="h-8 w-8 text-pitch-green mb-4" />
                <h3 className="text-2xl font-bold text-white">Gemini Pro AI analyst</h3>
                <p className="mt-2 text-sm text-gray-400 max-w-md">
                  Retrieve immediate match projections, tactical alignment reports, and set-piece trends customized dynamically per fixture.
                </p>
              </div>
              <span className="rounded-full bg-pitch-green/10 border border-pitch-green/20 px-3 py-1 text-xs font-semibold text-pitch-green">
                Gemini 1.5 Pro
              </span>
            </div>

            {/* Simulated AI Prompt interface */}
            <div className="mt-8 rounded-xl border border-white/5 bg-gray-950/80 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-pitch-green animate-pulse"></span>
                <span className="text-xs text-gray-400 font-semibold uppercase">Real-Time Prompt Input</span>
              </div>
              <p className="text-sm text-gray-300 italic">"How will France counter Spain's wingers in the semi-final?"</p>
              <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-500 flex justify-between">
                <span>Confidence: 94%</span>
                <span>Response Time: 0.12s</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Live Match Telemetry */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-white/5 bg-gradient-to-b from-gray-900/60 to-gray-950 p-8 flex flex-col justify-between hover:border-blue-500/20 transition-colors duration-300"
          >
            <div>
              <Zap className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-white">Live telemetry</h3>
              <p className="mt-2 text-sm text-gray-400">
                Auto-polling score tickers and timeline event streams delivering real-time action straight to your hub.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <div className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-2 text-xs border border-white/5">
                <span>⏱️ 12' - GOAL</span>
                <span className="font-bold text-pitch-green">L. Messi</span>
              </div>
              <div className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-2 text-xs border border-white/5">
                <span>⏱️ 42' - GOAL</span>
                <span className="font-bold text-pitch-green">Vinicius Jr</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Sentiment Chat space */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-2xl border border-white/5 bg-gradient-to-b from-gray-900/60 to-gray-950 p-8 flex flex-col justify-between hover:border-yellow-500/20 transition-colors duration-300"
          >
            <div>
              <MessageSquare className="h-8 w-8 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold text-white">Community Chat sentiment</h3>
              <p className="mt-2 text-sm text-gray-400">
                Engage in discussions. AI parses sentiment to index fan vibes and predict support indicators.
              </p>
            </div>

            <div className="mt-8 flex justify-between items-center text-xs">
              <div className="flex flex-col items-center">
                <span className="text-pitch-green font-bold text-lg">78%</span>
                <span className="text-gray-500 uppercase mt-1">Positive</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 font-bold text-lg">14%</span>
                <span className="text-gray-500 uppercase mt-1">Neutral</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-red-500 font-bold text-lg">8%</span>
                <span className="text-gray-500 uppercase mt-1">Negative</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Historical archives (Spans 2 columns) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 rounded-2xl border border-white/5 bg-gradient-to-b from-gray-900/60 to-gray-950 p-8 flex flex-col justify-between hover:border-pitch-green/20 transition-colors duration-300"
          >
            <div className="flex items-start gap-6">
              <Award className="h-8 w-8 text-trophy-gold shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-white">Legendary World Cup archives</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Analyze records, past champions, historical scorers, and look up details of previous championships using integrated search layouts.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                <div className="text-lg font-bold text-white">2022</div>
                <div className="text-xs text-gray-500">Winner: Argentina</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                <div className="text-lg font-bold text-white">2018</div>
                <div className="text-xs text-gray-500">Winner: France</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3 border border-white/5">
                <div className="text-lg font-bold text-white">2014</div>
                <div className="text-xs text-gray-500">Winner: Germany</div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default Features;
