import GudangLayout from '../../layouts/GudangLayout.jsx';

// Komponen ini bertindak sebagai "entry point" untuk seluruh fitur Gudang.
// Tugasnya hanya merender GudangLayout.
export default function Gudang() {
  console.log('Rendering halaman Gudang, memuat GudangLayout...');
  return <GudangLayout />;
}

