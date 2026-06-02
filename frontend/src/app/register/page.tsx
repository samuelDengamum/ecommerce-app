'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [navigatingState, setNavigatingState] = useState(false);
  const router = useRouter();

  const handleNav = (e: React.MouseEvent) => {
    e.preventDefault();
    setNavigatingState(true);
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isNewUser', 'true');
        window.dispatchEvent(new Event('authchange'));
        router.push(data.user?.role === 'admin' ? '/admin' : '/');
      } else {
        setError(data.msg || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transform -translate-x-1/2"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out 0.1s backwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      <div className="w-full max-w-md relative z-10 animate-slideInUp">
        {/* Glassmorphism card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-500">
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
                Join Us Today
              </h1>
              <p className="text-emerald-100 font-medium">Create your account to start shopping</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {error && (
              <div className="animate-slideInLeft p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="animate-slideInLeft animation-delay-2000" style={{ animationDelay: '0.15s' }}>
              <label className="block text-sm font-semibold text-emerald-100 mb-3 flex items-center gap-2">
                <span>👤</span> Full Name
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-105' : ''}`}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-5 py-4 rounded-xl bg-white/10 border-2 backdrop-blur-sm text-white placeholder-emerald-200/50 transition-all duration-300 focus:outline-none ${
                    focusedField === 'name'
                      ? 'border-emerald-400 shadow-lg shadow-emerald-500/50 bg-white/20'
                      : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.25s' }}>
              <label className="block text-sm font-semibold text-emerald-100 mb-3 flex items-center gap-2">
                <span>📧</span> Email Address
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-5 py-4 rounded-xl bg-white/10 border-2 backdrop-blur-sm text-white placeholder-emerald-200/50 transition-all duration-300 focus:outline-none ${
                    focusedField === 'email'
                      ? 'border-emerald-400 shadow-lg shadow-emerald-500/50 bg-white/20'
                      : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="animate-slideInLeft" style={{ animationDelay: '0.35s' }}>
              <label className="block text-sm font-semibold text-emerald-100 mb-3 flex items-center gap-2">
                <span>🔐</span> Password
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-5 py-4 rounded-xl bg-white/10 border-2 backdrop-blur-sm text-white placeholder-emerald-200/50 transition-all duration-300 focus:outline-none ${
                    focusedField === 'password'
                      ? 'border-emerald-400 shadow-lg shadow-emerald-500/50 bg-white/20'
                      : 'border-white/20 hover:border-white/30'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full animate-slideInLeft bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl mt-8 transition-all duration-300 disabled:opacity-50 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 disabled:scale-100"
              style={{ animationDelay: '0.45s' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-white/50 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Sign in link */}
            <p className="text-center text-emerald-100/70 font-medium">
              Already have an account?{' '}
              <button
                onClick={handleNav}
                disabled={navigatingState}
                className="text-emerald-300 hover:text-emerald-200 font-bold transition-colors underline decoration-emerald-500/50 hover:decoration-emerald-300 disabled:opacity-70 disabled:no-underline"
              >
                {navigatingState ? 'Loading sign in...' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 text-center text-white/30 text-sm">
          <p>🛡️ Your data is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
