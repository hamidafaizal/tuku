import React from 'react';
import { Search, Plus } from 'lucide-react';

// Keterangan: Header kustom untuk halaman Database.
// Props `onAddClick`, `searchTerm`, dan `setSearchTerm` ditambahkan.
export default function Header({ onAddClick, searchTerm, setSearchTerm }) {
  console.log('// Database: Merender Header kustom untuk halaman Database.');
  
  // Keterangan: Handler untuk perubahan input search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log('// Database: Input search berubah:', e.target.value);
  };
  
  return (
    <div className="flex-shrink-0 sticky top-0 backdrop-blur z-10 py-4 border-b border-slate-200">
      <div className="flex flex-col gap-2">
        {/* Search area diletakkan di atas */}
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            placeholder="Cari nama barang..."
            value={searchTerm} // Keterangan: Nilai input dikontrol oleh state `searchTerm`
            onChange={handleSearchChange} // Keterangan: Menerima perubahan dari input
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
