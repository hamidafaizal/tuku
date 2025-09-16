import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

export default function StokMasuk() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Stok Masuk</h3>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4" />
          <span>Tambah Stok</span>
        </button>
      </div>

      {/* Area Pencarian */}
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

      <div>
        <p className="text-slate-500">Isi halaman stok masuk akan ditampilkan di sini.</p>
      </div>
    </div>
  );
}
