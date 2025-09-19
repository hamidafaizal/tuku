import { useState } from 'react';
import { PiggyBank, BarChart, CalendarDays } from 'lucide-react';

export default function Ringkasan() {
  const [selectedDate, setSelectedDate] = useState('');

  // Keterangan: Dummy data untuk omset dan laba bersih
  const omset = 25000000; // Contoh omset
  const labaBersih = 7500000; // Contoh laba bersih

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
      {/* Keterangan: Header fixed dengan date picker */}
      <div className="flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-xl z-10 py-2 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold">Ringkasan</h2>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-500" />
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
        </div>
      </div>

      {/* Konten ringkasan */}
      <div className="flex-1 overflow-y-auto pt-4 pb-20">
        <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Omset */}
          <div className="kpi-card">
            <p className="kpi-label">Omset</p>
            <p className="kpi-value">{formatCurrency(omset)}</p>
          </div>
          
          {/* Laba Bersih */}
          <div className="kpi-card">
            <p className="kpi-label">Laba Bersih</p>
            <p className="kpi-value">{formatCurrency(labaBersih)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
