import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockBackend';
import { SystemStats } from '../../types';
import { Users, FileText, CheckCircle, AlertTriangle, Smile } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  
  useEffect(() => {
    api.admin.getStats().then(setStats);
  }, []);

  if (!stats) return <div>Loading System Stats...</div>;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
      <div className={`p-4 rounded-lg ${color} mr-4`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
    </div>
  );

  const chartData = [
    { name: 'Positive', value: stats.positiveCount },
    { name: 'Negative', value: stats.negativeCount },
    { name: 'Neutral', value: stats.neutralCount },
    { name: 'Sarcasm', value: stats.sarcasmCount },
    { name: 'Humor', value: stats.humorCount },
  ];

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Overview</h1>
        <p className="text-slate-500">Monitoring system performance and data metrics.</p>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
         <StatCard title="Total Analyses" value={stats.totalAnalyses} icon={FileText} color="bg-indigo-500" />
         <StatCard title="Sarcasm Detected" value={stats.sarcasmCount} icon={AlertTriangle} color="bg-purple-500" />
         <StatCard title="Humor Detected" value={stats.humorCount} icon={Smile} color="bg-yellow-500" />
       </div>

       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
         <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Classification Distribution</h3>
         <div className="h-80">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData}>
               <XAxis dataKey="name" stroke="#94a3b8" />
               <YAxis stroke="#94a3b8" />
               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
               <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </div>
    </div>
  );
};