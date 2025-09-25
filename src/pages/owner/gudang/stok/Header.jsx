import React from 'react';
import { Search } from 'lucide-react';

// Keterangan: Komponen header untuk halaman Stok.
// Menerima searchTerm dan setSearchTerm sebagai props untuk fungsionalitas pencarian.
export default function Header({ searchTerm, setSearchTerm }) {
  console.log('// Stok: Merender Header untuk halaman Stok.');

  // Handler untuk perubahan pada input pencarian
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log('// Stok: Nilai pencarian berubah:', e.target.value);
  };

  return (
    <div className="flex-shrink-0 sticky top-0 backdrop-blur z-10 py-4 border-b border-slate-200">
      <div className="relative">
        <input
          type="text"
          className="input pl-10"
          placeholder="Cari nama barang..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
