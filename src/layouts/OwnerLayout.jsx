import { useState } from 'react';
import Header from '/src/components/Header.jsx';
import Dashboard from '/src/pages/owner/Dashboard.jsx';
import Gudang from '/src/pages/owner/Gudang.jsx';

// Layout ini adalah "bungkus" untuk semua halaman dalam Mode Pemilik.
export default function OwnerLayout() {
  // State untuk melacak halaman mana yang sedang aktif. Defaultnya 'dashboard'.
  const [activePage, setActivePage] = useState('dashboard');
  console.log(`Rendering OwnerLayout, halaman aktif: ${activePage}`);

  // Fungsi ini akan di-passing ke Sidebar untuk mengubah halaman
  const handleNavigate = (pageKey) => {
    console.log(`Navigasi ke halaman: ${pageKey}`);
    setActivePage(pageKey);
  };

  // Fungsi untuk merender komponen halaman berdasarkan state activePage
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'gudang':
        return <Gudang />;
      // case 'keuangan':
      //   return <Keuangan />; // Placeholder untuk menu lain nanti
      default:
        return <Dashboard />;
    }
  };

  return (
    // Hapus border merah untuk kembali ke tampilan normal
    <div className="app-shell h-screen flex flex-col">
      {/* Meneruskan fungsi handleNavigate ke komponen Header */}
      <Header onNavigate={handleNavigate} />
      
      {/* Konten Utama Aplikasi */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-app py-4 md:py-6 h-full">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
