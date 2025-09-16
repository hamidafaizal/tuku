import { useEffect, useRef } from 'react';

// Komponen untuk menampilkan view scanner secara inline dengan UI kustom
export default function InlineScanner({ onScanSuccess }) {
  const scannerRef = useRef(null); // Ref untuk instance scanner

  useEffect(() => {
    if (!window.Html5Qrcode) {
      console.error("Library Html5Qrcode belum termuat.");
      return;
    }

    const handleScanSuccess = (decodedText, decodedResult) => {
      console.log(`Kode sukses di-scan via kamera: ${decodedText}`, decodedResult);
      onScanSuccess(decodedText);
    };
    
    const handleScanFailure = (error) => {
      // Abaikan error umum "not found"
    };

    // Konfigurasi untuk scanner
    const config = {
      fps: 10,
      // Membuat area scan sekecil mungkin agar tidak menutupi UI lain.
      // Nilai ini bisa disesuaikan lagi jika perlu.
      qrbox: { width: 200, height: 80 }, 
    };

    const html5QrCode = new window.Html5Qrcode("inline-camera-reader");
    scannerRef.current = html5QrCode;
    
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      handleScanSuccess,
      handleScanFailure
    ).catch(err => {
      console.error("Gagal memulai kamera.", err);
    });

    console.log('Inline camera scanner (mode fleksibel) is now rendering.');

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          console.log('Inline camera scanner has been stopped.');
        }).catch(err => {
          // Mengabaikan error yang kadang muncul saat komponen di-unmount cepat
          if (err.includes("not found")) return;
          console.error('Gagal menghentikan scanner.', err);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    // Container dibuat lebih ringkas
    <div className="mt-4 bg-slate-800 rounded-xl p-1 max-w-xs mx-auto">
      <div id="inline-camera-reader" className="w-full rounded-lg overflow-hidden"></div>
    </div>
  );
}

