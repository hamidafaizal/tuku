import React, { useState } from 'react';
import { PackageMinus, Settings } from 'lucide-react';

// Komponen untuk halaman produk stok tipis
export default function StokTipis() {
  // State untuk mengontrol batas stok
  const [stockThreshold, setStockThreshold] = useState(10);
  // State untuk mengontrol visibilitas menu pengaturan
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dummy data untuk produk dengan stok
  const allItems = [
    { id: 1, name: 'Kopi Susu Gula Aren', stock: 5 },
    { id: 2, name: 'Air Mineral 600ml', stock: 15 },
    { id: 3, name: 'Teh Hijau Original', stock: 8 },
    { id: 4, name: 'Roti Bakar Cokelat', stock: 2 },
    { id: 5, name: 'Es Jeruk Nipis', stock: 12 },
    { id: 6, name: 'Cireng Crispy', stock: 6 },
    { id: 7, name: 'Mie Goreng Instan', stock: 10 },
    { id: 8, name: 'Keripik Kentang', stock: 3 },
    { id: 9, name: 'Nasi Goreng Spesial', stock: 1 },
    { id: 10, name: 'Kopi Hitam', stock: 20 },
    { id: 11, name: 'Jus Alpukat', stock: 7 },
    { id: 12, name: 'Pisang Goreng Keju', stock: 9 },
    { id: 13, name: 'Susu Cokelat Dingin', stock: 4 },
    { id: 14, name: 'Cemilan Asin', stock: 11 },
    { id: 15, name: 'Sate Ayam', stock: 14 },
  ];
  
  // Fungsi untuk menangani perubahan input batas stok
  const handleThresholdChange = (e) => {
    const value = parseInt(e.target.value, 10);
    // Keterangan: Memastikan nilai yang valid (angka positif)
    if (!isNaN(value) && value > 0) {
      setStockThreshold(value);
      console.log('Batas stok diubah:', value);
    }
  };

  // Keterangan: Memfilter item yang stoknya di bawah batas
  const lowStockItems = allItems.filter(item => item.stock <= stockThreshold);

  return (
    <div className="flex flex-col h-full">
      {/* Keterangan: Header fixed yang kini full-width */}
      <div className="flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-xl z-10 py-2 border-b border-slate-200">
        <div className="container-app">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PackageMinus className="w-8 h-8 text-rose-500" />
              <div>
                <h2 className="text-xl font-bold">Stok Tipis</h2>
                <p className="muted text-sm">Produk yang stoknya hampir habis.</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="icon-btn hover:bg-slate-100"
              title="Pengaturan"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {/* Keterangan: Input untuk mengatur batas stok */}
          {isSettingsOpen && (
            <div className="p-4 bg-slate-50 rounded-lg mt-2">
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Tampilkan produk dengan stok kurang dari
              </label>
              <input
                type="number"
                value={stockThreshold}
                onChange={handleThresholdChange}
                min="1"
                className="input w-full md:w-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Keterangan: Konten yang bisa digulir */}
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        <div className="container-app">
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4">Produk Stok Tipis ({lowStockItems.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                  <div key={item.id} className="card p-4 flex items-center gap-4 bg-slate-50">
                    <div className="w-8 h-8 flex-shrink-0 bg-rose-500 text-white font-bold text-sm rounded-full flex items-center justify-center">
                      {item.stock}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">Stok: {item.stock}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 col-span-full">Tidak ada produk dengan stok di bawah batas yang ditentukan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
