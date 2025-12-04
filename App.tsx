
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { ResetPassword } from './pages/public/ResetPassword';
import { TermsAndConditions } from './pages/public/TermsAndConditions';
import { NotFound } from './pages/public/NotFound';
import { Dashboard } from './pages/user/Dashboard';
import { Upload } from './pages/user/Upload';
import { UserRole } from './types';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';

// Private Route Guard
const PrivateRoute: React.FC<{ children: React.ReactElement, roles?: UserRole[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

// History Page Stub
const History = () => {
    const { user } = useAuth();
    const [data, setData] = React.useState<any[]>([]);
    
    React.useEffect(() => {
        if(user) import('./services/mockBackend').then(m => m.api.analysis.getByUser(user.id).then(setData));
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Analysis History</h1>
            <div className="grid gap-4">
                {data.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">{new Date(item.timestamp).toLocaleString()}</p>
                                <p className="text-lg font-medium dark:text-white">{item.originalText}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                item.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 
                                item.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                            }`}>{item.sentiment}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// User Profile Stub
const Profile = () => {
    const { user } = useAuth();
    return (
        <div className="max-w-xl">
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Profile</h1>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm font-medium text-slate-500">Username</label>
                         <div className="mt-1 text-lg font-medium dark:text-white">{user?.username}</div>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-slate-500">Email</label>
                         <div className="mt-1 text-lg font-medium dark:text-white">{user?.email}</div>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-slate-500">Role</label>
                         <div className="mt-1 text-lg font-medium dark:text-white">{user?.role}</div>
                     </div>
                 </div>
             </div>
        </div>
    )
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/about" element={<div className="p-10">About Page Stub</div>} />

          {/* User Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/guide" element={<PrivateRoute><div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Help Guide</h1><p className="dark:text-slate-300 mt-4">1. Upload text or image.<br/>2. Select processing options.<br/>3. View results.</p></div></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute roles={[UserRole.ADMIN]}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={[UserRole.ADMIN]}><UserManagement /></PrivateRoute>} />
          <Route path="/admin/data" element={<PrivateRoute roles={[UserRole.ADMIN]}><div className="p-8 dark:text-white">All Comments Data View (Stub)</div></PrivateRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
