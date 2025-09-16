// Komponen navigasi bawah yang dapat digunakan kembali
// Menerima daftar menu, item aktif, dan fungsi navigasi sebagai props
export default function BottomNav({ menuItems, activeItem, onNavigate }) {
  console.log(`Rendering BottomNav, item aktif: ${activeItem}`);
  
  return (
    // Styling utama diambil dari class .bottom-nav di index.css
    <nav className="bottom-nav">
      {menuItems.map((item) => {
        // Mengambil komponen Ikon langsung dari properti 'item'
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            // Menerapkan class 'active' jika item ini adalah item yang sedang aktif
            className={`bottom-nav-item ${activeItem === item.key ? 'active' : ''}`}
          >
            {/* Merender ikon secara dinamis */}
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
