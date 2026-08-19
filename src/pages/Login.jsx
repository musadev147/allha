import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Lock, User } from 'lucide-react';
import './Login.css'; // We'll add some specific styling here

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Salesman');
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate authentication
    login({ id: 1, name: username || 'User', role: role });
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card card animate-fade-in">
        <div className="login-header">
          <h2>আল্লাহর দান জন্টস পেয়ন্ট</h2>
          <p>Login to your account</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input
              type="text"
              placeholder="Username or ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="role-selector">
            <label>
              <input
                type="radio"
                value="Salesman"
                checked={role === 'Salesman'}
                onChange={(e) => setRole(e.target.value)}
              />
              Salesman
            </label>
            <label>
              <input
                type="radio"
                value="Admin"
                checked={role === 'Admin'}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
          </div>
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
