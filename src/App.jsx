import { useMode } from '/src/context/ModeContext.jsx';
import { useAuth } from '/src/context/AuthContext.jsx';
import OwnerLayout from '/src/layouts/OwnerLayout.jsx';
import CashierLayout from '/src/layouts/CashierLayout.jsx';
import AuthPage from '/src/pages/AuthPage.jsx';

// Komponen PrivateRoute untuk melindungi halaman yang memerlukan login
function PrivateRoute({ children }) {
  const { session } = useAuth();
  console.log("PrivateRoute check, session:", session);
  return session ? children : <AuthPage />;
}

export default function App() {
  const { isOwnerMode } = useMode();
  console.log('App is selecting layout, isOwnerMode:', isOwnerMode);

  return (
    <PrivateRoute>
      {isOwnerMode ? <OwnerLayout /> : <CashierLayout />}
    </PrivateRoute>
  );
}

