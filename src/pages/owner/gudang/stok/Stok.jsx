import React, { useState, useEffect } from 'react';
import { fetchProductsAndStock } from '../../../../utils/supabaseDb.js';
import { Loader2, Package } from 'lucide-react';
import Header from './Header.jsx'; // Keterangan: Impor komponen Header yang baru

// Komponen utama untuk halaman stok
export default function Stok() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Keterangan: State untuk nilai pencarian

  // Fungsi untuk memuat data produk dan stok
  const loadData = async () => {
    setLoading(true);
    setError(null);
    console.log('// Stok: Memulai pengambilan data produk dan stok.');
    const { data, error: fetchError } = await fetchProductsAndStock();
    if (fetchError) {
      console.error('// Stok: Gagal memuat data stok.', fetchError);
      setError('Gagal memuat data stok.');
    } else {
      console.log('// Stok: Data stok berhasil dimuat.', data);
      // Keterangan: Mengurutkan data berdasarkan nama produk (abjad)
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(sortedData);
    }
    setLoading(false);
  };

  // Memuat data saat komponen pertama kali dirender
  useEffect(() => {
    loadData();
  }, []);

  // Keterangan: Filter produk berdasarkan searchTerm dari awal nama barang
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Keterangan: Tambahkan komponen Header dan teruskan props yang diperlukan */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Konten utama yang menampilkan daftar stok */}
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-slate-500 mt-2">Memuat data stok...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-rose-500">{error}</p>
            <button onClick={loadData} className="btn btn-primary mt-2">Coba Lagi</button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Package className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500">
                  {searchTerm ? 'Produk tidak ditemukan.' : 'Belum ada produk di database.'}
                </p>
              </div>
            ) : (
              // Menampilkan daftar produk yang sudah difilter
              filteredProducts.map((product) => (
                <div key={product.id} className="card flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-800">{product.name}</h4>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-bold text-slate-900">{product.stock}</p>
                     <p className="text-sm text-slate-500">{product.base_unit}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

