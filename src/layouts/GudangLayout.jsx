import { useState } from 'react';
// Import icon yang diperlukan
import { Package, Truck, DatabaseZap } from 'lucide-react';
import BottomNav from '/src/components/owner/BottomNav.jsx';

// Keterangan: Mengimpor komponen halaman gudang
import Database from '/src/pages/owner/gudang/database/Database.jsx';
import StokMasuk from '/src/pages/owner/gudang/stok_masuk/StokMasuk.jsx';
import Stok from '/src/pages/owner/gudang/stok/Stok.jsx';

// Layout khusus untuk semua halaman yang berhubungan dengan Gudang
export default function GudangLayout() {
  // State untuk melacak item menu mana yang aktif di BottomNav
  // Keterangan: Mengubah item aktif default menjadi 'stok'
  const [activeItem, setActiveItem] = useState('stok');
  console.log(`// GudangLayout: Rendering GudangLayout dengan item aktif: ${activeItem}`);

  // Daftar menu yang akan ditampilkan di navigasi bawah
  // Keterangan: Mengubah key 'productList' menjadi 'stok'
  const gudangMenuItems = [
    { key: 'stok', label: 'Stok', icon: Package },
    { key: 'stockIn', label: 'Stok Masuk', icon: Truck },
    { key: 'database', label: 'Database', icon: DatabaseZap },
  ];

  // Fungsi untuk mengubah halaman yang aktif
  const handleNavigate = (itemKey) => {
    console.log(`// GudangLayout: Navigasi di dalam Gudang ke: ${itemKey}`);
    setActiveItem(itemKey);
  };
  
  // Fungsi untuk merender komponen halaman sesuai activeItem
  const renderPage = () => {
    switch (activeItem) {
      // Keterangan: Merender komponen Stok yang baru
      case 'stok':
        return <Stok />;
      case 'stockIn':
        return <StokMasuk />;
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
      <div className="flex-1 pb-24">
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

