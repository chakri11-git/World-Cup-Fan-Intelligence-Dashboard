import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Teams', href: '/teams' },
    { name: 'Groups', href: '/groups' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Profile', href: '/profile' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Trophy className="h-6 w-6 text-pitch-green" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pitch-green to-blue-500 bg-clip-text text-transparent">
              FanSphere
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-pitch-green' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="hidden md:block">
            <Link 
              to="/dashboard"
              className="relative inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-b border-white/5 bg-gray-950"
          >
            <div className="flex flex-col gap-4 px-6 pb-6 pt-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-medium transition-colors duration-200 ${
                      isActive ? 'text-pitch-green' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full block rounded-full bg-white py-3 text-center text-sm font-semibold text-gray-950 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
