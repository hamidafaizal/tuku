import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '/src/components/Header.jsx';
import Dashboard from '/src/pages/owner/Dashboard.jsx';
import Gudang from '/src/pages/owner/Gudang.jsx';

// Layout ini adalah "bungkus" untuk semua halaman dalam Mode Pemilik.
export default function OwnerLayout() {
  // Gunakan useNavigate hook dari react-router-dom untuk navigasi
  const navigate = useNavigate();
  
  // Fungsi ini akan di-passing ke Sidebar untuk mengubah halaman
  const handleNavigate = (pageKey) => {
    console.log(`Navigasi ke halaman: ${pageKey}`);
    // Arahkan ke rute yang sesuai
    navigate(`/owner/${pageKey}`);
  };
  
  return (
    // Hapus border merah untuk kembali ke tampilan normal
    <div className="app-shell h-screen flex flex-col">
      {/* Meneruskan fungsi handleNavigate ke komponen Header */}
      <Header onNavigate={handleNavigate} />
      
      {/* Konten Utama Aplikasi */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-app py-4 md:py-6 h-full">
          {/* Outlet akan merender komponen anak dari rute, seperti DashboardLayout atau GudangLayout */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
