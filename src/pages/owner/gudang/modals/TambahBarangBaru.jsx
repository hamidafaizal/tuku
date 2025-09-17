import { useState, useEffect } from 'react';
import { X, Save, Camera, Sparkles, Info, Plus, Loader2 } from 'lucide-react';
import { useBarcodeScanner } from '../../../../hooks/useBarcodeScanner.js';
import InlineScanner from '../../../../components/cashier/InlineScanner.jsx';

// Komponen Modal untuk menambah barang baru
export default function TambahBarangBaruModal({ isOpen, onClose, onSave, existingItems = [], saveStatus }) {
  // Komentar: Menambah state `uom` untuk menampung data input UOM List
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    sku: '', // SKU untuk satuan dasar
    uom: [{ uomList: '', uomQuantity: 0, sku: '' }],
  });
  // Komentar: Menambah state untuk mengelola tampilan scanner dan input mana yang aktif
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false);
  const [currentScannerTarget, setCurrentScannerTarget] = useState(null); 
  const [isNameExists, setIsNameExists] = useState(false);
  const [isUomListEnabled, setIsUomListEnabled] = useState(false);

  // Fungsi untuk mereset state saat modal ditutup/dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', unit: '', sku: '', uom: [{ uomList: '', uomQuantity: 0, sku: '' }] });
      setCameraScannerOpen(false);
      setCurrentScannerTarget(null);
      setIsNameExists(false);
      setIsUomListEnabled(false);
    }
  }, [isOpen]);

  // Cek apakah nama barang sudah ada setiap kali nama di form berubah
  useEffect(() => {
    if (formData.name) {
      const exists = existingItems.some(item => item.name.toLowerCase() === formData.name.toLowerCase());
      setIsNameExists(exists);
    } else {
      setIsNameExists(false);
    }
  }, [formData.name, existingItems]);


  // Fungsi untuk menangani perubahan pada input form umum
  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(`Input dengan id "${id}" diubah menjadi:`, value);
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Fungsi untuk menangani perubahan pada input UOM List
  const handleUomChange = (index, e) => {
    const { id, value } = e.target;
    console.log(`UOM input di index ${index} dengan id "${id}" diubah menjadi:`, value);
    const newUom = [...formData.uom];
    newUom[index][id] = value;
    setFormData(prev => ({ ...prev, uom: newUom }));
  };

  // Fungsi untuk menambah UOM List baru
  const handleAddUom = () => {
    if (formData.uom.length < 5) {
      console.log("Menambahkan UOM baru.");
      setFormData(prev => ({
        ...prev,
        uom: [...prev.uom, { uomList: '', uomQuantity: 0, sku: '' }]
      }));
    }
  };
  
  // Fungsi untuk menghapus UOM List
  const handleRemoveUom = (index) => {
    console.log(`Menghapus UOM pada index: ${index}`);
    const newUom = formData.uom.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, uom: newUom }));
  };

  // Komentar: Fungsi baru untuk membuka/menutup scanner kamera dengan target input
  const handleScannerToggle = (target) => {
    setCameraScannerOpen(prev => !prev);
    setCurrentScannerTarget(isCameraScannerOpen ? null : target);
    console.log(`Scanner kamera di-toggle untuk target: ${target}`);
  };

  // Komentar: Fungsi callback yang sudah disesuaikan untuk mengisi input yang benar
  const handleScanSuccess = (scannedCode) => {
    console.log(`Kode barang berhasil dipindai: ${scannedCode}`);
    if (currentScannerTarget === 'base-sku') {
        setFormData(prev => ({ ...prev, sku: scannedCode }));
    } else if (currentScannerTarget && currentScannerTarget.startsWith('uom-sku-')) {
      const index = parseInt(currentScannerTarget.split('-')[2]);
      const newUom = [...formData.uom];
      newUom[index].sku = scannedCode;
      setFormData(prev => ({ ...prev, uom: newUom }));
    } else if (currentScannerTarget && currentScannerTarget.startsWith('uom-list-')) {
      const index = parseInt(currentScannerTarget.split('-')[2]);
      const newUom = [...formData.uom];
      newUom[index].uomList = scannedCode;
      setFormData(prev => ({ ...prev, uom: newUom }));
    }
    setCameraScannerOpen(false);
    setCurrentScannerTarget(null);
  };
  
  // Menggunakan custom hook untuk scanner fisik.
  const handleBarcodeScan = (scannedCode) => {
    // Komentar: Asumsi scanner fisik selalu mengisi SKU UOM pertama jika UOM List aktif, 
    // jika tidak, mengisi SKU Satuan Dasar
    console.log(`Kode dari scanner fisik terdeteksi: ${scannedCode}`);
    if (isUomListEnabled) {
      const newUom = [...formData.uom];
      newUom[0].sku = scannedCode;
      setFormData(prev => ({ ...prev, uom: newUom }));
    } else {
      setFormData(prev => ({ ...prev, sku: scannedCode }));
    }
  };
  useBarcodeScanner(isOpen ? handleBarcodeScan : () => {});

  // Fungsi untuk membuat kode barang otomatis
  const handleGenerateSku = (index = null) => {
    console.log(`Membuat kode barang otomatis untuk UOM index: ${index}`);
    const nameAcronym = formData.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
    const uniqueSuffix = Date.now().toString().slice(-4);
    
    if (index === null) {
        // Generate SKU untuk satuan dasar
        const newSku = `${nameAcronym}${uniqueSuffix}`;
        setFormData(prev => ({ ...prev, sku: newSku }));
    } else {
        // Generate SKU untuk UOM List
        const newSku = `${nameAcronym}-${formData.uom[index].uomList.toUpperCase()}${uniqueSuffix}`;
        const newUom = [...formData.uom];
        newUom[index].sku = newSku;
        setFormData(prev => ({ ...prev, uom: newUom }));
    }
  };

  // Mengubah handleSubmit menjadi pemanggil onSave
  const handleSubmit = () => {
    // Validasi sederhana sebelum menyimpan
    if (!formData.name || !formData.unit || !formData.sku || isNameExists) {
      console.log("Form tidak valid, penyimpanan dibatalkan.");
      return;
    }

    if (isUomListEnabled) {
      const isUomValid = formData.uom.every(uom => uom.uomList && uom.uomQuantity > 0 && uom.sku);
      if (!isUomValid) {
        console.log("Semua input UOM List, Jumlah Satuan Dasar, dan SKU harus terisi jika diaktifkan.");
        return;
      }
    }

    console.log('Formulir tambah barang disubmit dengan data:', formData);
    // Perubahan di sini: Mengirim status isUomListEnabled
    onSave(formData, isUomListEnabled);
  };

  if (!isOpen) return null;

  const canGenerateBaseSku = formData.name && !formData.sku && !isNameExists;
  const canSubmit = formData.name && formData.unit && formData.sku && !isNameExists && (!isUomListEnabled || formData.uom.every(u => u.uomList && u.uomQuantity > 0 && u.sku)) && !saveStatus.loading;
  const canAddUom = formData.uom.length < 5;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold">Tambah Barang Baru</h2>
          <button onClick={onClose} className="icon-btn hover:bg-slate-100"><X className="w-5 h-5"/></button>
        </div>

        {/* Konten/Body Modal - dibuat scrollable */}
        <div className="p-6 flex-1 overflow-y-auto scrollbar space-y-4">
            {/* Input Nama Barang */}
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-1 block">Nama Barang</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`input ${isNameExists ? 'ring-rose-500' : ''}`}
                placeholder="cth: Kopi Susu Gula Aren"
                autoFocus
                disabled={saveStatus.loading}
              />
              {isNameExists && <p className="text-xs text-rose-600 mt-1">Nama barang ini sudah ada di database.</p>}
            </div>

            {/* Input Satuan Dasar & SKU */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label htmlFor="unit" className="text-sm font-medium mb-1 block">Satuan Dasar</label>
                <input
                  id="unit"
                  type="text"
                  value={formData.unit}
                  onChange={handleChange}
                  className="input"
                  placeholder="contoh: bungkus, biji, pcs, dll"
                  disabled={saveStatus.loading}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="sku" className="text-sm font-medium mb-1 block">Kode Barang (SKU)</label>
                <div className="flex gap-1">
                  <input
                    id="sku"
                    type="text"
                    value={formData.sku}
                    onChange={handleChange}
                    className="input flex-1"
                    placeholder="Ketik atau scan barcode"
                    disabled={saveStatus.loading}
                  />
                  <button
                    onClick={() => handleScannerToggle('base-sku')}
                    type="button"
                    className={`icon-btn rounded-lg mb-px ${isCameraScannerOpen && currentScannerTarget === 'base-sku' ? 'bg-sky-100 text-sky-600' : 'bg-white'}`}
                    title={isCameraScannerOpen && currentScannerTarget === 'base-sku' ? "Tutup Scanner" : "Buka Scanner Kamera"}
                    disabled={saveStatus.loading}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tombol Buat Kode Otomatis untuk Satuan Dasar */}
            <div className="text-center">
              <button
                onClick={() => handleGenerateSku(null)}
                disabled={!canGenerateBaseSku || saveStatus.loading}
                className="btn btn-ghost btn-sm"
              >
                <Sparkles className="w-4 h-4" />
                Buat Kode Barang Satuan Dasar
              </button>
            </div>
            
            {/* Toggle untuk UOM List dengan info icon */}
            <div className="flex items-center gap-2">
              <input
                id="uom-list-toggle"
                type="checkbox"
                checked={isUomListEnabled}
                onChange={() => setIsUomListEnabled(!isUomListEnabled)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                disabled={saveStatus.loading}
              />
              <label htmlFor="uom-list-toggle" className="text-sm font-medium text-slate-700">
                Aktifkan UOM List
              </label>
              <div className="relative group">
                <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 p-3 rounded-lg bg-slate-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  jika barang anda memiliki satuan grosir silahkan aktifkan UOM List untuk mempermudah proses penghitungan laba rugi nantinya. UOM List ini berfungsi untuk mendata satuan barang grosir (contoh untuk produk rokok : bungkus, slop, ball.).
                </div>
              </div>
            </div>

            {/* Input UOM List (conditional) */}
            {isUomListEnabled && (
              <div className="space-y-4">
                {formData.uom.map((uomItem, index) => (
                  <div key={index} className="space-y-2 card bg-slate-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-700">Satuan Grosir {index + 1}</h4>
                      {formData.uom.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUom(index)}
                          className="icon-btn text-rose-500 hover:bg-rose-100"
                          title="Hapus Satuan Grosir"
                          disabled={saveStatus.loading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label htmlFor={`uomList${index}`} className="text-sm font-medium mb-1 block">UOM List</label>
                        <input
                            id="uomList"
                            type="text"
                            value={uomItem.uomList}
                            onChange={(e) => handleUomChange(index, e)}
                            className="input flex-1"
                            placeholder="Contoh : slop"
                            disabled={saveStatus.loading}
                          />
                      </div>
                      <div className="w-24">
                        <label htmlFor={`uomQuantity${index}`} className="text-sm font-medium mb-1 block">Jumlah</label>
                        <div className="relative group">
                          <input
                            id="uomQuantity"
                            type="number"
                            value={uomItem.uomQuantity}
                            onChange={(e) => handleUomChange(index, e)}
                            className="input pr-8"
                            placeholder="0"
                            min="0"
                            disabled={saveStatus.loading}
                          />
                          <Info className="w-4 h-4 text-slate-400 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2" />
                          <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 p-3 rounded-lg bg-slate-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            dalam satuan grosir ini silahkan masukkan jumlah satuan dasar. (contoh untuk produk rokok : 1 slop berisi 10 bungkus), berarti di kolom ini isi dengan angka 10.
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Kode Barang (SKU) untuk setiap UOM */}
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label htmlFor={`uom-sku-${index}`} className="text-sm font-medium mb-1 block">Kode Barang (SKU)</label>
                            <div className="flex gap-1">
                                <input
                                id="sku"
                                type="text"
                                value={uomItem.sku}
                                onChange={(e) => handleUomChange(index, e)}
                                className="input flex-1"
                                placeholder="Ketik atau scan barcode"
                                disabled={saveStatus.loading}
                                />
                                <button
                                onClick={() => handleScannerToggle(`uom-sku-${index}`)}
                                type="button"
                                className={`icon-btn rounded-lg mb-px ${isCameraScannerOpen && currentScannerTarget === `uom-sku-${index}` ? 'bg-sky-100 text-sky-600' : 'bg-white'}`}
                                title={isCameraScannerOpen && currentScannerTarget === `uom-sku-${index}` ? "Tutup Scanner" : "Buka Scanner Kamera"}
                                disabled={saveStatus.loading}
                                >
                                <Camera className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                         <button
                            onClick={() => handleGenerateSku(index)}
                            disabled={!formData.name || !uomItem.uomList || uomItem.sku || saveStatus.loading}
                            className="btn btn-ghost btn-sm"
                            >
                            <Sparkles className="w-4 h-4" />
                            Auto
                        </button>
                    </div>
                  </div>
                ))}
                {canAddUom && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleAddUom}
                      className="btn btn-ghost btn-sm"
                      disabled={saveStatus.loading}
                    >
                      <Plus className="w-4 h-4" />
                      Tambah UOM List
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Menampilkan status simpan */}
            {saveStatus.loading && (
              <div className="flex items-center justify-center p-3 text-sm text-sky-600 bg-sky-50 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Menyimpan...</span>
              </div>
            )}
            {saveStatus.error && (
              <div className="p-3 text-sm text-rose-600 bg-rose-50 rounded-lg">
                <span>Error: {saveStatus.error}</span>
              </div>
            )}

            {/* Tampilan Scanner Inline */}
            {isCameraScannerOpen && (
              <div className="pt-2">
                <InlineScanner onScanSuccess={handleScanSuccess} />
              </div>
            )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="btn" disabled={saveStatus.loading}>Batal</button>
          <button onClick={handleSubmit} disabled={!canSubmit} className="btn btn-primary">
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
