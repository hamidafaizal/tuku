import { useState } from 'react';
// Import icon yang diperlukan, termasuk icon mata uang rupiah (DollarSign atau CurrencyDollar dari lucide-react)
import { Package, Truck, DatabaseZap, DollarSign } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';

// Halaman-halaman turunan Gudang
import DatabaseBarang from '../pages/owner/gudang/DatabaseBarang.jsx';
import ProductList from '../pages/owner/gudang/ProductList.jsx';
import StokMasuk from '../pages/owner/gudang/StokMasuk.jsx';
// Keterangan: Mengimpor komponen HargaJual yang baru
import HargaJual from '../pages/owner/gudang/HargaJual.jsx';

// Layout khusus untuk semua halaman yang berhubungan dengan Gudang
export default function GudangLayout() {
  // State untuk melacak item menu mana yang aktif di BottomNav
  const [activeItem, setActiveItem] = useState('database');
  console.log(`Rendering GudangLayout, item aktif: ${activeItem}`);

  // Daftar menu yang akan ditampilkan di navigasi bawah
  const gudangMenuItems = [
    { key: 'productList', label: 'Produk', icon: Package },
    { key: 'stockIn', label: 'Stok Masuk', icon: Truck },
    // Mengubah label dari 'Laporan' menjadi 'Harga Jual' dan ikonnya menjadi DollarSign
    { key: 'hargaJual', label: 'Harga Jual', icon: DollarSign },
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
      // Keterangan: Merender komponen HargaJual yang sudah diimpor
      case 'hargaJual':
        return <HargaJual />;
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
