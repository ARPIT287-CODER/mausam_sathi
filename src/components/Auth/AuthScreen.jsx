import React, { useState } from 'react';
import { 
  CloudSun, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Zap
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function AuthScreen({ onLogin, onRegister, onContinueAsGuest, onBackToWelcome }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    soundManager.playSuccess();
    if (isSignUp) {
      onRegister(name.trim(), email.trim(), password);
    } else {
      onLogin(email.trim(), password);
    }
  };

  const handleDemoLogin = () => {
    soundManager.playSuccess();
    onLogin("demo@mausamsathi.in", "demo123", "Demo User");
  };

  const handleGuestEntry = () => {
    soundManager.playSuccess();
    onContinueAsGuest();
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      
      <div className="relative z-10 max-w-md w-full mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* App Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#131B2E] border border-slate-700/80 text-teal-400 shadow-md">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              MAUSAM SATHI
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {isSignUp ? 'Create your personal account' : 'Welcome back to your environmental safety companion'}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#131B2E] rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
          
          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex p-1 bg-[#0B0F17] rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                soundManager.playChime();
                setIsSignUp(false);
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition ${
                !isSignUp ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playChime();
                setIsSignUp(true);
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition ${
                isSignUp ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Name Input */}
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arpit Chauhan"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition transform active:scale-[0.98] mt-2"
            >
              <span>{isSignUp ? 'Create My Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#131B2E] px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider relative">
              OR
            </span>
          </div>

          {/* Prominent Continue as Guest Button */}
          <button
            type="button"
            onClick={handleGuestEntry}
            className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-sm group"
          >
            <Zap className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            <span>Continue as Guest (Skip Login)</span>
          </button>

          {/* Quick Demo 1-Click Login */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-slate-400 hover:text-teal-300 font-semibold underline decoration-dotted"
            >
              ✨ Try Quick Demo Account
            </button>
          </div>

        </div>

        {/* Back to intro link */}
        {onBackToWelcome && (
          <div className="text-center">
            <button
              type="button"
              onClick={onBackToWelcome}
              className="text-xs text-slate-500 hover:text-white font-medium"
            >
              ← Back to App Introduction
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
