import { createContext, useState, useContext } from 'react';

// 1. Membuat Context
const ModeContext = createContext();

// 2. Membuat Provider Component
export function ModeProvider({ children }) {
  const [isOwnerMode, setIsOwnerMode] = useState(true);

  // Fungsi untuk mengubah mode
  const toggleMode = () => {
    setIsOwnerMode(prevMode => {
      const newMode = !prevMode;
      console.log('Global mode switched to:', newMode ? 'Pemilik' : 'Kasir');
      return newMode;
    });
  };

  // Nilai yang akan dibagikan ke seluruh komponen
  const value = { isOwnerMode, toggleMode };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

// 3. Membuat Custom Hook untuk mempermudah penggunaan context
export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
