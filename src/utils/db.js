    // console.log untuk debugging koneksi database
    console.log("Mempersiapkan koneksi ke IndexedDB.");

    import { openDB } from 'idb';

    // Inisialisasi database
    const dbPromise = openDB('tuku-db', 1, {
      upgrade(db) {
        // Buat "tabel" (disebut objectStore di IndexedDB) untuk menyimpan barang
        console.log("Membuat object store 'products'.");
        db.createObjectStore('products', {
          keyPath: 'id', // 'id' akan menjadi kunci unik untuk setiap barang
          autoIncrement: true,
        });
      },
    });

    // Fungsi untuk membaca semua barang
    export async function getAllProducts() {
      console.log("Mengambil semua produk dari IndexedDB.");
      return (await dbPromise).getAll('products');
    }

    // Fungsi untuk menambah barang baru
    export async function addProduct(product) {
      console.log("Menambahkan produk baru ke IndexedDB:", product);
      return (await dbPromise).add('products', product);
    }

    // Fungsi untuk menghapus satu barang
    export async function deleteProduct(id) {
        console.log(`Menghapus produk dengan id: ${id}`);
      return (await dbPromise).delete('products', id);
    }

    // Fungsi untuk menghapus beberapa barang sekaligus
    export async function deleteMultipleProducts(ids) {
        console.log(`Menghapus beberapa produk dengan ids:`, ids);
      const tx = (await dbPromise).transaction('products', 'readwrite');
      await Promise.all(ids.map(id => tx.store.delete(id)));
      await tx.done;
    }
    
