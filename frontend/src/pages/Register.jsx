import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center p-6 sm:p-8">
      <div className="glass-card w-full max-w-[440px] p-8 md:p-10 animate-fade-in relative overflow-hidden">
        {/* Decorator blur */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
              <Sparkles className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-3">
              Join Us
            </h2>
            <p className="text-slate-400 max-w-[260px] mx-auto text-sm leading-relaxed">
              Create your account to start organizing your projects
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8 text-sm flex items-center gap-3 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="label-text">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-secondary transition-colors" />
                <input
                  type="text"
                  required
                  className="input-field pl-12"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-text">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-secondary transition-colors" />
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-secondary transition-colors" />
                <input
                  type="password"
                  required
                  minLength={6}
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
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl py-3.5 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:text-cyan-400 transition-colors font-bold tracking-tight">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
