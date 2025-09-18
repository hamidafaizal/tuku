import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import TambahStokModal from './modals/TambahStok.jsx';
import { fetchStockHistory } from '../../../utils/supabaseDb.js';

export default function StokMasuk() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Keterangan: Fungsi untuk memuat data riwayat stok dari Supabase
  const loadStockHistory = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchStockHistory();
    if (error) {
      console.error('Gagal memuat riwayat stok:', error);
      setError('Gagal memuat riwayat stok.');
    } else {
      setStockHistory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Keterangan: Memuat data dari Supabase saat komponen dimuat
    loadStockHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return stockHistory
      .filter(item => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
        const dateMatch = !selectedDate || itemDate === selectedDate;
        const searchMatch = item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.product_sku.toLowerCase().includes(searchTerm.toLowerCase());
        return dateMatch && searchMatch;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Mengurutkan berdasarkan tanggal terbaru
  }, [stockHistory, searchTerm, selectedDate]);

  const openTambahStokModal = () => setModalOpen(true);
  const closeTambahStokModal = () => {
    setModalOpen(false);
    // Keterangan: Memuat ulang data setelah modal ditutup
    loadStockHistory();
  };
  
  // Keterangan: Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    if (typeof number !== 'number') return 'Rp0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Area fixed untuk tools di bagian atas */}
      <div className="flex-shrink-0 sticky top-0 backdrop-blur z-10 py-2 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button onClick={openTambahStokModal} className="btn btn-primary btn-sm">
            <Plus className="w-4 h-4" />
            <span>Stok</span>
          </button>
          <input
            type="date"
            className="input text-sm w-fit"
            value={selectedDate}
            onChange={(e) => {
              setSearchTerm('');
              console.log('Tanggal dipilih:', e.target.value);
              setSelectedDate(e.target.value);
            }}
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              console.log('Pencarian diubah:', e.target.value);
            }}
            className="input pl-10"
            placeholder="Cari nama barang..."
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Area yang menggunakan overflow-y-auto */}
      <div className="flex-1 overflow-y-auto pb-20">
        {loading && (
          <div className="flex justify-center items-center py-10 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Memuat riwayat stok...</span>
          </div>
        )}
        {error && (
          <div className="p-4 mt-4 text-sm text-rose-600 bg-rose-50 rounded-lg">
            <span>Error: {error}</span>
          </div>
        )}
        {!loading && filteredHistory.length > 0 ? (
          <>
            {/* Tampilan Tabel untuk Desktop */}
            <div className="hidden md:block card overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama Barang</th>
                    <th>SKU</th>
                    <th>Jumlah</th>
                    <th>Total Satuan Dasar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.created_at).toLocaleDateString()}</td>
                      <td>{item.product_name}</td>
                      <td>{item.product_sku}</td>
                      <td>{item.quantity} {item.product_unit}</td>
                      <td>{item.total_quantity_base_unit} {item.base_unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tampilan Card untuk Mobile */}
            <div className="md:hidden space-y-4 pt-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="card p-4 space-y-2">
                  <p className="text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  <h4 className="font-bold text-lg">{item.product_name}</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">SKU:</span>
                    <span>{item.product_sku}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">Jumlah:</span>
                    <span>
                      {item.quantity} {item.product_unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">Total Satuan Dasar:</span>
                    <span>
                      {item.total_quantity_base_unit} {item.base_unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          !loading && <p className="text-center text-slate-500 py-10">Tidak ada riwayat stok masuk yang ditemukan.</p>
        )}
      </div>
      <TambahStokModal isOpen={isModalOpen} onClose={closeTambahStokModal} />
    </div>
  );
}
