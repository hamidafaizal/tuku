import { useState } from 'react';
import { Award, AlertTriangle, TrendingUp, History } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';

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
      // TODO: Implementasi komponen halaman yang sebenarnya
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">Halaman {activeItem} akan muncul di sini.</p>
          </div>
        );
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
