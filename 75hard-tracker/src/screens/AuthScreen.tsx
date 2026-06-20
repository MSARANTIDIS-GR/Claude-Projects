import { useState } from 'react';
import { Flame, Eye, EyeOff, Loader2, Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth, getAuthError } from '../hooks/useAuth';
import { haptic } from '../utils/haptics';

type Mode = 'login' | 'signup' | 'forgot';

export default function AuthScreen() {
  const { login, signup, resetPassword } = useAuth();

  const [mode, setMode]                     = useState<Mode>('login');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState('');
  const [busy, setBusy]                     = useState(false);

  function reset() { setError(''); setSuccess(''); }
  function switchMode(m: Mode) { reset(); setPassword(''); setConfirmPassword(''); setMode(m); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }

    setBusy(true);
    haptic('medium');
    try {
      if (mode === 'login')  await login(email, password);
      if (mode === 'signup') await signup(email, password);
      if (mode === 'forgot') {
        await resetPassword(email);
        setSuccess('Reset link sent! Check your inbox (and spam folder).');
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(getAuthError(code));
      haptic('heavy');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-7">

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Flame size={32} className="text-orange-400" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white">75 Hard</h1>
          <p className="text-gray-500 text-sm">
            {mode === 'forgot' ? 'Reset your password' : 'Your challenge, your data — everywhere.'}
          </p>
        </div>

        {/* Mode tabs (not shown in forgot mode) */}
        {mode !== 'forgot' && (
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
            {(['login', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { haptic(); switchMode(m); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all
                  ${mode === m ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Back button (forgot mode) */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="flex items-center gap-1.5 text-gray-400 text-sm hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> Back to login
            </button>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); reset(); }}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Password (not in forgot mode) */}
          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); reset(); }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm password (signup only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); reset(); }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2 animate-slide-up">
              {error}
            </p>
          )}

          {/* Success message (forgot password) */}
          {success && (
            <div className="flex items-start gap-2 text-emerald-400 text-sm bg-emerald-950/40 border border-emerald-900/50 rounded-xl px-3 py-2 animate-slide-up">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 disabled:bg-orange-900 disabled:text-orange-600 text-white font-bold text-base transition-all active:scale-95"
          >
            {busy
              ? <Loader2 size={20} className="animate-spin" />
              : mode === 'login'  ? 'Log In'
              : mode === 'signup' ? 'Create Account'
              : 'Send Reset Link'}
          </button>

          {/* Forgot password link (login mode only) */}
          {mode === 'login' && (
            <button
              type="button"
              onClick={() => { haptic(); switchMode('forgot'); }}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Forgot your password?
            </button>
          )}
        </form>

        <p className="text-center text-xs text-gray-700">
          Your data is encrypted and stored securely.
        </p>
      </div>
    </div>
  );
}
