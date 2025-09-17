import { useState } from 'react';
import { Package, Truck, BarChart3, DatabaseZap } from 'lucide-react';
import BottomNav from '../components/owner/BottomNav.jsx';

// Komentar: Menghapus impor untuk halaman-halaman turunan Gudang

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

  // Komentar: Menghapus fungsi renderPage
  // Sekarang hanya merender teks placeholder

  return (
    // Container utama diatur sebagai flex container dan menggunakan tinggi layar penuh
    <div className="flex flex-col h-screen">
      
      {/* Area Tools (Fixed) */}
      {/* Gunakan flex-shrink-0 untuk mencegah div ini mengecil */}
      <div className="flex-shrink-0 p-4 border border-red-500 sticky top-0 bg-white z-10">
        <p>disini kita akan mengatur area konten</p>
      </div>

      {/* Konten Halaman (Scrollable) */}
      {/* Gunakan flex-1 overflow-y-auto untuk membuat area ini dapat discroll secara independen */}
      <div className="flex-1 overflow-y-auto">
        <div className="container-app py-4 md:py-6">
          <p className="text-slate-500">Konten area yang dapat di-scroll akan ditempatkan di sini.</p>
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
