import { createClient } from '@supabase/supabase-js';

// Mengambil variabel environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// console.log untuk debugging inisialisasi client
console.log("Mencoba menginisialisasi Supabase client.");

// Validasi bahwa variabel environment sudah diisi
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variabel environment Supabase (URL atau Anon Key) tidak ditemukan.");
  throw new Error("Supabase URL and Anon Key must be defined in .env.local");
}

// Membuat dan mengekspor client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase client berhasil diinisialisasi.");
