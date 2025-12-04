import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicHeader: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const dashboardLink = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  const handleNavClick = (hash: string) => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
        const element = document.getElementById(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-purple-600 p-1.5 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">CordForge</span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#features" onClick={() => handleNavClick('features')} className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors">Features</Link>
              <Link to="/#how-it-works" onClick={() => handleNavClick('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors">How it Works</Link>
              <Link to="/#testimonials" onClick={() => handleNavClick('testimonials')} className="text-sm font-medium text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-colors">Testimonials</Link>
              
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="flex items-center space-x-4 ml-4">
                {user ? (
                   <Link to={dashboardLink} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-purple-500/20">
                     Go to Dashboard
                   </Link>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-medium text-slate-900 dark:text-white hover:text-purple-600 transition-colors">Log in</Link>
                    <Link to="/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform hover:-translate-y-0.5">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleTheme} 
                className="p-2 text-slate-600 dark:text-slate-300"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/#features" onClick={() => handleNavClick('features')} className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">Features</Link>
              <Link to="/#how-it-works" onClick={() => handleNavClick('how-it-works')} className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">How it Works</Link>
              <Link to="/#testimonials" onClick={() => handleNavClick('testimonials')} className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">Testimonials</Link>
              
              {user ? (
                <Link to={dashboardLink} onClick={() => setIsMenuOpen(false)} className="block w-full text-center mt-4 bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">Log in</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-lg font-semibold">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
  );
};
