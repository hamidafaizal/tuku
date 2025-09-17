import { useMode } from '/src/context/ModeContext.jsx';
import { useAuth } from '/src/context/AuthContext.jsx';
import OwnerLayout from '/src/layouts/OwnerLayout.jsx';
import CashierLayout from '/src/layouts/CashierLayout.jsx';
import AuthPage from '/src/pages/AuthPage.jsx';
import GudangLayout from './layouts/GudangLayout.jsx';
import DatabaseBarang from './pages/owner/gudang/DatabaseBarang.jsx';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
  Navigate,
} from "react-router-dom";


// Komponen PrivateRoute untuk melindungi halaman yang memerlukan login
function PrivateRoute({ children }) {
  const { session } = useAuth();
  console.log("PrivateRoute check, session:", session);
  return session ? children : <AuthPage />;
}

// Router utama aplikasi
function AppRoutes() {
  const { isOwnerMode } = useMode();
  console.log('App is selecting layout, isOwnerMode:', isOwnerMode);

  const element = useRoutes([
    {
      path: "/",
      element: (
        <PrivateRoute>
          {isOwnerMode ? <OwnerLayout /> : <CashierLayout />}
        </PrivateRoute>
      ),
      children: [
        {
          path: "owner/gudang",
          element: <GudangLayout />,
          children: [
            {
              path: "database",
              element: <DatabaseBarang />,
            },
            // Tambahkan rute untuk StokMasuk, ProductList di sini
          ]
        }
      ]
    },
    { path: "/auth", element: <AuthPage /> },
    { path: "*", element: <Navigate to="/" /> },
  ]);

  return element;
}

export default function App() {
  const { session, loading } = useAuth();
  // Tampilkan loading screen jika sesi sedang dimuat
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <h1 className="text-xl text-slate-500">Memuat sesi...</h1>
      </div>
    );
  }

  // Tampilkan AuthPage jika tidak ada sesi
  if (!session) {
    return <AuthPage />;
  }
  
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
