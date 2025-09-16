import { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Landmark, Printer, PlusCircle, Camera } from 'lucide-react';

// Komponen untuk animasi centang sukses
const SuccessAnimation = () => (
  <>
    <style>{`
      .checkmark__circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        stroke: #0ea5e9; /* sky-500 */
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      .checkmark {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: block;
        stroke-width: 3;
        stroke: #fff;
        stroke-miterlimit: 10;
        margin: 10% auto;
        box-shadow: inset 0px 0px 0px #0ea5e9;
        animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      .checkmark__check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      @keyframes stroke {
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes scale {
        0%, 100% {
          transform: none;
        }
        50% {
          transform: scale3d(1.1, 1.1, 1);
        }
      }
      @keyframes fill {
        100% {
          box-shadow: inset 0px 0px 0px 40px #0ea5e9;
        }
      }
    `}</style>
    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
      <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
  </>
);


export default function PaymentModal({ isOpen, onClose, totalAmount, onSuccess }) {
  const [activeTab, setActiveTab] = useState('tunai');
  const [amountPaid, setAmountPaid] = useState(0);
  const [change, setChange] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false); // State untuk layar sukses

  // Reset state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setAmountPaid(0);
      setChange(0);
      setActiveTab('tunai');
      setIsSuccess(false); // Reset status sukses
    }
  }, [isOpen]);

  // Hitung kembalian
  useEffect(() => {
    if (amountPaid >= totalAmount) {
      setChange(amountPaid - totalAmount);
    } else {
      setChange(0);
    }
  }, [amountPaid, totalAmount]);

  // Handler untuk input jumlah bayar
  const handleAmountChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setAmountPaid(Number(numericValue));
    console.log(`Jumlah bayar diubah menjadi: ${Number(numericValue)}`);
  };

  // Handler saat pembayaran diselesaikan
  const handleSuccess = () => {
    console.log(`Proses pembayaran sukses dengan metode ${activeTab}`);
    setIsSuccess(true); // Tampilkan layar sukses
  };

  // Handler untuk memulai transaksi baru
  const handleNewTransaction = () => {
    console.log('Memulai transaksi baru, modal ditutup.');
    onSuccess(); // Fungsi ini akan mereset keranjang dan menutup modal dari parent
  };
  
  const handlePrintReceipt = () => {
    console.log('Fungsi print nota dummy dijalankan.');
    // Logika print akan ditambahkan di sini
  };

  const handlePhotoProofClick = () => {
    console.log('Tombol "Foto bukti pembayaran" diklik. Buka file picker.');
    // Logika untuk membuka file picker akan ditambahkan di sini.
  };

  if (!isOpen) return null;

  const cashDenominations = [5000, 10000, 20000, 50000, 100000];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        {isSuccess ? (
          // Tampilan setelah pembayaran berhasil
          <div className="p-6 text-center">
            <SuccessAnimation />
            <h2 className="text-2xl font-bold text-slate-800 mt-4">Pembayaran Berhasil</h2>
            <p className="text-slate-500 mb-6">Transaksi telah selesai.</p>
            <div className="space-y-3">
              <button onClick={handlePrintReceipt} className="btn w-full btn-secondary">
                <Printer className="w-4 h-4" /> Print Nota
              </button>
              <button onClick={handleNewTransaction} className="btn w-full btn-primary">
                <PlusCircle className="w-4 h-4" /> Transaksi Baru
              </button>
            </div>
          </div>
        ) : (
          // Tampilan pembayaran normal
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Pembayaran</h2>
              <button onClick={onClose} className="icon-btn hover:bg-slate-100"><X className="w-5 h-5"/></button>
            </div>

            <div className="p-6">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center mb-6">
                <p className="text-sm text-sky-800">Total Tagihan</p>
                <p className="text-4xl font-extrabold text-sky-700">Rp{totalAmount.toLocaleString('id-ID')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={() => setActiveTab('tunai')}
                  className={`btn justify-center ${activeTab === 'tunai' ? 'btn-secondary !ring-2 !ring-sky-500' : ''}`}
                >
                  <Landmark className="w-4 h-4" /> Tunai
                </button>
                <button 
                  onClick={() => setActiveTab('nontunai')}
                  className={`btn justify-center ${activeTab === 'nontunai' ? 'btn-secondary !ring-2 !ring-sky-500' : ''}`}
                >
                  <CreditCard className="w-4 h-4" /> Non-Tunai
                </button>
              </div>

              {activeTab === 'tunai' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Jumlah Bayar (Rp)</label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      value={amountPaid > 0 ? amountPaid.toLocaleString('id-ID') : ''}
                      onChange={handleAmountChange}
                      className="input text-lg text-right"
                      placeholder="0"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {cashDenominations.map(value => (
                       <button key={value} onClick={() => setAmountPaid(value)} className="btn btn-sm flex-1">
                         {value.toLocaleString('id-ID')}
                       </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg">
                    <span className="font-medium">Kembalian</span>
                    <span className="font-bold text-lg">Rp{change.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}

              {activeTab === 'nontunai' && (
                <div className="space-y-3 text-center p-4 border rounded-lg bg-slate-50">
                  <p className="text-slate-600">
                    Konfirmasi jika pelanggan sudah melakukan transfer.
                  </p>
                  <button onClick={handlePhotoProofClick} className="btn w-full">
                    <Camera className="w-4 h-4" />
                    <span>Foto Bukti Pembayaran (Opsional)</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t">
              <button 
                onClick={handleSuccess}
                disabled={activeTab === 'tunai' && amountPaid < totalAmount}
                className="btn btn-primary btn-lg w-full"
              >
                <CheckCircle className="w-5 h-5" /> Selesaikan Pembayaran
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

