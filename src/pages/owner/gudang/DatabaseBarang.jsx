import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru';
import ConfirmationModal from './modals/ConfirmationModal';

// Halaman untuk mengelola database barang di gudang
export default function DatabaseBarang() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false); // State untuk mode hapus masal

  // State untuk modal konfirmasi
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    item: null,
    action: null,
  });

  const [items, setItems] = useState([
    { id: 1, name: 'Kopi Susu Gula Aren', sku: 'KSGA' },
    { id: 2, name: 'Croissant Cokelat', sku: 'CRCK' },
    { id: 3, name: 'Air Mineral 600ml', sku: 'AM600' },
    { id: 4, name: 'Americano', sku: 'AMER' },
    { id: 5, name: 'Teh Melati', sku: 'TMEL' },
  ]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const lowercasedTerm = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercasedTerm) ||
        item.sku.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, items]);

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const areAllFilteredSelected = useMemo(() => {
    if (filteredItems.length === 0) return false;
    return filteredItems.every((item) => selectedItems.includes(item.id));
  }, [filteredItems, selectedItems]);

  const handleSelectAll = () => {
    const filteredIds = filteredItems.map((item) => item.id);
    if (areAllFilteredSelected) {
      setSelectedItems((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };
  
  // Fungsi untuk mengaktifkan mode hapus masal
  const handleEnableBulkDelete = () => {
    console.log('Mode hapus masal diaktifkan.');
    setIsBulkDeleteMode(true);
  };

  // Fungsi untuk membatalkan mode hapus masal
  const handleCancelBulkDelete = () => {
    console.log('Mode hapus masal dibatalkan.');
    setIsBulkDeleteMode(false);
    setSelectedItems([]); // Reset item terpilih saat batal
  };


  const handleAddItem = () => setModalOpen(true);

  const handleDeleteClick = (item, e) => {
    e.stopPropagation();
    console.log(`Membuka konfirmasi hapus untuk: ${item.name}`);
    setConfirmModalState({ isOpen: true, item, action: 'delete' });
  };
  
  const handleBulkDeleteClick = () => {
    console.log(`Membuka konfirmasi hapus masal untuk ${selectedItems.length} item.`);
    setConfirmModalState({ isOpen: true, item: null, action: 'bulk-delete' });
  };
  
  const handleCloseConfirmModal = () => {
    setConfirmModalState({ isOpen: false, item: null, action: null });
  };

  const handleConfirmAction = () => {
    const { item, action } = confirmModalState;
    console.log(`Aksi "${action}" dikonfirmasi.`);
    
    if (action === 'delete' && item) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
    
    if (action === 'bulk-delete') {
      setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
      setSelectedItems([]);
      setIsBulkDeleteMode(false); // Keluar dari mode hapus masal setelah selesai
    }
    
    handleCloseConfirmModal();
  };
  
  const getConfirmMessage = () => {
    const { action, item } = confirmModalState;
    if (action === 'delete') return `Apakah Anda yakin ingin menghapus "${item?.name}"?`;
    if (action === 'bulk-delete') return `Apakah Anda yakin ingin menghapus ${selectedItems.length} barang yang dipilih?`;
    return 'Apakah Anda yakin?';
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Halaman */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-xl font-bold">Data Barang</h2>
          <div className="flex gap-2">
             {!isBulkDeleteMode && (
                <button onClick={handleEnableBulkDelete} className="btn btn-secondary">
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Masal</span>
                </button>
             )}
            <button onClick={handleAddItem} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              <span>Barang Baru</span>
            </button>
          </div>
        </div>
        
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
        
        {/* Toolbar Aksi Massal (hanya muncul di mode hapus masal) */}
        {isBulkDeleteMode && (
            <div className="h-10 flex items-center justify-between px-1 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox"
                        id="select-all"
                        className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        checked={areAllFilteredSelected}
                        onChange={handleSelectAll}
                        disabled={filteredItems.length === 0}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium text-slate-700 select-none">
                        Pilih Semua
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    {selectedItems.length > 0 && (
                        <button onClick={handleBulkDeleteClick} className="btn btn-danger btn-sm">
                            <Trash2 className="w-4 h-4" />
                            Hapus ({selectedItems.length})
                        </button>
                    )}
                    <button onClick={handleCancelBulkDelete} className="btn btn-sm">
                        <X className="w-4 h-4" />
                        Batal
                    </button>
                </div>
            </div>
        )}
        
        {/* Daftar Barang */}
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={isBulkDeleteMode ? () => handleSelectItem(item.id) : undefined} 
              className={`card flex items-center gap-4 transition-colors ${isBulkDeleteMode ? 'cursor-pointer' : ''} ${selectedItems.includes(item.id) ? 'bg-sky-50 ring-2 ring-sky-200' : 'hover:bg-slate-50'}`}
            >
              {isBulkDeleteMode && (
                <input 
                  type="checkbox"
                  className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 pointer-events-none"
                  checked={selectedItems.includes(item.id)}
                  readOnly
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">SKU: {item.sku}</p>
              </div>
              {!isBulkDeleteMode && (
                <div className="flex items-center">
                    <button 
                      onClick={(e) => handleDeleteClick(item, e)}
                      className="icon-btn hover:bg-rose-50" 
                      title={`Hapus ${item.name}`}
                    >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                </div>
              )}
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500">Barang tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
      
      <TambahBarangBaruModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        existingItems={items}
      />

      <ConfirmationModal
        isOpen={confirmModalState.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAction}
        title="Konfirmasi Hapus"
        message={getConfirmMessage()}
        confirmText="Ya, Hapus"
      />
    </>
  );
}

