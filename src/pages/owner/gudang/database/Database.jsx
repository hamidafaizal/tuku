import React, { useState, useEffect } from 'react';
import Header from '/src/pages/owner/gudang/database/Header.jsx';
import TambahBarangBaru from '/src/pages/owner/gudang/database/TambahBarangBaru.jsx';
import { supabase } from '/supabaseClient.js';
import { Loader2, Trash2, Pencil } from 'lucide-react'; // Keterangan: Menambahkan ikon pensil
import ConfirmationModal from '/src/components/modals/ConfirmationModal.jsx';
import { deleteProduct } from '/src/utils/supabaseDb.js';
import EditHargaModal from './modals/EditHargaModal.jsx'; // Keterangan: Impor modal edit harga

export default function Database() {
  const [showTambahBarang, setShowTambahBarang] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk modal konfirmasi hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State untuk modal edit harga
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);


  // Keterangan: Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };
  
  // Keterangan: Fungsi untuk mengambil data produk
  const fetchProducts = async () => {
    console.log('// Database: Memuat data produk, UOM, dan harga dari Supabase.');
    setLoading(true);
    
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        base_unit,
        base_sku,
        prices(id, sku, selling_price, uom_id),
        uom(id, uom_name, uom_sku)
      `)
      .order('name', { ascending: true });
    
    if (searchTerm) {
      query = query.filter('name', 'ilike', `%${searchTerm}%`);
    }

    const { data, error: fetchError } = await query;
    
    if (fetchError) {
      console.error('// Database: Gagal memuat data produk.', fetchError);
      setError(fetchError.message);
    } else {
      console.log('// Database: Data produk berhasil dimuat.', data);
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!showTambahBarang) {
      fetchProducts();
    }
  }, [showTambahBarang, searchTerm]);

  const handleAddClick = () => setShowTambahBarang(true);
  const handleBack = () => setShowTambahBarang(false);

  // Keterangan: Fungsi saat tombol hapus di klik
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
    console.log(`// Database: Membuka konfirmasi hapus untuk produk: ${product.name}`);
  };

  // Keterangan: Fungsi untuk konfirmasi penghapusan
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    const { error: deleteError } = await deleteProduct(productToDelete.id);
    
    if (deleteError) {
      setError(`Gagal menghapus produk: ${deleteError.message}`);
    } else {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
    }
    
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };
  
  // Keterangan: Fungsi saat tombol edit diklik
  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
    console.log(`// Database: Membuka modal edit harga untuk: ${product.name}`);
  };

  // Keterangan: Fungsi yang dipanggil setelah harga berhasil disimpan
  const handleSaveSuccess = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
    fetchProducts(); // Muat ulang data untuk menampilkan harga terbaru
  };

  if (showTambahBarang) {
    return <TambahBarangBaru onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col h-full">
      <Header onAddClick={handleAddClick} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-slate-500 mt-2">Memuat data produk...</p>
          </div>
        )}

        {error && <div className="p-4 text-rose-500 text-center">Error: {error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center p-4"><p className="text-slate-500">Tidak ada produk.</p></div>
            ) : (
              products.map((product) => {
                const basePrice = product.prices?.find(p => p.uom_id === null);
                return (
                  <div key={product.id} className="card p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm muted">SKU: {product.base_sku} ({product.base_unit})</p>
                            <p className="text-sm muted">Harga: {formatCurrency(basePrice?.selling_price || 0)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handleEditClick(product)}
                                className="icon-btn hover:bg-sky-50"
                                title="Edit Harga Jual"
                            >
                                <Pencil className="w-4 h-4 text-sky-600" />
                            </button>
                            <button 
                                onClick={() => handleDeleteClick(product)}
                                className="icon-btn hover:bg-rose-50"
                                title="Hapus Produk"
                            >
                                <Trash2 className="w-4 h-4 text-rose-500" />
                            </button>
                        </div>
                    </div>

                    {product.uom && product.uom.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                        <span className="font-medium text-slate-700">Satuan Lain:</span>
                        <ul className="space-y-2 mt-2">
                          {product.uom.map((uomItem) => {
                            const uomPrice = product.prices?.find(p => p.uom_id === uomItem.id);
                            return (
                              <li key={uomItem.id} className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-semibold">{uomItem.uom_name}</p>
                                <p className="text-sm muted">SKU: {uomItem.uom_sku}</p>
                                <p className="text-sm muted">Harga: {formatCurrency(uomPrice?.selling_price || 0)}</p>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      
      {/* Modal Edit Harga */}
      <EditHargaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={productToEdit}
        onSaveSuccess={handleSaveSuccess}
      />
      
      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk"
        message={`Yakin ingin menghapus "${productToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        isLoading={isDeleting}
      />
    </div>
  );
}

