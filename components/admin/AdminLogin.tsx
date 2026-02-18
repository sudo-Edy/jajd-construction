import React, { useState, FormEvent } from 'react';
import { supabase } from '../../utils/supabase';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] p-12 md:p-16 max-w-md w-full shadow-2xl">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#FACC15] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Login</h1>
          <p className="text-slate-500 font-medium">JAJD Construction Gallery Manager</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#FACC15] focus:outline-none font-medium transition-colors"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-slate-900 font-black uppercase tracking-widest text-xs mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#FACC15] focus:outline-none font-medium transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#FACC15] hover:text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Help text */}
        <p className="text-center text-slate-400 text-xs mt-8">
          Contact your administrator if you've forgotten your password
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
