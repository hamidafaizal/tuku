import React, { useState } from 'react';
// Keterangan: Mengimpor Header kustom untuk halaman ini
import Header from './Header.jsx';
import TambahBarangBaru from './TambahBarangBaru.jsx';
import { X } from 'lucide-react';

// Halaman utama untuk membungkus konten menu Database.
export default function Database() {
  // Keterangan: Menggunakan state untuk mengontrol tampilan halaman "Tambah Barang Baru"
  const [showTambahBarang, setShowTambahBarang] = useState(false);
  console.log(`Rendering halaman Database. Mode: ${showTambahBarang ? 'Tambah Produk' : 'List Database'}`);

  // Fungsi untuk menampilkan halaman tambah barang
  const handleAddClick = () => {
    console.log('Tombol "Baru" di klik, menampilkan halaman TambahBarangBaru.');
    setShowTambahBarang(true);
  };
  
  // Fungsi untuk kembali ke halaman list database
  const handleBack = () => {
    console.log('Kembali ke halaman Database utama.');
    setShowTambahBarang(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Menampilkan Header hanya jika halaman TambahBarangBaru tidak aktif */}
      {!showTambahBarang && <Header onAddClick={handleAddClick} />}
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        {/* Menampilkan komponen yang sesuai berdasarkan state */}
        {showTambahBarang ? (
          <div className="space-y-4">
            {/* Header dengan tombol kembali untuk halaman TambahBarangBaru */}
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="btn-ghost">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Tambah Produk Baru</h2>
            </div>
            <TambahBarangBaru onBack={handleBack} />
          </div>
        ) : (
          <p className="muted">Halaman database siap di kembangkan</p>
        )}
      </div>
    </div>
  );
}
