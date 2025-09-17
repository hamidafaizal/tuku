import { useState } from 'react';
import { Package, Truck, BarChart3, DatabaseZap } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';

// Halaman-halaman turunan Gudang
import DatabaseBarang from '../pages/owner/gudang/DatabaseBarang.jsx';
import ProductList from '../pages/owner/gudang/ProductList.jsx';
import StokMasuk from '../pages/owner/gudang/StokMasuk.jsx';

// Layout khusus untuk semua halaman yang berhubungan dengan Gudang
export default function GudangLayout() {
  // State untuk melacak item menu mana yang aktif di BottomNav
  const [activeItem, setActiveItem] = useState('database');
  console.log(`Rendering GudangLayout, item aktif: ${activeItem}`);

  // Daftar menu yang akan ditampilkan di navigasi bawah
  const gudangMenuItems = [
    { key: 'productList', label: 'Produk', icon: Package },
    { key: 'stockIn', label: 'Stok Masuk', icon: Truck },
    { key: 'report', label: 'Laporan', icon: BarChart3 },
    { key: 'database', label: 'Database', icon: DatabaseZap },
  ];

  // Fungsi untuk mengubah halaman yang aktif
  const handleNavigate = (itemKey) => {
    console.log(`Navigasi di dalam Gudang ke: ${itemKey}`);
    setActiveItem(itemKey);
  };
  
  // Fungsi untuk merender komponen halaman sesuai activeItem
  const renderPage = () => {
    switch (activeItem) {
      case 'productList':
        return <ProductList />;
      case 'stockIn':
        return <StokMasuk />;
      case 'database':
        return <DatabaseBarang />;
      // case 'report':
      //   return <Laporan />; // Placeholder untuk menu lain
      default:
        return <DatabaseBarang />;
    }
  };

  return (
    // Container GudangLayout diatur sebagai flex column agar konten terbagi secara vertikal
    <div className="flex-1 flex flex-col">
      {/* Area konten fleksibel yang akan digulir */}
      <div className="flex-1">
        <div className="container-app py-4 md:py-6 h-full">
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
