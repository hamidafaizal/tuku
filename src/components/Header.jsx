import { useState } from 'react';
import { Menu, User } from 'lucide-react';
import Sidebar from '/src/components/Sidebar.jsx';
import ProfileSidebar from '/src/components/ProfileSidebar.jsx';

// Komponen Header sekarang menerima prop onNavigate dari OwnerLayout
export default function Header({ showMenuButton = true, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    console.log('Sidebar toggled from Header');
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleProfileClick = () => {
    console.log('Profile sidebar toggled from Header');
    setProfileSidebarOpen(!profileSidebarOpen);
  };

  // Fungsi ini sekarang akan memanggil fungsi dari OwnerLayout dan menutup sidebar
  const handleSidebarNavigate = (key) => {
    console.log('Menerima navigasi dari Sidebar, key:', key);
    if (onNavigate) {
      onNavigate(key); // Meneruskan navigasi ke OwnerLayout
    }
    setSidebarOpen(false); // Menutup sidebar setelah navigasi
  };
  
  return (
    <>
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
        <div className="container-app h-14 flex items-center justify-between">
          
          {/* Menu Button - Ditampilkan hanya jika showMenuButton true */}
          {showMenuButton ? (
            <button
              onClick={handleMenuClick}
              type="button"
              aria-label="Open menu"
              className="icon-btn hover:bg-sky-50"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          ) : (
            // placeholder kosong untuk menjaga tata letak tetap simetris
            <div className="w-9 h-9"></div>
          )}

          {/* Judul Aplikasi - Menggunakan logo SVG */}
          <div className="flex-1 flex items-center justify-center pointer-events-none">
            <img src="/logotuku2.svg" alt="Tuku Logo" className="h-6" />
          </div>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              type="button"
              aria-label="Open profile"
              className="icon-btn hover:bg-sky-50"
              title="Profil"
            >
              <div className="w-9 h-9 rounded-full border border-sky-200 bg-sky-50 flex items-center justify-center">
                <User className="w-4 h-4 text-sky-700" />
              </div>
            </button>
          </div>
        </div>
      </header>
      
      {/* Sidebar untuk menu navigasi */}
      <Sidebar 
        open={sidebarOpen} 
        onNavigate={handleSidebarNavigate} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Sidebar untuk profil pengguna */}
      <ProfileSidebar 
        open={profileSidebarOpen}
        onClose={() => setProfileSidebarOpen(false)}
      />
    </>
  );
}
