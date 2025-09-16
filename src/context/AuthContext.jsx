import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Coba ambil sesi yang sudah ada
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      console.log("Sesi awal dimuat:", session);
    });

    // Dengarkan perubahan status otentikasi
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        console.log("Status otentikasi berubah, sesi baru:", session);
      }
    );

    // Cleanup listener saat komponen dilepas
    return () => subscription.unsubscribe();
  }, []);

  // Fungsi-fungsi otentikasi
  const value = {
    session,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };

  // Tampilkan loading jika sesi belum termuat
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </Auth.Provider>
  );
}

// Custom hook untuk mempermudah penggunaan context
export function useAuth() {
  return useContext(AuthContext);
}

