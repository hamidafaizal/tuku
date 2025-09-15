import { X } from 'lucide-react';

// Komponen Profile, disalin dari Sidebar.jsx
export default function Profile({ open = false, onNavigate = () => {}, onClose = () => {} }) {
  // Menu spesifik untuk Profile
  const menus = [
    { key: "pengaturan-akun", label: "Pengaturan Akun" },
    { key: "keluar", label: "Keluar" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={
          "fixed inset-0 bg-black/30 z-30 transition-opacity duration-200 " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Konten Panel Profil, muncul dari kanan */}
      <aside
        className={
          "fixed inset-y-0 right-0 z-40 w-72 bg-white border-l border-slate-200 " + // diubah ke right-0 dan border-l
          "transition-transform duration-200 " +
          (open ? "translate-x-0" : "translate-x-full") // diubah ke translate-x-full
        }
        aria-label="Profile"
      >
        {/* Header, sama seperti Sidebar */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4">
          <span className="font-semibold text-slate-800">Profil</span>
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

        {/* Navigasi, sama seperti Sidebar */}
        <nav className="p-3 space-y-2" role="navigation">
          {menus.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`btn w-full justify-start ${m.key === 'keluar' ? 'text-rose-600 hover:bg-rose-50' : ''}`}
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

