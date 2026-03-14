import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckSquare, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-card rounded-none border-x-0 border-t-0 py-3 px-6 sticky top-0 z-50 bg-slate-900/60 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-white tracking-tight">PrimeTask</span>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-300"></div>
          </div>
        </Link>

        <div>
          {user ? (
            <div className="flex items-center gap-4 md:gap-8">
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-800">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-100 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-all duration-300 hover:scale-105"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-semibold">Logout</span>
              </button>
            </div>
          ) : (
             <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2 text-slate-400 hover:text-white transition-colors font-semibold text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 text-sm">
                  Get Started
                </Link>
             </div>
          )}
        </div>
      </div>
    </nav>
  );
}
