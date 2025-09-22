import React from 'react';

// Keterangan: Komponen template untuk header halaman.
// Menerima props 'title', 'rightContent', dan 'children' untuk fleksibilitas.
export default function HeaderTemplate({ title, rightContent, children }) {
  console.log(`// HeaderTemplate: Merender header dengan judul: ${title}`);
  return (
    <div className="flex-shrink-0 sticky top-0 backdrop-blur z-10 py-4 border-b border-slate-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Konten di sisi kiri header (default: children) */}
        {children ? children : (
          <h2 className="text-xl font-bold">{title}</h2>
        )}
        {/* Konten di sisi kanan header (misalnya, tombol atau input) */}
        <div className="flex gap-2">
          {rightContent}
        </div>
      </div>
    </div>
  );
}
