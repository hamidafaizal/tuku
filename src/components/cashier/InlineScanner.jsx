import { useEffect, useRef } from 'react';

// Komponen untuk menampilkan view scanner secara inline dengan UI kustom
export default function InlineScanner({ onScanSuccess }) {
  const scannerRef = useRef(null); // Ref untuk instance scanner

  useEffect(() => {
    // Memeriksa apakah library sudah dimuat oleh browser
    if (!window.Html5Qrcode) {
      console.error("Library Html5Qrcode belum termuat.");
      return;
    }

    const handleScanSuccess = (decodedText, decodedResult) => {
      console.log(`Kode sukses di-scan via kamera: ${decodedText}`, decodedResult);
      onScanSuccess(decodedText);
    };
    
    const handleScanFailure = (error) => {
      // Mengabaikan error umum "not found" agar console tidak penuh
    };

    // Konfigurasi untuk scanner, frame putih tetap kecil
    const config = {
      fps: 10,
      qrbox: { width: 200, height: 80 }, 
    };

    // Inisialisasi scanner pada elemen dengan ID 'inline-camera-reader'
    const html5QrCode = new window.Html5Qrcode("inline-camera-reader");
    scannerRef.current = html5QrCode;
    
    // Memulai kamera dengan preferensi kamera belakang
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      handleScanSuccess,
      handleScanFailure
    ).catch(err => {
      console.error("Gagal memulai kamera.", err);
    });

    console.log('Inline camera scanner (mode fleksibel) is now rendering.');

    // Fungsi cleanup saat komponen di-unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          console.log('Inline camera scanner has been stopped.');
        }).catch(err => {
          // Mengabaikan error yang kadang muncul saat komponen di-unmount cepat
          if (err && typeof err === 'string' && err.includes("not found")) return;
          console.error('Gagal menghentikan scanner.', err);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    // TRIK UTAMA ADA DI SINI:
    // 1. Container ini memiliki tinggi tetap (h-28) dan overflow-hidden.
    // 2. Ini akan "memotong" video dari library yang ukurannya lebih besar.
    <div className="mt-4 max-w-sm mx-auto h-28 rounded-xl overflow-hidden bg-slate-900 ring-4 ring-white/10">
      {/* 3. Div ini adalah tempat library merender video. */}
      <div id="inline-camera-reader" className="w-full h-full"></div>
    </div>
  );
}

