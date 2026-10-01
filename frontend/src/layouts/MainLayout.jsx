import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, Search, Shield, Server, BarChart3, Network, Settings, Sun, Moon } from 'lucide-react';

export default function MainLayout({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('lognex-theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('lognex-theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncThemePreference = (event) => setTheme(event.detail);
    window.addEventListener('lognex-theme-change', syncThemePreference);
    return () => window.removeEventListener('lognex-theme-change', syncThemePreference);
  }, []);

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/live-logs', icon: <Radio size={20} />, label: 'Live Logs' },
    { to: '/logs', icon: <Search size={20} />, label: 'Log Explorer' },
    { to: '/security', icon: <Shield size={20} />, label: 'Security' },
    { to: '/servers', icon: <Server size={20} />, label: 'Servers' },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: '/infrastructure', icon: <Network size={20} />, label: 'Infrastructure' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-dark-900 text-gray-200 font-sans">
      <aside className="sidebar w-64 flex flex-col transition-all duration-300">
        <div className="p-4 flex items-center gap-3 border-b border-white/20">
          <div className="sidebar-brand-mark w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            LX
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white">LOGNEX</h1>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'font-semibold' : ''}`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="app-header h-16 flex items-center justify-between px-6 border-b border-dark-700">
          <div className="flex items-center">
            {/* Header left placeholder */}
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-green"></span>
              <span>System Healthy</span>
            </div>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="header-theme-toggle inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-dark-900">
          {children}
        </main>
      </div>
    </div>
  );
}
