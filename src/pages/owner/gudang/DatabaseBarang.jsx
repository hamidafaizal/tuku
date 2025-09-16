import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Trash2, X, WifiOff, RefreshCw, LoaderCircle } from 'lucide-react';
import TambahBarangBaruModal from './modals/TambahBarangBaru.jsx';
import ConfirmationModal from './modals/ConfirmationModal.jsx';
// Impor fungsi database lokal (IndexedDB)
import { getAllProducts, addProduct, deleteMultipleProducts, syncLocalProducts, replaceProductWithFinal } from '../../../utils/db.js';
// Impor fungsi database online (Supabase)
import { getSupabaseProducts, upsertSupabaseProducts, deleteMultipleSupabaseProducts } from '../../../utils/supabaseDb.js';
// Impor hook otentikasi
import { useAuth } from '../../../context/AuthContext.jsx';

// Halaman untuk mengelola database barang di gudang dengan logika Local-First
export default function DatabaseBarang() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isBulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { session } = useAuth();

  // Efek untuk memuat data dengan strategi local-first dan memantau status koneksi
  useEffect(() => {
    const loadAndSyncData = async () => {
      setIsLoading(true);
      console.log("Memuat data awal dari IndexedDB.");
      const localProducts = await getAllProducts();
      setItems(localProducts);
      setIsLoading(false);
      console.log("Data lokal berhasil dimuat:", localProducts);
      
      if (navigator.onLine) {
        await syncFromServer();
      }
    };

    loadAndSyncData();

    // Listener untuk status online/offline
    const handleOnline = () => {
      console.log("Koneksi kembali online.");
      setIsOffline(false);
      syncFromServer();
    };
    const handleOffline = () => {
      console.log("Koneksi terputus, masuk mode offline.");
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fungsi untuk sinkronisasi data dari Supabase ke lokal
  const syncFromServer = async () => {
    setIsSyncing(true);
    try {
      console.log("Mencoba sinkronisasi dari Supabase...");
      const supabaseProducts = await getSupabaseProducts();
      await syncLocalProducts(supabaseProducts);
      const freshLocalProducts = await getAllProducts();
      setItems(freshLocalProducts);
      console.log("Sinkronisasi dari server berhasil.");
    } catch (error) {
      console.warn("Gagal sinkronisasi dari server.");
      setIsOffline(true);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Fungsi untuk memfilter barang berdasarkan pencarian dan mengurutkannya
  const filteredItems = useMemo(() => {
    console.log("Memfilter dan mengurutkan data...");
    return items
      .filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, searchTerm]);

  // Handler untuk menyimpan barang baru (Local-first)
  const handleSaveNewItem = async (newItemData) => {
    if (!session) {
      alert("Sesi tidak ditemukan. Silakan login kembali.");
      return;
    }

    const tempId = -Date.now();
    const newItem = { ...newItemData, id: tempId, user_id: session.user.id };
    console.log("Menyimpan item baru ke lokal dengan ID sementara:", newItem);
    
    await addProduct(newItem);
    setItems(prevItems => [...prevItems, newItem]);
    setModalOpen(false);
    
    if (!isOffline) {
      try {
        const { id, ...productToSave } = newItem;
        const [savedProduct] = await upsertSupabaseProducts([productToSave]);
        await replaceProductWithFinal(tempId, savedProduct);
        setItems(prevItems => prevItems.map(item => item.id === tempId ? savedProduct : item));
        console.log("Sinkronisasi item baru ke Supabase berhasil.");
      } catch (error) {
        console.error("Gagal sinkronisasi item baru:", error);
        // Di sini bisa ditambahkan logika antrian
      }
    }
  };
  
  // Handler untuk konfirmasi dan eksekusi penghapusan (Local-first)
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const itemsToDelete = Array.isArray(itemToDelete) ? itemToDelete : [itemToDelete];
    const idsToDelete = itemsToDelete.map(i => i.id);
    
    await deleteMultipleProducts(idsToDelete);
    setItems(prevItems => prevItems.filter(item => !idsToDelete.includes(item.id)));
    console.log("Item dihapus dari lokal:", idsToDelete);
    
    setConfirmOpen(false);
    setItemToDelete(null);
    setBulkDeleteMode(false);
    setSelectedItems([]);
    
    if (!isOffline) {
      try {
        await deleteMultipleSupabaseProducts(idsToDelete);
        console.log("Sinkronisasi hapus item ke Supabase berhasil.");
      } catch (error) {
        console.error("Gagal sinkronisasi hapus item:", error);
        // Di sini bisa ditambahkan logika antrian
      }
    }
  };
  
  // Sisa handler (handleAddItem, handleDeleteClick, dll) tidak berubah
  const handleAddItem = () => setModalOpen(true);
  const handleDeleteClick = (item) => { setItemToDelete(item); setConfirmOpen(true); };
  const handleSelectItem = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleSelectAll = () => setSelectedItems(selectedItems.length === filteredItems.length && filteredItems.length > 0 ? [] : filteredItems.map(i => i.id));
  const handleBulkDeleteClick = () => {
    const toDelete = items.filter(item => selectedItems.includes(item.id));
    setItemToDelete(toDelete);
    setConfirmOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <div className="flex-shrink-0">
          {isBulkDeleteMode ? (
            <div className="sticky top-14 bg-white/80 backdrop-blur py-2 z-10 flex justify-between items-center gap-4 p-2 rounded-xl shadow-md border">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500" checked={selectedItems.length === filteredItems.length && filteredItems.length > 0} onChange={handleSelectAll} />
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
                <button onClick={() => setBulkDeleteMode(true)} className="btn btn-secondary" disabled={items.length === 0}>
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

          {/* Notifikasi Offline/Syncing dinonaktifkan */}
          {/* <div className={`mt-4 border-l-4 p-4 rounded-r-lg flex items-center gap-3 ${isOffline ? 'bg-amber-50 border-amber-400' : 'bg-sky-50 border-sky-400'}`}>
            {isSyncing ? <LoaderCircle className="w-5 h-5 text-sky-600 animate-spin" /> : <WifiOff className="w-5 h-5 text-amber-600" />}
            <div>
              <p className={`font-bold ${isOffline ? 'text-amber-800' : 'text-sky-800'}`}>{isSyncing ? 'Sinkronisasi...' : 'Anda sedang offline'}</p>
              <p className={`text-sm ${isOffline ? 'text-amber-700' : 'text-sky-700'}`}>{isSyncing ? 'Memperbarui data dari server.' : 'Perubahan akan di-backup saat kembali online.'}</p>
            </div>
            {isOffline && (
              <button onClick={syncFromServer} className="btn btn-sm ml-auto">
                <RefreshCw className="w-4 h-4"/> Coba Lagi
              </button>
            )}
          </div> */}

          {/* Area Pencarian */}
          <div className="relative mt-4">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" placeholder="Cari nama atau kode barang..." />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Daftar Barang (Area scroll) */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-3 scrollbar">
          {isLoading ? (
            <p className="text-center text-slate-500 py-10">Memuat data...</p>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div key={item.id} className={`card flex items-center gap-4 ${item.id < 0 ? 'opacity-70' : ''}`}>
                    {isBulkDeleteMode && <input type="checkbox" className="h-5 w-5" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} />}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">SKU: {item.sku}</p>
                    </div>
                    {!isBulkDeleteMode && <button className="icon-btn hover:bg-slate-100 text-rose-500" onClick={() => handleDeleteClick(item)}><Trash2 className="w-5 h-5" /></button>}
                  </div>
                ))
              ) : (
                <div className="text-center py-10"><p className="text-slate-500">Tidak ada barang yang ditemukan.</p></div>
              )}
            </>
          )}
        </div>
      </div>

      <TambahBarangBaruModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveNewItem} existingItems={items} />
      <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Konfirmasi Hapus" message={`Apakah Anda yakin ingin menghapus ${Array.isArray(itemToDelete) ? itemToDelete.length + ' barang' : 'barang ini'}?`} confirmText="Ya, Hapus" />
    </>
  );
}
