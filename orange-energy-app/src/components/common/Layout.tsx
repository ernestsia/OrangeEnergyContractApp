import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  Send, 
  Users,
  LogOut, 
  Wifi, 
  WifiOff, 
  Menu, 
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, logout } = useAuth();
  const isOnline = useNetworkStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Contract', path: '/new-subscription', icon: FilePlus },
    { label: 'Drafts', path: '/drafts', icon: FileText },
    { label: 'Submissions', path: '/submissions', icon: Send },
    { label: 'User Management', path: '/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm shadow-orange-500/30">
              OE
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-none">Orange Energy</span>
              <span className="text-[10px] text-slate-400 block font-medium">Liberia Digital Portal</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Network Sync Pill */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
              isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 animate-pulse" />}
              <span>{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
            </div>

            {/* Profile Info */}
            <div className="hidden sm:flex items-center space-x-2 text-right border-l border-slate-800 pl-4">
              <div>
                <p className="text-xs font-bold text-white leading-tight">{userProfile?.fullName || 'Agent'}</p>
                <p className="text-[10px] text-orange-400 font-semibold">{userProfile?.role || 'FIELD_AGENT'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Navigation Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <nav className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-1.5 sticky top-22">
            <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Agent & Admin Workflow
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Slide-out Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full p-4 space-y-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">Menu</div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};