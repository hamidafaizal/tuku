export default function Sidebar({ open = true, onNavigate = () => {} }) {
  const menus = [
    { key: "dashboard", label: "Dashboard" },
    { key: "keuangan", label: "Keuangan" },
    { key: "gudang", label: "Gudang" },
    { key: "pengaturan", label: "Pengaturan" },
  ];

  return (
    <aside
      className={
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 " +
        "transition-transform duration-200 " +
        (open ? "translate-x-0" : "-translate-x-full")
      }
      aria-label="Sidebar"
    >
      {/* Spacer untuk tinggi header (h-14) */}
      <div className="h-14 border-b border-slate-200 flex items-center px-4">
        <span className="font-semibold text-slate-800">Menu</span>
      </div>

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
  );
}
