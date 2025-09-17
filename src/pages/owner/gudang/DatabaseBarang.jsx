import { useState } from 'react';
import { Plus } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru.jsx';
// Semua impor yang berhubungan dengan Supabase telah dihapus.
// import { upsertSupabaseProduct } from '../../../utils/supabaseDb.js';
// import { useAuth } from '../../../context/AuthContext.jsx';

// Halaman untuk mengelola database barang di gudang dengan logika dummy
export default function DatabaseBarang() {
  const [isModalOpen, setModalOpen] = useState(false);
  // const { session } = useAuth();

  // Handler dummy untuk menyimpan barang baru
  const handleSaveNewItem = async (newItemData) => {
    // console.log untuk debugging
    console.log("SIMULASI: Data yang diterima dari modal:", newItemData);
    // Di sini Anda bisa menambahkan logika dummy lain jika diperlukan.
    
    // Setelah selesai, tutup modal
    setModalOpen(false);
    console.log("SIMULASI: Modal ditutup. Data tidak disimpan ke database.");
  };

  const handleAddItem = () => setModalOpen(true);

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold">Data Barang</h2>
        <button onClick={handleAddItem} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          <span>Barang Baru</span>
        </button>
      </div>

      <p className="text-center text-slate-500 py-10">Data barang akan ditampilkan di sini.</p>

      <TambahBarangBaruModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveNewItem} />
    </>
  );
}
