import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 pt-16 pb-8 border-t border-slate-200 dark:border-slate-800 w-full z-10 relative">
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
  );
};
