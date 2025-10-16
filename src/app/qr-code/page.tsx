'use client';

import { useState } from 'react';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import { Download } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function QRCodePage() {
  const [text, setText] = useState('');
  const [, setSize] = useState(256);
  const [, setBgColor] = useState('#ffffff');
  const [, setFgColor] = useState('#000000');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const _copyQRCode = async () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = async () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          } catch (err) {
            console.error('Failed to copy QR code:', err);
          }
        }
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-[#0d2557] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#0d2557]">
        {/* Top Bar */}
        <TopBar />
        <main className="flex-1 px-12 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">Tạo Mã QR</h1>
              <p className="text-gray-300 text-sm leading-relaxed">
                QR code được xem là một loại mã quyền năng chứa rất nhiều thông tin được mã hóa trong 1 biểu tượng gồm những kích thước vuông và khoanh trống được cấp dựa trên một quy luật nhất định.
              </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">
                  Nội Dung Cần Tạo QR
                </label>
                <textarea
                  placeholder="Nhập nội dung..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />

                <div className="flex gap-2">
                  <button
                    onClick={downloadQR}
                    disabled={!text.trim()}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Tạo Mã
                  </button>
                  <button
                    onClick={downloadQR}
                    disabled={!text.trim()}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Tạo QR
                  </button>
                </div>
              </div>

              {/* Right Side - QR Preview */}
              <div className="flex flex-col items-center justify-center">
                {text ? (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-gray-800 inline-block">
                      <QRCode
                        id="qr-code"
                        value={text}
                        size={256}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="H"
                      />
                    </div>

                    {/* Download Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-md font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <Download className="h-4 w-4" />
                        Tải xuống (PNG)
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showDownloadMenu && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-10">
                          <button
                            onClick={() => {
                              downloadQR();
                              setShowDownloadMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm border-b border-gray-200"
                          >
                            PNG
                          </button>
                          <button
                            onClick={() => {
                              downloadQR();
                              setShowDownloadMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm border-b border-gray-200"
                          >
                            SVG
                          </button>
                          <button
                            onClick={() => {
                              downloadQR();
                              setShowDownloadMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                          >
                            EPS
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-72 h-72 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center bg-gray-800/20">
                      <p className="text-gray-500 text-sm">QR Code Preview</p>
                    </div>
                  </div>
                )}
              </div>
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
