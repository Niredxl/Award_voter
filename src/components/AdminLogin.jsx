import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../utils/storage';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminLogin(username, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white/60" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Admin Sign In</h2>
          <p className="text-sm text-white/40 mt-1 text-center">
            Enter your credentials to continue.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-5 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 ml-1">
              Username
            </label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
