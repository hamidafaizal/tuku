import React, { useState } from 'react';
import { supabase } from '/supabaseClient.js';
import { X, Camera, Info, Save, Loader2, Wand2 } from 'lucide-react';
import InlineScanner from '/src/components/cashier/InlineScanner.jsx';

export default function TambahBarangBaru({ onBack }) {
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [baseUnit, setBaseUnit] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [isUomActive, setIsUomActive] = useState(false);
  const [uoms, setUoms] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  const addUom = () => {
    if (uoms.length < 3) {
      setUoms([...uoms, { unit: '', quantity: 0, price: 0, sku: '' }]);
    }
  };

  const handleUomChange = (index, field, value) => {
    const newUoms = [...uoms];
    newUoms[index][field] = value;
    setUoms(newUoms);
  };
  
  const handleScanSuccess = (scannedCode) => {
    setSku(scannedCode);
    setIsScanning(false);
  };
  
  // Keterangan: Fungsi untuk menghasilkan kode SKU acak
  const generateRandomSku = (type, index) => {
    const newSku = crypto.randomUUID().slice(0, 8).toUpperCase();
    if (type === 'base') {
      setSku(newSku);
    } else if (type === 'uom') {
      const newUoms = [...uoms];
      newUoms[index].sku = newSku;
      setUoms(newUoms);
    }
    console.log(`// Tambah Produk: Kode SKU acak dibuat: ${newSku}`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess('');
    setSubmitError('');

    console.log('// Tambah Produk: Memulai proses penyimpanan data.');

    try {
      // Keterangan: Menggunakan data.session dari AuthContext.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Pengguna belum terotentikasi.");
      }

      // Keterangan: Cek duplikasi nama produk dan SKU
      console.log('// Tambah Produk: Melakukan pengecekan duplikasi nama dan SKU.');
      const { data: existingProducts, error: checkError } = await supabase
        .from('products')
        .select('name, base_sku')
        .eq('user_id', session.user.id)
        .or(`name.eq.${productName},base_sku.eq.${sku}`);

      if (checkError) throw checkError;

      if (existingProducts && existingProducts.length > 0) {
        const nameExists = existingProducts.some(p => p.name.toLowerCase() === productName.toLowerCase());
        const skuExists = existingProducts.some(p => p.base_sku.toLowerCase() === sku.toLowerCase());

        if (nameExists) {
          throw new Error('Nama produk sudah ada. Silakan gunakan nama lain.');
        }
        if (skuExists) {
          throw new Error('Kode Produk (SKU) sudah ada. Silakan gunakan kode lain.');
        }
      }
      
      // Keterangan: Menyimpan data ke tabel `products`
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([{
          name: productName,
          base_unit: baseUnit,
          base_sku: sku,
          user_id: session.user.id
        }])
        .select();

      if (productError) throw productError;
      const productId = productData[0].id;
      console.log('// Tambah Produk: Data produk berhasil disimpan, product_id:', productId);
      
      const pricesToInsert = [
        {
          product_id: productId,
          sku: sku,
          selling_price: parseFloat(sellingPrice),
          cost_price: 0,
        }
      ];

      // Keterangan: Menyimpan data UOM jika diaktifkan
      if (isUomActive && uoms.length > 0) {
        console.log('// Tambah Produk: Menyimpan data UOM.');
        const uomInserts = uoms.map(uom => ({
          product_id: productId,
          uom_name: uom.unit,
          uom_sku: uom.sku,
          quantity_per_uom: parseInt(uom.quantity),
        }));
        
        const { data: uomData, error: uomError } = await supabase
          .from('uom')
          .insert(uomInserts)
          .select();

        if (uomError) throw uomError;
        console.log('// Tambah Produk: Data UOM berhasil disimpan.', uomData);
        
        // Keterangan: Menambahkan data harga UOM ke array `pricesToInsert`
        uomData.forEach((uomItem, index) => {
          pricesToInsert.push({
            product_id: productId,
            uom_id: uomItem.id,
            sku: uomItem.uom_sku,
            selling_price: parseFloat(uoms[index].price),
            cost_price: 0,
          });
        });
      }
      
      // Keterangan: Menyimpan semua data harga (dasar dan UOM) sekaligus
      const { error: priceError } = await supabase
        .from('prices')
        .insert(pricesToInsert);
        
      if (priceError) throw priceError;
      console.log('// Tambah Produk: Semua data harga berhasil disimpan.');

      setSubmitSuccess('Produk berhasil ditambahkan!');
      // Reset form
      setProductName('');
      setSku('');
      setBaseUnit('');
      setSellingPrice(0);
      setIsUomActive(false);
      setUoms([]);
      
    } catch (error) {
      console.error('// Tambah Produk: Terjadi error:', error);
      setSubmitError(`Gagal menyimpan data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Tambah Produk Baru</h2>
        <button onClick={onBack} className="icon-btn hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSave} className="space-y-6 max-w-lg mx-auto">
        {submitSuccess && (
          <div className="alert alert-success">
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div className="alert alert-error">
            {submitError}
          </div>
        )}
        
        {/* Nama Produk */}
        <div>
          <label className="text-sm font-medium mb-1 block">Nama Produk</label>
          <input
            type="text"
            className="input"
            placeholder="Contohnya mie instan"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        {/* Input SKU Dasar */}
        <div>
          <label className="text-sm font-medium mb-1 block">Kode Produk (SKU)</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Contoh: 1234567890"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={isScanning}
              required
            />
            <button
              type="button"
              onClick={() => generateRandomSku('base')}
              className="icon-btn bg-white hover:bg-slate-100"
              title="Buat SKU Otomatis"
            >
              <Wand2 className="w-5 h-5" />
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
        {isScanning && (
          <div className="mt-4">
            <p className="text-sm text-center text-slate-500 mb-2">Arahkan kamera ke barcode</p>
            <InlineScanner onScanSuccess={handleScanSuccess} />
          </div>
        )}

        {/* Satuan Barang Dasar */}
        <div>
          <label className="text-sm font-medium mb-1 block">Satuan Barang</label>
          <input
            type="text"
            className="input"
            placeholder="Contoh: biji, botol, pcs"
            value={baseUnit}
            onChange={(e) => setBaseUnit(e.target.value)}
            required
          />
        </div>
        
        {/* Harga Jual Dasar */}
        <div>
          <label className="text-sm font-medium mb-1 block">Harga Jual</label>
          <input
            type="number"
            className="input"
            placeholder="Harga jual per unit"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
          />
        </div>

        {/* Checkbox UOM */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text flex items-center gap-2 font-medium">
              Aktifkan UOM
              <div className="tooltip" data-tip="UOM (Unit of Measure): satuan barang untuk jual/beli & stok. Contoh: biji, botol, kardus. Sistem otomatis konversi antar satuan.">
                <Info className="w-4 h-4 text-slate-400" />
              </div>
            </span>
            <input 
              type="checkbox" 
              className="checkbox" 
              checked={isUomActive} 
              onChange={(e) => setIsUomActive(e.target.checked)} 
            />
          </label>
        </div>

        {/* Form UOM jika diaktifkan */}
        {isUomActive && uoms.map((uom, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg bg-slate-50">
            <p className="text-sm font-semibold mb-2">Satuan UOM {index + 1}</p>
            <div>
              <label className="text-sm font-medium mb-1 block">Satuan UOM</label>
              <input
                type="text"
                className="input"
                placeholder="Contoh: biji, botol, pcs"
                value={uom.unit}
                onChange={(e) => handleUomChange(index, 'unit', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kode Produk (SKU)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Contoh: SKU-BOTOL"
                  value={uom.sku}
                  onChange={(e) => handleUomChange(index, 'sku', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => generateRandomSku('uom', index)}
                  className="icon-btn bg-white hover:bg-slate-100"
                  title="Buat SKU Otomatis"
                >
                  <Wand2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Jumlah per Satuan</label>
              <input
                type="number"
                className="input"
                placeholder={`Berapa ${baseUnit} dalam 1 ${uom.unit}`}
                value={uom.quantity}
                onChange={(e) => handleUomChange(index, 'quantity', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Harga Jual per UOM</label>
              <input
                type="number"
                className="input"
                placeholder="Harga jual satuan UOM"
                value={uom.price}
                onChange={(e) => handleUomChange(index, 'price', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        {isUomActive && uoms.length < 3 && (
          <div className="flex justify-end mt-4">
            <button type="button" onClick={addUom} className="btn btn-sm">
              + Satuan Barang
            </button>
          </div>
        )}

        {/* Tombol Simpan */}
        <div className="mt-6 border-t pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full btn-lg"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
