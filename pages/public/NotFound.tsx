
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PublicHeader } from '../../components/PublicHeader';
import { Home, Mail, ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-50 dark:bg-black transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Navigation */}
      <PublicHeader />

      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-purple-900/30 animate-blob"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-blue-900/30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[40%] w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-normal dark:bg-pink-900/20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-2xl px-6 text-center pt-16">
        <h1 className="text-[150px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 select-none">
          404
        </h1>
        
        <div className="relative -mt-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Oops! Page Not Found
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button onClick={() => navigate('/')} className="w-full sm:w-auto px-8 shadow-lg shadow-purple-500/20">
            <Home className="mr-2 h-5 w-5" />
            Go Back Home
          </Button>
          <Button onClick={() => window.location.href = 'mailto:support@cordforge.com'} variant="secondary" className="w-full sm:w-auto px-8">
            <Mail className="mr-2 h-5 w-5" />
            Contact Support
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-500 mb-4 uppercase tracking-wider">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
              Home <ArrowRight className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </Link>
            <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
              About <ArrowRight className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </Link>
            <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center group">
              Dashboard <ArrowRight className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-xs text-slate-400 dark:text-slate-600">
            Sarcasm & Humor-Aware Sentiment Analyzer © 2024
        </div>
      </div>
    </div>
  );
};
