import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/mockBackend';
import { Button } from '../../components/ui/Button';
import { Lock, ArrowLeft, Moon, Sun, CheckCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await api.auth.requestPasswordReset(email);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage('Failed to send reset link. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-100 dark:bg-black transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Theme Toggle & Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-all">
          <ArrowLeft size={20} />
        </Link>
      </div>
      <div className="absolute top-6 right-6 z-20">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-800 dark:text-yellow-400 transition-transform hover:scale-105">
            {darkMode || document.documentElement.classList.contains('dark') ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-purple-900/30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-blue-900/30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-3xl p-8 sm:p-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-black dark:bg-black rounded-2xl flex items-center justify-center shadow-lg mb-6 ring-4 ring-slate-100 dark:ring-slate-800">
              <Lock className="text-white w-7 h-7" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Reset Your Password</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center max-w-xs">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {status === 'success' ? (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Check Your Inbox</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                We have sent a password reset link to <span className="font-medium text-slate-900 dark:text-white">{email}</span>
              </p>
              <Link to="/login">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:bg-white dark:focus:bg-slate-800 transition-all"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm text-center">
                  {errorMessage}
                </div>
              )}

              <Button 
                type="submit" 
                isLoading={status === 'loading'} 
                className="w-full shadow-lg shadow-slate-900/20 dark:shadow-none"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          {status !== 'success' && (
            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};