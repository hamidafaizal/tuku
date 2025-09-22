import React from 'react';
// Keterangan: Mengimpor Header kustom untuk halaman ini
import Header from './Header.jsx';

// Halaman utama untuk membungkus konten menu Database.
export default function Database() {
  // Keterangan: Ini adalah placeholder sementara.
  console.log('Rendering halaman Database.');
  return (
    <div className="flex flex-col h-full">
      {/* Menggunakan Header kustom */}
      <Header />
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        <p className="muted">Halaman database siap di kembangkan</p>
      </div>
    </div>
  );
}
