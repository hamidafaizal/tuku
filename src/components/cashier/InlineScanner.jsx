import { useEffect } from 'react';

// Komponen untuk menampilkan view scanner secara inline di bawah search bar
export default function InlineScanner({ onScanSuccess }) {
  useEffect(() => {
    // Memastikan library scanner sudah dimuat dari CDN via index.html
    if (!window.Html5QrcodeScanner) {
      console.error("Library Html5QrcodeScanner belum termuat.");
      return;
    }

    // Fungsi yang akan dipanggil saat scan berhasil
    function handleScanSuccess(decodedText, decodedResult) {
      console.log(`Kode sukses di-scan via kamera: ${decodedText}`, decodedResult);
      onScanSuccess(decodedText);
    }

    // Inisialisasi scanner dari library
    const html5QrcodeScanner = new window.Html5QrcodeScanner(
      "inline-camera-reader", // ID unik untuk container ini
      {
        fps: 10,
        qrbox: { width: 250, height: 150 }, // Dibuat lebih landscape agar tidak terlalu tinggi
        supportedScanTypes: [0] // 0 = Camera
      },
      false // verbose mode
    );

    // Mulai rendering scanner
    html5QrcodeScanner.render(handleScanSuccess, () => {});
    console.log('Inline camera scanner is now rendering.');

    // Fungsi cleanup saat komponen dilepas (unmounted)
    return () => {
      // Cek jika scanner instance ada sebelum memanggil clear()
      // Ini penting untuk mematikan kamera saat komponen disembunyikan
      if (html5QrcodeScanner && html5QrcodeScanner.getState() === 2) { // 2 = SCANNING
        html5QrcodeScanner.clear().catch(error => {
          console.error("Gagal membersihkan inline camera scanner.", error);
        });
        console.log('Inline camera scanner has been cleared.');
      }
    };
  }, [onScanSuccess]); // Dependensi effect

  return (
    <div className="mt-4 bg-black rounded-xl p-2">
      {/* Container untuk view kamera */}
      <div id="inline-camera-reader" className="w-full bg-slate-800 rounded-lg overflow-hidden"></div>
    </div>
  );
}
