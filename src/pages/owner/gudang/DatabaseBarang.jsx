import { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru.jsx';

// Halaman untuk mengelola database barang di gudang
export default function DatabaseBarang() {
  const [isModalOpen, setModalOpen] = useState(false);
  
  // Data dummy untuk daftar barang
  const dummyItems = [
    { id: 1, name: 'Kopi Susu Gula Aren', sku: 'KSGA', stock: 50, price: 15000 },
    { id: 2, name: 'Croissant Cokelat', sku: 'CRCK', stock: 35, price: 12000 },
    { id: 3, name: 'Air Mineral 600ml', sku: 'AM600', stock: 120, price: 3000 },
  ];

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };
  
  const handleAddItem = () => {
    console.log("Tombol 'Tambah Barang Baru' diklik.");
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Halaman */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Database Barang</h2>
          <button onClick={handleAddItem} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            <span>Tambah Barang Baru</span>
          </button>
        </div>
        
        {/* Daftar Barang */}
        <div className="space-y-3">
          {dummyItems.map(item => (
            <div key={item.id} className="card flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">SKU: {item.sku} • {formatCurrency(item.price)}</p>
              </div>
              <div className="font-semibold text-right">
                <p>{item.stock}</p>
                <p className="text-xs text-slate-400 font-normal">Stok</p>
              </div>
              <button className="icon-btn hover:bg-slate-100" onClick={() => console.log('Aksi untuk item:', item.id)}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal Tambah Barang Baru */}
      <TambahBarangBaruModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        existingItems={dummyItems}
      />
    </>
  );
}

