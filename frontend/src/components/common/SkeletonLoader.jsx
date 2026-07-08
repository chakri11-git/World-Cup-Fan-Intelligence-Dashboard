import React from 'react';

/**
 * Reusable animated Skeleton Loader for clean visual loading states
 */
const SkeletonLoader = ({ type = 'page' }) => {
  if (type === 'card') {
    return (
      <div className="rounded-2xl border border-white/5 bg-gray-900/40 p-6 animate-pulse flex flex-col gap-4">
        <div className="h-10 w-14 rounded-lg bg-gray-800"></div>
        <div className="h-6 w-3/4 rounded bg-gray-800 mt-2"></div>
        <div className="h-4 w-1/2 rounded bg-gray-800"></div>
        <div className="h-12 w-full rounded-lg bg-gray-800 mt-4"></div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full rounded-2xl border border-white/5 bg-gray-900/20 p-6 animate-pulse flex flex-col gap-4">
        <div className="h-6 w-1/4 rounded bg-gray-800 mb-4"></div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
              <div className="h-4 w-1/3 rounded bg-gray-800"></div>
              <div className="h-4 w-12 rounded bg-gray-800"></div>
              <div className="h-4 w-8 rounded bg-gray-800"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex flex-col gap-6 animate-pulse">
      {/* Navbar mockup skeleton */}
      <div className="h-16 w-full rounded-xl bg-gray-900/40 border border-white/5 mb-8"></div>
      
      {/* Content grid mockup */}
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="h-10 w-1/3 rounded bg-gray-900/60"></div>
          <div className="h-4 w-1/2 rounded bg-gray-900/40"></div>
          <div className="h-64 w-full rounded-2xl bg-gray-900/20 border border-white/5 mt-6"></div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-48 w-full rounded-2xl bg-gray-900/20 border border-white/5"></div>
          <div className="h-48 w-full rounded-2xl bg-gray-900/20 border border-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
