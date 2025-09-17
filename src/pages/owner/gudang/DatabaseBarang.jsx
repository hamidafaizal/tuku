import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { upsertProduct, fetchProducts } from '../../../utils/supabaseDb.js';
import ConfirmationModal from './modals/ConfirmationModal.jsx';

export default function DatabaseBarang() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useAuth();
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });

  // Fungsi untuk memuat data dari Supabase
  const loadProducts = async () => {
    if (!session) return;

    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await fetchProducts(session.user.id);
      setProducts(fetchedProducts);
      console.log('Data produk dimuat ke state:', fetchedProducts);
    } catch (err) {
      console.error('Gagal memuat produk:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Memuat data saat komponen pertama kali dirender
  useEffect(() => {
    loadProducts();
  }, [session]); // Jalankan lagi saat sesi berubah

  const handleSaveNewItem = async (newItemData) => {
    if (!session) {
      setError('User not authenticated.');
      return;
    }
    setSaveStatus({ loading: true, error: null });
    try {
      await upsertProduct(newItemData, session.user.id);
      console.log('Produk berhasil disimpan, memuat ulang data...');
      await loadProducts(); // Memuat ulang data setelah penyimpanan berhasil
      setModalOpen(false);
      setSaveStatus({ loading: false, error: null });
    } catch (err) {
      console.error('Gagal menyimpan produk:', err.message);
      setSaveStatus({ loading: false, error: err.message });
    }
  };

  const handleAddItem = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setSaveStatus({ loading: false, error: null });
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-bold">Data Barang</h2>
        <button onClick={handleAddItem} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          <span>Barang Baru</span>
        </button>
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

      {!loading && products.length > 0 && (
        <>
          {/* Tampilan Tabel untuk Desktop */}
          <div className="hidden md:block card mt-4 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-1/4">Nama Barang</th>
                  <th className="w-1/4">Satuan Dasar</th>
                  <th className="w-1/4">SKU</th>
                  <th className="w-1/4">UOM List</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.unit}</td>
                    <td>{product.sku}</td>
                    <td>
                      {product.uom ? (
                        <ul className="list-disc list-inside">
                          {product.uom.map((item, i) => (
                            <li key={i}>
                              {item.uomList} ({item.uomQuantity})<br />
                              <span className="text-xs text-slate-400">SKU: {item.sku}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tampilan Card untuk Mobile */}
          <div className="md:hidden space-y-4 mt-4">
            {products.map((product) => (
              <div key={product.id} className="card p-4 space-y-2">
                <div>
                  <h4 className="font-bold text-lg">{product.name}</h4>
                  <p className="text-sm text-slate-500">{product.unit}</p>
                </div>
                <div className="divider" />
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-600">SKU:</span>
                  <span>{product.sku}</span>
                </div>
                {product.uom && (
                  <>
                    <div className="divider" />
                    <div className="space-y-2">
                      <p className="font-semibold text-slate-600 text-sm">UOM List:</p>
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        {product.uom.map((item, i) => (
                          <li key={i} className="text-sm">
                            {item.uomList} ({item.uomQuantity})<br />
                            <span className="text-xs text-slate-400">SKU: {item.sku}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {!loading && products.length === 0 && !error && (
        <p className="text-center text-slate-500 py-10">Belum ada data barang.</p>
      )}

      <TambahBarangBaruModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNewItem}
        existingItems={products}
        saveStatus={saveStatus}
      />
    </>
  );
}
