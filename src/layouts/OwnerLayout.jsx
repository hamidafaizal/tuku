import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
// Keterangan: Import Dashboard dan Gudang dihapus karena tidak lagi digunakan di sini

// Keterangan: Layout ini adalah "bungkus" untuk semua halaman dalam Mode Pemilik.
export default function OwnerLayout() {
  // Gunakan useNavigate hook dari react-router-dom untuk navigasi
  const navigate = useNavigate();
  
  // Fungsi ini akan di-passing ke Header/Sidebar untuk mengubah halaman
  const handleNavigate = (pageKey) => {
    console.log(`Navigasi ke halaman: ${pageKey}`);
    // Arahkan ke rute yang sesuai
    navigate(`/owner/${pageKey}`);
  };
  
  return (
    <div className="app-shell h-screen flex flex-col">
      {/* Meneruskan fungsi handleNavigate ke komponen Header */}
      <Header onNavigate={handleNavigate} />
      
      {/* Konten Utama Aplikasi */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-app h-full">
          {/* Outlet akan merender komponen anak dari rute, seperti DashboardLayout atau GudangLayout */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
