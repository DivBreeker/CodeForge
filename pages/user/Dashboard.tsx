
import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockBackend';
import { AnalysisResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  MessageSquare, 
  TrendingUp, 
  Smile, 
  BarChart2, 
  Search, 
  MoreHorizontal 
} from 'lucide-react';

// Custom Colors matching the design
const COLORS = {
  positive: '#22c55e', // Green
  neutral: '#eab308',  // Yellow
  negative: '#ef4444', // Red
  sarcasm: '#22d3ee',  // Cyan
  nonSarcasm: '#a855f7', // Purple
  humor: '#facc15',    // Yellow
  nonHumor: '#8b5cf6',   // Violet
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const results = await api.analysis.getByUser(user.id);
        setData(results);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  // --- Metrics Calculation ---
  const totalComments = data.length;
  const positiveCount = data.filter(d => d.sentiment === 'Positive').length;
  const sarcasmCount = data.filter(d => d.sarcasm).length;
  const humorCount = data.filter(d => d.humor).length;
  
  const sentimentData = [
    { name: 'Positive', value: positiveCount },
    { name: 'Neutral', value: data.filter(d => d.sentiment === 'Neutral').length },
    { name: 'Negative', value: data.filter(d => d.sentiment === 'Negative').length },
  ];

  // Calculate percentages for Sentiment
  const sentimentConfig = sentimentData.map(item => ({
    ...item,
    percentage: totalComments > 0 ? Math.round((item.value / totalComments) * 100) : 0
  }));

  // Filtered Data for Table
  const filteredData = data.filter(item => 
    item.originalText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Components ---

  const StatCard = ({ title, value, label, icon: Icon, iconColor, bgClass }: any) => (
    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-100 dark:border-[#333] shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgClass} transition-transform group-hover:scale-110`}>
          <Icon size={24} className={iconColor} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value.toLocaleString()}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{title}</p>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, colorClass, bgBarClass }: any) => {
    const percent = total > 0 ? (value / total) * 100 : 0;
    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600 dark:text-gray-400 font-medium">{label}</span>
          <span className="text-slate-900 dark:text-white font-bold">{value}</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${colorClass}`} 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-slate-500 dark:text-gray-400">Welcome back! Here's your sentiment analysis overview.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Comments" 
          value={totalComments} 
          icon={MessageSquare} 
          iconColor="text-blue-500"
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard 
          title="Positive Sentiment" 
          value={positiveCount} 
          icon={TrendingUp} 
          iconColor="text-green-500"
          bgClass="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard 
          title="Sarcasm Detected" 
          value={sarcasmCount} 
          icon={Smile} 
          iconColor="text-cyan-500"
          bgClass="bg-cyan-50 dark:bg-cyan-900/20"
        />
        <StatCard 
          title="Humor Detected" 
          value={humorCount} 
          icon={BarChart2} 
          iconColor="text-yellow-500"
          bgClass="bg-yellow-50 dark:bg-yellow-900/20"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sentiment Distribution */}
        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-100 dark:border-[#333] shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Sentiment Distribution</h3>
          <div className="relative h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={COLORS.positive} />
                  <Cell fill={COLORS.neutral} />
                  <Cell fill={COLORS.negative} />
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text (Optional visual flair) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               {/* Could add total count here if desired */}
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-600 dark:text-gray-400">Positive</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{sentimentConfig.find(s => s.name === 'Positive')?.percentage}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-slate-600 dark:text-gray-400">Neutral</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{sentimentConfig.find(s => s.name === 'Neutral')?.percentage}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600 dark:text-gray-400">Negative</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{sentimentConfig.find(s => s.name === 'Negative')?.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Sarcasm Analysis */}
        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-100 dark:border-[#333] shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Sarcasm Analysis</h3>
          
          <ProgressBar 
            label="Sarcastic" 
            value={sarcasmCount} 
            total={totalComments} 
            colorClass="bg-cyan-400" 
          />
          
          <ProgressBar 
            label="Non-sarcastic" 
            value={totalComments - sarcasmCount} 
            total={totalComments} 
            colorClass="bg-purple-600" 
          />
        </div>

        {/* Humor Analysis */}
        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-100 dark:border-[#333] shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Humor Analysis</h3>
          
          <ProgressBar 
            label="Humorous" 
            value={humorCount} 
            total={totalComments} 
            colorClass="bg-yellow-400" 
          />
          
          <ProgressBar 
            label="Non-humorous" 
            value={totalComments - humorCount} 
            total={totalComments} 
            colorClass="bg-violet-600" 
          />
        </div>
      </div>

      {/* Recent Analysis Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Analysis</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search comments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-slate-100 dark:border-[#333] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-[#111] border-b border-slate-100 dark:border-[#333]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400">Comment</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400">Sentiment</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 text-center">Sarcasm</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 text-center">Humor</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400">Date</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                {filteredData.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#222] transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-slate-900 dark:text-white font-medium" title={item.originalText}>
                        {item.originalText}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${item.sentiment === 'Positive' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
                          item.sentiment === 'Negative' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                          ${item.sentiment === 'Positive' ? 'bg-green-500' : 
                            item.sentiment === 'Negative' ? 'bg-red-500' : 
                            'bg-yellow-500'}`}></span>
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.sarcasm ? (
                        <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Yes</span>
                      ) : (
                        <span className="text-slate-400 dark:text-gray-600">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                       {item.humor ? (
                        <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Yes</span>
                      ) : (
                        <span className="text-slate-400 dark:text-gray-600">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-gray-400">
                      {new Date(item.timestamp).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-semibold transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-gray-500">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
