import { useEffect } from 'react';
// import { Html5QrcodeScanner } from 'html5-qrcode'; // Impor dihapus, kita akan gunakan dari global window
import { X } from 'lucide-react';

// Komponen modal untuk menampilkan view dari kamera scanner
export default function CameraScannerModal({ isOpen, onClose, onScanSuccess }) {
  useEffect(() => {
    // Hanya inisialisasi scanner jika modal terbuka
    if (isOpen) {
      // Pastikan library sudah dimuat dari CDN
      if (!window.Html5QrcodeScanner) {
        console.error("Library Html5QrcodeScanner belum termuat.");
        return;
      }

      // Fungsi yang akan dipanggil saat scan berhasil
      function handleScanSuccess(decodedText, decodedResult) {
        console.log(`Kode sukses di-scan via kamera: ${decodedText}`, decodedResult);
        onScanSuccess(decodedText);
      }

      // Inisialisasi scanner dari library yang ada di window
      const html5QrcodeScanner = new window.Html5QrcodeScanner(
        "camera-reader", // ID dari div container
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [0] // 0 = Camera
        },
        false // verbose mode
      );

      // Mulai rendering scanner
      html5QrcodeScanner.render(handleScanSuccess, () => {});
      console.log('Camera scanner is now rendering.');

      // Fungsi cleanup saat komponen dilepas (modal ditutup)
      return () => {
        // Cek jika scanner instance ada sebelum memanggil clear()
        if (html5QrcodeScanner && html5QrcodeScanner.getState() === 2) { // 2 = SCANNING
          html5QrcodeScanner.clear().catch(error => {
            console.error("Gagal membersihkan camera scanner.", error);
          });
          console.log('Camera scanner has been cleared.');
        }
      };
    }
  }, [isOpen, onScanSuccess]); // Dependensi effect

  // Jangan render apapun jika modal tidak terbuka
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-4 relative">
        <h3 className="text-lg font-semibold text-center mb-4">Arahkan Kamera ke Barcode</h3>
        {/* Container untuk view kamera */}
        <div id="camera-reader" className="w-full"></div>
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup scanner"
          className="absolute top-2 right-2 icon-btn bg-white/80 hover:bg-white"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

