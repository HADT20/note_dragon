'use client';

import { Sun, Moon, User, LogOut, Settings, FileText, QrCode, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopBar() {
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Đóng menu khi click bên ngoài
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex justify-end items-center px-6 py-4 bg-[#0d2557]">
      <div className="flex items-center gap-3">
        {/* Light Mode Button */}
        <button
          className="w-10 h-10 rounded-full bg-[#2d4a6e] hover:bg-[#3d5a7e] transition-all duration-200 flex items-center justify-center shadow-lg"
          aria-label="Chế độ sáng"
          title="Chế độ sáng"
        >
          <Sun className="h-5 w-5 text-white" />
        </button>

        {/* Dark Mode Button */}
        <button
          className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 transition-all duration-200 flex items-center justify-center shadow-lg"
          aria-label="Chế độ tối"
          title="Chế độ tối"
        >
          <Moon className="h-5 w-5 text-[#2d4a6e]" />
        </button>

        {/* User Section */}
        {user ? (
          <div className="relative user-menu-container">
            {/* User Info Button */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#2d4a6e] hover:bg-[#3d5a7e] transition-all duration-200 shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-white">{user.username}</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1e3a5f] rounded-xl shadow-2xl border border-[#2d4a6e]/50 overflow-hidden z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 bg-[#2d4a6e]/30 border-b border-[#2d4a6e]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Trương Hà</p>
                      <p className="text-xs text-gray-300">@{user.username}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* Admin Dashboard - Chỉ hiển thị cho admin */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2d4a6e]/30 transition-colors text-orange-400 hover:text-orange-300"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-semibold">Admin Dashboard</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2d4a6e]/30 transition-colors text-gray-200 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">Quản lý tài khoản</span>
                  </Link>
                  <Link
                    href="/my-notes"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2d4a6e]/30 transition-colors text-gray-200 hover:text-white"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Ghi chú của tôi</span>
                  </Link>
                  <Link
                    href="/qr-code"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2d4a6e]/30 transition-colors text-gray-200 hover:text-white"
                  >
                    <QrCode className="h-4 w-4" />
                    <span className="text-sm">Quản lý mã QR</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2d4a6e]/30 transition-colors text-gray-200 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Cài đặt</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-[#2d4a6e]/50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* User Icon Button */}
            <button
              className="w-10 h-10 rounded-full bg-[#2d4a6e] hover:bg-[#3d5a7e] transition-all duration-200 flex items-center justify-center shadow-lg"
              aria-label="User"
              title="User"
            >
              <User className="h-5 w-5 text-white" />
            </button>

            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d4a6e] hover:bg-[#3d5a7e] transition-all duration-200 text-white shadow-lg"
            >
              <span className="font-semibold text-sm">Đăng nhập</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

