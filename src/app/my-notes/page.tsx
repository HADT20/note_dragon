'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import TopBar from '../../components/top-bar';
import Toast from '../../components/toast';
import ConfirmDialog from '../../components/confirm-dialog';
import { FileText, Trash2, Eye, Copy, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Note {
  id: number;
  title: string;
  recipient: string;
  content: string;
  note_key: string;
  created_at: string;
  updated_at: string;
}

export default function MyNotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const userData = localStorage.getItem('user');
    if (!userData) {
      setToastType('warning');
      setToastMessage('Vui lòng đăng nhập để xem ghi chú');
      setShowToast(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    loadNotes();
  }, [router]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setToastType('error');
        setToastMessage(data.error || 'Đã xảy ra lỗi khi tải ghi chú');
        setShowToast(true);
        return;
      }

      setNotes(data.notes);
    } catch (error) {
      console.error('Load notes error:', error);
      setToastType('error');
      setToastMessage('Đã xảy ra lỗi khi tải ghi chú');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    setNoteToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    setShowConfirm(false);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notes/${noteToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setToastType('error');
        setToastMessage(data.error || 'Đã xảy ra lỗi khi xóa ghi chú');
        setShowToast(true);
        return;
      }

      setToastType('success');
      setToastMessage('Ghi chú đã được xóa!');
      setShowToast(true);

      // Reload notes
      loadNotes();
    } catch (error) {
      console.error('Delete note error:', error);
      setToastType('error');
      setToastMessage('Đã xảy ra lỗi khi xóa ghi chú');
      setShowToast(true);
    } finally {
      setNoteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setNoteToDelete(null);
  };

  const viewNote = (note: Note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const copyNoteKey = (noteKey: string) => {
    navigator.clipboard.writeText(noteKey);
    setToastType('success');
    setToastMessage(`Đã copy mã khóa: ${noteKey}`);
    setShowToast(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
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

      {/* Confirm Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message="Bạn có chắc muốn xóa ghi chú này?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Xóa"
          cancelText="Hủy"
        />
      )}

      {/* Modal xem chi tiết */}
      {showModal && selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedNote.title || 'Ghi chú'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedNote.recipient && (
                <p className="text-gray-600 mb-2">
                  <strong>Người nhận:</strong> {selectedNote.recipient}
                </p>
              )}

              <p className="text-gray-600 mb-4">
                <strong>Mã khóa:</strong> 
                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                  {selectedNote.note_key}
                </span>
                <button
                  onClick={() => copyNoteKey(selectedNote.note_key)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <Copy className="h-4 w-4 inline" />
                </button>
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                  {selectedNote.content}
                </pre>
              </div>

              <p className="text-sm text-gray-500">
                Tạo lúc: {formatDate(selectedNote.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#0d2557] flex">
        <Sidebar />

        <div className="flex-1 flex flex-col bg-[#0d2557]">
          <TopBar />

          <main className="flex-1 px-16 py-12">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-3">Ghi Chú Của Tôi</h1>
                <p className="text-gray-300 text-base">
                  Quản lý tất cả các ghi chú bạn đã tạo
                </p>
              </div>

              {/* Loading */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-20">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">Bạn chưa có ghi chú nào</p>
                  <button
                    onClick={() => router.push('/notes')}
                    className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
                  >
                    Tạo ghi chú mới
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                          {note.title || 'Ghi chú'}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewNote(note)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Xem"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Xóa"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {note.recipient && (
                        <p className="text-sm text-gray-600 mb-2">
                          Người nhận: {note.recipient}
                        </p>
                      )}

                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                        {note.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {note.note_key}
                        </span>
                        <button
                          onClick={() => copyNoteKey(note.note_key)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(note.created_at)}
                      </p>
                    </div>
                  ))}
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

