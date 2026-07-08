import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SkeletonLoader from '../components/common/SkeletonLoader';

// Lazy loading all pages for optimized bundle size and initial load performance
const LandingPage = lazy(() => import('../pages/LandingPage'));
const TeamExplorer = lazy(() => import('../pages/TeamExplorer'));
const TeamProfile = lazy(() => import('../pages/TeamProfile'));
const GroupDashboard = lazy(() => import('../pages/GroupDashboard'));
const FanProfilePage = lazy(() => import('../pages/FanProfilePage'));
const SupportAnalytics = lazy(() => import('../pages/SupportAnalytics'));
const Home = lazy(() => import('../pages/Home'));

/**
 * Declares all application routes mapping views to endpoints with lazy loading and suspense skeleton loader integration
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        {/* Premium Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Team Explorer page */}
        <Route path="/teams" element={<TeamExplorer />} />
        
        {/* Team Profile details page */}
        <Route path="/teams/:teamId" element={<TeamProfile />} />
        
        {/* Group standings and stats dashboard */}
        <Route path="/groups" element={<GroupDashboard />} />
        
        {/* Fan profile and settings */}
        <Route path="/profile" element={<FanProfilePage />} />
        
        {/* Recharts support analytics page */}
        <Route path="/analytics" element={<SupportAnalytics />} />
        
        {/* Interactive MERN Dashboard Hub */}
        <Route path="/dashboard" element={<Home />} />
        
        {/* Wildcard fallback redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
