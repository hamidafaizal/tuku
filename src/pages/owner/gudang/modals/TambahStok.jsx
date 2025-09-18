import React, { useState, useEffect } from 'react';
import { X, Search, Camera, Loader2, Save } from 'lucide-react';
import InlineScanner from '../../../../components/cashier/InlineScanner.jsx';
// import { useAuth } from '../../../../context/AuthContext.jsx';
// import { fetchProducts, addStockToDb } from '../../../../utils/supabaseDb.js';
import { useBarcodeScanner } from '../../../../hooks/useBarcodeScanner.js';

// Data dummy produk untuk simulasi pencarian
const dummyProducts = [
  {
    id: 1,
    name: 'Kopi Susu Gula Aren',
    unit: 'bungkus',
    sku: 'KSGA',
    uom: [
      { uomList: 'slop', uomQuantity: 10, sku: 'SLOP-KSGA' },
      { uomList: 'karton', uomQuantity: 100, sku: 'KARTON-KSGA' },
    ],
  },
  {
    id: 2,
    name: 'Croissant Cokelat',
    unit: 'pcs',
    sku: 'CRCK',
    uom: null,
  },
  {
    id: 3,
    name: 'Air Mineral 600ml',
    unit: 'botol',
    sku: 'AM600',
    uom: [
      { uomList: 'dus', uomQuantity: 24, sku: 'DUS-AM600' },
    ],
  },
];

// Komponen modal untuk menambah stok barang
export default function TambahStokModal({ isOpen, onClose }) {
  // Keterangan: State untuk kode barang yang di-scan atau diinput manual
  const [scannedCode, setScannedCode] = useState('');
  // Keterangan: State untuk mengelola tampilan scanner inline
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false);
  // Keterangan: State untuk menyimpan produk yang ditemukan
  const [productFound, setProductFound] = useState(null);
  // Keterangan: State untuk menyimpan detail SKU yang cocok (SKU utama atau UOM)
  const [matchedSku, setMatchedSku] = useState(null);
  // Keterangan: State untuk jumlah stok yang akan ditambahkan (dalam unit SKU yang di-scan)
  const [stockQuantity, setStockQuantity] = useState('');
  // Keterangan: State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });

  // Keterangan: Fungsi untuk mereset state saat modal ditutup
  useEffect(() => {
    if (isOpen) {
      setScannedCode('');
      setProductFound(null);
      setMatchedSku(null);
      setStockQuantity('');
      setLoading(false);
      setError('');
      setSaveStatus({ loading: false, error: null });
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
  
  // Keterangan: Fungsi dummy untuk mencari produk
  const handleSearch = async (code) => {
    if (!code) {
        setError('Kode barang tidak boleh kosong.');
        return;
    }
    setLoading(true);
    setError('');
    setProductFound(null);
    setMatchedSku(null);
    console.log('Mencari produk dengan kode (dummy):', code);
    
    // Keterangan: Mensimulasikan delay API
    setTimeout(() => {
      let foundProduct = null;
      let isBaseSkuMatch = false;
      let matchedUomItem = null;
      
      for (const product of dummyProducts) {
        if (product.sku === code) {
          foundProduct = product;
          isBaseSkuMatch = true;
          break;
        }
        if (product.uom) {
          matchedUomItem = product.uom.find(uomItem => uomItem.sku === code);
          if (matchedUomItem) {
            foundProduct = product;
            isBaseSkuMatch = false;
            break;
          }
        }
      }

      if (foundProduct) {
        setProductFound(foundProduct);
        if (isBaseSkuMatch) {
          setMatchedSku({
            type: 'base',
            sku: foundProduct.sku,
            unit: foundProduct.unit,
            name: foundProduct.name,
            quantity: 1
          });
        } else {
          setMatchedSku({
            type: 'uom',
            sku: matchedUomItem.sku,
            unit: matchedUomItem.uomList,
            name: foundProduct.name,
            quantity: matchedUomItem.uomQuantity
          });
        }
        setStockQuantity('');
        console.log('Produk dummy ditemukan:', foundProduct);
        console.log('SKU yang cocok:', isBaseSkuMatch ? 'SKU Utama' : 'UOM List');
      } else {
        setError("Kode barang belum di input ke database!");
        console.log('Kode barang dummy tidak ditemukan.');
      }
      setLoading(false);
    }, 500);
  };
  
  // Keterangan: Fungsi dummy untuk menangani penambahan stok
  const handleAddStock = () => {
    setSaveStatus({ loading: true, error: null });
    console.log('Mencoba menyimpan data stok masuk (dummy)...');
    
    setTimeout(() => {
      console.log('Data stok berhasil disimpan secara dummy.');
      setSaveStatus({ loading: false, error: null });
      onClose();
    }, 1000);
  };

  // Keterangan: Fungsi untuk mengelola perubahan input jumlah stok
  const handleStockQuantityChange = (e) => {
    const value = e.target.value;
    setStockQuantity(value);
    console.log('Jumlah stok diubah menjadi:', value);
  };

  // Jika modal tidak terbuka, jangan render apapun
  if (!isOpen) return null;

  const isFormValid = productFound && Number(stockQuantity) > 0 && !saveStatus.loading;

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
              disabled={loading || saveStatus.loading}
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
              disabled={loading || saveStatus.loading}
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
              {/* Menampilkan informasi produk berdasarkan tipe SKU yang cocok */}
              {matchedSku?.type === 'base' ? (
                <>
                  <h3 className="text-lg font-semibold">{productFound.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Satuan Dasar</span>
                      <span className="font-medium">{productFound.unit}</span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{productFound.name} ({matchedSku?.unit})</h3>
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Jumlah per {matchedSku?.unit}</span>
                      <span className="font-medium">{matchedSku?.quantity} {productFound.unit}</span>
                  </div>
                </>
              )}
                <div className="divider" />
                <div>
                  <label htmlFor="stockQuantity" className="text-sm font-medium mb-1 block">
                    Jumlah Stok ({matchedSku?.unit})
                  </label>
                  <input
                    id="stockQuantity"
                    type="number"
                    value={stockQuantity}
                    onChange={handleStockQuantityChange}
                    className="input"
                    min="1"
                    placeholder="Masukkan jumlah stok"
                    disabled={saveStatus.loading}
                  />
                </div>
                {matchedSku?.type === 'uom' && (
                  <p className="text-sm text-slate-500 bg-slate-100 p-2 rounded">
                    Total stok yang akan ditambahkan: {stockQuantity || 0} {matchedSku.unit} = {(stockQuantity || 0) * matchedSku.quantity} {productFound.unit}
                  </p>
                )}
            </div>
          )}
          {/* Save Status */}
          {saveStatus.loading && (
            <div className="flex items-center justify-center p-4 text-sky-600 bg-sky-50 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Menyimpan...</span>
            </div>
          )}
          {saveStatus.error && (
            <div className="p-4 text-sm text-rose-600 bg-rose-50 rounded-lg">
              <span>Error: {saveStatus.error}</span>
            </div>
          )}
        </div>
        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button onClick={onClose} className="btn mr-2" disabled={saveStatus.loading}>Batal</button>
          <button
            onClick={handleAddStock}
            disabled={!isFormValid}
            className="btn btn-primary"
          >
            {saveStatus.loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
