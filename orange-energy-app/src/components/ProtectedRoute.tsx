import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // 1. Wait for Firebase to finish checking auth state on initial load
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-semibold text-sm">
        Loading session...
      </div>
    );
  }

  // 2. If no user is logged in after loading finishes, send back to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. If user exists, display the requested page (e.g. Dashboard)
  return <>{children}</>;
};