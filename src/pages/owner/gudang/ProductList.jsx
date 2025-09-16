import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

// Data produk dummy untuk simulasi
const dummyProducts = [
  { id: 1, name: 'Kopi Susu Gula Aren', stock: 50 },
  { id: 2, name: 'Croissant Cokelat', stock: 25 },
  { id: 3, name: 'Air Mineral 600ml', stock: 100 },
  { id: 4, name: 'Americano', stock: 30 },
  { id: 5, name: 'Teh Melati', stock: 75 },
  { id: 6, name: 'Latte', stock: 40 },
  { id: 7, name: 'Donat Gula', stock: 60 },
  { id: 8, name: 'Roti Bakar Keju', stock: 20 },
  { id: 9, name: 'Espresso', stock: 15 },
  { id: 10, name: 'Jus Jeruk', stock: 90 },
];

// Halaman untuk menampilkan daftar produk di dalam menu Gudang
export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  console.log('Rendering halaman ProductList');

  // Memfilter produk berdasarkan searchTerm
  const filteredProducts = useMemo(() => {
    return dummyProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

      {/* Tabel Daftar Produk */}
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
    </div>
  );
}
