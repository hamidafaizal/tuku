import { useState } from 'react';
import { ShoppingBag, DollarSign, X } from 'lucide-react';
import TransactionDetailModal from './modals/TransactionDetailModal.jsx';

export default function Riwayat() {
  const [activeTab, setActiveTab] = useState('penjualan');
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Keterangan: Dummy data untuk riwayat penjualan per nota
  // Menambahkan data detail produk untuk dummy
  const salesHistory = [
    {
      id: 'NOTA-001',
      date: '2025-09-18',
      total: 75000,
      cashier: 'Daffa',
      items: [
        { name: 'Kopi Susu', quantity: 2, price: 25000, subtotal: 50000 },
        { name: 'Roti Bakar', quantity: 1, price: 25000, subtotal: 25000 },
      ],
    },
    {
      id: 'NOTA-002',
      date: '2025-09-18',
      total: 42000,
      cashier: 'Daffa',
      items: [
        { name: 'Teh Hijau', quantity: 1, price: 12000, subtotal: 12000 },
        { name: 'Air Mineral', quantity: 1, price: 30000, subtotal: 30000 },
      ],
    },
    {
      id: 'NOTA-003',
      date: '2025-09-17',
      total: 120000,
      cashier: 'Syifa',
      items: [
        { name: 'Jus Alpukat', quantity: 3, price: 30000, subtotal: 90000 },
        { name: 'Cemilan Asin', quantity: 2, price: 15000, subtotal: 30000 },
      ],
    },
    {
      id: 'NOTA-004',
      date: '2025-09-16',
      total: 50000,
      cashier: 'Daffa',
      items: [
        { name: 'Es Jeruk Nipis', quantity: 1, price: 50000, subtotal: 50000 },
      ],
    },
  ];

  // Keterangan: Dummy data untuk riwayat pembelian per produk
  const purchaseHistory = [
    { id: 'PROD-001', date: '2025-09-18', name: 'Kopi Susu', unit: 'pcs', quantity: 20, totalPurchasePrice: 150000 },
    { id: 'PROD-002', date: '2025-09-17', name: 'Gula Aren', unit: 'kg', quantity: 5, totalPurchasePrice: 75000 },
    { id: 'PROD-003', date: '2025-09-16', name: 'Susu Bubuk', unit: 'box', quantity: 10, totalPurchasePrice: 200000 },
  ];

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
    console.log('Membuka modal untuk transaksi:', transaction.id);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    console.log('Menutup modal transaksi.');
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const filteredSales = salesHistory.filter(item => 
    !selectedDate || item.date === selectedDate
  );

  const filteredPurchases = purchaseHistory.filter(item => 
    !selectedDate || item.date === selectedDate
  );

  const renderContent = () => {
    if (activeTab === 'penjualan') {
      return (
        <div className="space-y-4">
          <p className="section-label">Riwayat Penjualan ({filteredSales.length})</p>
          {filteredSales.length > 0 ? (
            filteredSales.map((nota) => (
              <div 
                key={nota.id} 
                className="card cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleOpenModal(nota)}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-sky-600">{nota.id}</span>
                  <span className="text-slate-500">{new Date(nota.date).toLocaleDateString()}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(nota.total)}</span>
                </div>
                <p className="text-sm text-slate-500">Jumlah Barang: {nota.items.length}</p>
                <p className="text-sm text-slate-500">Kasir: {nota.cashier}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">Tidak ada riwayat penjualan.</p>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <p className="section-label">Riwayat Pembelian ({filteredPurchases.length})</p>
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((item) => (
              <div key={item.id} className="card">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg">{item.name}</h4>
                  <span className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Jumlah Masuk:</span>
                  <span className="font-medium">{item.quantity} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Harga Beli:</span>
                  <span className="font-medium">{formatCurrency(item.totalPurchasePrice)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">Tidak ada riwayat pembelian.</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-xl z-10 py-2 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold">Riwayat</h2>
          <input
            type="date"
            className="input text-sm w-fit"
            value={selectedDate}
            onChange={(e) => {
              console.log('Tanggal dipilih:', e.target.value);
              setSelectedDate(e.target.value);
            }}
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('penjualan')} 
            className={`btn flex-1 ${activeTab === 'penjualan' ? 'btn-primary' : ''}`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Penjualan</span>
          </button>
          <button 
            onClick={() => setActiveTab('pembelian')} 
            className={`btn flex-1 ${activeTab === 'pembelian' ? 'btn-primary' : ''}`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pembelian</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        {renderContent()}
      </div>

      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </div>
  );
}
