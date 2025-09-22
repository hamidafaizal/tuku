import React, { useState } from 'react';
import { X, Camera, Save, Loader2 } from 'lucide-react';
import InlineScanner from '/src/components/cashier/InlineScanner.jsx';

export default function TambahStok({ onBack }) {
  const [sku, setSku] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keterangan: Fungsi dummy untuk mencari produk
  const findProduct = (scannedSku) => {
    // Keterangan: Logika dummy untuk simulasi pencarian produk
    console.log(`// Stok Masuk: Mencari produk dengan SKU: ${scannedSku}`);
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      // Keterangan: Simulasi produk ditemukan
      if (scannedSku === '12345') {
        setProduct({
          name: 'Mie Instan Rasa Kari',
          unit: 'pcs',
        });
      } else {
        setError('Produk tidak ditemukan.');
        setProduct(null);
      }
    }, 1000);
  };

  const handleScanSuccess = (scannedCode) => {
    setSku(scannedCode);
    setIsScanning(false);
    findProduct(scannedCode);
  };

  const handleSave = () => {
    console.log('// Stok Masuk: Data disimpan:', {
      sku,
      quantity,
      purchasePrice,
    });
    // Keterangan: Logika penyimpanan data akan ditambahkan di sini
    alert('Data berhasil disimpan!');
    onBack();
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Tambah Stok</h2>
        <button onClick={onBack} className="icon-btn hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Form input Kode Produk (SKU) */}
        <div>
          <label className="text-sm font-medium mb-1 block">Kode Produk (SKU)</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Scan atau ketik SKU produk"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={isScanning}
            />
            <button
              onClick={() => setIsScanning(!isScanning)}
              className="icon-btn bg-white hover:bg-slate-100"
              title="Pindai barcode"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scanner barcode */}
        {isScanning && (
          <div className="mt-4">
            <p className="text-sm text-center text-slate-500 mb-2">Arahkan kamera ke barcode</p>
            <InlineScanner onScanSuccess={handleScanSuccess} />
          </div>
        )}

        {/* Tampilan info produk jika ditemukan */}
        {loading && <div className="text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-500" /></div>}
        {error && <p className="text-sm text-rose-500 text-center">{error}</p>}
        {product && (
          <div className="card mt-4">
            <p className="text-sm text-slate-500">Produk Ditemukan:</p>
            <p className="font-semibold text-lg">{product.name}</p>
            
            {/* Form input jumlah dan harga */}
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Jumlah</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Jumlah stok"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Harga Beli</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Harga per unit"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tombol Simpan */}
      <div className="mt-6 border-t pt-4">
        <button
          onClick={handleSave}
          disabled={!product || !quantity || !purchasePrice}
          className="btn btn-primary w-full btn-lg"
        >
          <Save className="w-5 h-5" />
          <span>Simpan</span>
        </button>
      </div>
    </div>
  );
}
