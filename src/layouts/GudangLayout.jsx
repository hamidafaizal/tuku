import { useState } from 'react';
import { Package, Truck, BarChart3, DatabaseZap } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';
import ProductList from '../pages/owner/gudang/ProductList.jsx';
import StokMasuk from '../pages/owner/gudang/StokMasuk.jsx';
import DatabaseBarang from '../pages/owner/gudang/DatabaseBarang.jsx';

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

  // Fungsi untuk merender komponen halaman berdasarkan state activeItem
  const renderPage = () => {
    switch (activeItem) {
      case 'productList':
        return <ProductList />;
      case 'stockIn':
        return <StokMasuk />;
      case 'database':
        return <DatabaseBarang />;
      // Tambahkan case untuk 'report' nanti di sini
      default:
        return <DatabaseBarang />;
    }
  };

  return (
    // Container utama diatur sebagai flex column dan menggunakan tinggi layar penuh
    <div className="flex flex-col h-screen">
      
      {/* Area Tools (Fixed) */}
      <div className="flex-shrink-0 p-4 border border-red-500">
        {/* Area ini tidak akan digulir. */}
      </div>

      {/* Konten Halaman (Scrollable) */}
      
      {/* Navigasi Bawah (Persistent) */}
      <BottomNav 
        menuItems={gudangMenuItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
