import { useState, useEffect } from 'react';
import { X, Save, Camera, Sparkles } from 'lucide-react';
import { useBarcodeScanner } from '../../../../hooks/useBarcodeScanner.js';
import InlineScanner from '../../../../components/cashier/InlineScanner.jsx';

// Komponen Modal untuk menambah barang baru
export default function TambahBarangBaruModal({ isOpen, onClose, existingItems = [] }) {
  const [formData, setFormData] = useState({ name: '', sku: '' });
  const [isCameraScannerOpen, setCameraScannerOpen] = useState(false);
  const [isNameExists, setIsNameExists] = useState(false);

  // Fungsi untuk mereset state saat modal ditutup/dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', sku: '' });
      setCameraScannerOpen(false);
      setIsNameExists(false);
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


  // Fungsi untuk menangani perubahan pada input form
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Fungsi callback yang akan dipanggil saat scanner (fisik/kamera) berhasil memindai
  const handleScanSuccess = (scannedCode) => {
    console.log(`Kode barang berhasil dipindai: ${scannedCode}`);
    setFormData(prev => ({ ...prev, sku: scannedCode }));
    setCameraScannerOpen(false); // Otomatis tutup scanner kamera setelah berhasil
  };

  // Menggunakan custom hook untuk scanner fisik.
  const noOp = () => {}; // Fungsi kosong untuk nonaktifkan listener
  useBarcodeScanner(isOpen ? handleScanSuccess : noOp);

  // Fungsi untuk membuat kode barang otomatis
  const handleGenerateSku = () => {
    console.log("Membuat kode barang otomatis...");
    const nameAcronym = formData.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
    const uniqueSuffix = Date.now().toString().slice(-4);
    const newSku = `${nameAcronym}${uniqueSuffix}`;
    setFormData(prev => ({ ...prev, sku: newSku }));
  };

  const handleSubmit = () => {
    console.log('Formulir tambah barang disubmit dengan data:', formData);
    // Logika untuk menyimpan data akan ditambahkan di sini
    onClose(); // Tutup modal setelah submit
  };
  
  // Jangan render apapun jika modal tidak terbuka
  if (!isOpen) return null;

  const canGenerateSku = formData.name && !formData.sku && !isNameExists;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Tambah Barang Baru</h2>
          <button onClick={onClose} className="icon-btn hover:bg-slate-100"><X className="w-5 h-5"/></button>
        </div>

        {/* Konten/Body Modal */}
        <div className="p-6">
          <div className="space-y-4">
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
              />
              {isNameExists && <p className="text-xs text-rose-600 mt-1">Nama barang ini sudah ada di database.</p>}
            </div>

            {/* Input Kode Barang (SKU) dengan Tombol Scanner */}
            <div>
              <label htmlFor="sku" className="text-sm font-medium mb-1 block">Kode Barang (SKU)</label>
              <div className="relative">
                <input 
                  id="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Ketik atau scan barcode"
                />
                <button
                  onClick={() => setCameraScannerOpen(!isCameraScannerOpen)}
                  type="button"
                  className={`icon-btn absolute right-1 top-1/2 -translate-y-1/2 rounded-lg ${isCameraScannerOpen ? 'bg-sky-100 text-sky-600' : 'bg-white'}`}
                  title={isCameraScannerOpen ? "Tutup Scanner" : "Buka Scanner Kamera"}
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tombol Buat Kode Otomatis */}
            <div className="text-center">
              <button
                onClick={handleGenerateSku}
                disabled={!canGenerateSku}
                className="btn btn-ghost btn-sm"
              >
                <Sparkles className="w-4 h-4" />
                Buat Kode Barang
              </button>
            </div>

            {/* Tampilan Scanner Inline */}
            {isCameraScannerOpen && (
              <div className="pt-2">
                <InlineScanner onScanSuccess={handleScanSuccess} />
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="btn">Batal</button>
          <button onClick={handleSubmit} className="btn btn-primary">
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

