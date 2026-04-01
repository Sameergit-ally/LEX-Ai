import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LoadingScreen from './components/ui/LoadingScreen';
import './index.css';

// Lazy load all pages
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DocumentAnalyzer = lazy(() => import('./pages/DocumentAnalyzer'));
const KnowYourRights = lazy(() => import('./pages/KnowYourRights'));
const DraftGenerator = lazy(() => import('./pages/DraftGenerator'));
const CaseTracker = lazy(() => import('./pages/CaseTracker'));
const CaseRescuePlan = lazy(() => import('./pages/CaseRescuePlan'));

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-[#94a3b8] text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0f] text-[#f8fafc]">
        {/* Loading screen on first visit */}
        <LoadingScreen />

        {/* Animated mesh background */}
        <div className="mesh-bg" />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#141824',
              color: '#f8fafc',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#141824' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#141824' },
            },
          }}
        />

        {/* Navigation */}
        <Navbar />

        {/* Routes */}
        <main className="relative z-10">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/document-analyzer" element={<DocumentAnalyzer />} />
              <Route path="/know-your-rights" element={<KnowYourRights />} />
              <Route path="/draft-generator" element={<DraftGenerator />} />
              <Route path="/case-tracker" element={<CaseTracker />} />
              <Route path="/case-rescue" element={<CaseRescuePlan />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
