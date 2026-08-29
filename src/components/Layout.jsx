import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  LogOut,
  Settings,
  DollarSign,
  Truck,
  RefreshCcw,
  Sun,
  Moon,
  MoreVertical,
  MessageSquare,
  Wifi,
  WifiOff,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import './Layout.css';
import logo from '../assets/allah_dan.jpeg';

const Layout = () => {
  const { user, logout, theme, toggleTheme, language, setLanguage } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



  return (
    <div className={`app-container ${theme === 'dark' ? 'dark-mode' : ''}`} style={{ display: 'block', minHeight: '100vh' }}>
      <main className="main-content" style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <header className="topbar glass" style={{ 
          height: '70px', 
          borderBottom: '1px solid rgba(0,0,0,0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2rem', 
          background: 'var(--bg-card)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Left Side: Brand Logo */}
          <div className="topbar-brand flex-align-gap" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isDashboard && (
              <button 
                onClick={() => navigate(-1)} 
                style={{ 
                  background: '#f1f5f9', 
                  color: '#0f172a',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateX(-3px)'; e.currentTarget.style.background='#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateX(0)'; e.currentTarget.style.background='#f1f5f9'; }}
                title="Go Back"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
            )}
            <div style={{ cursor: 'pointer', transition: 'transform 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={() => navigate('/')} onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white'
              }}>
                <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{language === 'bn' ? 'আল্লাহর দান জেন্টস পয়েন্ট' : 'Allah Dan Gents Point'}</h2>
                <span className="role-badge" style={{ marginTop: '2px', padding: '0.15rem 0.5rem', fontSize: '0.65rem', display: 'inline-block' }}>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Actions & Profile */}
          <div className="topbar-actions flex-align-gap">
            <div className={`flex-align-gap px-3 py-1.5 rounded-full`} style={{ backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: isOnline ? '#10b981' : '#f59e0b', border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`, fontSize: '0.8rem', fontWeight: 600, borderRadius: '20px' }}>
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span className="hide-on-mobile">{isOnline ? 'Synced' : 'Offline'}</span>
            </div>
            
            <button className="btn-icon" onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')} title="Toggle Language" style={{ background: 'var(--bg-input)', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {language === 'en' ? 'BN' : 'EN'}
            </button>
            
            <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme" style={{ background: 'var(--bg-input)', color: 'var(--text-main)' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="user-profile-topbar flex-align-gap" style={{ marginLeft: '0.5rem', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,0,0,0.1)' }}>
              <div className="avatar" style={{ width: '38px', height: '38px', fontSize: '1rem', borderRadius: '50%' }}>{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-icon" style={{ marginLeft: '0.5rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="content-area" style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <div className="print-only-header">
            <h2>{language === 'bn' ? 'আল্লাহর দান জেন্টস পয়েন্ট' : 'Allah Dan Gents Point'}</h2>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
