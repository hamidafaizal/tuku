import React, { useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X, Info, Plus } from 'lucide-react';
// Keterangan: Menggunakan InlineScanner untuk tampilan kamera yang terintegrasi
import InlineScanner from '/src/components/cashier/InlineScanner.jsx';

export default function TambahBarangBaru({ onBack }) {
  const [namaProduk, setNamaProduk] = useState('');
  const [skuProduk, setSkuProduk] = useState('');
  const [satuanProduk, setSatuanProduk] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [fotoProduk, setFotoProduk] = useState(null);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [isUomActive, setIsUomActive] = useState(false);
  // Keterangan: Menggunakan array untuk menyimpan beberapa UOM
  const [uomList, setUomList] = useState([{
    id: 1,
    sku: '',
    nama: '',
    jumlah: '',
    harga: '',
    isScannerOpen: false, // State scanner per UOM
  }]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File foto dipilih:', file.name);
      setFotoProduk(file);
    }
  };

  const handleScanSuccess = (decodedText) => {
    console.log('Barcode berhasil di-scan:', decodedText);
    setSkuProduk(decodedText);
    setIsCameraScannerOpen(false);
  };
  
  // Keterangan: Fungsi untuk menangani hasil scan barcode UOM tertentu
  const handleUomScanSuccess = (id, decodedText) => {
    console.log(`Barcode UOM (ID: ${id}) berhasil di-scan:`, decodedText);
    setUomList(uomList.map(uom =>
      uom.id === id ? { ...uom, sku: decodedText, isScannerOpen: false } : uom
    ));
  };
  
  // Keterangan: Fungsi untuk menambah UOM baru
  const handleAddUom = () => {
    if (uomList.length < 3) {
      setUomList([...uomList, {
        id: uomList.length + 1,
        sku: '',
        nama: '',
        jumlah: '',
        harga: '',
        isScannerOpen: false,
      }]);
    } else {
      console.log('Batas maksimal UOM (3) telah tercapai.');
    }
  };

  // Keterangan: Fungsi untuk menghapus UOM
  const handleRemoveUom = (id) => {
    setUomList(uomList.filter(uom => uom.id !== id));
  };

  // Keterangan: Fungsi untuk mengubah data UOM
  const handleUomChange = (id, field, value) => {
    setUomList(uomList.map(uom =>
      uom.id === id ? { ...uom, [field]: value } : uom
    ));
  };

  // Keterangan: Fungsi untuk handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form disubmit dengan data:', {
      namaProduk,
      skuProduk,
      satuanProduk,
      hargaJual,
      fotoProduk,
      isUomActive,
      uomList: isUomActive ? uomList : [],
    });
    // Logika untuk menyimpan data ke database akan ditambahkan di sini
  };
  
  const tooltipText = "UOM (Unit of Measure): satuan barang untuk jual/beli & stok. Contoh: biji, botol, kardus. Sistem otomatis konversi antar satuan.";

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Nama Produk */}
        <div>
          <label htmlFor="namaProduk" className="text-sm font-medium">Nama Produk</label>
          <input
            id="namaProduk"
            type="text"
            className="input mt-1"
            placeholder="contohnya mie instan"
            value={namaProduk}
            onChange={(e) => {
              console.log('Input nama produk:', e.target.value);
              setNamaProduk(e.target.value);
            }}
            required
          />
        </div>

        {/* Input Foto Produk */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Foto Produk</label>
          {fotoProduk ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 ring-1 ring-slate-200">
              <ImageIcon className="w-5 h-5 text-slate-500" />
              <span className="flex-1 text-sm text-slate-700 ellipsis">{fotoProduk.name}</span>
              <button 
                type="button" 
                onClick={() => {
                  console.log('Menghapus foto produk.');
                  setFotoProduk(null);
                }}
                className="icon-btn hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => {
                  console.log('Tombol Ambil Foto diklik. Fungsi ini akan diimplementasikan nanti.');
                }}
                className="btn w-full justify-center btn-secondary"
              >
                <Camera className="w-4 h-4" />
                <span>Ambil Foto</span>
              </button>
              <label htmlFor="uploadFoto" className="btn w-full justify-center btn-secondary cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Pilih dari File</span>
                <input 
                  id="uploadFoto" 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

        {/* Input Kode Produk SKU */}
        <div>
          <label htmlFor="skuProduk" className="text-sm font-medium">Kode Produk (SKU)</label>
          <div className="flex gap-2">
            <input
              id="skuProduk"
              type="text"
              className="input mt-1 flex-1"
              placeholder="contohnya MIE001"
              value={skuProduk}
              onChange={(e) => {
                console.log('Input SKU:', e.target.value);
                setSkuProduk(e.target.value);
              }}
              required
            />
            <button
              type="button"
              onClick={() => {
                console.log('Tombol scanner diklik, toggling inline scanner.');
                setIsCameraScannerOpen(!isCameraScannerOpen);
              }}
              className={`icon-btn btn-secondary mt-1 ${isCameraScannerOpen ? 'text-rose-500' : ''}`}
            >
              {isCameraScannerOpen ? <X className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Keterangan: Input Satuan Produk dasar */}
        <div>
          <label htmlFor="satuanProduk" className="text-sm font-medium">Satuan Barang Terkecil</label>
          <input
            id="satuanProduk"
            type="text"
            className="input mt-1"
            placeholder="Contoh : bungkus, biji, pcs"
            value={satuanProduk}
            onChange={(e) => {
              console.log('Input satuan produk:', e.target.value);
              setSatuanProduk(e.target.value);
            }}
            required
          />
        </div>

        {/* Keterangan: Menampilkan scanner inline saat state aktif */}
        {isCameraScannerOpen && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Arahkan kamera ke barcode.</p>
            <InlineScanner onScanSuccess={handleScanSuccess} />
          </div>
        )}

        {/* Input Harga Jual */}
        <div>
          <label htmlFor="hargaJual" className="text-sm font-medium">Harga Jual per {satuanProduk || 'Satuan Terkecil'}</label>
          <input
            id="hargaJual"
            type="number"
            className="input mt-1"
            placeholder="contohnya 3000"
            value={hargaJual}
            onChange={(e) => {
              console.log('Input harga jual:', e.target.value);
              setHargaJual(e.target.value);
            }}
            required
          />
        </div>

        <div className="divider my-6"></div>

        {/* Opsi UOM */}
        <div className="flex items-center gap-2">
          <input
            id="uomActive"
            type="checkbox"
            checked={isUomActive}
            onChange={(e) => {
              console.log('Checkbox UOM diubah:', e.target.checked);
              setIsUomActive(e.target.checked);
              // Keterangan: Reset UOM list saat checkbox dimatikan
              if (!e.target.checked) {
                setUomList([{ id: 1, sku: '', nama: '', jumlah: '', harga: '', isScannerOpen: false }]);
              }
            }}
            className="form-checkbox h-4 w-4 rounded-md text-sky-600 focus:ring-sky-500"
          />
          <label htmlFor="uomActive" className="text-sm font-medium text-slate-700">Aktifkan UOM</label>
          <div className="relative group">
            <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              {tooltipText}
            </div>
          </div>
        </div>
        
        {/* Form UOM (Muncul jika isUomActive true) */}
        {isUomActive && (
          <div className="card space-y-4 p-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Form UOM</h3>
              {uomList.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddUom}
                  className="btn btn-sm btn-secondary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Satuan Barang</span>
                </button>
              )}
            </div>

            {uomList.map((uom, index) => (
              <div key={uom.id} className="space-y-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
                {uomList.length > 1 && (
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-semibold text-slate-600">UOM #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveUom(uom.id)}
                      className="icon-btn hover:bg-rose-50"
                    >
                      <X className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                )}
                {/* Form Kode Produk (SKU) untuk UOM */}
                <div>
                  <label htmlFor={`uomSku-${uom.id}`} className="text-sm font-medium">Kode Produk UOM (SKU)</label>
                  <div className="flex gap-2">
                    <input
                      id={`uomSku-${uom.id}`}
                      type="text"
                      className="input mt-1 flex-1"
                      placeholder="contohnya MIE001-KARDUS"
                      value={uom.sku}
                      onChange={(e) => {
                        console.log(`Input UOM SKU (ID: ${uom.id}):`, e.target.value);
                        handleUomChange(uom.id, 'sku', e.target.value);
                      }}
                      required={isUomActive}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        console.log(`Tombol scanner UOM (ID: ${uom.id}) diklik.`);
                        setUomList(uomList.map(item =>
                          item.id === uom.id ? { ...item, isScannerOpen: !item.isScannerOpen } : { ...item, isScannerOpen: false }
                        ));
                      }}
                      className={`icon-btn btn-secondary mt-1 ${uom.isScannerOpen ? 'text-rose-500' : ''}`}
                    >
                      {uom.isScannerOpen ? <X className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Form Input Satuan UOM */}
                <div>
                  <label htmlFor={`uomNama-${uom.id}`} className="text-sm font-medium">Satuan UOM</label>
                  <div className="flex gap-2 items-end">
                    <input
                      id={`uomNama-${uom.id}`}
                      type="text"
                      className="input mt-1"
                      placeholder="contohnya Kardus"
                      value={uom.nama}
                      onChange={(e) => {
                        console.log(`Input UOM nama (ID: ${uom.id}):`, e.target.value);
                        handleUomChange(uom.id, 'nama', e.target.value);
                      }}
                      required={isUomActive}
                    />
                    <span className="text-sm muted">x</span>
                    <input
                      id={`uomJumlah-${uom.id}`}
                      type="number"
                      className="input mt-1 w-24 text-right"
                      placeholder="0"
                      value={uom.jumlah}
                      onChange={(e) => {
                        console.log(`Input UOM jumlah (ID: ${uom.id}):`, e.target.value);
                        handleUomChange(uom.id, 'jumlah', e.target.value);
                      }}
                      required={isUomActive}
                    />
                    <span className="text-sm muted">{satuanProduk || 'satuan terkecil'}</span>
                  </div>
                </div>

                {/* Input Harga Jual per UOM */}
                <div>
                  <label htmlFor={`uomHarga-${uom.id}`} className="text-sm font-medium">Harga Jual per {uom.nama || 'UOM'}</label>
                  <input
                    id={`uomHarga-${uom.id}`}
                    type="number"
                    className="input mt-1"
                    placeholder="contohnya 30000"
                    value={uom.harga}
                    onChange={(e) => {
                      console.log(`Input UOM harga (ID: ${uom.id}):`, e.target.value);
                      handleUomChange(uom.id, 'harga', e.target.value);
                    }}
                    required={isUomActive}
                  />
                </div>

                {uom.isScannerOpen && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Arahkan kamera ke barcode.</p>
                    <InlineScanner onScanSuccess={(text) => handleUomScanSuccess(uom.id, text)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Tombol Simpan */}
        <button type="submit" className="btn btn-primary w-full btn-lg">
          Simpan Produk
        </button>
      </form>
    </div>
  );
}
