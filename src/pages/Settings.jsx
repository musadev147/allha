import React from 'react';
import useStore from '../store/useStore';

const themeOptions = [
  { id: 'theme-sky', name: 'Sky Blue (Akasi)', color1: '#0ea5e9', color2: '#38bdf8' },
  { id: 'theme-emerald', name: 'Emerald Green', color1: '#10b981', color2: '#34d399' },
  { id: 'theme-purple', name: 'Royal Purple', color1: '#8b5cf6', color2: '#a78bfa' },
  { id: 'theme-rose', name: 'Rose Red', color1: '#f43f5e', color2: '#fb7185' },
  { id: 'theme-amber', name: 'Amber Gold', color1: '#f59e0b', color2: '#fbbf24' },
  { id: 'theme-indigo', name: 'Deep Indigo', color1: '#6366f1', color2: '#818cf8' },
];

const Settings = () => {
  const themeGradient = useStore((state) => state.themeGradient) || 'theme-sky';
  const setThemeGradient = useStore((state) => state.setThemeGradient);

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>App Settings</h1>
          <p className="text-muted">Configure your shop settings and appearance.</p>
        </div>
      </div>
      
      <div className="card glass">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Theme Colors</h3>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>Choose a primary color gradient for your application.</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.5rem'
        }}>
          {themeOptions.map((theme) => (
            <div 
              key={theme.id}
              onClick={() => setThemeGradient(theme.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: themeGradient === theme.id ? '2px solid var(--primary)' : '2px solid transparent',
                background: themeGradient === theme.id ? 'var(--bg-hover)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.color1} 0%, ${theme.color2} 100%)`,
                boxShadow: themeGradient === theme.id ? `0 0 15px ${theme.color1}80` : '0 4px 6px rgba(0,0,0,0.1)'
              }}></div>
              <span style={{ 
                fontWeight: themeGradient === theme.id ? '600' : '500',
                color: themeGradient === theme.id ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {theme.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
