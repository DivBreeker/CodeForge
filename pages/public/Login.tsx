
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/mockBackend';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/PublicHeader';
import { PublicFooter } from '../../components/PublicFooter';
import { Activity } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.auth.login(email, password);
      login(response.token, response.user);
      navigate(response.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-black transition-colors duration-300 font-sans">
      
      <PublicHeader />

      <main className="flex-grow flex items-center justify-center relative py-24 px-4">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-purple-900/40 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-blue-900/40 animate-blob animation-delay-2000"></div>
            <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-500/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal dark:bg-pink-900/20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-md">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-3xl p-8 sm:p-10">
            
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 ring-4 ring-slate-100 dark:ring-slate-800">
                <Activity className="text-white w-8 h-8" strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Sign in to continue analyzing comments</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:bg-white dark:focus:bg-slate-800 transition-all"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:bg-white dark:focus:bg-slate-800 transition-all"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-slate-900 dark:text-white focus:ring-slate-900 dark:focus:ring-white border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <Link to="/reset-password" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                    Forgot password?
                    </Link>
                </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm text-center">{error}</div>}

                <Button type="submit" isLoading={loading} className="w-full shadow-lg shadow-slate-900/20 dark:shadow-none">
                Login
                </Button>

                <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/0 backdrop-blur-xl text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Or</span>
                </div>
                </div>

                <Button type="button" variant="google" className="w-full" onClick={() => alert("Social login is mocked for this demo.")}>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                    Register
                </Link>
                </p>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-600">
                © 2024 Sarcasm & Humor Analyzer. All rights reserved.
                </p>
            </div>

            </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
