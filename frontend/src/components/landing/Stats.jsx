import React from 'react';
import { motion } from 'framer-motion';

const statsData = [
  { value: '99.8%', label: 'Prediction Accuracy', desc: 'AI confidence parameters' },
  { value: '1.2M+', label: 'Active World Cup Fans', desc: 'In-app community chatters' },
  { value: '25ms', label: 'Telemetry Latency', desc: 'Real-time WebSocket feed updates' },
  { value: '16k+', label: 'Tactical Breakdowns', desc: 'Custom Gemini queries generated' }
];

const Stats = () => {
  return (
    <section id="stats" className="border-y border-white/5 bg-gray-950/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-pitch-green uppercase">Performance Metrics</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Engineered for real-time scale</p>
        </div>

        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          {statsData.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center sm:items-start px-8 py-6"
            >
              <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-semibold text-white">{stat.label}</span>
              <span className="mt-1 text-xs text-gray-500">{stat.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
