// src/utils/supabaseDb.js

import { supabase } from '../../supabaseClient.js';

// Fungsi untuk menyimpan atau memperbarui data produk di tabel gudang_database
export async function upsertProduct(productData, userId) {
  console.log('Mencoba menyimpan produk ke database...', { productData, userId });

  // Struktur data yang akan dikirim ke Supabase
  const dataToInsert = {
    user_id: userId,
    name: productData.name,
    unit: productData.unit,
    sku: productData.sku,
    // Jika UOM List diaktifkan, simpan array UOM, jika tidak, simpan null.
    uom: productData.uom.length > 1 ? productData.uom : null,
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
