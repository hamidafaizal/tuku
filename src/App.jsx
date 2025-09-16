import { useMode } from '/src/context/ModeContext.jsx';
import OwnerLayout from '/src/layouts/OwnerLayout.jsx';
import CashierLayout from '/src/layouts/CashierLayout.jsx';

export default function App() {
  // Mengambil state mode global dari context
  const { isOwnerMode } = useMode();
  console.log('App is selecting layout, isOwnerMode:', isOwnerMode);

  // Render layout yang sesuai berdasarkan mode yang aktif.
  // Jika isOwnerMode true, tampilkan OwnerLayout, jika false, tampilkan CashierLayout.
  return isOwnerMode ? <OwnerLayout /> : <CashierLayout />;
}

