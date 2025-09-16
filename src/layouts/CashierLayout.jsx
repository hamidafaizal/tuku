import POS from '/src/pages/cashier/POS.jsx';
import Header from '/src/components/Header.jsx';

export default function CashierLayout() {
  return (
    // Container utama diatur untuk mengisi seluruh layar dan menjadi flex container
    <div className="h-screen bg-slate-50 flex flex-col">
      <Header showMenuButton={false} />
      
      {/* Area main dibuat fleksibel dan dapat di-scroll */}
      <main className="flex-1 overflow-y-auto">
        <POS />
      </main>
    </div>
  );
}

