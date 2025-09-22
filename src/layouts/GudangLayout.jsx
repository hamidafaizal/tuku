import { useState } from 'react';
// Import icon yang diperlukan
import { Package, Truck, DatabaseZap, DollarSign } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';

// Keterangan: Mengimpor komponen Database baru
import Database from '../pages/owner/gudang/database/Database.jsx';

// Layout khusus untuk semua halaman yang berhubungan dengan Gudang
export default function GudangLayout() {
  // State untuk melacak item menu mana yang aktif di BottomNav
  const [activeItem, setActiveItem] = useState('database');
  console.log(`// GudangLayout: Rendering GudangLayout dengan item aktif: ${activeItem}`);

  // Daftar menu yang akan ditampilkan di navigasi bawah
  const gudangMenuItems = [
    { key: 'productList', label: 'Produk', icon: Package },
    { key: 'stockIn', label: 'Stok Masuk', icon: Truck },
    { key: 'hargaJual', label: 'Harga Jual', icon: DollarSign },
    { key: 'database', label: 'Database', icon: DatabaseZap },
  ];

  // Fungsi untuk mengubah halaman yang aktif
  const handleNavigate = (itemKey) => {
    console.log(`// GudangLayout: Navigasi di dalam Gudang ke: ${itemKey}`);
    setActiveItem(itemKey);
  };
  
  // Fungsi untuk merender komponen halaman sesuai activeItem
  const renderPage = () => {
    // Keterangan: Mengubah logika untuk merender komponen Database
    switch (activeItem) {
      case 'database':
        return <Database />;
      default:
        // Placeholder untuk menu lainnya
        console.log(`// GudangLayout: Merender halaman placeholder untuk item: ${activeItem}`);
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">Halaman {activeItem} akan muncul di sini.</p>
          </div>
        );
    }
  };

  return (
    // Container GudangLayout diatur sebagai flex column agar konten terbagi secara vertikal
    <div className="flex-1 flex flex-col">
      {/* Area konten fleksibel yang akan digulir */}
      <div className="flex-1">
        <div className="container-app h-full">
          {renderPage()}
        </div>
      </div>
      
      {/* Navigasi Bawah (Persistent) */}
      <BottomNav 
        menuItems={gudangMenuItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
