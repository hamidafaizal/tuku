import { useState } from 'react';
import { PiggyBank, History, FileText, Settings } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';
import Ringkasan from '../pages/owner/keuangan/Ringkasan.jsx';

// Keterangan: Halaman-halaman turunan Keuangan (dummy sementara)
const DummyRiwayat = () => (
  <div>
    <h2 className="text-xl font-bold">Riwayat Keuangan</h2>
    <p className="muted">Halaman riwayat transaksi keuangan.</p>
  </div>
);
const DummyLaporan = () => (
  <div>
    <h2 className="text-xl font-bold">Laporan Keuangan</h2>
    <p className="muted">Halaman laporan laba rugi, neraca, dll.</p>
  </div>
);
const DummyPengaturan = () => (
  <div>
    <h2 className="text-xl font-bold">Pengaturan Keuangan</h2>
    <p className="muted">Halaman pengaturan akun dan metode pembayaran.</p>
  </div>
);

// Layout khusus untuk semua halaman yang berhubungan dengan Keuangan
export default function KeuanganLayout() {
  // State untuk melacak item menu mana yang aktif di BottomNav
  // Keterangan: Mengubah default activeItem menjadi 'ringkasan'
  const [activeItem, setActiveItem] = useState('ringkasan');
  console.log(`Rendering KeuanganLayout, item aktif: ${activeItem}`);

  // Daftar menu yang akan ditampilkan di navigasi bawah
  const keuanganMenuItems = [
    { key: 'ringkasan', label: 'Ringkasan', icon: PiggyBank },
    { key: 'riwayat', label: 'Riwayat', icon: History },
    { key: 'laporan', label: 'Laporan', icon: FileText },
    { key: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  // Fungsi untuk mengubah halaman yang aktif
  const handleNavigate = (itemKey) => {
    console.log(`Navigasi di dalam Keuangan ke: ${itemKey}`);
    setActiveItem(itemKey);
  };
  
  // Fungsi untuk merender komponen halaman sesuai activeItem
  const renderPage = () => {
    switch (activeItem) {
      case 'ringkasan':
        return <Ringkasan />;
      case 'riwayat':
        return <DummyRiwayat />;
      case 'laporan':
        return <DummyLaporan />;
      case 'pengaturan':
        return <DummyPengaturan />;
      default:
        return <Ringkasan />;
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
        menuItems={keuanganMenuItems}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
