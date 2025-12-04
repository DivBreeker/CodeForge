import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/mockBackend';
import { SystemStats } from '../../types';
import { Users, FileText, CheckCircle, AlertTriangle, Smile, Activity, Settings, Database, ArrowRight, Cloud, HardDrive, Wifi } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  
  useEffect(() => {
    api.admin.getStats().then(setStats);
    
    // Check actual database health
    api.status.checkHealth().then(status => setIsConnected(status));
    
    setIsCustomModel(api.status.isCustomModelConnected());
  }, []);

  if (!stats) return (
    <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#333] shadow-sm flex flex-col justify-between group hover:border-purple-500/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        {trend && (
            <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center">
                +{trend}%
            </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value.toLocaleString()}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{title}</p>
      </div>
    </div>
  );

  const chartData = [
    { name: 'Positive', value: stats.positiveCount, color: '#22c55e' },
    { name: 'Negative', value: stats.negativeCount, color: '#ef4444' },
    { name: 'Neutral', value: stats.neutralCount, color: '#eab308' },
  ];

  return (
    <div className="space-y-8 font-sans pb-10">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">System overview and platform controls.</p>
        </div>
        
        {/* Connection Status Badges */}
        <div className="flex flex-col sm:flex-row gap-3">
             <div className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border ${isConnected ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' : 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300'}`}>
                {isConnected ? <Cloud size={16} /> : <HardDrive size={16} />}
                {isConnected ? 'DB: Centralized (Supabase)' : 'DB: Local Browser Storage'}
            </div>

             <div className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border ${isCustomModel ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300' : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'}`}>
                <Wifi size={16} />
                {isCustomModel ? 'AI: Custom Python Model' : 'AI: Google Gemini Fallback'}
            </div>
        </div>
       </div>

       {!isConnected && (
         <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  You are currently in <strong>Local Mode</strong>. Users from other browsers will not appear here. 
                  To fix this, create a project at <a href="https://supabase.com" target="_blank" className="underline font-bold">Supabase.com</a>, run the setup SQL, and add your API keys to the configuration.
                </p>
              </div>
            </div>
          </div>
       )}

       {/* Top Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={Users} 
            color="bg-purple-500" 
            trend="5.2" 
         />
         <StatCard 
            title="Comments Analyzed" 
            value={stats.totalAnalyses} 
            icon={FileText} 
            color="bg-blue-500" 
            trend="12.8"
         />
         <StatCard 
            title="Sarcasm Detected" 
            value={stats.sarcasmCount} 
            icon={AlertTriangle} 
            color="bg-cyan-500" 
            trend="3.4"
         />
         <StatCard 
            title="Humor Detected" 
            value={stats.humorCount} 
            icon={Smile} 
            color="bg-yellow-500" 
            trend="8.7"
         />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sentiment Distribution Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#333] shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Sentiment Distribution</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <XAxis type="number" stroke="#94a3b8" hide />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{fill: '#94a3b8'}} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}} 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', borderRadius: '8px' }} 
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#333] shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Quick Actions</h3>
                <div className="space-y-4">
                    <Link to="/admin/users" className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-[#222] hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors group">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg mr-4">
                            <Users size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white">Manage Users</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">View and edit user accounts</p>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
                    </Link>

                    <Link to="/admin/data" className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-[#222] hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors group">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg mr-4">
                            <Database size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white">Review Data</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Browse analyzed comments</p>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </Link>

                    <div className="flex items-center p-4 rounded-xl bg-slate-50 dark:bg-[#222] hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors group cursor-pointer">
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg mr-4">
                            <Settings size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white">System Settings</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Configure platform</p>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-gray-500 transition-colors" />
                    </div>
                </div>
            </div>
       </div>

       {/* Recent Activity Table (Stub for visual) */}
       <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-[#333]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent System Activity</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-[#111] border-b border-slate-100 dark:border-[#333]">
                        <tr>
                            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Event</th>
                            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Details</th>
                            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Time</th>
                            <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#222]">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">User Login</td>
                            <td className="px-6 py-4 text-slate-500">admin@cordforge.com</td>
                            <td className="px-6 py-4 text-slate-500">2 mins ago</td>
                            <td className="px-6 py-4 text-right"><span className="text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs">Success</span></td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-[#222]">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">New Analysis</td>
                            <td className="px-6 py-4 text-slate-500">Sentiment Check (ID: #8329)</td>
                            <td className="px-6 py-4 text-slate-500">15 mins ago</td>
                            <td className="px-6 py-4 text-right"><span className="text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-xs">Completed</span></td>
                        </tr>
                         <tr className="hover:bg-slate-50 dark:hover:bg-[#222]">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">New Registration</td>
                            <td className="px-6 py-4 text-slate-500">user.demo@example.com</td>
                            <td className="px-6 py-4 text-slate-500">1 hour ago</td>
                            <td className="px-6 py-4 text-right"><span className="text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs">Verified</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
       </div>
    </div>
  );
};