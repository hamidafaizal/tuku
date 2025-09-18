import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import TambahStokModal from './modals/TambahStok.jsx';

export default function StokMasuk() {
  const [searchTerm, setSearchTerm] = useState('');
  // Keterangan: State untuk mengelola visibilitas modal tambah stok
  const [isTambahStokModalOpen, setIsTambahStokModalOpen] = useState(false);

  // Keterangan: Fungsi untuk membuka modal
  const handleOpenTambahStokModal = () => {
    console.log('Membuka modal tambah stok');
    setIsTambahStokModalOpen(true);
  };

  // Keterangan: Fungsi untuk menutup modal
  const handleCloseTambahStokModal = () => {
    console.log('Menutup modal tambah stok');
    setIsTambahStokModalOpen(false);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Area fixed untuk tools di bagian atas */}
      <div className="flex-shrink-0 sticky top-0 backdrop-blur z-10 py-2 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          {/* Keterangan: Tombol untuk membuka modal tambah stok */}
          <button onClick={handleOpenTambahStokModal} className="btn btn-primary btn-sm">
            <Plus className="w-4 h-4" />
            <span>Stok</span>
          </button>
          <input type="date" className="input text-sm w-fit" />
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
            placeholder="Cari nama barang..."
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Area yang menggunakan overflow-y-auto */}
      <div className="flex-1 overflow-y-auto pb-20">
        <p className="text-center text-slate-500 py-10">Isi halaman stok masuk akan ditampilkan di sini.</p>
      </div>
      
      {/* Keterangan: Menggunakan modal tambah stok */}
      <TambahStokModal 
        isOpen={isTambahStokModalOpen} 
        onClose={handleCloseTambahStokModal} 
      />
    </div>
  );
}
