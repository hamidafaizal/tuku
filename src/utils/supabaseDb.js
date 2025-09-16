// File ini berisi semua fungsi untuk berinteraksi dengan tabel 'gudang_database' di Supabase.
import { supabase } from '../../supabaseClient.js';

const TABLE_NAME = 'gudang_database';

/**
 * Mengambil semua produk dari Supabase untuk pengguna yang sedang login.
 * @returns {Promise<Array>} Array berisi produk.
 */
export const getSupabaseProducts = async () => {
  console.log("Mengambil data produk dari Supabase.");
  const { data, error } = await supabase.from(TABLE_NAME).select('*');
  if (error) {
    console.error("Error mengambil data dari Supabase:", error);
    throw error;
  }
  console.log("Data produk dari Supabase berhasil diambil:", data);
  return data;
};

/**
 * Menggunakan 'upsert' untuk menambah atau memperbarui beberapa produk sekaligus.
 * Ini adalah fungsi inti untuk sinkronisasi dari lokal ke server.
 * @param {Array<object>} products - Array produk yang akan di-upsert.
 * @returns {Promise<Array>} Array produk yang berhasil di-upsert.
 */
export const upsertSupabaseProducts = async (products) => {
  console.log("Melakukan upsert produk ke Supabase:", products);
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(products, { onConflict: 'user_id, sku' }) // Jika user_id dan sku sudah ada, data akan di-update
    .select();
  
  if (error) {
    console.error("Error saat upsert produk ke Supabase:", error);
    throw error;
  }
  
  console.log("Produk berhasil di-upsert ke Supabase:", data);
  return data;
};


/**
 * Menghapus beberapa produk dari Supabase berdasarkan array ID.
 * @param {Array<number>} ids - Array berisi ID produk yang akan dihapus.
 */
export const deleteMultipleSupabaseProducts = async (ids) => {
    console.log(`Menghapus beberapa produk dari Supabase dengan ids:`, ids);
    // Pastikan tidak ada ID sementara (negatif) yang dikirim ke Supabase
    const validIds = ids.filter(id => id > 0);
    if (validIds.length === 0) {
        console.log("Tidak ada ID valid untuk dihapus dari Supabase.");
        return;
    }

    const { error } = await supabase.from(TABLE_NAME).delete().in('id', validIds);

    if (error) {
        console.error("Error menghapus beberapa produk dari Supabase:", error);
        throw error;
    }
    console.log(`Beberapa produk berhasil dihapus dari Supabase.`);
};

