import Header from '/src/components/Header.jsx';

// Layout ini adalah "bungkus" untuk semua halaman dalam Mode Pemilik.
export default function OwnerLayout() {
  // Log untuk memastikan layout yang benar sedang dirender
  console.log('Rendering OwnerLayout');
  
  return (
    <div className="app-shell">
      <Header />
      
      {/* Konten Utama Aplikasi */}
      <main>
        <div className="container-app py-4 md:py-6">
          {/* Di sini nanti kita akan merender halaman-halaman spesifik pemilik */}
          <h2>Dashboard</h2>
          <p className='muted'>Selamat datang di aplikasi Tuku.</p>
        </div>
      </main>
    </div>
  );
}

