import { useState, useMemo, useEffect } from 'react';
import { Search, Camera, X, Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import PaymentModal from '/src/components/modals/PaymentModal.jsx';
import { useBarcodeScanner } from '/src/hooks/useBarcodeScanner.js';
import InlineScanner from '/src/components/cashier/InlineScanner.jsx';
// Keterangan: Mengimpor fungsi dari supabaseDb.js
import { fetchProductsForPOS, recordSaleAndUpdateStock } from '/src/utils/supabaseDb.js';

// Halaman utama untuk mode kasir (Point of Sale)
export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keterangan: Fungsi untuk memuat data produk dari Supabase
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchProductsForPOS();
    if (fetchError) {
      setError('Gagal memuat produk.');
      console.error('Gagal memuat produk untuk POS:', fetchError);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Mencari produk di database (real-time) dan menambahkannya ke keranjang
  const findProductAndAddToCart = (code) => {
    console.log(`Mencari produk dengan kode atau nama: ${code}`);
    const searchTermLower = code.toLowerCase();
    const product = products.find(p => p.sku.toLowerCase() === searchTermLower || p.name.toLowerCase().includes(searchTermLower));

    if (product) {
      if (product.stock <= 0) {
        alert('Stok produk habis!');
        return;
      }
      setCart(currentCart => {
        const existingItem = currentCart.find(item => item.sku === product.sku);
        if (existingItem) {
          if (existingItem.quantity >= product.stock) {
            alert('Jumlah di keranjang melebihi stok yang tersedia.');
            return currentCart;
          }
          // Jika barang sudah ada, tambah jumlahnya
          return currentCart.map(item =>
            item.sku === product.sku ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        // Jika barang baru, tambahkan ke keranjang
        return [...currentCart, { ...product, quantity: 1 }];
      });
      setSearchTerm(''); // Kosongkan input setelah berhasil
      console.log(`Produk ditemukan dan ditambahkan:`, product.name);
    } else {
      console.log(`Produk dengan kode atau nama "${code}" tidak ditemukan.`);
      alert(`Produk dengan kode atau nama "${code}" tidak ditemukan atau harga jualnya belum diatur.`);
    }
  };

  // Keterangan: Menggunakan custom hook untuk scanner fisik
  useBarcodeScanner(findProductAndAddToCart);

  // Fungsi yang dipanggil saat search form di-submit (Enter)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      findProductAndAddToCart(searchTerm.trim());
    }
  };
  
  // Keterangan: Fungsi untuk menangani klik pada saran
  const handleSuggestionClick = (product) => {
    findProductAndAddToCart(product.sku); // Tambahkan produk ke keranjang berdasarkan SKU
    setSearchTerm(''); // Kosongkan input pencarian
  };

  // Fungsi untuk mengubah jumlah barang di keranjang
  const updateQuantity = (productSku, amount) => {
    setCart(currentCart => {
      const targetItem = currentCart.find(item => item.sku === productSku);
      const productInfo = products.find(p => p.sku === productSku);

      if (!targetItem || !productInfo) return currentCart;

      const newQuantity = targetItem.quantity + amount;

      if (newQuantity > productInfo.stock) {
        alert('Jumlah melebihi stok yang tersedia.');
        return currentCart;
      }

      if (newQuantity <= 0) {
        return currentCart.filter(item => item.sku !== productSku);
      }

      return currentCart.map(item =>
        item.sku === productSku ? { ...item, quantity: newQuantity } : item
      );
    });
  };


  const handleCameraScanSuccess = (decodedText) => {
    findProductAndAddToCart(decodedText);
    // Kamera tetap terbuka untuk scan berkelanjutan
  };

  // Menghitung total
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);
  
  // Keterangan: Fungsi yang dijalankan setelah pembayaran sukses
  const handlePaymentSuccess = async () => {
    console.log('Pembayaran berhasil, proses pencatatan penjualan...');
    const { success, error } = await recordSaleAndUpdateStock(cart);
    
    if (error) {
      console.error('Gagal menyimpan penjualan:', error);
      alert(`Gagal menyimpan transaksi: ${error.message}`);
    } else {
      console.log('Transaksi berhasil disimpan.');
      setCart([]); // Mengosongkan keranjang
      setPaymentOpen(false); // Menutup modal
      await loadProducts(); // Memuat ulang data produk untuk update stok
    }
  };
  
  // Keterangan: Menyiapkan saran produk berdasarkan input pencarian
  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const lowerCaseSearch = searchTerm.toLowerCase();
    return products
      .filter(product => product.name.toLowerCase().startsWith(lowerCaseSearch))
      .slice(0, 5); // Ambil maksimal 5 saran
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        <p className="text-slate-500">Memuat data produk...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50 gap-4">
        <p className="text-rose-500">{error}</p>
        <button onClick={loadProducts} className="btn btn-primary">Coba Lagi</button>
      </div>
    );
  }

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
        
        {/* Keterangan: Area saran pencarian */}
        {searchTerm.length > 0 && suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 z-20">
            {suggestions.map(product => (
              <button
                key={product.sku}
                onClick={() => handleSuggestionClick(product)}
                className="w-full text-left p-3 hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl"
              >
                <span className="font-medium">{product.name}</span>
                <p className="text-sm text-slate-500">{formatCurrency(product.price)} - Stok: {product.stock}</p>
              </button>
            ))}
          </div>
        )}
        
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
            <div key={item.sku} className="card flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateQuantity(item.sku, -1)} className="icon-btn bg-white">
                  {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-rose-500"/> : <Minus className="w-4 h-4" />}
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.sku, 1)} className="icon-btn bg-white">
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
      <PaymentModal
        isOpen={isPaymentOpen}
        totalAmount={total}
        onClose={() => {
          console.log('Menutup modal pembayaran.');
          setPaymentOpen(false);
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
