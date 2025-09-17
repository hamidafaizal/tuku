import { useState, useEffect } from 'react';
import { Plus, Loader2, Search, Trash2, ListFilter, CheckSquare, X } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
// Keterangan: Mengimpor fungsi deleteProducts yang baru
import { upsertProduct, fetchProducts, deleteProducts } from '../../../utils/supabaseDb.js';
import ConfirmationModal from './modals/ConfirmationModal.jsx';

export default function DatabaseBarang() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useAuth();
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });
  const [searchTerm, setSearchTerm] = useState('');
  // Keterangan: State baru untuk mengelola mode hapus massal dan item yang dipilih
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  // Keterangan: State baru untuk menyimpan ID item yang akan dihapus satu per satu
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleSaveNewItem = async (newItemData, isUomListEnabled) => {
    console.log("Menyimpan item baru, isUomListEnabled:", isUomListEnabled);
    if (!session) {
      setError('User not authenticated.');
      return;
    }
    setSaveStatus({ loading: true, error: null });
    
    const isNameExists = products.some(product => product.name.toLowerCase() === newItemData.name.toLowerCase());
    const isBaseSkuExists = products.some(product => product.sku.toLowerCase() === newItemData.sku.toLowerCase());

    const allExistingSkus = new Set(products.map(item => item.sku.toLowerCase()));
    products.forEach(item => {
      if (item.uom) {
        item.uom.forEach(uomItem => allExistingSkus.add(uomItem.sku.toLowerCase()));
      }
    });

    const isSkuExistsInAnywhere = allExistingSkus.has(newItemData.sku.toLowerCase());
    if (isSkuExistsInAnywhere) {
        setSaveStatus({ loading: false, error: `SKU utama "${newItemData.sku}" sudah ada di database.` });
        return;
    }

    const duplicatedUomSkus = [];
    if (isUomListEnabled) {
      newItemData.uom.forEach(uomItem => {
        if (allExistingSkus.has(uomItem.sku.toLowerCase())) {
          duplicatedUomSkus.push(uomItem.sku);
        }
      });
    }

    if (isNameExists || duplicatedUomSkus.length > 0) {
      let errorMessage = 'Gagal menyimpan. ';
      if (isNameExists) {
        errorMessage += `Nama barang "${newItemData.name}" sudah ada. `;
      }
      if (duplicatedUomSkus.length > 0) {
        errorMessage += `SKU UOM list berikut sudah ada: ${duplicatedUomSkus.join(', ')}.`;
      }
      setSaveStatus({ loading: false, error: errorMessage });
      console.log(errorMessage);
      return;
    }

    try {
      await upsertProduct(newItemData, session.user.id, isUomListEnabled);
      console.log('Produk berhasil disimpan, memuat ulang data...');
      await loadProducts();
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
  
  // Keterangan: Fungsi baru untuk mengelola pembukaan konfirmasi modal untuk satu item
  const openDeleteConfirmation = (id) => {
    setItemToDelete(id);
    setIsConfirmationModalOpen(true);
    console.log(`Membuka konfirmasi hapus untuk item ID: ${id}`);
  };

  // Keterangan: Fungsi untuk menghapus satu item, dipanggil setelah konfirmasi
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    console.log(`Mencoba menghapus item dengan ID: ${itemToDelete}`);
    if (!session) return;
    setSaveStatus({ loading: true, error: null });
    try {
      await deleteProducts([itemToDelete], session.user.id);
      console.log(`Item dengan ID ${itemToDelete} berhasil dihapus.`);
      await loadProducts();
    } catch (err) {
      console.error('Gagal menghapus item:', err.message);
      setSaveStatus({ loading: false, error: err.message });
    } finally {
      setSaveStatus({ loading: false, error: null });
      setIsConfirmationModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Keterangan: Fungsi untuk mengelola item yang dipilih untuk hapus massal
  const handleSelectItem = (id) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
    console.log('Item yang dipilih:', newSelectedItems);
  };
  
  // Keterangan: Fungsi untuk menghapus item yang dipilih
  const handleDeleteSelectedItems = async () => {
    console.log('Mencoba menghapus item yang dipilih:', selectedItems);
    if (selectedItems.size === 0) return;
    if (!session) return;
    setSaveStatus({ loading: true, error: null });

    const selectedIds = Array.from(selectedItems);

    try {
      await deleteProducts(selectedIds, session.user.id);
      console.log('Item yang dipilih berhasil dihapus.');
      setSelectedItems(new Set());
      setIsBulkDeleteMode(false);
      await loadProducts();
    } catch (err) {
      console.error('Gagal menghapus item yang dipilih:', err.message);
      setSaveStatus({ loading: false, error: err.message });
    } finally {
      setSaveStatus({ loading: false, error: null });
      setIsConfirmationModalOpen(false);
      setItemToDelete(null);
    }
  };
  
  // Keterangan: Fungsi baru untuk memilih/membatalkan pilihan semua item
  const handleSelectAll = () => {
    if (selectedItems.size === filteredProducts.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = filteredProducts.map(product => product.id);
      setSelectedItems(new Set(allIds));
    }
    console.log(`Select All di-toggle. Jumlah item dipilih: ${filteredProducts.length}`);
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
                // Keterangan: Mengubah ukuran tombol Hapus menjadi btn-sm
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
                // Keterangan: Mengubah ukuran tombol Batal menjadi btn-sm
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
                // Keterangan: Mengubah ukuran tombol Hapus Massal menjadi btn-sm
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
                      <td className="td-right">
                        {!isBulkDeleteMode && (
                          // Keterangan: Mengubah onClick untuk memanggil fungsi konfirmasi
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
                      <p className="text-sm text-slate-500">{product.unit}</p>
                    </div>
                    {!isBulkDeleteMode && (
                      // Keterangan: Mengubah onClick untuk memanggil fungsi konfirmasi
                      <button onClick={() => openDeleteConfirmation(product.id)} className="icon-btn text-rose-500 hover:bg-rose-100" title="Hapus Barang">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
        
        {!loading && filteredProducts.length === 0 && !error && (
          <p className="text-center text-slate-500 py-10">Tidak ada data barang yang ditemukan.</p>
        )}
      </div>

      <TambahBarangBaruModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNewItem}
        existingItems={products}
        saveStatus={saveStatus}
      />

      {/* Keterangan: Mengubah props ConfirmationModal untuk menangani hapus satu item */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          // Keterangan: Mereset itemToDelete dan selectedItems saat menutup modal
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
