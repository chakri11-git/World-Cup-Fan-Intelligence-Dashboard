import React from 'react';
import { motion } from 'framer-motion';

/**
 * FeatureCard — Reusable bento-grid card for the Features section.
 * Extracted from Features.jsx to eliminate repeated JSX blocks and
 * keep Features.jsx under the 100-line threshold.
 *
 * @param {string}    accentColor  - Tailwind border hover color class, e.g. 'hover:border-pitch-green/20'
 * @param {number}    colSpan      - Optional grid column span (default 1, pass 2 for wide cards)
 * @param {ReactNode} children     - Card content
 */
const FeatureCard = ({ accentColor = 'hover:border-white/10', colSpan = 1, children }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`${colSpan === 2 ? 'md:col-span-2' : ''} rounded-2xl border border-white/5 bg-gradient-to-b from-gray-900/60 to-gray-950 p-8 flex flex-col justify-between ${accentColor} hover:border transition-colors duration-300`}
  >
    {children}
  </motion.div>
);

export default FeatureCard;
