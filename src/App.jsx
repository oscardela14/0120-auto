import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import TopicPage from './pages/TopicPage';
import TrendsPage from './pages/TrendsPage';
import RevenuePage from './pages/RevenuePage';
import TestPage from './pages/TestPage';
import { GA4Page } from './pages/GA4Page';
import { StudioPage, HistoryPage, PricingPage, GuidePage, SettingsPage, AnalyzerPage, ProductionLabPage, GrowthPage, ReputationPage, ReconPage, FanCarePage } from './pages/PageWrappers';
import './App.css';

import CommunityPage from './pages/CommunityPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="ga4" element={<GA4Page />} />
            <Route path="trends" element={<TrendsPage />} />
            <Route path="topics" element={<TopicPage />} />
            <Route path="studio" element={<StudioPage />} />
            <Route path="revenue" element={<RevenuePage />} />
            <Route path="test" element={<TestPage />} />

            <Route path="analysis" element={<AnalyzerPage />} />
            <Route path="production" element={<ProductionLabPage />} />
            <Route path="growth" element={<GrowthPage />} />


            {/* Advanced Features */}
            <Route path="reputation" element={<ReputationPage />} />
            <Route path="recon" element={<ReconPage />} />
            <Route path="fancare" element={<FanCarePage />} />

            <Route path="community" element={<CommunityPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="membership" element={<Navigate to="/pricing" replace />} />
            <Route path="guide" element={<GuidePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
