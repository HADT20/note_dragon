'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import Toast from '../../components/toast';
import { Copy, ExternalLink, Trash2, BarChart3 } from 'lucide-react';

interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function ShortLinkPage() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Load saved short links from localStorage
    const saved = localStorage.getItem('vozee-short-links');
    if (saved) {
      setShortLinks(JSON.parse(saved));
    }
  }, []);

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const createShortLink = () => {
    if (!url.trim() || !isValidUrl(url)) {
      setToastType('error');
      setToastMessage('Vui lòng nhập URL hợp lệ');
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    const shortCode = customCode.trim() || generateShortCode();

    // Check if custom code already exists
    if (shortLinks.some(link => link.shortCode === shortCode)) {
      setToastType('error');
      setToastMessage('Mã rút gọn này đã tồn tại, vui lòng chọn mã khác');
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    const newShortLink: ShortLink = {
      id: Date.now().toString(),
      originalUrl: url.trim(),
      shortCode,
      shortUrl: `https://voz.ee/${shortCode}`,
      clicks: 0,
      createdAt: new Date().toLocaleString('vi-VN')
    };

    const updatedLinks = [newShortLink, ...shortLinks];
    setShortLinks(updatedLinks);
    localStorage.setItem('vozee-short-links', JSON.stringify(updatedLinks));

    // Show success toast
    setToastType('success');
    setToastMessage('Link đã được rút gọn thành công!');
    setShowToast(true);

    // Clear form
    setUrl('');
    setCustomCode('');
    setIsLoading(false);
  };

  const deleteLink = (id: string) => {
    const updatedLinks = shortLinks.filter(link => link.id !== id);
    setShortLinks(updatedLinks);
    localStorage.setItem('vozee-short-links', JSON.stringify(updatedLinks));

    setToastType('success');
    setToastMessage('Đã xóa link');
    setShowToast(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastType('success');
    setToastMessage('Đã copy vào clipboard!');
    setShowToast(true);
  };

  const incrementClick = (id: string) => {
    const updatedLinks = shortLinks.map(link => 
      link.id === id ? { ...link, clicks: link.clicks + 1 } : link
    );
    setShortLinks(updatedLinks);
    localStorage.setItem('vozee-short-links', JSON.stringify(updatedLinks));
  };

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
          {/* Top Bar */}
          <TopBar />
        <main className="flex-1 px-12 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">Rút Gọn Đường Dẫn</h1>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tăng tính thẩm mỹ cho người nhận đường dẫn và dễ quản trọng chất trong việc rút gọn link là dễ dàng hơn bao giờ hết. Những năm vừa rồi google danh giá rất cao những link được rút gọn.
              </p>
            </div>

            {/* URL Input Section */}
            <div className="bg-white rounded-full shadow-lg mb-12 flex items-center px-6 py-4">
              <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                type="url"
                placeholder="Nhập đường dẫn cần rút gọn vào đây..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none text-base"
              />
              <div className="flex gap-3 ml-4">
                <button
                  onClick={createShortLink}
                  disabled={!url.trim() || isLoading}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-md"
                >
                  Thời Gian
                </button>
                <button
                  onClick={createShortLink}
                  disabled={!url.trim() || isLoading}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-md"
                >
                  Rút Gọn
                </button>
              </div>
            </div>

            {/* Steps Section */}
            <div className="flex items-center justify-center gap-16 mb-16">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-medium text-white">Nhập Liệu</h3>
              </div>

              {/* Arrow 1 */}
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>

              {/* Step 2 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-medium text-white">Chỉnh Sửa</h3>
              </div>

              {/* Arrow 2 */}
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>

              {/* Step 3 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-medium text-white">Chia Sẻ</h3>
              </div>
            </div>

            {/* Short Links List */}
            {shortLinks.length > 0 && (
              <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Link đã tạo</h2>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {shortLinks.map((link) => (
                    <div key={link.id} className="border border-blue-400/30 rounded-lg p-4 bg-blue-700/20 hover:bg-blue-700/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-orange-400 truncate">
                              {link.shortUrl}
                            </span>
                            <button
                              onClick={() => copyToClipboard(link.shortUrl)}
                              className="p-1 text-blue-200 hover:text-white transition-colors"
                              title="Sao chép"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-blue-100 truncate">
                            {link.originalUrl}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => {
                              incrementClick(link.id);
                              window.open(link.originalUrl, '_blank');
                            }}
                            className="p-1 text-blue-200 hover:text-white transition-colors"
                            title="Mở link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="p-1 text-blue-200 hover:text-red-400 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-blue-200">
                        <span>{link.createdAt}</span>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>{link.clicks} lượt click</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
