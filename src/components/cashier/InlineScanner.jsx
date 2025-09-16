import { useEffect, useRef } from 'react';

// Komponen untuk menampilkan view scanner secara inline dengan UI kustom
export default function InlineScanner({ onScanSuccess }) {
  const scannerRef = useRef(null); // Ref untuk instance scanner
  // Ref untuk melacak kode terakhir yang di-scan dan waktunya
  const lastScanRef = useRef({ code: null, time: 0 }); 

  useEffect(() => {
    if (!window.Html5Qrcode) {
      console.error("Library Html5Qrcode belum termuat.");
      return;
    }

    const handleScanSuccess = (decodedText, decodedResult) => {
      const now = Date.now();
      const COOLDOWN_MS = 10000; // Jeda 10 detik untuk barcode yang sama

      // Cek apakah barcode yang di-scan sama dengan yang terakhir
      // dan apakah masih dalam periode cooldown.
      if (
        decodedText === lastScanRef.current.code && 
        (now - lastScanRef.current.time < COOLDOWN_MS)
      ) {
        console.log(`Barcode ${decodedText} diabaikan (cooldown).`);
        return; // Abaikan scan jika sama dan masih dalam cooldown
      }

      // Jika barcode baru atau cooldown sudah selesai, proses scan.
      console.log(`Kode sukses di-scan via kamera: ${decodedText}`, decodedResult);
      
      // Perbarui ref dengan kode dan waktu scan yang baru
      lastScanRef.current = { code: decodedText, time: now };
      
      onScanSuccess(decodedText);
    };
    
    const handleScanFailure = (error) => {
      // Mengabaikan error umum 'not found'
    };

    // Konfigurasi scanner dengan area pindai yang lebih pas untuk view kecil
    const config = {
      fps: 10,
      qrbox: { width: 180, height: 60 }, 
    };

    const html5QrCode = new window.Html5Qrcode("inline-camera-reader");
    scannerRef.current = html5QrCode;
    
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      handleScanSuccess,
      handleScanFailure
    ).then(() => {
      // SOLUSI UTAMA: Dijalankan setelah kamera berhasil dimulai
      console.log('Kamera berhasil dimulai, mengubah style video...');
      const videoElement = document.querySelector('#inline-camera-reader video');
      
      if (videoElement) {
        // Memaksa elemen video untuk mengisi kontainer kecil kita
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover'; // 'Cover' memastikan video mengisi ruang tanpa distorsi
      }
    }).catch(err => {
      console.error("Gagal memulai kamera.", err);
    });

    console.log('Inline camera scanner (mode fleksibel) is now rendering.');

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          console.log('Inline camera scanner has been stopped.');
        }).catch(err => {
          if (err && typeof err === 'string' && err.includes("not found")) return;
          console.error('Gagal menghentikan scanner.', err);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    // Container ini tetap kecil, tapi sekarang video di dalamnya juga ikut kecil
    <div className="mt-4 max-w-sm mx-auto h-28 rounded-xl overflow-hidden bg-slate-900 ring-4 ring-white/10 relative">
      <div id="inline-camera-reader" className="w-full h-full"></div>
    </div>
  );
}


