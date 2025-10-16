'use client';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Hủy'
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e3a5f] rounded-2xl max-w-md w-full border border-[#2d4a6e]/50 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2d4a6e]/50">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-300 text-base leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-[#2d4a6e]/50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

