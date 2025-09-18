import { supabase } from '../../supabaseClient.js';

// Keterangan: Fungsi untuk mengambil semua produk beserta UOM list-nya
export async function fetchProductsWithUom() {
  console.log('Mencoba mengambil produk dan UOM dari database.');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, base_unit, base_sku, uom(id, uom_name, uom_sku, quantity_per_uom)');

  if (productsError) {
    console.error('Gagal mengambil data produk:', productsError);
    return { data: null, error: productsError };
  }
  
  // Mengubah nama key UOM agar sesuai dengan format di frontend
  const formattedProducts = products.map(product => {
    const uomList = product.uom ? product.uom.map(uom => ({
      uomList: uom.uom_name,
      uomQuantity: uom.quantity_per_uom,
      sku: uom.uom_sku
    })) : null;
    return { ...product, uom: uomList };
  });

  console.log('Data produk dan UOM berhasil diambil:', formattedProducts);
  return { data: formattedProducts, error: null };
}

// Keterangan: Fungsi untuk menyimpan produk baru beserta UOM jika ada
export async function insertNewProduct(newItemData) {
  console.log('Mencoba menyimpan produk baru:', newItemData.name);
  const { name, unit, sku, uom } = newItemData;
  
  // Masukkan data ke tabel products
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      user_id: (await supabase.auth.getSession()).data.session.user.id,
      name: name,
      base_unit: unit,
      base_sku: sku
    })
    .select()
    .single();

  if (productError) {
    console.error('Gagal menyimpan produk baru:', productError);
    return { data: null, error: productError };
  }

  // Keterangan: Array untuk menyimpan semua data harga yang akan dimasukkan
  const priceInsertData = [];

  // Keterangan: Siapkan data harga untuk satuan dasar (uom_id: null)
  priceInsertData.push({
    product_id: product.id,
    sku: product.base_sku,
    selling_price: 0,
    cost_price: 0,
  });
  
  let uomResult = null; // Inisialisasi uomResult dengan nilai null

  // Jika ada data UOM, masukkan ke tabel uom dan siapkan data prices
  if (uom && uom.length > 0) {
    const uomDataToInsert = uom.map(uomItem => ({
      product_id: product.id,
      uom_name: uomItem.uomList,
      uom_sku: uomItem.sku,
      quantity_per_uom: uomItem.uomQuantity,
    }));
    
    const { data: result, error: uomError } = await supabase
      .from('uom')
      .insert(uomDataToInsert)
      .select();

    if (uomError) {
      console.error('Gagal menyimpan UOM:', uomError);
      // Rollback produk yang sudah disimpan
      await supabase.from('products').delete().eq('id', product.id);
      return { data: null, error: uomError };
    }
    uomResult = result; // Tetapkan nilai uomResult di sini

    uomResult.forEach(uomItem => {
      priceInsertData.push({
        product_id: product.id,
        uom_id: uomItem.id,
        sku: uomItem.uom_sku,
        selling_price: 0,
        cost_price: 0,
      });
    });

    console.log('Produk baru dan UOM berhasil disimpan:', { product, uom: uomResult });
  }

  // Masukkan semua data harga (dasar dan UOM) ke tabel prices
  const { data: priceResult, error: priceError } = await supabase
    .from('prices')
    .insert(priceInsertData);

  if (priceError) {
    console.error('Gagal menyimpan harga jual:', priceError);
    await supabase.from('products').delete().eq('id', product.id);
    return { data: null, error: priceError };
  }

  console.log('Produk baru, UOM, dan harga berhasil disimpan.');
  return { data: { product, uom: uomResult, prices: priceResult }, error: null };
}

// Keterangan: Fungsi untuk menghapus produk berdasarkan ID
export async function deleteProduct(productId) {
  console.log('Mencoba menghapus produk dengan ID:', productId);
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Gagal menghapus produk:', error);
    return { success: false, error };
  }

  console.log('Produk berhasil dihapus.');
  return { success: true, error: null };
}

// Keterangan: Fungsi untuk mengambil data harga jual dari tabel products, uom, dan prices
export async function fetchHargaJual() {
  console.log('Mencoba mengambil data harga jual dari database.');
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      base_unit,
      prices(id, selling_price, uom_id, sku),
      uom(id, uom_name, quantity_per_uom)
    `);

  if (error) {
    console.error('Gagal mengambil data harga jual:', error);
    return { data: null, error };
  }

  // Keterangan: Memformat data agar sesuai dengan struktur di komponen HargaJual.jsx
  const formattedData = data.map(product => {
    const prices = product.prices || [];
    const uomList = product.uom || [];

    const basePriceData = prices.find(p => !p.uom_id);
    const uomPriceData = prices.filter(p => p.uom_id);

    const formattedUomList = uomList.map(uomItem => {
      const uomPrice = uomPriceData.find(p => p.uom_id === uomItem.id);
      return {
        id: uomPrice ? uomPrice.id : null,
        uomList: uomItem.uom_name,
        uomQuantity: uomItem.quantity_per_uom,
        harga: uomPrice ? uomPrice.selling_price : 0,
        sku: uomPrice ? uomPrice.sku : null,
      };
    });

    return {
      id: product.id,
      name: product.name,
      unit: product.base_unit,
      harga_jual_dasar: basePriceData ? basePriceData.selling_price : 0,
      uom_list: formattedUomList.length > 0 ? formattedUomList : null,
    };
  });

  console.log('Data harga jual berhasil diambil:', formattedData);
  return { data: formattedData, error: null };
}

// Keterangan: Fungsi untuk memperbarui harga jual di tabel prices
export async function updateHargaJual(updates) {
  console.log('Mencoba memperbarui harga jual:', updates);
  const { basePriceId, basePrice, productId, uomUpdates } = updates;

  const updatePromises = [];

  // Keterangan: Memperbarui harga satuan dasar
  updatePromises.push(
    supabase
      .from('prices')
      .update({ selling_price: basePrice })
      .eq('product_id', productId)
      .is('uom_id', null)
  );
  
  if (uomUpdates && uomUpdates.length > 0) {
    for (const uom of uomUpdates) {
      if (uom.id) {
        updatePromises.push(
          supabase
            .from('prices')
            .update({ selling_price: uom.harga })
            .eq('id', uom.id)
        );
      }
    }
  }

  const results = await Promise.all(updatePromises);
  const errors = results.map(res => res.error).filter(Boolean);

  if (errors.length > 0) {
    console.error('Gagal memperbarui harga jual:', errors);
    return { success: false, error: errors[0] };
  }

  console.log('Harga jual berhasil diperbarui.');
  return { success: true, error: null };
}
