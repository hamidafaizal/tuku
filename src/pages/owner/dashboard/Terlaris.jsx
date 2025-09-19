import React, { useState } from 'react';
import { Award, Settings } from 'lucide-react';

// Komponen untuk halaman produk terlaris
export default function Terlaris() {
  // State untuk mengontrol jumlah item yang ditampilkan
  const [displayCount, setDisplayCount] = useState(20);
  // State untuk mengontrol visibilitas menu pengaturan
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dummy data untuk produk terlaris
  const topSellingItems = [
    { id: 1, name: 'Kopi Susu Gula Aren', sales: 120 },
    { id: 2, name: 'Air Mineral 600ml', sales: 105 },
    { id: 3, name: 'Teh Hijau Original', sales: 98 },
    { id: 4, name: 'Roti Bakar Cokelat', sales: 87 },
    { id: 5, name: 'Es Jeruk Nipis', sales: 75 },
    { id: 6, name: 'Cireng Crispy', sales: 62 },
    { id: 7, name: 'Mie Goreng Instan', sales: 55 },
    { id: 8, name: 'Keripik Kentang', sales: 49 },
    { id: 9, name: 'Nasi Goreng Spesial', sales: 41 },
    { id: 10, name: 'Kopi Hitam', sales: 38 },
    { id: 11, name: 'Jus Alpukat', sales: 35 },
    { id: 12, name: 'Pisang Goreng Keju', sales: 32 },
    { id: 13, name: 'Susu Cokelat Dingin', sales: 30 },
    { id: 14, name: 'Cemilan Asin', sales: 28 },
    { id: 15, name: 'Sate Ayam', sales: 25 },
  ];
  
  // Fungsi untuk menangani perubahan input jumlah item
  const handleCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    // Keterangan: Memastikan nilai yang valid (angka positif)
    if (!isNaN(value) && value > 0) {
      setDisplayCount(value);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Keterangan: Header fixed yang kini full-width */}
      <div className="flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-xl z-10 py-2 border-b border-slate-200">
        <div className="container-app">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-sky-500" />
              <div>
                <h2 className="text-xl font-bold">Terlaris</h2>
                <p className="muted text-sm">Produk dengan penjualan tertinggi bulan ini.</p>
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
          
          {/* Keterangan: Input untuk mengatur jumlah item yang ditampilkan */}
          {isSettingsOpen && (
            <div className="p-4 bg-slate-50 rounded-lg mt-2">
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Tampilkan hingga
              </label>
              <input
                type="number"
                value={displayCount}
                onChange={handleCountChange}
                min="1"
                max={topSellingItems.length}
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
            <h3 className="font-semibold text-slate-800 mb-4">Peringkat Teratas ({displayCount})</h3>
            <div className="space-y-3">
              {topSellingItems.slice(0, displayCount).map((item, index) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 flex-shrink-0 bg-sky-500 text-white font-bold text-sm rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base text-slate-800">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-sky-600">{item.sales}</span>
                    <p className="text-sm text-slate-500">penjualan</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
