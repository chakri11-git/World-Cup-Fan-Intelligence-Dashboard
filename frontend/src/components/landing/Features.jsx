import React from 'react';
import { Cpu, Zap, MessageSquare, ShieldAlert, Award } from 'lucide-react';
import FeatureCard from './FeatureCard';

/**
 * Features — Bento-grid feature showcase section.
 * Each card uses the shared FeatureCard wrapper; card data lives
 * in the FEATURE_CARDS array to avoid repeated JSX blocks.
 */
const Features = () => (
  <section id="features" className="py-24 bg-gray-950/20">
    <div className="mx-auto max-w-7xl px-6">
      <div className="text-center mb-16">
        <h2 className="text-sm font-semibold tracking-wider text-pitch-green uppercase">
          Comprehensive Features
        </h2>
        <p className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Take command of the match
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* AI Tactical Analyst — spans 2 columns */}
        <FeatureCard colSpan={2} accentColor="hover:border-pitch-green/20">
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
          <div className="mt-8 rounded-xl border border-white/5 bg-gray-950/80 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-pitch-green animate-pulse" />
              <span className="text-xs text-gray-400 font-semibold uppercase">Real-Time Prompt Input</span>
            </div>
            <p className="text-sm text-gray-300 italic">
              &quot;How will France counter Spain&apos;s wingers in the semi-final?&quot;
            </p>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-500 flex justify-between">
              <span>Confidence: 94%</span>
              <span>Response Time: 0.12s</span>
            </div>
          </div>
        </FeatureCard>

        {/* Live Match Telemetry */}
        <FeatureCard accentColor="hover:border-blue-500/20">
          <div>
            <Zap className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold text-white">Live telemetry</h3>
            <p className="mt-2 text-sm text-gray-400">
              Auto-polling score tickers and timeline event streams delivering real-time action straight to your hub.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {[{ time: "12'", event: 'GOAL', player: 'L. Messi' }, { time: "42'", event: 'GOAL', player: 'Vinicius Jr' }].map((e) => (
              <div key={e.time} className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-2 text-xs border border-white/5">
                <span>⏱️ {e.time} - {e.event}</span>
                <span className="font-bold text-pitch-green">{e.player}</span>
              </div>
            ))}
          </div>
        </FeatureCard>

        {/* Sentiment Chat */}
        <FeatureCard accentColor="hover:border-yellow-500/20">
          <div>
            <MessageSquare className="h-8 w-8 text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-white">Community Chat sentiment</h3>
            <p className="mt-2 text-sm text-gray-400">
              Engage in discussions. AI parses sentiment to index fan vibes and predict support indicators.
            </p>
          </div>
          <div className="mt-8 flex justify-between items-center text-xs">
            {[{ pct: '78%', label: 'Positive', color: 'text-pitch-green' }, { pct: '14%', label: 'Neutral', color: 'text-gray-400' }, { pct: '8%', label: 'Negative', color: 'text-red-500' }].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className={`${s.color} font-bold text-lg`}>{s.pct}</span>
                <span className="text-gray-500 uppercase mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </FeatureCard>

        {/* Historical Archives — spans 2 columns */}
        <FeatureCard colSpan={2} accentColor="hover:border-pitch-green/20">
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
            {[{ year: '2022', winner: 'Argentina' }, { year: '2018', winner: 'France' }, { year: '2014', winner: 'Germany' }].map((c) => (
              <div key={c.year} className="rounded-lg bg-white/5 p-3 border border-white/5">
                <div className="text-lg font-bold text-white">{c.year}</div>
                <div className="text-xs text-gray-500">Winner: {c.winner}</div>
              </div>
            ))}
          </div>
        </FeatureCard>

      </div>
    </div>
  </section>
);

export default Features;
