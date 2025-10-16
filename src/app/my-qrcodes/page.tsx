'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import Toast from '../../components/toast';
import { QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyQRCodesPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Kiểm tra đăng nhập
    const userData = localStorage.getItem('user');
    if (!userData) {
      setToastType('warning');
      setToastMessage('Vui lòng đăng nhập để xem mã QR');
      setShowToast(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }
  }, [router]);

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

          <main className="flex-1 px-16 py-12">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-3">Quản Lý Mã QR</h1>
                <p className="text-gray-300 text-base">
                  Kiểm tra danh sách các mã QR đã tạo
                </p>
              </div>

              {/* Coming Soon */}
              <div className="text-center py-20">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg mb-4">Tính năng đang phát triển</p>
                <button
                  onClick={() => router.push('/qr-code')}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
                >
                  Tạo mã QR mới
                </button>
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

