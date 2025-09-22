import React, { useState } from 'react';
import Header from './Header.jsx';
import TambahStok from './TambahStok.jsx';

// Halaman utama untuk mencatat stok masuk.
export default function StokMasuk() {
  const [showTambahStok, setShowTambahStok] = useState(false);

  const handleAddClick = () => {
    setShowTambahStok(true);
    console.log('// Stok Masuk: Mengaktifkan mode tambah stok.');
  };

  const handleBack = () => {
    setShowTambahStok(false);
    console.log('// Stok Masuk: Kembali ke halaman utama stok masuk.');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Keterangan: Header tidak akan dirender saat form Tambah Stok ditampilkan */}
      {!showTambahStok && <Header onAddClick={handleAddClick} />}
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        {/* Keterangan: Menampilkan halaman yang sesuai dengan state */}
        {showTambahStok ? <TambahStok onBack={handleBack} /> : null}
      </div>
    </div>
  );
}
