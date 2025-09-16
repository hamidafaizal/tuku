// console.log untuk debugging koneksi database
console.log("Mempersiapkan koneksi ke IndexedDB.");

import { openDB } from 'idb';

// Inisialisasi database
const dbPromise = openDB('tuku-db', 2, {
  upgrade(db, oldVersion) {
    // Buat "tabel" (disebut objectStore di IndexedDB) untuk menyimpan barang
    if (!db.objectStoreNames.contains('products')) {
      console.log("Membuat object store 'products'.");
      const store = db.createObjectStore('products', { keyPath: 'id' });
      // Menambahkan index untuk pencarian berdasarkan SKU, jika diperlukan di masa depan
      store.createIndex('sku', 'sku', { unique: false });
    }
    // Di versi 2, kita tambahkan object store untuk antrian sinkronisasi
    if (oldVersion < 2 && !db.objectStoreNames.contains('sync_queue')) {
        console.log("Membuat object store 'sync_queue'.");
        db.createObjectStore('sync_queue', { autoIncrement: true, keyPath: 'queue_id' });
    }
  },
});

// Fungsi untuk membaca semua barang
export async function getAllProducts() {
  console.log("Mengambil semua produk dari IndexedDB.");
  return (await dbPromise).getAll('products');
}

// Fungsi untuk menambah atau memperbarui barang
export async function addProduct(product) {
  console.log("Menambahkan/memperbarui produk di IndexedDB:", product);
  return (await dbPromise).put('products', product);
}

// Fungsi untuk menghapus satu barang
export async function deleteProduct(id) {
    console.log(`Menghapus produk dengan id: ${id} dari IndexedDB.`);
  return (await dbPromise).delete('products', id);
}

// Fungsi untuk menghapus beberapa barang sekaligus
export async function deleteMultipleProducts(ids) {
    console.log(`Menghapus beberapa produk dengan ids dari IndexedDB:`, ids);
  const tx = (await dbPromise).transaction('products', 'readwrite');
  await Promise.all(ids.map(id => tx.store.delete(id)));
  return tx.done;
}

/**
 * Mengganti semua produk di IndexedDB dengan data baru dari server.
 * Ini adalah inti dari proses sinkronisasi dari server ke lokal.
 * @param {Array<object>} products - Array produk dari Supabase.
 */
export async function syncLocalProducts(products) {
  console.log("Memulai sinkronisasi data lokal dengan data server...");
  const tx = (await dbPromise).transaction('products', 'readwrite');
  // Hapus semua data lama
  await tx.store.clear();
  console.log("Data lokal lama dibersihkan.");
  // Tambahkan semua data baru
  await Promise.all(products.map(product => tx.store.put(product)));
  console.log(`${products.length} item baru berhasil disinkronkan ke lokal.`);
  return tx.done;
}

/**
 * Mengganti item dengan ID sementara dengan item final dari server setelah sinkronisasi berhasil.
 * @param {number} tempId - ID sementara yang dibuat di client.
 * @param {object} finalProduct - Objek produk lengkap dari Supabase.
 */
export async function replaceProductWithFinal(tempId, finalProduct) {
  console.log(`Mengganti produk sementara (id: ${tempId}) dengan final (id: ${finalProduct.id})`);
  const db = await dbPromise;
  const tx = db.transaction('products', 'readwrite');
  // Hapus record lama dengan ID sementara
  await tx.store.delete(tempId);
  // Tambahkan record baru dengan ID final dari Supabase
  await tx.store.put(finalProduct);
  return tx.done;
}

