import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function Penjualan() {
  const [activePeriod, setActivePeriod] = useState('harian');

  // Keterangan: Dummy data untuk total penjualan dan omset
  // Data ini akan berubah tergantung pada periode yang aktif (harian, mingguan, bulanan)
  const salesData = {
    harian: { totalItems: 150, totalRevenue: 1500000 },
    mingguan: { totalItems: 980, totalRevenue: 10500000 },
    bulanan: { totalItems: 4200, totalRevenue: 45000000 },
  };

  const currentData = salesData[activePeriod];

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-xl z-10 py-2 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-sky-500" />
            <div>
              <h2 className="text-xl font-bold">Penjualan</h2>
              <p className="muted text-sm">Ringkasan penjualan {activePeriod} ini.</p>
            </div>
          </div>
        </div>
        
        {/* Opsi Filter Waktu */}
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => setActivePeriod('harian')} 
            className={`btn btn-sm ${activePeriod === 'harian' ? 'btn-primary' : ''}`}
          >
            Harian
          </button>
          <button 
            onClick={() => setActivePeriod('mingguan')} 
            className={`btn btn-sm ${activePeriod === 'mingguan' ? 'btn-primary' : ''}`}
          >
            Mingguan
          </button>
          <button 
            onClick={() => setActivePeriod('bulanan')} 
            className={`btn btn-sm ${activePeriod === 'bulanan' ? 'btn-primary' : ''}`}
          >
            Bulanan
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Penjualan Barang */}
          <div className="kpi-card">
            <p className="kpi-label">Total Penjualan Barang</p>
            <p className="kpi-value">{currentData.totalItems}</p>
          </div>
          
          {/* Total Omset */}
          <div className="kpi-card">
            <p className="kpi-label">Total Omset</p>
            <p className="kpi-value">{formatCurrency(currentData.totalRevenue)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
