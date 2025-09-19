import { useState } from 'react';
import { Award, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';
import Terlaris from '../pages/owner/dashboard/Terlaris.jsx';
import StokTipis from '../pages/owner/dashboard/StokTipis.jsx';

// Import komponen halaman dummy untuk Dashboard
// Nanti bisa diganti dengan halaman sebenarnya
const DummyPenjualan = () => <div>Halaman Penjualan</div>;
const DummyLaporan = () => <div>Halaman Laporan</div>;

// Layout khusus untuk semua halaman yang berhubungan dengan Dashboard
export default function DashboardLayout() {
  // State untuk melacak item menu mana yang aktif di BottomNav
  const [activeItem, setActiveItem] = useState('terlaris');
  console.log(`Rendering DashboardLayout, item aktif: ${activeItem}`);

  // Daftar menu yang akan ditampilkan di navigasi bawah
  const dashboardMenuItems = [
    // Keterangan: Mengubah menu pertama menjadi "Terlaris"
    { key: 'terlaris', label: 'Terlaris', icon: Award },
    // Keterangan: Mengubah menu kedua menjadi "Stok Tipis" dengan icon peringatan
    { key: 'stokTipis', label: 'Stok Tipis', icon: AlertTriangle },
    { key: 'penjualan', label: 'Penjualan', icon: TrendingUp },
    { key: 'laporan', label: 'Laporan', icon: Users },
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
      // Keterangan: Merender komponen StokTipis
      case 'stokTipis':
        return <StokTipis />;
      case 'penjualan':
        return <DummyPenjualan />;
      case 'laporan':
        return <DummyLaporan />;
      default:
        return <Terlaris />;
    }
  };

  return (
    // Container DashboardLayout diatur sebagai flex column agar konten terbagi secara vertikal
    <div className="flex-1 flex flex-col">
      {/* Area konten fleksibel yang akan digulir */}
      <div className="flex-1">
        <div className="container-app py-4 md:py-6 h-full">
          {renderPage()}
        </div>
      </div>
      
      {/* Navigasi Bawah (Persistent) */}
      <BottomNav 
        menuItems={dashboardMenuItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
