import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Minus, Barcode, Camera, X } from 'lucide-react'; // Impor ikon X
import PaymentModal from '/src/components/modals/PaymentModal.jsx';
import { useBarcodeScanner } from '/src/hooks/useBarcodeScanner.js';
import InlineScanner from '/src/components/cashier/InlineScanner.jsx'; // Impor scanner inline baru

// Database produk dummy
const dummyProducts = [
  { id: 1, name: 'Kopi Bubuk ABC', price: 15000, code: 'ABC01', barcode: '8998866100133' },
  { id: 2, name: 'Susu UHT Indomilk', price: 18000, code: 'IND02', barcode: '8992703115428' },
  { id: 3, name: 'Roti Tawar Sari Roti', price: 16000, code: 'SR03', barcode: '8992772310113' },
  { id: 4, name: 'Minyak Goreng Bimoli 2L', price: 35000, code: 'BIM04', barcode: '8992611102018' },
];

// Komponen Halaman Point of Sale (POS)
export default function POS() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false); // State untuk toggle scanner inline
  const searchInputRef = useRef(null);

  // Fungsi terpusat untuk mencari produk dan menambahkannya ke keranjang
  const findProductAndAddToCart = (code) => {
    console.log(`Mencari produk dengan kode/nama: ${code}`);
    const query = code.toLowerCase();
    const foundProduct = dummyProducts.find(p => 
        p.barcode === query || 
        p.code.toLowerCase() === query || 
        p.name.toLowerCase().includes(query)
    );
    
    if (foundProduct) {
      handleAddItem(foundProduct);
      return true;
    } else {
      console.log('Produk tidak ditemukan');
      return false;
    }
  };

  // Menggunakan hook scanner fisik
  useBarcodeScanner((scannedCode) => {
    findProductAndAddToCart(scannedCode);
  });
  
  // Fungsi callback saat kamera berhasil scan. Tidak lagi menutup scanner.
  const handleCameraScanSuccess = (scannedCode) => {
    findProductAndAddToCart(scannedCode);
  };

  // Fungsi untuk menambah atau memperbarui item di keranjang
  const handleAddItem = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...currentCart, { ...product, qty: 1 }];
    });
    setSearchQuery('');
  };
  
  // Fungsi untuk handle pencarian manual
  const handleManualSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    findProductAndAddToCart(searchQuery);
    setSearchQuery('');
  };
  
  // Fungsi untuk mengubah jumlah barang
  const handleUpdateQty = (productId, newQty) => {
    setCart(currentCart => {
      if (newQty <= 0) {
        return currentCart.filter(item => item.id !== productId);
      }
      return currentCart.map(item =>
        item.id === productId ? { ...item, qty: newQty } : item
      );
    });
  };
  
  // Kalkulasi total
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      <div className="bg-slate-50 h-full flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
        {/* Area Atas: Input Pencarian & Scanner */}
        <div className="p-4 border-b bg-white">
          <form onSubmit={handleManualSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan barcode atau cari nama/kode barang..."
                className="input text-base pl-12"
              />
              <Barcode className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {/* Tombol ini sekarang berfungsi sebagai toggle */}
            <button
              type="button"
              onClick={() => setCameraScannerOpen(prev => !prev)}
              className={`btn p-2.5 ${isCameraScannerOpen ? 'btn-primary' : 'btn-secondary'}`}
              title={isCameraScannerOpen ? "Tutup Scanner Kamera" : "Buka Scanner Kamera"}
            >
              {isCameraScannerOpen ? <X className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
            </button>
          </form>
          
          {/* Container untuk Inline Scanner yang muncul di bawah input */}
          {isCameraScannerOpen && (
            <InlineScanner onScanSuccess={handleCameraScanSuccess} />
          )}
        </div>

        {/* Area Tengah: Daftar Keranjang */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Barcode className="w-16 h-16 mb-4" />
              <p>Keranjang masih kosong</p>
              <p className="text-sm">Scan barang untuk memulai</p>
            </div>
          ) : (
            <table className="table">
              <thead className="sticky top-0 bg-slate-50">
                <tr>
                  <th className="px-4 py-2 w-full">Produk</th>
                  <th className="px-4 py-2 text-center">Jumlah</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td className="p-4">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-slate-500">{formatCurrency(item.price)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleUpdateQty(item.id, item.qty - 1)} className="icon-btn hover:bg-slate-200"><Minus className="w-4 h-4" /></button>
                        <span className="w-10 text-center font-semibold">{item.qty}</span>
                        <button onClick={() => handleUpdateQty(item.id, item.qty + 1)} className="icon-btn hover:bg-slate-200"><Plus className="w-4 h-4" /></button>
                      </div>
                    </td>
                    <td className="p-4 text-right font-semibold">{formatCurrency(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Area Bawah: Total & Tombol Bayar */}
        <div className="p-4 border-t bg-white">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pajak (11%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-800">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <button
            onClick={() => setPaymentModalOpen(true)}
            disabled={cart.length === 0}
            className="btn-primary w-full btn-lg"
          >
            Bayar
          </button>
        </div>
      </div>
      
      {/* Modal Pembayaran */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={total}
        onSuccess={() => {
          console.log('Pembayaran Berhasil!');
          setCart([]);
          setPaymentModalOpen(false);
        }}
      />
    </>
  );
}

