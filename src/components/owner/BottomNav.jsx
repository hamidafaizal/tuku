import { Package, Truck, FileText, Settings } from 'lucide-react';

// Komponen navigasi bawah yang dapat digunakan kembali
// Menerima daftar menu, item aktif, dan fungsi navigasi sebagai props
export default function BottomNav({ menuItems, activeItem, onNavigate }) {
  console.log(`Rendering BottomNav, item aktif: ${activeItem}`);
  
  // Fungsi untuk mendapatkan ikon berdasarkan kunci menu
  const getIcon = (key) => {
    switch (key) {
      case 'productList':
        return <Package className="w-5 h-5 mb-1" />;
      case 'stockIn':
        return <Truck className="w-5 h-5 mb-1" />;
      case 'stockReport':
        return <FileText className="w-5 h-5 mb-1" />;
      case 'gudangSettings':
        return <Settings className="w-5 h-5 mb-1" />;
      default:
        return <Package className="w-5 h-5 mb-1" />;
    }
  };

  return (
    // Styling utama diambil dari class .bottom-nav di index.css
    <nav className="bottom-nav">
      {menuItems.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onNavigate(item.key)}
          // Menerapkan class 'active' jika item ini adalah item yang sedang aktif
          className={`bottom-nav-item ${activeItem === item.key ? 'active' : ''}`}
        >
          {getIcon(item.key)}
          <span className="text-xs">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
