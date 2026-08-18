import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const Layout = () => {
  const { user, logout, theme, toggleTheme } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/pos', name: 'Point of Sale', icon: <ShoppingCart size={20} /> },
    { path: '/inventory', name: 'Inventory', icon: <Package size={20} /> },
    { path: '/purchases', name: 'Purchases', icon: <Truck size={20} /> },
    { path: '/returns', name: 'Returns', icon: <RefreshCcw size={20} /> },
    { path: '/customers', name: 'Customers & Due', icon: <Users size={20} /> },
    { path: '/expenses', name: 'Expenses', icon: <DollarSign size={20} /> },
  ];

  // Admin only menu items
  if (user?.role === 'Admin') {
    menuItems.push(
      { path: '/hr', name: 'HR & Payroll', icon: <Users size={20} /> },
      { path: '/reports', name: 'Reports', icon: <FileText size={20} /> },
      { path: '/settings', name: 'Settings', icon: <Settings size={20} /> }
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div>
            <h2>আল্লাহর দান জন্টস পেয়ন্ট</h2>
            <span className="role-badge">{user?.role}</span>
          </div>
          <button 
            className="mobile-menu-toggle btn-icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MoreVertical size={24} />
          </button>
        </div>
        <nav className={`sidebar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <span>{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar glass">
          <div className="topbar-search">
            {/* Search or breadcrumbs can go here */}
          </div>
          <div className="topbar-actions flex-align-gap">
            <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Notifications, POS quick link, etc. */}
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
