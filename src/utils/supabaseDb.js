import { supabase } from '../../supabaseClient.js';

// Fungsi untuk menyimpan atau memperbarui data produk di tabel gudang_database
export async function upsertProduct(productData, userId, isUomListEnabled) {
  console.log('Mencoba menyimpan produk ke database...', { productData, userId, isUomListEnabled });

  // Struktur data yang akan dikirim ke Supabase
  const dataToInsert = {
    user_id: userId,
    name: productData.name,
    unit: productData.unit,
    sku: productData.sku,
    // Perubahan di sini: Mengirim data uom jika isUomListEnabled bernilai true, jika tidak mengirim null
    uom: isUomListEnabled ? productData.uom : null,
  };

  const { data, error } = await supabase
    .from('gudang_database')
    .upsert(dataToInsert, { onConflict: 'sku' }) // upsert berdasarkan SKU
    .select();

  if (error) {
    console.error('Error saat menyimpan produk:', error.message);
    throw new Error(error.message);
  }

  console.log('Produk berhasil disimpan:', data);
  console.log('Data yang dikirim ke Supabase:', dataToInsert);
  return data;
}

// Fungsi untuk mengambil semua produk dari tabel gudang_database
export async function fetchProducts(userId) {
  console.log('Mencoba mengambil data produk dari database...');
  const { data, error } = await supabase
    .from('gudang_database')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error saat mengambil data produk:', error.message);
    throw new Error(error.message);
  }

  console.log('Data produk berhasil diambil:', data);
  return data;
}

// Fungsi untuk mengambil data harga jual dari tabel harga_jual
export async function fetchHargaJual(userId) {
  console.log('Mencoba mengambil data harga jual dari database...');
  const { data, error } = await supabase
    .from('harga_jual')
    .select('*, gudang_database (name, unit, uom)') // Mengambil data nama, unit, dan uom dari tabel gudang_database
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error saat mengambil data harga jual:', error.message);
    throw new Error(error.message);
  }
  
  const mergedData = data.map(item => {
    // Keterangan: Menggabungkan data uom dari gudang_database ke objek harga_jual
    const uomList = item.gudang_database.uom ? item.gudang_database.uom.map(uom => ({
      uomList: uom.uomList,
      uomQuantity: uom.uomQuantity,
      harga: item.harga_jual_uom?.find(h => h.uomList === uom.uomList)?.harga || 0
    })) : null;

    return {
      ...item,
      name: item.gudang_database.name,
      unit: item.gudang_database.unit,
      uom_list: uomList
    };
  });
  
  console.log('Data harga jual berhasil diambil:', mergedData);
  return mergedData;
}

// Fungsi baru untuk memperbarui harga jual
export async function updateHargaJual(id, newHargaJualDasar, newHargaJualUom) {
  console.log('Mencoba memperbarui harga jual...', { id, newHargaJualDasar, newHargaJualUom });
  
  const { data, error } = await supabase
    .from('harga_jual')
    .update({ 
      harga_jual_dasar: newHargaJualDasar,
      harga_jual_uom: newHargaJualUom
    })
    .eq('id', id);

  if (error) {
    console.error('Error saat memperbarui harga jual:', error.message);
    throw new Error(error.message);
  }

  console.log('Harga jual berhasil diperbarui:', data);
  return data;
}

// Keterangan: Fungsi untuk menghapus produk dari database
export async function deleteProducts(ids, userId) {
  console.log('Mencoba menghapus produk dari database...', { ids, userId });

  const { data, error } = await supabase
    .from('gudang_database')
    .delete()
    .eq('user_id', userId)
    .in('id', ids);

  if (error) {
    console.error('Error saat menghapus produk:', error.message);
    throw new Error(error.message);
  }

  console.log('Produk berhasil dihapus:', data);
  return data;
}
