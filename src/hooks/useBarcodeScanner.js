import { useEffect, useRef } from 'react';

// Custom hook untuk mendeteksi input dari barcode scanner fisik
export const useBarcodeScanner = (onScanComplete) => {
  // Menggunakan useRef agar tidak memicu re-render
  const lastKeyTime = useRef(Date.now());
  const scannedCode = useRef('');

  useEffect(() => {
    // Fungsi yang akan menangani setiap ketukan keyboard
    const handleKeyDown = (e) => {
      // Abaikan tombol modifier seperti Shift, Control, dll.
      if (e.key.length > 1 && e.key !== 'Enter') return;
      
      const currentTime = Date.now();
      // Jeda waktu antar ketukan. Scanner biasanya < 50ms.
      const timeDiff = currentTime - lastKeyTime.current;
      lastKeyTime.current = currentTime;

      // Jika jeda terlalu lama, reset kode (input dari user biasa)
      if (timeDiff > 100) {
        scannedCode.current = '';
      }

      // Jika tombolnya Enter, proses kode yang sudah terkumpul
      if (e.key === 'Enter') {
        // Hanya proses jika ada kode yang di-scan
        if (scannedCode.current.length > 2) {
          console.log(`Barcode terdeteksi: ${scannedCode.current}`);
          onScanComplete(scannedCode.current);
        }
        scannedCode.current = ''; // Reset setelah enter
      } else {
        // Tambahkan karakter ke kode yang sedang di-scan
        scannedCode.current += e.key;
      }
    };

    // Daftarkan event listener saat komponen dimuat
    window.addEventListener('keydown', handleKeyDown);
    console.log('Barcode scanner listener is active.');

    // Hapus event listener saat komponen dilepas untuk mencegah memory leak
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      console.log('Barcode scanner listener is inactive.');
    };
  }, [onScanComplete]); // Jalankan ulang effect jika fungsi onScanComplete berubah
};
