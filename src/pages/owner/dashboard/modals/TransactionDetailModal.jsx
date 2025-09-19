import React from 'react';
import { X } from 'lucide-react';

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;
  
  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Detail Transaksi: {transaction.id}</h2>
          <button onClick={onClose} className="icon-btn hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-semibold">Tanggal:</span> {new Date(transaction.date).toLocaleDateString()}</p>
            <p><span className="font-semibold">Kasir:</span> {transaction.cashier}</p>
          </div>

          <div className="divider" />
          
          <h3 className="font-semibold text-base">Daftar Produk</h3>
          <ul className="space-y-2">
            {transaction.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-sm card p-3 bg-slate-50">
                <div className="flex-1">
                  <p className="font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-500">{formatCurrency(item.price)} x {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-slate-50 border-t flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>
      </div>
    </div>
  );
}
