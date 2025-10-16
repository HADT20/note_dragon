'use client';

import { useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import { User, Link as LinkIcon, QrCode, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ManageCard {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  color: string;
}

export default function ManagePage() {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra đăng nhập
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
  }, [router]);

  const manageCards: ManageCard[] = [
    {
      icon: User,
      title: 'Quản Lý Tài Khoản',
      description: 'Bạn có thể thay đổi các thông tin đăng nhập',
      buttonText: 'View On Account',
      href: '/profile',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: LinkIcon,
      title: 'Quản Lý Liên Kết',
      description: 'Tìm kiếm các liên kết đã từng được rút gọn',
      buttonText: 'View On Link',
      href: '/my-links',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: QrCode,
      title: 'Quản Lý Mã QR',
      description: 'Kiểm tra danh sách các mã QR đã tạo',
      buttonText: 'View On QR',
      href: '/my-qrcodes',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: FileText,
      title: 'Quản Lý Ghi Chú',
      description: 'Chỉnh sửa nội dung và tất cả các ghi chú',
      buttonText: 'View On Notes',
      href: '/my-notes',
      color: 'from-blue-600 to-blue-700'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a1e4a] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-[#0a1e4a]">
        <TopBar />

        <main className="flex-1 px-16 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Grid 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {manageCards.map((card, index) => (
                <Link
                  key={index}
                  href={card.href}
                  className="group"
                >
                  <div className="bg-[#1a3a7d] rounded-2xl p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-[#2d4a8e]/30">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border-2 border-white/20">
                        <card.icon className="h-10 w-10 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white text-center mb-3">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-center text-xs mb-6 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Button */}
                    <div className="flex justify-center">
                      <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md text-sm font-medium transition-all duration-200 border border-white/20">
                        {card.buttonText}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
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

