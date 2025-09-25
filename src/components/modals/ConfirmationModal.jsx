import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

// Komponen modal konfirmasi yang dapat digunakan kembali
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
            <AlertTriangle className="h-6 w-6 text-rose-600" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
          <button
            type="button"
            className="btn btn-danger w-full sm:ml-3 sm:w-auto"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{isLoading ? 'Memproses...' : confirmText}</span>
          </button>
          <button
            type="button"
            className="btn mt-3 w-full sm:mt-0 sm:w-auto"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
