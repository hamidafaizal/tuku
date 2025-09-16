import POS from '../pages/cashier/POS.jsx';
import Header from '../components/Header.jsx'; // Mengimpor Header

// Layout ini adalah "bungkus" untuk semua halaman dalam Mode Kasir.
export default function CashierLayout() {
  // Log untuk memastikan layout yang benar sedang dirender
  console.log('Rendering CashierLayout with POS page');
  
  return (
    <div className="app-shell">
      {/* Menampilkan Header tetapi menyembunyikan tombol menu */}
      <Header showMenuButton={false} />
      
      <main>
        {/* Merender halaman Point of Sale */}
        <POS />
      </main>
    </div>
  );
}

