import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ open = false, onNavigate = () => {}, onClose = () => {} }) {
  const menus = [
    // Keterangan: Mengubah key dan path agar sesuai dengan struktur rute
    { key: "dashboard", label: "Dashboard", path: "/owner/dashboard" },
    { key: "keuangan", label: "Keuangan", path: "/owner/keuangan" },
    { key: "gudang", label: "Gudang", path: "/owner/gudang" },
    { key: "pengaturan", label: "Pengaturan", path: "/owner/pengaturan" },
  ];

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
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 " +
          "transition-transform duration-200 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
        aria-label="Sidebar"
      >
        {/* Header Sidebar dengan Tombol Tutup */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4">
          <span className="font-semibold text-slate-800">Menu</span>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close menu"
            className="icon-btn hover:bg-slate-100"
            title="Tutup"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <nav className="p-3 space-y-2" role="navigation">
          {menus.map((m) => (
            // Menggunakan NavLink untuk navigasi
            <NavLink
              key={m.key}
              to={m.path}
              // Menerapkan styling active saat NavLink aktif
              className={({ isActive }) =>
                `btn w-full justify-start ${isActive ? 'btn-primary' : ''}`
              }
              onClick={onClose}
            >
              {m.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
