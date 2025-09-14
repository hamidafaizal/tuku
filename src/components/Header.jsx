import { Menu, User } from "lucide-react";

export default function Header({ onMenuClick = () => {}, onProfileClick = () => {} }) {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
      <div className="container-app h-14 flex items-center justify-between">
        {/* Hamburger (dummy) */}
        <button
          onClick={onMenuClick}
          type="button"
          aria-label="Open menu"
          className="icon-btn hover:bg-sky-50"
          title="Menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Judul */}
        <div className="flex-1 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold tracking-wide text-slate-900">Tuku</h1>
        </div>

        {/* Avatar (dummy) */}
        <button
          onClick={onProfileClick}
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
    </header>
  );
}
