import React, { useState, useEffect } from 'react';
import { X, Camera, Save, Loader2, Search, AlertTriangle } from 'lucide-react';
import InlineScanner from '/src/components/cashier/InlineScanner.jsx';
// Keterangan: Mengimpor fungsi dari supabaseDb.js
import { fetchProductBySku, addStock } from '/src/utils/supabaseDb.js';

export default function TambahStok({ onBack }) {
  const [sku, setSku] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  // Keterangan: Menggunakan state untuk menyimpan data produk yang ditemukan
  const [productData, setProductData] = useState(null);
  const [matchedSkuInfo, setMatchedSkuInfo] = useState(null);
  // Keterangan: State baru untuk menyimpan daftar UOM
  const [uomList, setUomList] = useState([]);
  const [selectedUom, setSelectedUom] = useState(null);
  
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Keterangan: Fungsi untuk mencari produk berdasarkan SKU
  const findProduct = async (scannedSku) => {
    console.log(`// Stok Masuk: Mencari produk dengan SKU: ${scannedSku}`);
    setLoading(true);
    setError(null);
    setProductData(null);
    setMatchedSkuInfo(null);
    setUomList([]);
    setSelectedUom(null);
    setPurchasePrice('');
    setQuantity('');

    const { product, matchedSku, uomList: fetchedUomList, error: fetchError } = await fetchProductBySku(scannedSku);

    if (fetchError) {
      console.error('Gagal memuat produk:', fetchError);
      setError('Terjadi kesalahan saat memuat produk.');
    } else if (product) {
      console.log('Produk ditemukan:', product);
      setProductData(product);
      setMatchedSkuInfo(matchedSku);
      setUomList(fetchedUomList || []);
      // Keterangan: Jika SKU yang cocok adalah UOM, set sebagai selectedUom
      if (matchedSku.type === 'uom') {
        setSelectedUom(matchedSku);
      } else {
        // Keterangan: Jika SKU yang cocok adalah base, buat objek UOM dasar
        setSelectedUom({
          type: 'base',
          id: null,
          sku: product.base_sku,
          unit: product.base_unit,
          quantity_per_uom: 1,
        });
      }
    } else {
      console.log('Produk tidak ditemukan.');
      setError('Produk tidak ditemukan.');
    }

    setLoading(false);
  };
  
  // Keterangan: Fungsi yang dipanggil saat scan barcode berhasil
  const handleScanSuccess = (scannedCode) => {
    setSku(scannedCode);
    setIsScanning(false);
    findProduct(scannedCode);
  };

  // Keterangan: Fungsi yang dipanggil saat input SKU berubah
  const handleSkuChange = (e) => {
    const value = e.target.value;
    setSku(value);
    // Keterangan: Opsional: Anda bisa menambahkan debounce untuk pencarian di sini
  };

  // Keterangan: Handler untuk submit form (pencarian produk)
  const handleFindProduct = (e) => {
    e.preventDefault();
    if (sku) {
      findProduct(sku);
    }
  };

  // Keterangan: Handler untuk menyimpan data stok masuk
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitSuccess('');
    
    // Keterangan: Pastikan semua data yang diperlukan ada
    if (!productData || !selectedUom || !quantity || !purchasePrice) {
      setError('Harap lengkapi semua data.');
      setLoading(false);
      return;
    }

    const totalBaseQuantity = parseInt(quantity) * selectedUom.quantity_per_uom;
    
    const stockData = {
      productId: productData.id,
      uomId: selectedUom.id,
      sku: selectedUom.sku, // Simpan SKU yang benar (base/uom)
      quantity: parseInt(quantity),
      purchasePrice: parseFloat(purchasePrice),
      totalBaseQuantity,
    };
    
    console.log('// Stok Masuk: Data untuk disimpan:', stockData);

    const { success, error: saveError } = await addStock(stockData);
    
    if (success) {
      setSubmitSuccess('Stok berhasil ditambahkan!');
      // Reset form
      setSku('');
      setProductData(null);
      setMatchedSkuInfo(null);
      setUomList([]);
      setSelectedUom(null);
      setQuantity('');
      setPurchasePrice('');
      setTimeout(onBack, 2000); // Kembali setelah 2 detik
    } else {
      setError(`Gagal menyimpan data: ${saveError.message}`);
    }
    
    setLoading(false);
  };
  
  // Keterangan: Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Tambah Stok</h2>
        <button onClick={onBack} className="icon-btn hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Form input Kode Produk (SKU) */}
        <div>
          <label className="text-sm font-medium mb-1 block">Kode Produk (SKU)</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Scan atau ketik SKU produk"
              value={sku}
              onChange={handleSkuChange}
              disabled={isScanning || loading}
              required
            />
            <button
              type="button"
              onClick={handleFindProduct}
              disabled={!sku || loading}
              className="icon-btn bg-white hover:bg-slate-100"
              title="Cari produk"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
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
        {error && (
          <div className="text-center bg-rose-50 p-4 rounded-lg flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <p className="text-sm text-rose-500">{error}</p>
          </div>
        )}
        {submitSuccess && (
          <div className="text-center bg-green-50 p-4 rounded-lg flex items-center justify-center gap-2">
            <Save className="w-5 h-5 text-green-500" />
            <p className="text-sm text-green-500">{submitSuccess}</p>
          </div>
        )}

        {productData && matchedSkuInfo && (
          <div className="card mt-4">
            <p className="text-sm text-slate-500">Produk Ditemukan:</p>
            <h3 className="font-semibold text-lg">{productData.name}</h3>
            
            {/* Form input jumlah dan harga */}
            <div className="mt-4 space-y-4">
              {/* Dropdown untuk memilih UOM jika ada lebih dari 1 */}
              {uomList.length > 0 && matchedSkuInfo.type === 'base' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Pilih Satuan</label>
                  <select 
                    className="select"
                    value={selectedUom?.sku || ''}
                    onChange={(e) => {
                      const newUom = uomList.find(u => u.uom_sku === e.target.value);
                      if (newUom) {
                        setSelectedUom({
                          type: 'uom',
                          id: newUom.id,
                          sku: newUom.uom_sku,
                          unit: newUom.uom_name,
                          quantity_per_uom: newUom.quantity_per_uom
                        });
                      } else {
                        // Kembali ke satuan dasar
                        setSelectedUom({
                          type: 'base',
                          id: null,
                          sku: productData.base_sku,
                          unit: productData.base_unit,
                          quantity_per_uom: 1,
                        });
                      }
                    }}
                  >
                    <option value="">{productData.base_unit}</option>
                    {uomList.map(uom => (
                      <option key={uom.id} value={uom.uom_sku}>{uom.uom_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Keterangan: Menampilkan SKU yang dipilih */}
              {selectedUom && (
                <div className="flex justify-between items-center bg-slate-100 px-3 py-2 rounded-lg">
                  <span className="text-sm text-slate-500 font-medium">SKU Terpilih:</span>
                  <span className="font-semibold">{selectedUom.sku}</span>
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1 block">Jumlah ({selectedUom?.unit})</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Jumlah stok"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Harga Beli ({selectedUom?.unit})</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Harga per unit"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}
      
        {/* Tombol Simpan */}
        <div className="mt-6 border-t pt-4">
          <button
            type="submit"
            disabled={!productData || !quantity || !purchasePrice || loading}
            className="btn btn-primary w-full btn-lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{loading ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
