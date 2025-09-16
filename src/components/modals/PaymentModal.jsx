import { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Landmark } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, totalAmount, onSuccess }) {
  const [activeTab, setActiveTab] = useState('tunai'); // 'tunai' atau 'nontunai'
  const [amountPaid, setAmountPaid] = useState('');
  const [change, setChange] = useState(0);

  // Reset state saat modal ditutup atau total berubah
  useEffect(() => {
    if (isOpen) {
      setAmountPaid('');
      setChange(0);
      setActiveTab('tunai');
    }
  }, [isOpen, totalAmount]);

  // Hitung kembalian saat jumlah bayar berubah
  useEffect(() => {
    const paid = parseFloat(amountPaid) || 0;
    if (paid >= totalAmount) {
      setChange(paid - totalAmount);
    } else {
      setChange(0);
    }
  }, [amountPaid, totalAmount]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    console.log(`Proses pembayaran sukses dengan metode ${activeTab}`);
    onSuccess();
  };
  
  const cashDenominations = [50000, 100000, Math.ceil(totalAmount / 1000) * 1000];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Pembayaran</h2>
          <button onClick={onClose} className="icon-btn hover:bg-slate-100"><X className="w-5 h-5"/></button>
        </div>

        {/* Konten Modal */}
        <div className="p-6">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center mb-6">
            <p className="text-sm text-sky-800">Total Tagihan</p>
            <p className="text-4xl font-extrabold text-sky-700">Rp{totalAmount.toLocaleString('id-ID')}</p>
          </div>

          {/* Tab Pilihan Metode Bayar */}
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

          {/* Konten Sesuai Tab */}
          {activeTab === 'tunai' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Jumlah Bayar (Rp)</label>
                <input 
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="input text-lg text-right"
                  placeholder="0"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                {cashDenominations.filter((v, i, a) => a.indexOf(v) === i && v >= totalAmount).sort((a,b) => a-b).map(value => (
                   <button key={value} onClick={() => setAmountPaid(value)} className="btn btn-sm flex-1">Rp{value.toLocaleString('id-ID')}</button>
                ))}
              </div>
              <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg">
                <span className="font-medium">Kembalian</span>
                <span className="font-bold text-lg">Rp{change.toLocaleString('id-ID')}</span>
              </div>
            </div>
          )}

          {activeTab === 'nontunai' && (
            <div className="text-center p-4 border rounded-lg bg-slate-50">
              <p className="font-semibold">Silakan Scan QRIS</p>
              <img src={`https://placehold.co/200x200/ffffff/000000?text=QRIS`} alt="QRIS Code" className="mx-auto my-2" />
              <p className="text-sm text-slate-500">Arahkan kamera pelanggan ke kode QR di atas.</p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t">
          <button 
            onClick={handleSuccess}
            disabled={activeTab === 'tunai' && (parseFloat(amountPaid) || 0) < totalAmount}
            className="btn btn-primary btn-lg w-full"
          >
            <CheckCircle className="w-5 h-5" /> Selesaikan Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
