import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru.jsx';
import ConfirmationModal from './modals/ConfirmationModal.jsx';
import { getAllProducts, addProduct, deleteProduct, deleteMultipleProducts } from '../../../utils/db.js';

// Halaman untuk mengelola database barang di gudang
export default function DatabaseBarang() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isBulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Mengambil data dari IndexedDB saat komponen dimuat
  useEffect(() => {
    async function fetchProducts() {
      console.log("Mencoba mengambil produk dari IndexedDB.");
      const products = await getAllProducts();
      setItems(products);
      console.log("Produk berhasil diambil:", products);
    }
    fetchProducts();
  }, []);

  // Fungsi untuk memfilter barang berdasarkan pencarian
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // Handler untuk membuka modal tambah barang
  const handleAddItem = () => {
    console.log("Tombol 'Barang Baru' diklik.");
    setModalOpen(true);
  };

  // Handler untuk menyimpan barang baru
  const handleSaveNewItem = async (newItem) => {
    console.log("Menyimpan barang baru:", newItem);
    await addProduct(newItem);
    const updatedItems = await getAllProducts(); // Ambil data terbaru
    setItems(updatedItems);
    setModalOpen(false);
  };
  
  // Handler untuk membuka konfirmasi hapus
  const handleDeleteClick = (item) => {
    console.log("Membuka konfirmasi untuk menghapus item:", item);
    setItemToDelete(item);
    setConfirmOpen(true);
  };
  
  // Handler untuk konfirmasi dan eksekusi penghapusan
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      console.log("Menghapus item:", itemToDelete);
      if (Array.isArray(itemToDelete)) { // Hapus masal
        await deleteMultipleProducts(itemToDelete.map(i => i.id));
      } else { // Hapus tunggal
        await deleteProduct(itemToDelete.id);
      }
      const updatedItems = await getAllProducts();
      setItems(updatedItems);
      console.log("Item berhasil dihapus, daftar diperbarui.");
    }
    setConfirmOpen(false);
    setItemToDelete(null);
    setBulkDeleteMode(false);
    setSelectedItems([]);
  };

  // Handler untuk mengelola item yang dipilih (checklist)
  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Handler untuk memilih semua item
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  // Handler untuk membuka konfirmasi hapus masal
  const handleBulkDeleteClick = () => {
    const itemsToDelete = items.filter(item => selectedItems.includes(item.id));
    console.log("Membuka konfirmasi hapus masal untuk item:", itemsToDelete);
    setItemToDelete(itemsToDelete);
    setConfirmOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Halaman & Toolbar Aksi Hapus Masal */}
        {isBulkDeleteMode ? (
          <div className="sticky top-14 bg-white/80 backdrop-blur py-2 z-10 flex justify-between items-center gap-4 p-2 rounded-xl shadow-md border">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={handleSelectAll}
                aria-label="Pilih semua"
              />
              <span className="font-semibold">{selectedItems.length} dipilih</span>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={handleBulkDeleteClick} className="btn btn-danger btn-sm" disabled={selectedItems.length === 0}>
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
              <button onClick={() => setBulkDeleteMode(false)} className="icon-btn hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-bold">Data Barang</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setBulkDeleteMode(true)} className="btn btn-secondary">
                <Trash2 className="w-4 h-4" />
                <span>Hapus Masal</span>
              </button>
              <button onClick={handleAddItem} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                <span>Barang Baru</span>
              </button>
            </div>
          </div>
        )}

        {/* Area Pencarian */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
            placeholder="Cari nama atau kode barang..."
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Daftar Barang */}
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="card flex items-center gap-4">
                {isBulkDeleteMode && (
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">SKU: {item.sku}</p>
                </div>
                {!isBulkDeleteMode && (
                  <button className="icon-btn hover:bg-slate-100 text-rose-500" onClick={() => handleDeleteClick(item)}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">Tidak ada barang yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tambah Barang Baru */}
      <TambahBarangBaruModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNewItem}
        existingItems={items}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus ${Array.isArray(itemToDelete) ? itemToDelete.length + ' barang' : 'barang ini'}? Proses ini tidak dapat diurungkan.`}
        confirmText="Ya, Hapus"
      />
    </>
  );
}

