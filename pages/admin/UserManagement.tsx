import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/mockBackend';
import { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Trash2, Lock, Unlock, ArrowLeft } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    api.admin.getAllUsers().then(setUsers);
  };

  const handleToggleStatus = async (id: string) => {
    await api.admin.toggleUserStatus(id);
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await api.admin.deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="p-2 rounded-lg bg-white dark:bg-[#1A1A1A] text-slate-500 hover:text-purple-600 transition-colors border border-slate-200 dark:border-[#333]">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
        </div>
        <Button size="sm">Add User</Button>
      </div>
      
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-[#111] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#333]">
              <tr>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2A2A2A]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-[#222] transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#333] flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        {user.username}
                      </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.isActive ? "Deactivate User" : "Activate User"}
                      className="bg-white dark:bg-[#2A2A2A] border border-slate-200 dark:border-[#333]"
                    >
                      {user.isActive ? <Lock size={14}/> : <Unlock size={14}/>}
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      title="Delete User"
                    >
                      <Trash2 size={14}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};