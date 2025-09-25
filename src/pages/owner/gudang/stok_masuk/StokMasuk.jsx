import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import TambahStok from './TambahStok.jsx';
import { fetchStockHistory } from '/src/utils/supabaseDb.js';
import { Loader2, Package, CalendarDays, Barcode, Scale } from 'lucide-react';

// Keterangan: Komponen baru untuk menampilkan riwayat stok dalam bentuk kartu
function StockHistoryList({ history }) {
  // Keterangan: Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Keterangan: Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div key={item.id} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{item.product_name}</h4>
            <span className="text-xs text-slate-500">{formatDate(item.created_at)}</span>
          </div>
          
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Barcode className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-slate-500 text-sm">{item.product_sku}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">{item.quantity} {item.product_unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Harga Beli:</span>
              <span className="font-medium text-slate-700">{formatCurrency(item.purchase_price)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Halaman utama untuk mencatat stok masuk.
export default function StokMasuk() {
  const [showTambahStok, setShowTambahStok] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Keterangan: State untuk menyimpan tanggal yang dipilih dari datepicker
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Keterangan: Memuat data riwayat stok saat halaman dimuat, kembali dari TambahStok, atau saat tanggal berubah
    const loadStockHistory = async () => {
      setLoading(true);
      setError(null);
      // Keterangan: Meneruskan tanggal yang dipilih ke fungsi fetch
      const { data, error: fetchError } = await fetchStockHistory(selectedDate);
      if (fetchError) {
        console.error('// Stok Masuk: Gagal memuat riwayat stok.', fetchError);
        setError('Gagal memuat riwayat stok.');
      } else {
        console.log('// Stok Masuk: Riwayat stok berhasil dimuat.', data);
        setStockHistory(data);
      }
      setLoading(false);
    };

    if (!showTambahStok) {
      loadStockHistory();
    }
  }, [showTambahStok, selectedDate]); // Keterangan: `selectedDate` ditambahkan ke dependency array

  const handleAddClick = () => {
    setShowTambahStok(true);
    console.log('// Stok Masuk: Mengaktifkan mode tambah stok.');
  };

  const handleBack = () => {
    setShowTambahStok(false);
    console.log('// Stok Masuk: Kembali ke halaman utama stok masuk.');
  };

  if (showTambahStok) {
    return <TambahStok onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Keterangan: Meneruskan state dan setter tanggal ke komponen Header */}
      <Header 
        onAddClick={handleAddClick} 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        <h3 className="font-bold text-lg mb-4">Riwayat Stok Masuk</h3>
        {loading && (
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-slate-500 mt-2">Memuat riwayat stok...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center p-4">
            <p className="text-rose-500">Error: {error}</p>
          </div>
        )}
        {!loading && !error && (
          stockHistory.length > 0 ? (
            <StockHistoryList history={stockHistory} />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Package className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500">
                {selectedDate ? `Tidak ada riwayat untuk tanggal ${selectedDate}` : 'Belum ada riwayat stok masuk.'}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
