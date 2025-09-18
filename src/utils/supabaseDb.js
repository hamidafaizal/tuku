import { supabase } from '../../supabaseClient.js';

// Fungsi untuk menyimpan atau memperbarui data produk di tabel gudang_database
export async function upsertProduct(productData, userId, isUomListEnabled) {
  console.log('Mencoba menyimpan produk ke database...', { productData, userId, isUomListEnabled });

  // Struktur data yang akan dikirim ke Supabase
  const dataToInsert = {
    user_id: userId,
    name: productData.name,
    unit: productData.unit,
    sku: productData.sku,
    // Perubahan di sini: Mengirim data uom jika isUomListEnabled bernilai true, jika tidak mengirim null
    uom: isUomListEnabled ? productData.uom : null,
  };

  const { data, error } = await supabase
    .from('gudang_database')
    .upsert(dataToInsert, { onConflict: 'sku' }) // upsert berdasarkan SKU
    .select();

  if (error) {
    console.error('Error saat menyimpan produk:', error.message);
    throw new Error(error.message);
  }

  console.log('Produk berhasil disimpan:', data);
  console.log('Data yang dikirim ke Supabase:', dataToInsert);
  return data;
}

// Fungsi untuk mengambil semua produk dari tabel gudang_database
export async function fetchProducts(userId) {
  console.log('Mencoba mengambil data produk dari database...');
  const { data, error } = await supabase
    .from('gudang_database')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error saat mengambil data produk:', error.message);
    throw new Error(error.message);
  }

  console.log('Data produk berhasil diambil:', data);
  return data;
}

// Fungsi untuk mengambil data harga jual dari tabel harga_jual
export async function fetchHargaJual(userId) {
  console.log('Mencoba mengambil data harga jual dari database...');
  const { data, error } = await supabase
    .from('harga_jual')
    .select('*, gudang_database (name, unit, uom)') // Mengambil data nama, unit, dan uom dari tabel gudang_database
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error saat mengambil data harga jual:', error.message);
    throw new Error(error.message);
  }
  
  const mergedData = data.map(item => {
    // Keterangan: Menggabungkan data uom dari gudang_database ke objek harga_jual
    const uomList = item.gudang_database.uom ? item.gudang_database.uom.map(uom => ({
      uomList: uom.uomList,
      uomQuantity: uom.uomQuantity,
      harga: item.harga_jual_uom?.find(h => h.uomList === uom.uomList)?.harga || 0
    })) : null;

    return {
      ...item,
      name: item.gudang_database.name,
      unit: item.gudang_database.unit,
      uom_list: uomList
    };
  });
  
  console.log('Data harga jual berhasil diambil:', mergedData);
  return mergedData;
}

// Fungsi baru untuk memperbarui harga jual
export async function updateHargaJual(id, newHargaJualDasar, newHargaJualUom) {
  console.log('Mencoba memperbarui harga jual...', { id, newHargaJualDasar, newHargaJualUom });
  
  const { data, error } = await supabase
    .from('harga_jual')
    .update({ 
      harga_jual_dasar: newHargaJualDasar,
      harga_jual_uom: newHargaJualUom
    })
    .eq('id', id);

  if (error) {
    console.error('Error saat memperbarui harga jual:', error.message);
    throw new Error(error.message);
  }

  console.log('Harga jual berhasil diperbarui:', data);
  return data;
}

// Keterangan: Fungsi untuk menghapus produk dari database
export async function deleteProducts(ids, userId) {
  console.log('Mencoba menghapus produk dari database...', { ids, userId });

  const { data, error } = await supabase
    .from('gudang_database')
    .delete()
    .eq('user_id', userId)
    .in('id', ids);

  if (error) {
    console.error('Error saat menghapus produk:', error.message);
    throw new Error(error.message);
  }

  console.log('Produk berhasil dihapus:', data);
  return data;
}

// Keterangan: Fungsi baru untuk menambah stok ke tabel gudang_stok_masuk
export async function addStockToDb(stockData) {
  console.log('Mencoba menyimpan data stok masuk ke database...', { stockData });
  
  const { data, error } = await supabase
    .from('gudang_stok_masuk')
    .insert([
      {
        user_id: stockData.user_id,
        product_sku: stockData.product_sku,
        quantity: stockData.quantity,
        total_quantity_base_unit: stockData.total_quantity_base_unit,
      },
    ])
    .select();

  if (error) {
    console.error('Error saat menyimpan stok masuk:', error.message);
    throw new Error(error.message);
  }

  console.log('Stok masuk berhasil disimpan:', data);
  return data;
}

// Keterangan: Fungsi untuk mengambil riwayat stok masuk
export async function fetchStockHistory(userId, startDate = null, endDate = null) {
  console.log('Mencoba mengambil riwayat stok masuk dari database...');
  let query = supabase
    .from('gudang_stok_masuk')
    .select(`*`) // Mengambil semua kolom
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate);
  }

  if (endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setDate(endOfDay.getDate() + 1);
    query = query.lt('created_at', endOfDay.toISOString().split('T')[0]);
  }
  
  const { data: historyData, error } = await query;
  
  if (error) {
    console.error('Error saat mengambil riwayat stok:', error.message);
    throw new Error(error.message);
  }

  // Mengambil semua SKU dari riwayat stok
  const productSkus = historyData.map(item => item.product_sku);

  // Mengambil data produk dari tabel gudang_database
  const { data: productsData, error: productsError } = await supabase
    .from('gudang_database')
    .select('sku, name, unit, uom')
    .eq('user_id', userId);

  if (productsError) {
    console.error('Error saat mengambil data produk untuk riwayat:', productsError.message);
    throw new Error(productsError.message);
  }

  // Menggabungkan data produk dan riwayat stok
  const mergedData = historyData.map(historyItem => {
    let productDetails = {};
    let matchedUomItem = null;

    // Mencari detail produk dari SKU yang ada di riwayat
    const baseProduct = productsData.find(p => p.sku === historyItem.product_sku);
    
    if (baseProduct) {
      productDetails = {
        name: baseProduct.name,
        unit: baseProduct.unit,
        base_unit: baseProduct.unit,
        matched_uom_unit: baseProduct.unit
      };
    } else {
      // Jika bukan SKU dasar, coba cari di UOM List
      for (const p of productsData) {
        if (p.uom) {
          matchedUomItem = p.uom.find(uomItem => uomItem.sku === historyItem.product_sku);
          if (matchedUomItem) {
            productDetails = {
              name: p.name,
              unit: matchedUomItem.uomList,
              base_unit: p.unit,
              matched_uom_unit: matchedUomItem.uomList
            };
            break;
          }
        }
      }
    }

    return {
      ...historyItem,
      product_name: productDetails.name || 'Produk tidak ditemukan',
      product_unit: productDetails.matched_uom_unit || 'N/A',
      base_unit: productDetails.base_unit || 'N/A',
    };
  });
  
  console.log('Riwayat stok berhasil diambil dan digabungkan:', mergedData);
  return mergedData;
}
