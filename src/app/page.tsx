'use client';

import { useEffect, useState } from 'react';
import Sidebar from "../components/sidebar";
import TopBar from "../components/top-bar";
import FeatureBox from "../components/feature-box";
import { Globe, Repeat } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d2557] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#0d2557]">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-12 py-16 bg-[#0d2557]">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              VOZ.EE UTILITIES
            </h1>
            <p className="text-2xl text-gray-300 mb-10">
              Rút Gọn Link - Tạo Mã QR - Tạo Ghi Chú
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-medium transition-colors shadow-lg text-lg">
              Trải nghiệm
            </button>
          </div>

          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
            <FeatureBox
              icon={Globe}
              title="Tìm Nhận"
              description="Mong muốn đến những tính năng tuyệt vời và thành nghiệp để tạo nên những sản phẩm cần có thể hoàn toàn miễn phí."
              href="/search"
            />
            <FeatureBox
              icon={Repeat}
              title="Tái Sao Lưu"
              description="Tự động lưu trữ mọi dữ liệu của bạn một cách an toàn. Tạo ra CB thì sẽ tự động lưu trữ thành chính xác."
              href="/backup"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-gray-400 text-xs">
          Copyright 2025 by NOTES VN All rights reserved.
        </div>
      </div>
    </div>
  );
}
