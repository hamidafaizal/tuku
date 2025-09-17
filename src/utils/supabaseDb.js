// src/utils/supabaseDb.js

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

// Keterangan: Fungsi baru untuk menghapus produk dari database
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
