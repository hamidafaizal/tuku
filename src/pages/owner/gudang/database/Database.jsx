import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import TambahBarangBaru from './TambahBarangBaru.jsx';
import { supabase } from '/supabaseClient.js';
import { Loader2 } from 'lucide-react';

export default function Database() {
  const [showTambahBarang, setShowTambahBarang] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keterangan: Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    // Keterangan: Fungsi untuk mengambil data produk, UOM, dan harga dari Supabase
    const fetchProducts = async () => {
      console.log('// Database: Memuat data produk, UOM, dan harga dari Supabase.');
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          base_unit,
          base_sku,
          prices(sku, selling_price, uom_id),
          uom(id, uom_name, uom_sku)
        `);

      if (fetchError) {
        console.error('// Database: Gagal memuat data produk.', fetchError);
        setError(fetchError.message);
      } else {
        console.log('// Database: Data produk berhasil dimuat.', data);
        setProducts(data);
        // Menambahkan console.log untuk memeriksa apakah data produk kosong atau tidak
        if (data && data.length === 0) {
          console.log('// Database: Data produk yang diterima kosong.');
        } else {
          console.log('// Database: Data produk yang diterima tidak kosong.');
        }
      }
      setLoading(false);
    };

    if (!showTambahBarang) {
      fetchProducts();
    }
  }, [showTambahBarang]);

  const handleAddClick = () => {
    setShowTambahBarang(true);
    console.log('// Database: Mengaktifkan mode tambah barang.');
  };

  const handleBack = () => {
    setShowTambahBarang(false);
    console.log('// Database: Kembali ke halaman utama database.');
  };

  if (showTambahBarang) {
    return <TambahBarangBaru onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col h-full">
      <Header onAddClick={handleAddClick} />
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-slate-500 mt-2">Memuat data produk...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center p-4">
            <p className="text-rose-500">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="flex items-center justify-center p-4">
                <p className="text-slate-500">Tidak ada produk yang ditemukan.</p>
              </div>
            ) : (
              products.map((product) => {
                const basePrice = product.prices?.find(p => p.uom_id === null);
                return (
                  <div key={product.id} className="card p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm muted">SKU Dasar: {product.base_sku}</p>
                    <p className="text-sm muted">Satuan Dasar: {product.base_unit}</p>
                    <p className="text-sm muted">Harga Jual: {formatCurrency(basePrice?.selling_price || 0)}</p>

                    {product.uom && product.uom.length > 0 && (
                      <div className="mt-4 text-sm">
                        <span className="font-medium text-slate-700">Satuan UOM:</span>
                        <ul className="space-y-2 mt-2">
                          {product.uom.map((uomItem) => {
                            const uomPrice = product.prices?.find(p => p.uom_id === uomItem.id);
                            return (
                              <li key={uomItem.id} className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-semibold">{uomItem.uom_name}</p>
                                <p className="text-sm muted">SKU: {uomItem.uom_sku}</p>
                                <p className="text-sm muted">Harga Jual: {formatCurrency(uomPrice?.selling_price || 0)}</p>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
