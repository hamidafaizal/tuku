import React from 'react';
import HeaderTemplate from '/src/components/owner/HeaderTemplate.jsx';
import { Plus, CalendarDays } from 'lucide-react';

// Keterangan: Komponen sekarang menerima `selectedDate` dan `setSelectedDate` sebagai props
export default function HeaderStokMasuk({ onAddClick = () => {}, selectedDate, setSelectedDate }) {
  console.log('// Stok Masuk: Merender Header untuk halaman Stok Masuk.');

  const handleDateChange = (e) => {
    // Keterangan: Memanggil fungsi setter dari props untuk mengubah state di komponen induk
    setSelectedDate(e.target.value);
    console.log('Tanggal dipilih:', e.target.value);
  };

  const handleAddStockClick = () => {
    console.log('Tombol "+ Stok" diklik.');
    onAddClick();
  };

  return (
    <HeaderTemplate title="Stok Masuk" rightContent={
      <>
        <button className="btn btn-primary btn-sm" onClick={handleAddStockClick}>
          <Plus className="w-4 h-4" />
          <span>Tambah Stok</span>
        </button>
      </>
    }>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-slate-500" />
          <input
            type="date"
            className="input text-sm w-fit"
            // Keterangan: Nilai input dikontrol oleh prop `selectedDate`
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
    </HeaderTemplate>
  );
}
