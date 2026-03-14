import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center p-6 sm:p-8">
      <div className="glass-card w-full max-w-[440px] p-8 md:p-10 animate-fade-in relative overflow-hidden">
        {/* Decorator blur */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
              <ShieldCheck className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-3">
              Welcome Back
            </h2>
            <p className="text-slate-400 max-w-[260px] mx-auto text-sm leading-relaxed">
              Enter your credentials to access your task dashboard
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="label-text">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  className="input-field pl-12"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-text">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  className="input-field pl-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-3 py-3.5 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-primary hover:text-indigo-400 transition-colors font-bold tracking-tight">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
