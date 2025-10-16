'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import Toast from '../../components/toast';
import { Users, Link2, FileText, QrCode, Shield, Activity } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalLinks: number;
  totalNotes: number;
  totalQRCodes: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalLinks: 0,
    totalNotes: 0,
    totalQRCodes: 0
  });
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Kiểm tra user đã đăng nhập và có quyền admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Kiểm tra role admin
    if (parsedUser.role !== 'admin') {
      setToastType('error');
      setToastMessage('Bạn không có quyền truy cập trang này!');
      setShowToast(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }

    // Load stats
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="min-h-screen bg-[#0d2557] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-[#0d2557]">
          <TopBar />

        <main className="flex-1 px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-gray-300">Chào mừng, {user?.fullName || user?.username}!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-xl p-6 border border-[#2d4a6e]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-300 text-sm mb-1">Tổng người dùng</h3>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>

            {/* Total Links */}
            <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-xl p-6 border border-[#2d4a6e]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-green-400" />
                </div>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-300 text-sm mb-1">Link rút gọn</h3>
              <p className="text-3xl font-bold text-white">{stats.totalLinks}</p>
            </div>

            {/* Total Notes */}
            <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-xl p-6 border border-[#2d4a6e]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-300 text-sm mb-1">Ghi chú</h3>
              <p className="text-3xl font-bold text-white">{stats.totalNotes}</p>
            </div>

            {/* Total QR Codes */}
            <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-xl p-6 border border-[#2d4a6e]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-orange-400" />
                </div>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-300 text-sm mb-1">Mã QR</h3>
              <p className="text-3xl font-bold text-white">{stats.totalQRCodes}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-xl p-6 border border-[#2d4a6e]/30 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Quản lý nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center gap-3 px-6 py-4 bg-[#2d4a6e] hover:bg-[#3d5a7e] rounded-lg transition-all text-white"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Quản lý người dùng</span>
              </button>
              <button
                onClick={() => router.push('/admin/links')}
                className="flex items-center gap-3 px-6 py-4 bg-[#2d4a6e] hover:bg-[#3d5a7e] rounded-lg transition-all text-white"
              >
                <Link2 className="w-5 h-5" />
                <span className="font-medium">Quản lý link</span>
              </button>
              <button
                onClick={() => router.push('/admin/settings')}
                className="flex items-center gap-3 px-6 py-4 bg-[#2d4a6e] hover:bg-[#3d5a7e] rounded-lg transition-all text-white"
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Cài đặt hệ thống</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-xl p-6 border border-[#2d4a6e]/30">
            <h2 className="text-xl font-bold text-white mb-4">Hoạt động gần đây</h2>
            <div className="text-gray-300 text-center py-8">
              Chức năng đang được phát triển...
            </div>
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

