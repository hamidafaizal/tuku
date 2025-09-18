import { useState, useEffect } from 'react';
import { Plus, Loader2, Search, Trash2, X } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru.jsx';
import ConfirmationModal from './modals/ConfirmationModal.jsx';
import { fetchProductsWithUom, deleteProduct } from '../../../utils/supabaseDb.js';

export default function DatabaseBarang() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Keterangan: Fungsi untuk mengambil data produk dari Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await fetchProductsWithUom();
    if (error) {
      setError('Gagal memuat data produk.');
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Keterangan: Fungsi untuk menambah produk baru
  const handleSaveNewItem = async (newItemData) => {
    setSaveStatus({ loading: true, error: null });
    // Keterangan: Data dikirim ke modal, tidak disimpan di sini lagi
  };

  const handleAddItem = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setSaveStatus({ loading: false, error: null });
    // Memuat ulang data setelah modal ditutup
    fetchProducts();
  };

  const openDeleteConfirmation = (id) => {
    setItemToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  // Keterangan: Menghapus satu item dari database
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    const { error } = await deleteProduct(itemToDelete);
    if (error) {
      console.error('Gagal menghapus item:', error);
      setError('Gagal menghapus item.');
    } else {
      await fetchProducts();
    }
    setIsConfirmationModalOpen(false);
    setItemToDelete(null);
    setLoading(false);
  };

  const handleSelectItem = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  // Keterangan: Menghapus item yang dipilih secara massal dari database
  const handleDeleteSelectedItems = async () => {
    if (selectedItems.size === 0) return;
    setLoading(true);
    const deletePromises = Array.from(selectedItems).map(id => deleteProduct(id));
    const results = await Promise.all(deletePromises);
    const hasError = results.some(result => result.error);
    if (hasError) {
      console.error('Beberapa item gagal dihapus.');
      setError('Beberapa item gagal dihapus.');
    }
    await fetchProducts();
    setSelectedItems(new Set());
    setIsBulkDeleteMode(false);
    setIsConfirmationModalOpen(false);
    setLoading(false);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredProducts.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = filteredProducts.map(product => product.id);
      setSelectedItems(new Set(allIds));
    }
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const isAllSelected = selectedItems.size === filteredProducts.length && filteredProducts.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-shrink-0 mb-4 sticky top-0 backdrop-blur z-10 py-4 border-b border-slate-200">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {isBulkDeleteMode ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsConfirmationModalOpen(true)}
                disabled={selectedItems.size === 0}
                className="btn btn-danger btn-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus ({selectedItems.size})</span>
              </button>
              <button
                onClick={() => {
                  setIsBulkDeleteMode(false);
                  setSelectedItems(new Set());
                }}
                className="btn btn-sm"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleAddItem} className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4" />
                <span>Barang Baru</span>
              </button>
              <button
                onClick={() => setIsBulkDeleteMode(true)}
                disabled={products.length === 0}
                className="btn btn-danger btn-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Massal</span>
              </button>
            </div>
          )}
        </div>
        <div className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
            placeholder="Cari nama barang..."
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
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

        {!loading && filteredProducts.length > 0 && (
          <>
            {/* Tampilan Tabel untuk Desktop */}
            <div className="hidden md:block card overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    {isBulkDeleteMode && (
                      <th className="w-12">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          className="form-checkbox"
                          title="Pilih Semua"
                        />
                      </th>
                    )}
                    <th className="w-1/4">Nama Barang</th>
                    <th className="w-1/4">Satuan Dasar</th>
                    <th className="w-1/4">SKU</th>
                    <th className="w-1/4">UOM List</th>
                    <th className="w-24 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      {isBulkDeleteMode && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedItems.has(product.id)}
                            onChange={() => handleSelectItem(product.id)}
                            className="form-checkbox"
                          />
                        </td>
                      )}
                      <td>{product.name}</td>
                      <td>{product.base_unit}</td>
                      <td>{product.base_sku}</td>
                      <td>
                        {product.uom && product.uom.length > 0 ? (
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
                      <td className="td-right">
                        {!isBulkDeleteMode && (
                          <button onClick={() => openDeleteConfirmation(product.id)} className="icon-btn text-rose-500 hover:bg-rose-100" title="Hapus Barang">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tampilan Card untuk Mobile */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center justify-end px-2">
                {isBulkDeleteMode && (
                  <label className="flex items-center text-sm font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="form-checkbox mr-2"
                    />
                    Pilih Semua
                  </label>
                )}
              </div>
              {filteredProducts.map((product) => (
                <div key={product.id} className="card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    {isBulkDeleteMode && (
                      <input
                        type="checkbox"
                        checked={selectedItems.has(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                        className="form-checkbox mr-2"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{product.name}</h4>
                      <p className="text-sm text-slate-500">{product.base_unit}</p>
                    </div>
                    {!isBulkDeleteMode && (
                      <button onClick={() => openDeleteConfirmation(product.id)} className="icon-btn text-rose-500 hover:bg-rose-100" title="Hapus Barang">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">SKU:</span>
                    <span>{product.base_sku}</span>
                  </div>
                  {product.uom && product.uom.length > 0 && (
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

        {!loading && filteredProducts.length === 0 && !error && (
          <p className="text-center text-slate-500 py-10">Tidak ada data barang yang ditemukan.</p>
        )}
      </div>

      <TambahBarangBaruModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNewItem} // Fungsi ini sekarang hanya placeholder
        existingItems={products}
        saveStatus={saveStatus}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          setItemToDelete(null);
          if (isBulkDeleteMode) {
            setSelectedItems(new Set());
            setIsBulkDeleteMode(false);
          }
        }}
        onConfirm={itemToDelete ? handleDeleteItem : handleDeleteSelectedItems}
        title={itemToDelete ? "Konfirmasi Hapus Barang" : "Konfirmasi Hapus Barang Massal"}
        message={itemToDelete ?
          `Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat diurungkan.` :
          `Apakah Anda yakin ingin menghapus ${selectedItems.size} barang yang dipilih? Tindakan ini tidak dapat diurungkan.`}
        confirmText={itemToDelete ? "Ya, Hapus" : `Ya, Hapus (${selectedItems.size})`}
      />
    </div>
  );
}
