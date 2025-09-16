import { X } from 'lucide-react';
import { useMode } from '../context/ModeContext.jsx'; // Impor hook useMode

// Sidebar untuk menu profil di sebelah kanan
export default function ProfileSidebar({ open = false, onNavigate = () => {}, onClose = () => {} }) {
  // Menggunakan state global dari context, bukan state lokal lagi
  const { isOwnerMode, toggleMode } = useMode();

  // Daftar menu untuk sidebar profil
  const menus = [
    { key: "profile", label: "Profil Saya" },
    { key: "notifications", label: "Notifikasi" },
    { key: "settings", label: "Pengaturan Akun" },
    { key: "logout", label: "Keluar" },
  ];

  // Log untuk memantau status open/close sidebar
  console.log('ProfileSidebar open state:', open);

  return (
    <>
      {/* Overlay untuk menutup sidebar saat diklik di luar area */}
      <div
        className={
          "fixed inset-0 bg-black/30 z-30 transition-opacity duration-200 " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Konten Sidebar */}
      <aside
        className={
          "fixed inset-y-0 right-0 z-40 w-72 bg-white border-l border-slate-200 " +
          "transition-transform duration-200 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        aria-label="Profile Sidebar"
      >
        {/* Header Sidebar dengan Tombol Tutup */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4">
          <span className="font-semibold text-slate-800">Profil</span>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close profile menu"
            className="icon-btn hover:bg-slate-100"
            title="Tutup"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* --- Toggle Mode Aplikasi --- */}
        <div className="p-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
                <label htmlFor="mode-toggle" className="text-sm font-medium text-slate-700">
                    Mode {isOwnerMode ? 'Pemilik' : 'Kasir'}
                </label>
                <button
                    id="mode-toggle"
                    type="button"
                    role="switch"
                    aria-checked={isOwnerMode}
                    onClick={toggleMode} // Langsung memanggil fungsi dari context
                    className={
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 " +
                        (isOwnerMode ? "bg-sky-500" : "bg-slate-300")
                    }
                >
                    <span
                        aria-hidden="true"
                        className={
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out " +
                            (isOwnerMode ? "translate-x-5" : "translate-x-0")
                        }
                    />
                </button>
            </div>
        </div>
        {/* --- Akhir Toggle Mode --- */}

        {/* Daftar menu navigasi */}
        <nav className="p-3 space-y-2" role="navigation">
          {menus.map((m) => (
            <button
              key={m.key}
              type="button"
              className="btn w-full justify-start"
              onClick={() => onNavigate(m.key)}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

