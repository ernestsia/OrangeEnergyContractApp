import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewSubscription } from './pages/NewSubscription';
import { UserManagement } from './components/Admin/UserManagement'; // Updated path
import { SubmittedForms } from './components/Admin/SubmittedForms'; // Updated path
import { Layout } from './components/common/Layout';

const DraftsPage = () => (
  <Layout>
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h1 className="text-xl font-bold text-slate-900 mb-2">Local Offline Drafts</h1>
      <p className="text-xs text-slate-500">Manage pending contract drafts saved on this device.</p>
    </div>
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-subscription"
            element={
              <ProtectedRoute>
                <NewSubscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drafts"
            element={
              <ProtectedRoute>
                <DraftsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <SubmittedForms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;