import { useState, useMemo, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { fetchProductsAndStock } from '../../../utils/supabaseDb.js';

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keterangan: Fungsi untuk memuat data produk dan stok dari database
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchProductsAndStock();
    if (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Memfilter dan mengurutkan produk berdasarkan searchTerm dan nama (A-Z)
  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }
    return products
      .filter(product =>
        product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Daftar Produk</h3>
      </div>
      
      {/* Area Pencarian */}
      <div className="relative">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="input pl-10" 
          placeholder="Cari nama barang..." 
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>Memuat data...</span>
        </div>
      )}

      {error && (
        <div className="p-4 mt-4 text-sm text-rose-600 bg-rose-50 rounded-lg">
          <span>Error: {error}</span>
        </div>
      )}

      {/* Tabel Daftar Produk */}
      {!loading && !error && (
        <div className="card overflow-x-auto">
          {filteredProducts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th className="w-3/5">Nama Barang</th>
                  <th className="w-2/5 td-right">Stok</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td className="td-right">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">Tidak ada produk yang ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
