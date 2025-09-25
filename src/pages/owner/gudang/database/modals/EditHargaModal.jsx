import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { updateHargaJual } from '../../../../../utils/supabaseDb.js';

// Keterangan: Komponen modal untuk mengedit harga jual
export default function EditHargaModal({ isOpen, onClose, product, onSaveSuccess }) {
  const [prices, setPrices] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Keterangan: Inisialisasi state harga saat produk berubah
  useEffect(() => {
    if (product) {
      const initialPrices = {};
      // Ambil harga dasar
      const basePriceEntry = product.prices.find(p => p.uom_id === null);
      initialPrices[product.base_sku] = basePriceEntry ? basePriceEntry.selling_price : 0;

      // Ambil harga UOM
      product.uom.forEach(uomItem => {
        const uomPriceEntry = product.prices.find(p => p.uom_id === uomItem.id);
        initialPrices[uomItem.uom_sku] = uomPriceEntry ? uomPriceEntry.selling_price : 0;
      });
      setPrices(initialPrices);
      console.log('// Edit Harga: Inisialisasi harga untuk', product.name, initialPrices);
    }
  }, [product]);

  // Keterangan: Handler untuk mengubah nilai input harga
  const handlePriceChange = (sku, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPrices(prev => ({ ...prev, [sku]: Number(numericValue) }));
  };

  // Keterangan: Handler untuk menyimpan perubahan harga
  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    // Keterangan: Menyiapkan data untuk dikirim ke Supabase
    const basePrice = prices[product.base_sku] || 0;
    const uomUpdates = product.uom.map(uomItem => {
      const priceEntry = product.prices.find(p => p.uom_id === uomItem.id);
      return {
        id: priceEntry.id, // ID dari tabel prices
        harga: prices[uomItem.uom_sku] || 0,
      };
    });

    const updates = {
      productId: product.id,
      basePrice,
      uomUpdates,
    };
    
    console.log("// Edit Harga: Mengirim pembaruan:", updates);
    const { success, error: updateError } = await updateHargaJual(updates);

    if (updateError) {
      setError(updateError.message);
      console.error("// Edit Harga: Gagal memperbarui harga.", updateError);
    } else {
      console.log("// Edit Harga: Harga berhasil diperbarui.");
      onSaveSuccess();
    }

    setIsSaving(false);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Edit Harga Jual</h2>
          <button onClick={onClose} className="icon-btn hover:bg-slate-100"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <h3 className="font-semibold text-center">{product.name}</h3>
            {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg text-center">{error}</p>}
            
            {/* Input Harga Dasar */}
            <div>
              <label className="text-sm font-medium mb-1 block">Harga Jual {product.base_unit} <span className="text-slate-400">(SKU: {product.base_sku})</span></label>
              <input
                type="text"
                inputMode="numeric"
                className="input"
                value={prices[product.base_sku]?.toLocaleString('id-ID') || ''}
                onChange={(e) => handlePriceChange(product.base_sku, e.target.value)}
              />
            </div>

            {/* Input Harga UOM */}
            {product.uom.map(uomItem => (
                 <div key={uomItem.id}>
                    <label className="text-sm font-medium mb-1 block">Harga Jual {uomItem.uom_name} <span className="text-slate-400">(SKU: {uomItem.uom_sku})</span></label>
                    <input
                        type="text"
                        inputMode="numeric"
                        className="input"
                        value={prices[uomItem.uom_sku]?.toLocaleString('id-ID') || ''}
                        onChange={(e) => handlePriceChange(uomItem.uom_sku, e.target.value)}
                    />
                </div>
            ))}
        </div>
        <div className="p-4 bg-slate-50 border-t">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary w-full"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

