import { useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';

// Halaman untuk Login dan Registrasi
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    console.log(`Mencoba ${isLogin ? 'login' : 'signup'} dengan email: ${email}`);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) throw error;
      
      if (!isLogin) {
        setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
      }
    } catch (error) {
      console.error("Error otentikasi:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Tuku</h1>
            <p className="text-slate-500">Aplikasi Point of Sale</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold text-center mb-1">{isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}</h2>
          <p className="text-slate-500 text-center mb-6">{isLogin ? 'Silakan masuk untuk melanjutkan.' : 'Isi form di bawah untuk mendaftar.'}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input 
                id="email"
                type="email"
                className="input mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anda@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                type="password"
                className="input mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-sm text-sky-600 bg-sky-50 p-3 rounded-lg">{message}</p>}

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-sky-600 hover:underline">
              {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

