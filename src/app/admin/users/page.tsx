'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/sidebar';
import TopBar from '../../../components/top-bar';
import Toast from '../../../components/toast';
import ConfirmDialog from '../../../components/confirm-dialog';
import { Users, Shield, Trash2, Edit, Search, UserCheck, UserX } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'toggle' | 'delete';
    userId: number;
    currentStatus?: boolean;
  } | null>(null);

  useEffect(() => {
    // Kiểm tra quyền admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      setToastType('error');
      setToastMessage('Bạn không có quyền truy cập trang này!');
      setShowToast(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = (userId: number, currentStatus: boolean) => {
    setConfirmAction({ type: 'toggle', userId, currentStatus });
    setShowConfirm(true);
  };

  const deleteUser = (userId: number) => {
    setConfirmAction({ type: 'delete', userId });
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    setShowConfirm(false);

    try {
      const token = localStorage.getItem('token');

      if (confirmAction.type === 'toggle') {
        const response = await fetch(`/api/admin/users/${confirmAction.userId}/toggle`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_active: !confirmAction.currentStatus })
        });

        if (response.ok) {
          setToastType('success');
          setToastMessage(confirmAction.currentStatus ? 'Đã vô hiệu hóa người dùng' : 'Đã kích hoạt người dùng');
          setShowToast(true);
          loadUsers();
        } else {
          setToastType('error');
          setToastMessage('Đã xảy ra lỗi');
          setShowToast(true);
        }
      } else if (confirmAction.type === 'delete') {
        const response = await fetch(`/api/admin/users/${confirmAction.userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setToastType('success');
          setToastMessage('Đã xóa người dùng');
          setShowToast(true);
          loadUsers();
        } else {
          setToastType('error');
          setToastMessage('Đã xảy ra lỗi');
          setShowToast(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setToastType('error');
      setToastMessage('Đã xảy ra lỗi');
      setShowToast(true);
    } finally {
      setConfirmAction(null);
    }
  };

  const handleCancelAction = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d2557] flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Confirm Dialog */}
      {showConfirm && confirmAction && (
        <ConfirmDialog
          title={confirmAction.type === 'delete' ? 'Xác nhận xóa' : 'Xác nhận thay đổi'}
          message={
            confirmAction.type === 'delete'
              ? 'Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!'
              : `Bạn có chắc muốn ${confirmAction.currentStatus ? 'vô hiệu hóa' : 'kích hoạt'} người dùng này?`
          }
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          confirmText={confirmAction.type === 'delete' ? 'Xóa' : 'Xác nhận'}
          cancelText="Hủy"
        />
      )}

      <div className="min-h-screen bg-[#0d2557] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-[#0d2557]">
          <TopBar />

          <main className="flex-1 px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-blue-400" />
                  <h1 className="text-3xl font-bold text-white">Quản lý người dùng</h1>
                </div>
                <p className="text-gray-300">Tổng số: {users.length} người dùng</p>
              </div>
              <button
                onClick={() => router.push('/admin')}
                className="px-6 py-3 bg-[#2d4a6e] hover:bg-[#3d5a7e] text-white rounded-lg transition-all"
              >
                ← Quay lại Dashboard
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1e3a5f]/60 border border-[#2d4a6e]/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-xl border border-[#2d4a6e]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2d4a6e]/30 border-b border-[#2d4a6e]/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Tên đăng nhập</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Họ tên</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Vai trò</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">Ngày tạo</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d4a6e]/30">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#2d4a6e]/20 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{user.full_name || '-'}</td>
                      <td className="px-6 py-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            <UserCheck className="w-3 h-3" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                            <UserX className="w-3 h-3" />
                            Vô hiệu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            className="p-2 hover:bg-[#2d4a6e] rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                            title={user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          >
                            {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 hover:bg-[#2d4a6e] rounded-lg transition-colors text-red-400 hover:text-red-300"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Không tìm thấy người dùng nào
              </div>
            )}
          </div>
        </main>

        <div className="text-center py-4 text-gray-400 text-xs">
          Copyright 2025 by NOTES VN All rights reserved.
        </div>
      </div>
    </div>
    </>
  );
}

