import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import TambahBarangBaru from './TambahBarangBaru.jsx';
import { supabase } from '/supabaseClient.js';
import { Loader2 } from 'lucide-react';

// Halaman utama untuk membungkus konten menu Database.
export default function Database() {
  const [showTambahBarang, setShowTambahBarang] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Keterangan: Fungsi untuk mengambil data produk dari Supabase
    const fetchProducts = async () => {
      console.log('// Database: Memuat data produk dari Supabase.');
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          base_unit,
          base_sku,
          uom(id, uom_name)
        `);

      if (fetchError) {
        console.error('// Database: Gagal memuat data produk.', fetchError);
        setError(fetchError.message);
      } else {
        console.log('// Database: Data produk berhasil dimuat.', data);
        setProducts(data);
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

  // Keterangan: Render tampilan yang berbeda berdasarkan state
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
              products.map((product) => (
                <div key={product.id} className="card p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm muted">SKU: {product.base_sku}</p>
                  <p className="text-sm muted">Satuan Dasar: {product.base_unit}</p>
                  {product.uom && product.uom.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">UOM:</span>
                      <ul className="list-disc list-inside">
                        {product.uom.map((uomItem) => (
                          <li key={uomItem.id}>{uomItem.uom_name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
