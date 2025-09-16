import { useEffect, useRef } from 'react';

// Komponen untuk menampilkan view scanner secara inline dengan UI kustom
export default function InlineScanner({ onScanSuccess }) {
  const scannerRef = useRef(null); // Ref untuk instance scanner

  useEffect(() => {
    // Memastikan library scanner sudah dimuat dari CDN via index.html
    if (!window.Html5Qrcode) {
      console.error("Library Html5Qrcode belum termuat.");
      return;
    }

    // Fungsi yang akan dipanggil saat scan berhasil
    const handleScanSuccess = (decodedText, decodedResult) => {
      console.log(`Kode sukses di-scan via kamera: ${decodedText}`, decodedResult);
      onScanSuccess(decodedText);
    };
    
    // Fungsi untuk handle error (opsional, tapi baik untuk debugging)
    const handleScanFailure = (error) => {
      // Kita bisa abaikan error "QR code not found" karena itu akan terjadi terus menerus
      // console.warn(`Scan Error: ${error}`);
    };

    // Konfigurasi untuk scanner
    const config = {
      fps: 10, // Frame per second untuk scanning
      // Membuat area scan lebih kecil dan landscape, sesuai bentuk barcode
      qrbox: { width: 250, height: 100 }, 
    };

    // Inisialisasi scanner dengan mode fleksibel
    const html5QrCode = new window.Html5Qrcode("inline-camera-reader");
    scannerRef.current = html5QrCode; // Simpan instance ke ref
    
    // Mulai scanner dengan menargetkan kamera belakang dan konfigurasi kustom
    html5QrCode.start(
      { facingMode: "environment" }, // 1. Selalu prioritaskan kamera belakang
      config,
      handleScanSuccess,
      handleScanFailure
    ).catch(err => {
      console.error("Gagal memulai kamera.", err);
    });

    console.log('Inline camera scanner (mode fleksibel) is now rendering.');

    // Fungsi cleanup saat komponen dilepas (unmounted)
    return () => {
      // Gunakan instance dari ref untuk menghentikan scanner
      // Ini akan mematikan kamera saat komponen disembunyikan
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          console.log('Inline camera scanner has been stopped.');
        }).catch(err => {
          console.error('Gagal menghentikan scanner.', err);
        });
      }
    };
  }, [onScanSuccess]); // Dependensi effect

  return (
    // 3. Mengatur ukuran container agar lebih compact
    <div className="mt-4 bg-slate-800 rounded-xl p-1 max-w-sm mx-auto">
      {/* Container untuk view kamera, tanpa UI bawaan library */}
      {/* 2. Tidak ada tombol start/stop bawaan */}
      <div id="inline-camera-reader" className="w-full rounded-lg overflow-hidden"></div>
    </div>
  );
}

