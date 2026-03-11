import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJobPage from './pages/PostJobPage';
import CandidateDashboard from './pages/CandidateDashboard';
import InterviewPage from './pages/InterviewPage';
import ScorecardPage from './pages/ScorecardPage';
import PricingPage from './pages/PricingPage';
import './index.css';

function ProtectedRoute({ children, requiredRole }) {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/employer" element={
          <ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>
        } />
        <Route path="/employer/post" element={
          <ProtectedRoute requiredRole="employer"><PostJobPage /></ProtectedRoute>
        } />
        <Route path="/candidate" element={
          <ProtectedRoute requiredRole="candidate"><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/interview/:jobId" element={
          <ProtectedRoute requiredRole="candidate"><InterviewPage /></ProtectedRoute>
        } />
        <Route path="/scorecard/:id" element={
          <ProtectedRoute><ScorecardPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
