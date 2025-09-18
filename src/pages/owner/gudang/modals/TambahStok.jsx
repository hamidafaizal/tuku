import React, { useState, useEffect } from 'react';
import { X, Search, Camera, Loader2, Save } from 'lucide-react';
import InlineScanner from '../../../../components/cashier/InlineScanner.jsx';
import { useBarcodeScanner } from '../../../../hooks/useBarcodeScanner.js';
import { fetchProductBySku, addStock } from '../../../../utils/supabaseDb.js';

export default function TambahStokModal({ isOpen, onClose }) {
  const [scannedCode, setScannedCode] = useState('');
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false);
  const [productFound, setProductFound] = useState(null);
  const [matchedSku, setMatchedSku] = useState(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    if (isOpen) {
      setScannedCode('');
      setProductFound(null);
      setMatchedSku(null);
      setStockQuantity('');
      setPurchasePrice('');
      setLoading(false);
      setError('');
      setSaveStatus({ loading: false, error: null });
    }
  }, [isOpen]);

  const handleScanSuccess = async (code) => {
    console.log('Kode barang berhasil di-scan via kamera:', code);
    setScannedCode(code);
    setCameraScannerOpen(false);
    await handleSearch(code);
  };
  
  const handleBarcodeScan = async (code) => {
    console.log('Kode barang berhasil di-scan via perangkat fisik:', code);
    setScannedCode(code);
    await handleSearch(code);
  };
  useBarcodeScanner(isOpen ? handleBarcodeScan : () => {});

  const handleCodeChange = (e) => {
    setScannedCode(e.target.value);
  };

  const handleSearch = async (code) => {
    if (!code) {
        setError('Kode barang tidak boleh kosong.');
        return;
    }
    setLoading(true);
    setError('');
    setProductFound(null);
    setMatchedSku(null);
    console.log('Mencari produk dengan kode:', code);
    
    const { product, matchedSku, error: fetchError } = await fetchProductBySku(code);

    if (fetchError) {
      console.error('Error saat mencari produk:', fetchError);
      setError('Terjadi kesalahan saat mencari produk.');
    } else if (product || matchedSku) { // Perubahan di sini untuk memeriksa product atau matchedSku
      setProductFound(product);
      setMatchedSku(matchedSku);
      setStockQuantity('');
      setPurchasePrice('');
      console.log('Produk ditemukan:', product);
      console.log('SKU yang cocok:', matchedSku);
    } else {
      // Keterangan: Logika ini sekarang lebih jelas untuk menangani kasus tidak ada data
      setError("Kode barang belum di input ke database!");
      console.log('Kode barang tidak ditemukan.');
    }
    setLoading(false);
  };
  
  const handleAddStock = async () => {
    setSaveStatus({ loading: true, error: null });
    console.log('Mencoba menyimpan data stok masuk...');
    
    if (!matchedSku || !productFound || Number(stockQuantity) <= 0 || Number(purchasePrice) <= 0) {
      setSaveStatus({ loading: false, error: 'Data tidak valid.' });
      return;
    }
    
    const totalBaseQuantity = matchedSku.quantity * Number(stockQuantity);

    const stockData = {
      productId: productFound.id,
      uomId: matchedSku.type === 'uom' ? matchedSku.id : null,
      sku: matchedSku.sku,
      quantity: Number(stockQuantity),
      purchasePrice: Number(purchasePrice),
      totalBaseQuantity,
    };
    
    const { success, error } = await addStock(stockData);
    
    if (!success) {
      console.error('Gagal menyimpan stok masuk:', error);
      setSaveStatus({ loading: false, error: error });
    } else {
      console.log('Stok masuk berhasil disimpan.');
      setSaveStatus({ loading: false, error: null });
      onClose();
    }
  };

  const handleStockQuantityChange = (e) => {
    const value = e.target.value;
    setStockQuantity(value);
    console.log('Jumlah stok diubah menjadi:', value);
  };
  
  const handlePurchasePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPurchasePrice(Number(value));
    console.log('Harga beli diubah menjadi:', Number(value));
  };

  if (!isOpen) return null;

  const isFormValid = productFound && Number(stockQuantity) > 0 && Number(purchasePrice) > 0 && !saveStatus.loading;

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
              {matchedSku?.type === 'base' ? (
                <>
                  <h3 className="text-lg font-semibold">{productFound.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Satuan Dasar</span>
                      <span className="font-medium">{productFound.base_unit}</span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{productFound.name} ({matchedSku?.unit})</h3>
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Jumlah per {matchedSku?.unit}</span>
                      <span className="font-medium">{matchedSku?.quantity} {productFound.base_unit}</span>
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
              <div>
                <label htmlFor="purchasePrice" className="text-sm font-medium mb-1 block">
                  Harga Beli per {matchedSku?.unit} (Rp)
                </label>
                <input
                  id="purchasePrice"
                  type="text"
                  inputMode="numeric"
                  value={purchasePrice > 0 ? purchasePrice.toLocaleString('id-ID') : ''}
                  onChange={handlePurchasePriceChange}
                  className="input"
                  min="1"
                  placeholder="Masukkan harga beli"
                  disabled={saveStatus.loading}
                />
              </div>
              <p className="text-sm text-slate-500 bg-slate-100 p-2 rounded">
                Total stok yang akan ditambahkan: {stockQuantity || 0} {matchedSku?.unit} = {(stockQuantity || 0) * (matchedSku?.quantity || 1)} {productFound.base_unit}
              </p>
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
