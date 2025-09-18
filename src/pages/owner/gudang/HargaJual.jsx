import React, { useState, useMemo, useEffect } from 'react';
import { Search, Loader2, Edit, Save, X } from 'lucide-react';
import { fetchHargaJual, updateHargaJual } from '../../../utils/supabaseDb';

// Halaman Harga Jual
export default function HargaJual() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hargaJualData, setHargaJualData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  // const { session } = useAuth();
  
  // Keterangan: Memuat data harga jual dari Supabase saat komponen dimuat
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await fetchHargaJual();
      if (error) {
        setError(error.message);
        console.error('Gagal memuat data harga jual:', error);
      } else {
        setHargaJualData(data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Fungsi untuk memformat angka menjadi format mata uang Rupiah
  const formatCurrency = (number) => {
    // Keterangan: Memastikan number adalah angka, jika tidak kembalikan Rp0
    if (typeof number !== 'number') return 'Rp0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };
  
  // Fungsi untuk menangani mode edit
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditedValues({
      harga_jual_dasar: item.harga_jual_dasar,
      // Keterangan: uom_list mungkin null, jadi pastikan array kosong jika tidak ada
      harga_jual_uom: item.uom_list ? [...item.uom_list] : []
    });
    console.log(`Memulai mode edit untuk item ID: ${item.id}`);
  };
  
  // Fungsi untuk membatalkan mode edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedValues({});
    console.log('Membatalkan mode edit.');
  };
  
  // Fungsi untuk menyimpan harga jual ke database
  const handleSave = async (id) => {
    console.log(`Mencoba menyimpan perubahan untuk item ID: ${id}`);
    setLoading(true);
    setError(null);

    const currentItem = hargaJualData.find(item => item.id === id);
    const { harga_jual_dasar, harga_jual_uom } = editedValues;
    
    if (harga_jual_dasar < 0 || (harga_jual_uom && harga_jual_uom.some(uom => uom.harga < 0))) {
      setError('Harga tidak boleh bernilai negatif.');
      setLoading(false);
      return;
    }

    try {
      const updates = {
        // Keterangan: Tambahkan productId ke objek updates
        productId: id,
        basePrice: harga_jual_dasar,
        // Keterangan: Mengirim array update untuk UOM
        uomUpdates: harga_jual_uom,
      };

      const { success, error } = await updateHargaJual(updates);
      if (!success) {
        throw new Error(error.message);
      }

      // Keterangan: Memuat ulang data dari database setelah penyimpanan berhasil
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay sedikit untuk memastikan data termuat
      const { data, error: fetchError } = await fetchHargaJual();
      if (fetchError) {
        setError('Data berhasil disimpan, namun gagal memuat ulang.');
      } else {
        setHargaJualData(data);
      }

      setEditingId(null);
      setEditedValues({});
      console.log(`Perubahan untuk item ID: ${id} berhasil disimpan ke database.`);
    } catch (err) {
      console.error('Gagal menyimpan perubahan:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fungsi untuk menangani perubahan input harga jual dasar
  const handleBasePriceChange = (e) => {
    // Keterangan: Menghapus semua karakter non-angka dan mengonversi ke Number
    const value = Number(e.target.value.replace(/[^0-9]/g, ''));
    setEditedValues(prev => ({
      ...prev,
      harga_jual_dasar: value
    }));
    console.log(`Harga jual dasar diubah menjadi: ${value}`);
  };

  // Fungsi untuk menangani perubahan input harga jual UOM
  const handleUomPriceChange = (index, e) => {
    // Keterangan: Menghapus semua karakter non-angka dan mengonversi ke Number
    const value = Number(e.target.value.replace(/[^0-9]/g, ''));
    const newUomPrices = [...editedValues.harga_jual_uom];
    if (newUomPrices[index]) {
      newUomPrices[index].harga = value;
    }
    setEditedValues(prev => ({
      ...prev,
      harga_jual_uom: newUomPrices
    }));
    console.log(`Harga UOM di index ${index} diubah menjadi: ${value}`);
  };

  const filteredData = useMemo(() => {
    return hargaJualData
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [hargaJualData, searchTerm]);

  return (
    <div className="flex flex-col h-full">
      {/* Area fixed untuk tools di bagian atas */}
      <div className="flex-shrink-0 mb-4 sticky top-0 backdrop-blur z-10 py-2 border-b border-slate-200">
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
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
            <span>Memuat data...</span>
          </div>
        )}

        {error && (
          <div className="p-4 mt-4 text-sm text-rose-600 bg-rose-50 rounded-lg">
            <span>Error: {error}</span>
          </div>
        )}

        {!loading && filteredData.length > 0 && (
          <>
            {/* Tampilan Tabel untuk Desktop */}
            <div className="hidden md:block card overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-1/4">Nama Barang</th>
                    <th className="w-1/4">Satuan Dasar</th>
                    <th className="w-1/4">Harga Jual Dasar</th>
                    <th className="w-1/4">UOM List</th>
                    <th className="w-24 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td>{item.unit}</td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editedValues.harga_jual_dasar.toLocaleString('id-ID')}
                            onChange={handleBasePriceChange}
                            className="input w-full text-right"
                            inputMode="numeric"
                          />
                        ) : (
                          formatCurrency(item.harga_jual_dasar)
                        )}
                      </td>
                      <td>
                        {item.uom_list ? (
                          <ul className="list-disc list-inside">
                            {item.uom_list.map((uom, i) => (
                              <li key={i} className="mb-2 last:mb-0">
                                <span className="font-semibold">{uom.uomList} ({uom.uomQuantity})</span>
                                <br />
                                {editingId === item.id ? (
                                  <input
                                    type="text"
                                    value={editedValues.harga_jual_uom[i]?.harga.toLocaleString('id-ID')}
                                    onChange={(e) => handleUomPriceChange(i, e)}
                                    className="input w-full"
                                    inputMode="numeric"
                                  />
                                ) : (
                                  <span className="text-sm text-slate-600">{formatCurrency(uom.harga)}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="td-right">
                        {editingId === item.id ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={handleCancelEdit} className="icon-btn text-rose-500 hover:bg-rose-100" title="Batal">
                              <X className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleSave(item.id)} className="icon-btn text-sky-500 hover:bg-sky-100" title="Simpan">
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleEditClick(item)} className="icon-btn text-slate-700 hover:bg-slate-100" title="Edit Harga">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Tampilan Card untuk Mobile */}
            <div className="md:hidden space-y-4">
              {filteredData.map((item) => (
                <div key={item.id} className="card p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                    </div>
                    {editingId === item.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={handleCancelEdit} className="icon-btn text-rose-500 hover:bg-rose-100" title="Batal">
                          <X className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleSave(item.id)} className="icon-btn text-sky-500 hover:bg-sky-100" title="Simpan">
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(item)} className="icon-btn text-slate-700 hover:bg-slate-100" title="Edit Harga">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="divider" />
                  
                  {/* Harga Jual Dasar */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">Harga Jual Dasar ({item.unit}):</span>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editedValues.harga_jual_dasar.toLocaleString('id-ID')}
                        onChange={handleBasePriceChange}
                        className="input w-32 text-right"
                        inputMode="numeric"
                      />
                    ) : (
                      <span className="font-bold">{formatCurrency(item.harga_jual_dasar)}</span>
                    )}
                  </div>
                  
                  {item.uom_list && item.uom_list.length > 0 && (
                    <>
                      <div className="divider" />
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-600 text-sm">UOM List:</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                          {item.uom_list.map((uom, i) => (
                            <li key={i} className="text-sm">
                              <div className="flex justify-between">
                                <div>
                                  <span className="font-semibold">{uom.uomList} ({uom.uomQuantity})</span>
                                </div>
                                {editingId === item.id ? (
                                  <input
                                    type="text"
                                    value={editedValues.harga_jual_uom[i]?.harga.toLocaleString('id-ID')}
                                    onChange={(e) => handleUomPriceChange(i, e)}
                                    className="input w-32"
                                    inputMode="numeric"
                                  />
                                ) : (
                                  <span className="text-sm text-slate-600">{formatCurrency(uom.harga)}</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        
        {!loading && filteredData.length === 0 && !error && (
          <p className="text-center text-slate-500 py-10">Tidak ada data harga jual yang ditemukan.</p>
        )}
      </div>
    </div>
  );
}
