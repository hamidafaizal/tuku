import { useState } from 'react';
import { Menu, User } from 'lucide-react';
import Sidebar from '/src/components/Sidebar.jsx';
import ProfileSidebar from '/src/components/ProfileSidebar.jsx';

// Komponen Header sekarang menerima prop `showMenuButton`
export default function Header({ showMenuButton = true }) {
  // State untuk sidebar menu utama
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // State untuk sidebar profil
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);

  // Fungsi untuk toggle sidebar utama
  const handleMenuClick = () => {
    console.log('Sidebar toggled from Header');
    setSidebarOpen(!sidebarOpen);
  };
  
  // Fungsi untuk toggle sidebar profil
  const handleProfileClick = () => {
    console.log('Profile sidebar toggled from Header');
    setProfileSidebarOpen(!profileSidebarOpen);
  };

  // Fungsi untuk navigasi dari sidebar utama
  const handleNavigate = (key) => {
    console.log('Navigate to:', key);
    setSidebarOpen(false); 
  };
  
  return (
    <>
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
        <div className="container-app h-14 flex items-center justify-between">
          
          {/* Tombol Hamburger hanya ditampilkan jika showMenuButton adalah true */}
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
            // Placeholder untuk menjaga layout tetap simetris
            <div className="w-9 h-9"></div>
          )}

          {/* Judul */}
          <div className="flex-1 flex items-center justify-center pointer-events-none">
            <h1 className="text-lg font-bold tracking-wide text-slate-900">Tuku</h1>
          </div>

          {/* Wrapper untuk Tombol Avatar dan Menu Profil */}
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
      
      {/* Render Sidebar utama */}
      <Sidebar 
        open={sidebarOpen} 
        onNavigate={handleNavigate} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Render Sidebar Profil */}
      <ProfileSidebar 
        open={profileSidebarOpen}
        onClose={() => setProfileSidebarOpen(false)}
      />
    </>
  );
}

