import { X, AlertTriangle } from 'lucide-react';

// Komponen Modal Konfirmasi yang dapat digunakan kembali
export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini? Proses ini tidak dapat diurungkan.",
  confirmText = "Ya, Lanjutkan"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold mt-4">{title}</h3>
          <p className="text-sm text-slate-500 mt-2">{message}</p>
        </div>
        <div className="p-4 bg-slate-50 border-t grid grid-cols-2 gap-3">
          <button onClick={onClose} className="btn">Batal</button>
          <button onClick={onConfirm} className="btn btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
