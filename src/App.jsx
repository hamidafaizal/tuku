import Header from './components/Header.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      
      {/* Konten Utama Aplikasi */}
      <main>
        <div className="container-app py-4 md:py-6">
          {/* Konten halaman akan ditampilkan di sini */}
          <h2>Dashboard</h2>
          <p className='muted'>Selamat datang di aplikasi Tuku.</p>
        </div>
      </main>
    </div>
  );
}

