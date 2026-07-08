import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section id="cta" className="relative py-24 overflow-hidden border-t border-white/5 bg-gray-950">
      <div className="absolute inset-0 bg-radial-gradient from-pitch-green/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/5 bg-gradient-to-b from-gray-900 to-gray-950 px-8 py-16 sm:px-16 sm:py-24 shadow-3xl border-beam"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Join the Next Era of Football Fans
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-md text-gray-400 leading-relaxed">
            Create your custom fan profile, track tournament statistics, share predictions, and analyze games with Gemini AI. Free to join.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/profile" 
              className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-base font-bold text-gray-950 hover:bg-gray-200 transition-all btn-animated cursor-pointer"
            >
              Get Started Now
            </Link>
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors btn-animated cursor-pointer"
            >
              Launch App
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
