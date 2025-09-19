import React from 'react';
import { AlertTriangle, Search } from 'lucide-react';

// Komponen untuk halaman produk stok tipis
export default function StokTipis() {
  // Dummy data untuk produk dengan stok menipis
  // Nantinya data ini akan diambil dari database
  const lowStockItems = [
    { id: 1, name: 'Kopi Susu Gula Aren', sku: 'KSGA-001', stock: 5, unit: 'pax' },
    { id: 2, name: 'Teh Hijau Original', sku: 'THO-002', stock: 10, unit: 'pcs' },
    { id: 3, name: 'Air Mineral 600ml', sku: 'AM-003', stock: 12, unit: 'botol' },
  ];

  return (
    <div className="space-y-4">
      {/* Header Halaman */}
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
        <div>
          <h2 className="text-xl font-bold">Stok Tipis</h2>
          <p className="muted text-sm">Produk dengan stok di bawah 15 unit.</p>
        </div>
      </div>

      {/* Area Pencarian (jika diperlukan, untuk saat ini hanya placeholder) */}
      <div className="relative">
        <input 
          type="text" 
          className="input pl-10" 
          placeholder="Cari barang stok tipis..." 
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Daftar Produk Stok Tipis */}
      <div className="space-y-3 pt-4">
        {lowStockItems.length > 0 ? (
          lowStockItems.map(item => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-lg text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">SKU: {item.sku}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-2xl text-rose-500">{item.stock}</span>
                <span className="text-xs text-rose-500">unit</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500">Tidak ada produk dengan stok tipis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
