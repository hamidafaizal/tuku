import { useState, useMemo } from 'react';
import { Search, Camera, X, Plus, Minus, Trash2 } from 'lucide-react';
import PaymentModal from '../../components/modals/PaymentModal.jsx';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner.js'; // Impor custom hook
import InlineScanner from '../../components/cashier/InlineScanner.jsx'; // Impor scanner inline

// Dummy database produk
const dummyProducts = [
  { id: 1, name: 'Kopi Susu Gula Aren', price: 15000, code: 'KSGA' },
  { id: 2, name: 'Croissant Cokelat', price: 12000, code: 'CRCK' },
  { id: 3, name: 'Air Mineral 600ml', price: 3000, code: 'AM600' },
  { id: 4, name: 'Americano', price: 10000, code: 'AMER' },
  { id: 5, name: 'Teh Melati', price: 8000, code: 'TMEL' },
];

// Halaman utama untuk mode kasir (Point of Sale)
export default function POS() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false);

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Mencari produk di database (simulasi) dan menambahkannya ke keranjang
  const findProductAndAddToCart = (code) => {
    console.log(`Mencari produk dengan kode: ${code}`);
    const product = dummyProducts.find(p => p.code.toLowerCase() === code.toLowerCase() || p.name.toLowerCase().includes(code.toLowerCase()));

    if (product) {
      setCart(currentCart => {
        const existingItem = currentCart.find(item => item.id === product.id);
        if (existingItem) {
          // Jika barang sudah ada, tambah jumlahnya
          return currentCart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        // Jika barang baru, tambahkan ke keranjang
        return [...currentCart, { ...product, quantity: 1 }];
      });
      setSearchTerm(''); // Kosongkan input setelah berhasil
      console.log(`Produk ditemukan dan ditambahkan:`, product.name);
    } else {
      console.log(`Produk dengan kode "${code}" tidak ditemukan.`);
      // Di sini bisa ditambahkan notifikasi error untuk user
    }
  };

  // Menggunakan custom hook untuk scanner fisik
  useBarcodeScanner(findProductAndAddToCart);

  // Fungsi yang dipanggil saat search form di-submit (Enter)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      findProductAndAddToCart(searchTerm.trim());
    }
  };

  // Fungsi untuk mengubah jumlah barang di keranjang
  const updateQuantity = (productId, amount) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
      ).filter(item => item.quantity > 0) // Hapus item jika jumlahnya 0
    );
  };

  const handleCameraScanSuccess = (decodedText) => {
    findProductAndAddToCart(decodedText);
    // Kamera tetap terbuka untuk scan berkelanjutan
  };

  // Menghitung total
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <div className="h-full flex flex-col p-4 bg-slate-50 gap-4">
      {/* Bagian Atas: Pencarian & Tombol Scanner */}
      <div>
        <div className="relative w-full">
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                    placeholder="tulis nama barang/kode barang"
                    autoFocus
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
            <button
              onClick={() => setCameraScannerOpen(!isCameraScannerOpen)}
              type="button"
              className={`icon-btn absolute right-1 top-1/2 -translate-y-1/2 rounded-lg ${isCameraScannerOpen ? 'bg-sky-100 text-sky-600' : 'bg-white'}`}
              title={isCameraScannerOpen ? "Tutup Scanner" : "Buka Scanner Kamera"}
            >
              {isCameraScannerOpen ? <X className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </button>
        </div>
        {/* Tampilan Scanner Inline */}
        {isCameraScannerOpen && <div className="mt-2"><InlineScanner onScanSuccess={handleCameraScanSuccess} /></div>}
      </div>

      {/* Daftar Keranjang Belanja (Area Scroll) */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-slate-500">Keranjang masih kosong.</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="card flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.id, -1)} className="icon-btn bg-white">
                  {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-rose-500"/> : <Minus className="w-4 h-4" />}
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="icon-btn bg-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="w-24 text-right font-bold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))
        )}
      </div>

      {/* Bagian Bawah: Total & Tombol Bayar */}
      <div className="border-t border-slate-200 pt-4">
        <div className="space-y-2 text-slate-700 font-medium">
          <div className="flex justify-between text-2xl text-slate-900 font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <button
          onClick={() => {
            console.log('Tombol Bayar diklik, membuka modal pembayaran.');
            setPaymentOpen(true);
          }}
          disabled={cart.length === 0}
          className="btn-primary w-full btn-lg mt-4"
        >
          Bayar
        </button>
      </div>

      {/* Modal Pembayaran */}
      {/* Komponen modal dipanggil dan dikontrol oleh state isPaymentOpen */}
      <PaymentModal
        isOpen={isPaymentOpen}
        totalAmount={total}
        onClose={() => {
          console.log('Menutup modal pembayaran.');
          setPaymentOpen(false);
        }}
        onSuccess={() => { // Mengganti nama prop dari onPaymentSuccess menjadi onSuccess
          console.log('Pembayaran berhasil!');
          setCart([]); // Mengosongkan keranjang
          setPaymentOpen(false); // Menutup modal
        }}
      />
    </div>
  );
}
