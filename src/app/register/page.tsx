'use client';

import { useState } from 'react';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Đăng ký thất bại');
        return;
      }

      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Register error:', error);
      setError('Đã xảy ra lỗi khi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d2557] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#0d2557]">
        <TopBar />
        
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Register Card */}
            <div className="bg-[#1e3a5f]/60 backdrop-blur-sm rounded-2xl shadow-2xl p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">Đăng ký</h1>
                <div className="text-4xl font-bold text-[#60a5fa] mb-1" style={{ 
                  fontFamily: 'monospace', 
                  letterSpacing: '0.1em'
                }}>
                  VOZ
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-[#1a3456] border border-[#2d4a6e]/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                    Tên đăng nhập <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full px-4 py-3 bg-[#1a3456] border border-[#2d4a6e]/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-[#1a3456] border border-[#2d4a6e]/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Mật khẩu <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-[#1a3456] border border-[#2d4a6e]/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Xác nhận mật khẩu <span className="text-red-400">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#1a3456] border border-[#2d4a6e]/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                  />
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <span className="text-gray-300 text-sm">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      Đăng nhập
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </main>

        <div className="text-center py-4 text-gray-400 text-xs">
          Copyright 2025 by NOTES VN All rights reserved.
        </div>
      </div>
    </div>
  );
}

