import React, { useState, useEffect } from 'react';
import { X, Search, Camera, Loader2, Save } from 'lucide-react';
import InlineScanner from '../../../../components/cashier/InlineScanner.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { fetchProducts } from '../../../../utils/supabaseDb.js';
import { useBarcodeScanner } from '../../../../hooks/useBarcodeScanner.js';

// Komponen modal untuk menambah stok barang
export default function TambahStokModal({ isOpen, onClose }) {
  // Keterangan: State untuk kode barang yang di-scan atau diinput manual
  const [scannedCode, setScannedCode] = useState('');
  // Keterangan: State untuk mengelola tampilan scanner inline
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false);
  // Keterangan: State untuk menyimpan produk yang ditemukan berdasarkan SKU
  const [productFound, setProductFound] = useState(null);
  // Keterangan: State untuk jumlah stok yang akan ditambahkan
  const [stockQuantity, setStockQuantity] = useState(1);
  // Keterangan: State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { session } = useAuth();

  // Keterangan: Fungsi untuk mereset state saat modal ditutup
  useEffect(() => {
    if (isOpen) {
      setScannedCode('');
      setProductFound(null);
      setStockQuantity(1); // Setel default ke 1
      setLoading(false);
      setError('');
    }
  }, [isOpen]);

  // Keterangan: Fungsi yang dipanggil saat barcode berhasil di-scan
  const handleScanSuccess = async (code) => {
    console.log('Kode barang berhasil di-scan via kamera:', code);
    setScannedCode(code);
    setCameraScannerOpen(false);
    await handleSearch(code);
  };
  
  // Menggunakan custom hook untuk scanner fisik
  const handleBarcodeScan = async (code) => {
    console.log('Kode barang berhasil di-scan via perangkat fisik:', code);
    setScannedCode(code);
    await handleSearch(code);
  };
  useBarcodeScanner(isOpen ? handleBarcodeScan : () => {});

  // Keterangan: Fungsi untuk mengelola input manual kode barang
  const handleCodeChange = (e) => {
    setScannedCode(e.target.value);
  };
  
  // Keterangan: Fungsi untuk mencari produk setelah kode diinput atau di-scan
  const handleSearch = async (code) => {
    if (!code) {
        setError('Kode barang tidak boleh kosong.');
        return;
    }
    setLoading(true);
    setError('');
    setProductFound(null);
    console.log('Mencari produk dengan kode:', code);
    
    try {
      if (!session?.user?.id) {
        throw new Error("User ID is not available.");
      }
      
      const allProducts = await fetchProducts(session.user.id);
      
      // Cari produk di SKU utama
      let foundProduct = allProducts.find(p => p.sku === code);
      
      if (!foundProduct) {
        // Jika tidak ditemukan, cari di UOM list
        for (const product of allProducts) {
          if (product.uom && product.uom.some(uomItem => uomItem.sku === code)) {
            foundProduct = product;
            break;
          }
        }
      }

      if (foundProduct) {
        setProductFound(foundProduct);
        setStockQuantity(1); // Reset kuantitas ke 1 setiap kali produk baru ditemukan
        console.log('Produk ditemukan:', foundProduct);
      } else {
        setError("Kode barang belum di input ke database!");
        console.log('Kode barang tidak ditemukan.');
      }
    } catch (err) {
      console.error("Gagal mencari produk:", err);
      setError("Gagal mencari produk: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Keterangan: Fungsi untuk menangani penambahan stok
  const handleAddStock = () => {
      console.log('Menambahkan stok:', {
          product: productFound,
          quantity: stockQuantity,
          userId: session.user.id
      });
      // Di sini akan ada logika untuk memperbarui stok di database
      // untuk saat ini, kita hanya log datanya.
      onClose();
  };

  // Keterangan: Fungsi untuk mengelola perubahan input jumlah stok
  const handleStockQuantityChange = (e) => {
    const value = Number(e.target.value);
    setStockQuantity(value);
    console.log('Jumlah stok diubah menjadi:', value);
  };

  // Jika modal tidak terbuka, jangan render apapun
  if (!isOpen) return null;

  const isFormValid = productFound && stockQuantity > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Tambah Stok Barang</h2>
          <button onClick={onClose} className="icon-btn hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="p-6 space-y-4">
          {/* Input dan Tombol Scanner */}
          <div className="relative">
            <input
              type="text"
              value={scannedCode}
              onChange={handleCodeChange}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(scannedCode); }}
              className="input pl-10 pr-12"
              placeholder="Kode barang (SKU)"
              disabled={loading}
            />
            <Search 
              className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer" 
              onClick={() => handleSearch(scannedCode)}
            />
            <button
              onClick={() => setCameraScannerOpen(!isCameraScannerOpen)}
              type="button"
              className={`icon-btn absolute right-1 top-1/2 -translate-y-1/2 rounded-lg ${isCameraScannerOpen ? 'bg-sky-100 text-sky-600' : 'bg-white'}`}
              title={isCameraScannerOpen ? "Tutup Scanner" : "Buka Scanner Kamera"}
              disabled={loading}
            >
              {isCameraScannerOpen ? <X className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Tampilan Scanner Inline */}
          {isCameraScannerOpen && (
            <div className="pt-2">
              <InlineScanner onScanSuccess={handleScanSuccess} />
            </div>
          )}

          {/* Loading atau Error Message */}
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Mencari produk...</span>
            </div>
          )}
          {error && (
            <div className="p-4 text-sm text-rose-600 bg-rose-50 rounded-lg">
              <span>{error}</span>
            </div>
          )}

          {/* Tampilan Detail Produk dan Input Jumlah jika ditemukan */}
          {productFound && (
            <div className="card space-y-4">
                <h3 className="text-lg font-semibold">{productFound.name}</h3>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Satuan Dasar</span>
                    <span className="font-medium">{productFound.unit}</span>
                </div>
                {productFound.uom && (
                    <div className="space-y-2">
                        <p className="font-semibold text-sm text-slate-600">UOM List:</p>
                        <ul className="list-disc list-inside text-sm">
                            {productFound.uom.map((uomItem, i) => (
                                <li key={i}>{uomItem.uomList} ({uomItem.uomQuantity}) - SKU: {uomItem.sku}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="divider" />
                <div>
                  <label htmlFor="stockQuantity" className="text-sm font-medium mb-1 block">Jumlah Stok</label>
                  <input
                    id="stockQuantity"
                    type="number"
                    value={stockQuantity}
                    onChange={handleStockQuantityChange}
                    className="input"
                    min="1"
                    placeholder="Masukkan jumlah stok"
                  />
                </div>
            </div>
          )}
        </div>
        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button onClick={onClose} className="btn mr-2">Batal</button>
          <button
            onClick={handleAddStock}
            disabled={!isFormValid}
            className="btn btn-primary"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
