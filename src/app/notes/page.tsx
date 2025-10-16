'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import Toast from '../../components/toast';
import { RotateCcw, Key, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotesPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [noteKey, setNoteKey] = useState('');
  const [textStyle, setTextStyle] = useState('Paragraph');
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const userData = localStorage.getItem('user');
    if (!userData) {
      setToastType('warning');
      setToastMessage('Vui lòng đăng nhập để sử dụng tính năng này');
      setShowToast(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const resetForm = () => {
    setTitle('');
    setRecipient('');
    setContent('');
    setNoteKey('');
    setHistory(['']);
    setHistoryIndex(0);
  };

  const generateKey = () => {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();
    setNoteKey(key);
    setToastType('success');
    setToastMessage(`Mã khóa đã được tạo: ${key}`);
    setShowToast(true);
  };

  const saveNote = async () => {
    if (!content.trim()) {
      setToastType('error');
      setToastMessage('Vui lòng nhập nội dung ghi chú');
      setShowToast(true);
      return;
    }

    if (!user) {
      setToastType('error');
      setToastMessage('Vui lòng đăng nhập để lưu ghi chú');
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim() || null,
          recipient: recipient.trim() || null,
          content: content.trim(),
          note_key: noteKey.trim() || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setToastType('error');
        setToastMessage(data.error || 'Đã xảy ra lỗi khi lưu ghi chú');
        setShowToast(true);
        return;
      }

      setToastType('success');
      setToastMessage(`✅ ${data.message} - Mã khóa: ${data.note.note_key}`);
      setShowToast(true);

      // Reset form sau 2 giây
      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Save note error:', error);
      setToastType('error');
      setToastMessage('Đã xảy ra lỗi khi lưu ghi chú');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Undo/Redo functionality
  const addToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    addToHistory(newContent);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  // Text formatting functions
  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);

    handleContentChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const applyBold = () => insertFormatting('**', '**');
  const applyItalic = () => insertFormatting('*', '*');
  const applyUnderline = () => insertFormatting('<u>', '</u>');

  const applyAlignment = (align: string) => {
    insertFormatting(`<div style="text-align: ${align}">`, '</div>');
  };

  const insertList = (type: 'ul' | 'ol') => {
    const listItem = type === 'ul' ? '- ' : '1. ';
    insertFormatting('\n' + listItem);
  };

  const insertImage = () => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      insertFormatting(`![Image](${url})`);
    }
  };

  const insertLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      insertFormatting(`[Link](${url})`);
    }
  };

  const insertTable = () => {
    const table = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n';
    insertFormatting(table);
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

        <main className="flex-1 px-16 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">Tạo Ghi Chú</h1>
              <p className="text-gray-300 text-base leading-relaxed">
                Một trò hay mà của Notes đó là bạn có thể chia sẻ với của người khác thân được cách tính hướng này sẽ được cân nhắc những văn bản đã được gửi đến cho mình...
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Title, Recipient and Buttons Row */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Tiêu đề..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 px-5 py-3 border border-gray-300 rounded bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
                <input
                  type="text"
                  placeholder="Người nhận..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="flex-1 px-5 py-3 border border-gray-300 rounded bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-base font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
                  title="Thử lại"
                >
                  <RotateCcw className="h-4 w-4" />
                  Thử lại
                </button>
                <button
                  onClick={generateKey}
                  className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded text-base font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
                  title="Tạo khóa"
                >
                  <Key className="h-4 w-4" />
                  Tạo khóa
                </button>
                <button
                  onClick={saveNote}
                  disabled={isLoading}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded text-base font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu'
                  )}
                </button>
              </div>

              {/* Editor Container */}
              <div className="border border-gray-300 rounded overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="bg-white border-b border-gray-300 px-4 py-2.5 flex items-center gap-1.5 flex-wrap">
                  <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed" title="Undo">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed" title="Redo">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  <select
                    value={textStyle}
                    onChange={(e) => setTextStyle(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-700 focus:outline-none"
                  >
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  <button onClick={applyBold} className="px-2 py-1 hover:bg-gray-100 rounded font-bold text-sm text-gray-700" title="Bold">B</button>
                  <button onClick={applyItalic} className="px-2 py-1 hover:bg-gray-100 rounded italic text-sm text-gray-700" title="Italic">I</button>
                  <button onClick={applyUnderline} className="px-2 py-1 hover:bg-gray-100 rounded underline text-sm text-gray-700" title="Underline">U</button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  <button onClick={() => applyAlignment('left')} className="p-1.5 hover:bg-gray-100 rounded" title="Align Left">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                    </svg>
                  </button>
                  <button onClick={() => applyAlignment('center')} className="p-1.5 hover:bg-gray-100 rounded" title="Align Center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
                    </svg>
                  </button>
                  <button onClick={() => applyAlignment('right')} className="p-1.5 hover:bg-gray-100 rounded" title="Align Right">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                    </svg>
                  </button>
                  <button onClick={() => applyAlignment('justify')} className="p-1.5 hover:bg-gray-100 rounded" title="Justify">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  <button onClick={() => insertList('ul')} className="p-1.5 hover:bg-gray-100 rounded" title="Bullet List">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                  </button>
                  <button onClick={() => insertList('ol')} className="p-1.5 hover:bg-gray-100 rounded" title="Numbered List">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                  </button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  <button onClick={insertImage} className="p-1.5 hover:bg-gray-100 rounded" title="Insert Image">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button onClick={insertLink} className="p-1.5 hover:bg-gray-100 rounded" title="Insert Link">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>

                  <div className="w-px h-5 bg-gray-300 mx-1"></div>

                  <button onClick={insertTable} className="p-1.5 hover:bg-gray-100 rounded" title="Insert Table">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="More Options">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                {/* Content Area */}
                <textarea
                  placeholder="Xin chào..."
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={14}
                  className="w-full px-5 py-4 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none border-0 text-base leading-relaxed"
                />
              </div>
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
