import React from 'react';

/**
 * AIDisclaimer — Reusable compliance notice rendered under every AI-generated block.
 * Satisfies the "no AI disclaimer" audit finding by ensuring users are aware that
 * content is model-generated and may not reflect real-time data.
 *
 * @param {string} [className] - Optional extra CSS classes for layout overrides.
 */
const AIDisclaimer = ({ className = '' }) => (
  <p
    className={`text-[10px] text-gray-500 italic mt-2 leading-relaxed select-none ${className}`}
    role="note"
    aria-label="AI-generated content disclaimer"
  >
    ⚡ AI-generated insight based on available data. May not reflect real-time changes.
  </p>
);

export default AIDisclaimer;
