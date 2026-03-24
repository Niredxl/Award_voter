import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut } from 'lucide-react';
import { isAdminLoggedIn, adminLogout } from '../utils/storage';

const Navbar = () => {
  const navigate = useNavigate();
  const isAdmin = isAdminLoggedIn();

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  return (
    <nav className="glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Trophy className="h-8 w-8 text-primary-500 group-hover:text-primary-400 transition-colors" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              Golden Gala Awards
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-slate-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/admin" className="text-sm text-dark-500 hover:text-dark-400 transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
