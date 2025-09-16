import { useState } from 'react';
import { Package, Truck, BarChart3, DatabaseZap } from 'lucide-react'; // Mengganti ikon Database
import BottomNav from '../components/owner/BottomNav.jsx';
import ProductList from '../pages/owner/gudang/ProductList.jsx';
import DatabaseBarang from '../pages/owner/gudang/DatabaseBarang.jsx';

// Layout khusus untuk semua halaman yang berhubungan dengan Gudang
export default function GudangLayout() {
  // State untuk melacak item menu mana yang aktif di BottomNav
  const [activeItem, setActiveItem] = useState('productList');
  console.log(`Rendering GudangLayout, item aktif: ${activeItem}`);

  // Daftar menu yang akan ditampilkan di navigasi bawah
  const gudangMenuItems = [
    { key: 'productList', label: 'Produk', icon: Package },
    { key: 'stockIn', label: 'Stok Masuk', icon: Truck },
    { key: 'report', label: 'Laporan', icon: BarChart3 },
    { key: 'database', label: 'Database', icon: DatabaseZap }, // Label dan ikon menu telah diubah
  ];

  // Fungsi untuk mengubah halaman yang aktif
  const handleNavigate = (itemKey) => {
    console.log(`Navigasi di dalam Gudang ke: ${itemKey}`);
    setActiveItem(itemKey);
  };

  // Fungsi untuk merender komponen halaman berdasarkan state activeItem
  const renderPage = () => {
    switch (activeItem) {
      case 'productList':
        return <ProductList />;
      case 'database':
        return <DatabaseBarang />;
      // Tambahkan case untuk 'stockIn' dan 'report' nanti di sini
      default:
        return <ProductList />;
    }
  };

  return (
    // Container dibuat relatif agar BottomNav bisa diposisikan di bawah
    <div className="relative min-h-[calc(100vh-120px)] pb-16">
      {/* Konten Halaman */}
      <div className="w-full">
        {renderPage()}
      </div>

      {/* Navigasi Bawah */}
      <BottomNav 
        menuItems={gudangMenuItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

