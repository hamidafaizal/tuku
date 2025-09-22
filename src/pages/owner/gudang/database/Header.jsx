import React from 'react';
import { Search, Plus } from 'lucide-react';

// Keterangan: Header kustom untuk halaman Database.
// Props `onAddClick` ditambahkan untuk menangani klik tombol "Baru".
export default function Header({ onAddClick }) {
  console.log('// Database: Merender Header kustom untuk halaman Database.');
  return (
    <div className="flex-shrink-0 sticky top-0 backdrop-blur z-10 py-4 border-b border-slate-200">
      <div className="flex flex-col gap-2">
        {/* Search area diletakkan di atas */}
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            placeholder="Cari nama barang..."
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        {/* Tombol "Baru" diletakkan di bawah */}
        <button className="btn btn-primary btn-sm" onClick={onAddClick}>
          <Plus className="w-4 h-4" />
          <span>Baru</span>
        </button>
      </div>
    </div>
  );
}
