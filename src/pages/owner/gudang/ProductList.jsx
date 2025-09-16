// Halaman untuk menampilkan daftar produk di dalam menu Gudang
export default function ProductList() {
  console.log('Rendering halaman ProductList');
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Daftar Produk</h3>
      <div className="card">
        <p className="text-slate-500">
          Ini adalah halaman untuk melihat dan mengelola semua produk. 
          Nanti di sini akan ada tabel berisi daftar produk.
        </p>
      </div>
    </div>
  );
}
