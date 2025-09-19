import { useState } from 'react';
import { Award, AlertTriangle, TrendingUp, History } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';
import Terlaris from '../pages/owner/dashboard/Terlaris.jsx';
import StokTipis from '../pages/owner/dashboard/StokTipis.jsx';
import Penjualan from '../pages/owner/dashboard/Penjualan.jsx';
import Riwayat from '../pages/owner/dashboard/Riwayat.jsx';

export default function DashboardLayout() {
  const [activeItem, setActiveItem] = useState('terlaris');
  console.log(`Rendering DashboardLayout, item aktif: ${activeItem}`);

  // Keterangan: Daftar menu yang akan ditampilkan di navigasi bawah
  // Menu 'Riwayat' telah ditambahkan
  const dashboardMenuItems = [
    { key: 'terlaris', label: 'Terlaris', icon: Award },
    { key: 'stokTipis', label: 'Stok Tipis', icon: AlertTriangle },
    { key: 'penjualan', label: 'Penjualan', icon: TrendingUp },
    { key: 'riwayat', label: 'Riwayat', icon: History },
  ];

  // Fungsi untuk mengubah halaman yang aktif
  const handleNavigate = (itemKey) => {
    console.log(`Navigasi di dalam Dashboard ke: ${itemKey}`);
    setActiveItem(itemKey);
  };
  
  // Fungsi untuk merender komponen halaman sesuai activeItem
  const renderPage = () => {
    switch (activeItem) {
      case 'terlaris':
        return <Terlaris />;
      case 'stokTipis':
        return <StokTipis />;
      case 'penjualan':
        return <Penjualan />;
      case 'riwayat':
        return <Riwayat />;
      default:
        return <Terlaris />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <div className="container-app py-4 md:py-6 h-full">
          {renderPage()}
        </div>
      </div>
      
      <BottomNav 
        menuItems={dashboardMenuItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
