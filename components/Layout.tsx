
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Activity, 
  Sun, 
  Moon, 
  Bell, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  Mail
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if we should show the dashboard layout (authenticated) or just a container
  const isPublicRoute = ['/', '/login', '/register', '/reset-password', '/terms', '/404', '/contact'].includes(location.pathname);
  if (isPublicRoute) {
      return <>{children}</>;
  }

  const NavItem = ({ to, label }: { to: string; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${
          isActive
            ? 'text-purple-500 dark:text-purple-400'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-200 font-sans flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo - Linked to Home */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-purple-600 p-1.5 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">CordForge</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                {user?.role === UserRole.ADMIN ? (
                     <>
                        <NavItem to="/admin/dashboard" label="Dashboard" />
                        <NavItem to="/admin/users" label="Users" />
                        <NavItem to="/admin/data" label="Data" />
                     </>
                ) : (
                    <>
                        <NavItem to="/dashboard" label="Dashboard" />
                        <NavItem to="/upload" label="Upload" />
                        <NavItem to="/history" label="History" />
                        <NavItem to="/guide" label="Help" />
                    </>
                )}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-[#1F1F1F] text-slate-600 dark:text-purple-400 hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notification Bell */}
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-[#1F1F1F] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-cyan-400 rounded-full border-2 border-[#1F1F1F]"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1F1F1F] hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors border border-transparent dark:border-[#333]"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                            {user?.username.substring(0, 2).toUpperCase()}
                        </div>
                        <ChevronDown size={14} className="text-slate-500 dark:text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setProfileDropdownOpen(false)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1F1F1F] rounded-xl shadow-lg border border-slate-200 dark:border-[#333] py-1 z-20 animate-fade-in">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-[#333]">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.username}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                </div>
                                <NavLink 
                                    to="/profile" 
                                    onClick={() => setProfileDropdownOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2A2A2A]"
                                >
                                    <UserIcon size={16} /> Profile
                                </NavLink>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-left"
                                >
                                    <LogOut size={16} /> Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-[#121212] border-t border-slate-200 dark:border-[#222]">
                <div className="px-4 py-4 space-y-4">
                    {user?.role === UserRole.ADMIN ? (
                        <>
                            <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Dashboard</NavLink>
                            <NavLink to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Users</NavLink>
                            <NavLink to="/admin/data" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Data</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Dashboard</NavLink>
                            <NavLink to="/upload" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Upload</NavLink>
                            <NavLink to="/history" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">History</NavLink>
                            <NavLink to="/guide" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white">Help</NavLink>
                        </>
                    )}
                    <div className="border-t border-slate-200 dark:border-[#222] pt-4 mt-4">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                                {user?.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.username}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                            </div>
                         </div>
                         <button onClick={toggleTheme} className="flex items-center gap-3 w-full py-2 text-slate-600 dark:text-slate-300">
                             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                             <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                         </button>
                         <button onClick={handleLogout} className="flex items-center gap-3 w-full py-2 text-red-600 dark:text-red-400">
                             <LogOut size={18} />
                             <span>Sign Out</span>
                         </button>
                    </div>
                </div>
            </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12 w-full max-w-7xl mx-auto flex-grow">
        {children}
      </main>

      {/* Global Footer for Authenticated Pages */}
      <footer className="bg-white dark:bg-[#121212] pt-16 pb-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-purple-600 p-1.5 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">CordForge</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Advanced AI-powered sentiment analysis for Sinhala text with sarcasm and humor detection.
              </p>
              <a href="mailto:contact@cordforge.com" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 mt-4 hover:text-purple-600">
                <Mail size={16} className="mr-2" /> contact@cordforge.com
              </a>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-purple-600">Features</a></li>
                <li><a href="#" className="hover:text-purple-600">How It Works</a></li>
                <li><a href="#" className="hover:text-purple-600">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-600">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-purple-600">About</a></li>
                <li><a href="#" className="hover:text-purple-600">Team</a></li>
                <li><Link to="/contact" className="hover:text-purple-600">Contact</Link></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-purple-600">Privacy Policy</a></li>
                <li><Link to="/terms" className="hover:text-purple-600">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-purple-600">Data Consent</a></li>
                <li><a href="#" className="hover:text-purple-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2024 CordForge. Academic Research Project. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a>
              <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms</Link>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
