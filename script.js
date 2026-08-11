// KAMUS MULTI-BAHASA & MATA UANG
let bahasaAktif = localStorage.getItem('pos_bahasa') || 'id';

const kamus = {
    id: {
        omsetHarian: "Omset Harian",
        bersihHarian: "Bersih Harian (Laba)",
        omsetBulanan: "Omset Bulanan",
        bersihBulanan: "Bersih Bulanan (Laba)",
        omsetTotal: "Total Omset Seluruhnya (Sejak Toko Buka)",
        labaTotal: "Total Keuntungan Bersih Seluruhnya",
        navDashboard: "Dashboard & Laporan",
        navStok: "Stok & Input Barang",
        navKasir: "Kasir (PAYMENT)",
        navRiwayat: "Riwayat Transaksi",
        keluar: "Keluar",
        simpanProduk: "Simpan / Restock",
        katalog: "Katalog Produk",
        keranjang: "Keranjang Kasir",
        bayar: "Bayar & Cetak Nota",
        mataUang: "Rp",
        tabelWaktu: "Waktu Transaksi",
        tabelDetail: "Detail Belanja",
        tabelOmset: "Total Omset",
        tabelLaba: "Laba Bersih",
        totalKeseluruhan: "Total Keseluruhan:",
        judulInputStok: "Input Barang Baru / Restock",
        placeholderNama: "Nama Barang",
        placeholderModal: "Harga Modal",
        placeholderJual: "Harga Jual",
        placeholderStok: "Jumlah Stok",
        peringatanStok: "Peringatan Stok Menipis (< 5 pcs)",
        stokAman: "Semua stok barang aman.",
        labelSisa: "Sisa",
        placeholderCari: "Cari nama barang..."
    },
    en: {
        omsetHarian: "Daily Turnover",
        bersihHarian: "Daily Net Profit",
        omsetBulanan: "Monthly Turnover",
        bersihBulanan: "Monthly Net Profit",
        omsetTotal: "Total Lifetime Turnover",
        labaTotal: "Total Lifetime Net Profit",
        navDashboard: "Dashboard & Reports",
        navStok: "Stock & Inventory",
        navKasir: "Cashier (POS)",
        navRiwayat: "Transaction History",
        keluar: "Logout",
        simpanProduk: "Save / Restock",
        katalog: "Product Catalog",
        keranjang: "Cart",
        bayar: "Pay & Print Receipt",
        mataUang: "$",
        tabelWaktu: "Transaction Time",
        tabelDetail: "Shopping Details",
        tabelOmset: "Total Turnover",
        tabelLaba: "Net Profit",
        totalKeseluruhan: "Grand Total:",
        judulInputStok: "New Item Input / Restock",
        placeholderNama: "Item Name",
        placeholderModal: "Cost Price",
        placeholderJual: "Selling Price",
        placeholderStok: "Stock Quantity",
        peringatanStok: "Low Stock Warning (< 5 pcs)",
        stokAman: "All stock items are safe.",
        labelSisa: "Left",
        placeholderCari: "Search item name..."
    },
    zh: {
        omsetHarian: "每日营业额",
        bersihHarian: "每日净利润",
        omsetBulanan: "每月营业额",
        bersihBulanan: "每月净利润",
        omsetTotal: "总营业额（开店以来）",
        labaTotal: "总净利润",
        navDashboard: "仪表盘与报告",
        navStok: "库存与商品",
        navKasir: "收银台 (POS)",
        navRiwayat: "交易历史",
        keluar: "登出",
        simpanProduk: "保存 / 补货",
        katalog: "商品目录",
        keranjang: "购物车",
        bayar: "付款并打印收据",
        mataUang: "NT$",
        tabelWaktu: "交易时间",
        tabelDetail: "购物详情",
        tabelOmset: "总营业额",
        tabelLaba: "净利润",
        totalKeseluruhan: "总计:",
        judulInputStok: "新商品录入 / 补货",
        placeholderNama: "商品名称",
        placeholderModal: "成本价",
        placeholderJual: "售价",
        placeholderStok: "库存数量",
        peringatanStok: "低库存警告 (< 5 件)",
        stokAman: "所有商品库存充足。",
        labelSisa: "剩余",
        placeholderCari: "搜索商品名称..."
    }
};

// DATA AWAL / STATE APLIKASI
let produkList = JSON.parse(localStorage.getItem('pos_produk')) || [
    { nama: "Minyak Goreng 1L", modal: 14000, jual: 16000, stok: 20 },
    { nama: "Gula Pasir 1kg", modal: 12500, jual: 14500, stok: 8 },
    { nama: "Mie Instan (1 Dus)", modal: 95000, jual: 105000, stok: 0 }
];

let riwayatTransaksi = JSON.parse(localStorage.getItem('pos_riwayat')) || [];
let riwayatRestock = JSON.parse(localStorage.getItem('pos_riwayat_restock')) || [];
let keranjang = [];

function simpanData() {
    localStorage.setItem('pos_produk', JSON.stringify(produkList));
    localStorage.setItem('pos_riwayat', JSON.stringify(riwayatTransaksi));
    localStorage.setItem('pos_riwayat_restock', JSON.stringify(riwayatRestock));
}

// FORMAT MATA UANG OTOMATIS BERDASARKAN BAHASA
function formatMataUang(angka) {
    let simbol = kamus[bahasaAktif].mataUang;
    return `${simbol} ${angka.toLocaleString('id-ID')}`;
}

// FUNGSI LIHAT / SEMBUNYIKAN PASSWORD
function togglePasswordLogin() {
    let inputPass = document.getElementById('input-pass');
    let iconPass = document.getElementById('icon-toggle-pass');

    if (inputPass.type === "password") {
        inputPass.type = "text";
        iconPass.classList.remove("fa-eye");
        iconPass.classList.add("fa-eye-slash");
    } else {
        inputPass.type = "password";
        iconPass.classList.remove("fa-eye-slash");
        iconPass.classList.add("fa-eye");
    }
}

// UBAH BAHASA & UPDATE UI
function ubahBahasa(lang) {
    bahasaAktif = lang;
    localStorage.setItem('pos_bahasa', lang);
    perbaruiTampilanBahasa();
}

function perbaruiTampilanBahasa() {
    let t = kamus[bahasaAktif];
    
    if(document.getElementById('stat-label-omset-harian')) document.getElementById('stat-label-omset-harian').innerText = t.omsetHarian;
    if(document.getElementById('stat-label-laba-harian')) document.getElementById('stat-label-laba-harian').innerText = t.bersihHarian;
    if(document.getElementById('stat-label-omset-bulanan')) document.getElementById('stat-label-omset-bulanan').innerText = t.omsetBulanan;
    if(document.getElementById('stat-label-laba-bulanan')) document.getElementById('stat-label-laba-bulanan').innerText = t.bersihBulanan;
    if(document.getElementById('stat-label-omset-total')) document.getElementById('stat-label-omset-total').innerText = t.omsetTotal;
    if(document.getElementById('stat-label-laba-total')) document.getElementById('stat-label-laba-total').innerText = t.labaTotal;

    if(document.getElementById('text-nav-dashboard')) document.getElementById('text-nav-dashboard').innerText = t.navDashboard;
    if(document.getElementById('text-nav-stok')) document.getElementById('text-nav-stok').innerText = t.navStok;
    if(document.getElementById('text-nav-kasir')) document.getElementById('text-nav-kasir').innerText = t.navKasir;
    if(document.getElementById('text-nav-riwayat')) document.getElementById('text-nav-riwayat').innerText = t.navRiwayat;
    if(document.getElementById('text-nav-keluar')) document.getElementById('text-nav-keluar').innerText = t.keluar;

    if(document.getElementById('btn-simpan-produk')) document.getElementById('btn-simpan-produk').innerText = t.simpanProduk;
    if(document.getElementById('title-katalog')) document.getElementById('title-katalog').innerText = t.katalog;
    if(document.getElementById('title-keranjang')) document.getElementById('title-keranjang').innerText = t.keranjang;
    if(document.getElementById('btn-bayar-cetak')) document.getElementById('btn-bayar-cetak').innerText = t.bayar;

    // LABEL KASIR
    if(document.getElementById('label-total')) document.getElementById('label-total').innerText = (bahasaAktif === 'zh') ? '總計:' : 'Total:';
    if(document.getElementById('label-uang-bayar')) document.getElementById('label-uang-bayar').innerText = (bahasaAktif === 'en') ? 'Amount Paid' : (bahasaAktif === 'zh') ? '实付金额' : 'Uang Dibayar';
    if(document.getElementById('label-kembalian')) document.getElementById('label-kembalian').innerText = (bahasaAktif === 'en') ? 'Change:' : (bahasaAktif === 'zh') ? '找零:' : 'Kembalian:';

    // INPUT BARANG BARU / RESTOCK (JUDUL & PLACEHOLDER)
    if(document.getElementById('title-input-stok')) document.getElementById('title-input-stok').innerText = t.judulInputStok;
    if(document.getElementById('form-nama')) document.getElementById('form-nama').placeholder = t.placeholderNama;
    if(document.getElementById('form-modal')) document.getElementById('form-modal').placeholder = t.placeholderModal;
    if(document.getElementById('form-jual')) document.getElementById('form-jual').placeholder = t.placeholderJual;
    if(document.getElementById('form-stok')) document.getElementById('form-stok').placeholder = t.placeholderStok;

    // PERINGATAN STOK MENIPIS & PENCARIAN
    if(document.getElementById('title-peringatan-stok')) document.getElementById('title-peringatan-stok').innerText = t.peringatanStok;
    if(document.getElementById('input-cari-produk')) document.getElementById('input-cari-produk').placeholder = t.placeholderCari;

    // TERJEMAHAN HEADER TABEL RIWAYAT
    if(document.getElementById('th-waktu')) document.getElementById('th-waktu').innerText = t.tabelWaktu;
    if(document.getElementById('th-detail')) document.getElementById('th-detail').innerText = t.tabelDetail;
    if(document.getElementById('th-omset')) document.getElementById('th-omset').innerText = t.tabelOmset;
    if(document.getElementById('th-laba')) document.getElementById('th-laba').innerText = t.tabelLaba;

    muatDashboard();
    muatTabelStok();
    muatTabelRiwayatRestock();
    muatGridKasir();
    renderKeranjang();
    muatTabelRiwayat();
}

// LOGIN SYSTEM
function prosesLogin() {
    let user = document.getElementById('input-user').value;
    let pass = document.getElementById('input-pass').value;

    if (user === "admin" && pass === "12345") {
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('view-app').classList.remove('hidden');
        
        let selectLang = document.getElementById('pilihan-bahasa');
        if(selectLang) selectLang.value = bahasaAktif;

        perbaruiTampilanBahasa();
    } else {
        alert("ID Pengguna atau Password salah!");
    }
}

function logout() {
    document.getElementById('input-user').value = '';
    document.getElementById('input-pass').value = '';
    
    let inputPass = document.getElementById('input-pass');
    let iconPass = document.getElementById('icon-toggle-pass');
    inputPass.type = "password";
    iconPass.classList.remove("fa-eye-slash");
    iconPass.classList.add("fa-eye");

    document.getElementById('view-app').classList.add('hidden');
    document.getElementById('view-login').classList.remove('hidden');
}

// NAVIGASI MENU
function gantiMenu(menu) {
    document.querySelectorAll('[id^="section-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('bg-blue-600', 'text-white');
        el.classList.add('text-gray-300', 'hover:bg-slate-800');
    });

    document.getElementById(`section-${menu}`).classList.remove('hidden');
    let btnAktif = document.getElementById(`nav-${menu}`);
    if(btnAktif) {
        btnAktif.classList.add('bg-blue-600', 'text-white');
        btnAktif.classList.remove('text-gray-300', 'hover:bg-slate-800');
    }
}

// DASHBOARD & LAPORAN + PERINGATAN STOK MENIPIS
function muatDashboard() {
    let tglSekarang = new Date().toISOString().slice(0, 10);
    let blnSekarang = tglSekarang.slice(0, 7);

    let omsetHarian = 0, labaHarian = 0;
    let omsetBulanan = 0, labaBulanan = 0;
    let omsetTotal = 0, labaTotal = 0;

    riwayatTransaksi.forEach(trx => {
        let tglTrx = trx.waktu.slice(0, 10);
        let blnTrx = trx.waktu.slice(0, 7);

        omsetTotal += trx.totalOmset;
        labaTotal += trx.totalLaba;

        if (blnTrx === blnSekarang) {
            omsetBulanan += trx.totalOmset;
            labaBulanan += trx.totalLaba;
        }

        if (tglTrx === tglSekarang) {
            omsetHarian += trx.totalOmset;
            labaHarian += trx.totalLaba;
        }
    });

    document.getElementById('stat-omset-harian').innerText = formatMataUang(omsetHarian);
    document.getElementById('stat-laba-harian').innerText = formatMataUang(labaHarian);
    document.getElementById('stat-omset-bulanan').innerText = formatMataUang(omsetBulanan);
    document.getElementById('stat-laba-bulanan').innerText = formatMataUang(labaBulanan);
    document.getElementById('stat-omset-total').innerText = formatMataUang(omsetTotal);
    document.getElementById('stat-laba-total').innerText = formatMataUang(labaTotal);

    let containerStokTipis = document.getElementById('list-stok-menipis');
    let t = kamus[bahasaAktif];
    if(containerStokTipis) {
        let produkTipis = produkList.filter(p => p.stok < 5);
        if(produkTipis.length === 0) {
            containerStokTipis.innerHTML = `<p class="text-emerald-700 font-medium">${t.stokAman}</p>`;
        } else {
            containerStokTipis.innerHTML = produkTipis.map(p => `<span class="inline-block bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-bold mr-2 mb-1">${p.nama} (${t.labelSisa}: ${p.stok})</span>`).join('');
        }
    }
}

// STOK BARANG & MANAGEMENT
function muatTabelStok() {
    let tbody = document.getElementById('tabel-stok-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    if (produkList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-400">Belum ada data barang.</td></tr>`;
        return;
    }

    produkList.forEach((p, index) => {
        let statusStokWarna = p.stok < 5 ? "text-red-600 font-extrabold" : "text-blue-600 font-bold";
        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 font-semibold text-gray-800">${p.nama}</td>
                <td class="p-3 text-gray-600">${formatMataUang(p.modal)}</td>
                <td class="p-3 text-gray-600">${formatMataUang(p.jual)}</td>
                <td class="p-3 ${statusStokWarna}">${p.stok} pcs</td>
                <td class="p-3 text-center space-x-1">
                    <button onclick="tambahStokLangsung(${index})" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer">
                        <i class="fa-solid fa-plus-minus mr-1"></i> Restock / Koreksi
                    </button>
                    <button onclick="hapusProdukDenganSandi(${index})" class="bg-red-100 hover:bg-red-200 text-red-600 px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer">
                        <i class="fa-solid fa-trash mr-1"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    });
}

// KOREKSI / TAMBAH & KURANG STOK FLEKSIBEL
function tambahStokLangsung(index) {
    let produk = produkList[index];
    let inputKoreksi = prompt(
        `KOREKSI / PENYESUAIAN STOK:\n` +
        `Nama: ${produk.nama}\n` +
        `Stok Saat Ini: ${produk.stok} pcs\n\n` +
        `Masukkan jumlah perubahan:\n` +
        `• Ketik angka positif untuk tambah (Contoh: 10)\n` +
        `• Ketik tanda minus untuk kurang (Contoh: -5)`
    );
    
    if (inputKoreksi === null) return;
    
    let jumlah = parseInt(inputKoreksi);
    if (isNaN(jumlah) || jumlah === 0) {
        alert("Masukkan angka yang valid (tidak boleh nol)!");
        return;
    }

    if (produk.stok + jumlah < 0) {
        alert("Gagal! Stok akhir tidak boleh menjadi minus (kurang dari 0).");
        return;
    }

    let jenisPerubahan = jumlah > 0 ? "Penambahan (Restock)" : "Pengurangan (Koreksi)";
    produk.stok += jumlah;

    riwayatRestock.unshift({
        waktuFormatted: new Date().toLocaleString('id-ID'),
        namaBarang: produk.nama,
        jumlahMasuk: jumlah,
        stokAkhir: produk.stok
    });

    simpanData();
    muatTabelStok();
    muatTabelRiwayatRestock();
    muatGridKasir();
    muatDashboard();

    alert(`${jenisPerubahan} berhasil! Stok "${produk.nama}" sekarang menjadi: ${produk.stok} pcs.`);
}

function hapusProdukDenganSandi(index) {
    let sandiInput = prompt("MASUKKAN PASSWORD ADMINISTRATOR UNTUK MENGHAPUS STOK:");
    
    if (sandiInput === "12345") {
        let namaBarang = produkList[index].nama;
        produkList.splice(index, 1);
        simpanData();
        muatTabelStok();
        muatGridKasir();
        muatDashboard();
        alert(`Produk "${namaBarang}" berhasil dihapus.`);
    } else if (sandiInput !== null) {
        alert("Password salah! Penghapusan dibatalkan.");
    }
}

function tambahProdukBaru() {
    let nama = document.getElementById('form-nama').value.trim();
    let modal = parseFloat(document.getElementById('form-modal').value);
    let jual = parseFloat(document.getElementById('form-jual').value);
    let stok = parseInt(document.getElementById('form-stok').value);

    if (!nama || isNaN(modal) || isNaN(jual) || isNaN(stok)) {
        alert("Semua kolom input produk harus diisi dengan benar!");
        return;
    }

    let indexAda = produkList.findIndex(p => p.nama.toLowerCase() === nama.toLowerCase());

    if (indexAda !== -1) {
        produkList[indexAda].stok += stok;
        produkList[indexAda].modal = modal; 
        produkList[indexAda].jual = jual;

        riwayatRestock.unshift({
            waktuFormatted: new Date().toLocaleString('id-ID'),
            namaBarang: produkList[indexAda].nama,
            jumlahMasuk: stok,
            stokAkhir: produkList[indexAda].stok
        });

        alert(`Barang "${produkList[indexAda].nama}" sudah ada. Stok berhasil ditambahkan sebanyak +${stok} pcs!`);
    } else {
        produkList.push({ nama, modal, jual, stok });

        riwayatRestock.unshift({
            waktuFormatted: new Date().toLocaleString('id-ID'),
            namaBarang: nama,
            jumlahMasuk: stok,
            stokAkhir: stok
        });

        alert(`Produk baru "${nama}" berhasil ditambahkan!`);
    }

    simpanData();
    muatTabelStok();
    muatTabelRiwayatRestock();
    muatGridKasir();
    muatDashboard();

    document.getElementById('form-nama').value = '';
    document.getElementById('form-modal').value = '';
    document.getElementById('form-jual').value = '';
    document.getElementById('form-stok').value = '';
}

// RIWAYAT RESTOCK BARANG
function muatTabelRiwayatRestock() {
    let tbody = document.getElementById('tabel-riwayat-restock-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    if (riwayatRestock.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-3 text-center text-gray-400">Belum ada riwayat penambahan stok.</td></tr>`;
        return;
    }

    riwayatRestock.forEach(item => {
        let warnaJumlah = item.jumlahMasuk > 0 ? "text-emerald-600 font-bold" : "text-red-600 font-bold";
        let teksJumlah = item.jumlahMasuk > 0 ? `+${item.jumlahMasuk} pcs` : `${item.jumlahMasuk} pcs`;

        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 text-gray-600 font-mono text-xs">${item.waktuFormatted}</td>
                <td class="p-3 font-semibold text-gray-800">${item.namaBarang}</td>
                <td class="p-3 ${warnaJumlah}">${teksJumlah}</td>
                <td class="p-3 text-gray-700">${item.stokAkhir} pcs</td>
            </tr>
        `;
    });
}

// KASIR & POS (DENGAN PENCARIAN PRODUK)
function muatGridKasir() {
    let grid = document.getElementById('grid-produk-kasir');
    if(!grid) return;
    grid.innerHTML = '';

    let keyword = document.getElementById('input-cari-produk') ? document.getElementById('input-cari-produk').value.toLowerCase() : "";
    let produkFiltered = produkList.filter(p => p.nama.toLowerCase().includes(keyword));

    if (produkFiltered.length === 0) {
        grid.innerHTML = `<p class="col-span-3 text-center text-gray-400 py-8">Produk tidak ditemukan.</p>`;
        return;
    }

    produkFiltered.forEach((p) => {
        let indexAsli = produkList.findIndex(item => item.nama === p.nama);

        grid.innerHTML += `
            <div onclick="tambahKeKeranjang(${indexAsli})" class="bg-white p-4 rounded-lg shadow-xs border border-gray-200 hover:border-blue-500 cursor-pointer transition flex flex-col justify-between">
                <div>
                    <h4 class="font-bold text-gray-800 text-sm">${p.nama}</h4>
                    <p class="text-xs text-gray-500 mt-1">Stok: ${p.stok}</p>
                </div>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-blue-600 font-bold text-sm">${formatMataUang(p.jual)}</span>
                    <span class="bg-blue-50 text-blue-600 p-1.5 rounded-full text-xs"><i class="fa-solid fa-plus"></i></span>
                </div>
            </div>
        `;
    });
}

function tambahKeKeranjang(index) {
    bunyiBeep(); 
    let produk = produkList[index];
    if (produk.stok <= 0) {
        alert("Stok barang habis!");
        return;
    }

    let itemAda = keranjang.find(item => item.index === index);
    if (itemAda) {
        if (itemAda.qty < produk.stok) {
            itemAda.qty++;
        } else {
            alert("Jumlah melebihi stok tersedia!");
        }
    } else {
        keranjang.push({ index: index, nama: produk.nama, harga: produk.jual, modal: produk.modal, qty: 1 });
    }
    renderKeranjang();
}

function renderKeranjang() {
    let list = document.getElementById('list-keranjang');
    if(!list) return;
    list.innerHTML = '';

    if (keranjang.length === 0) {
        list.innerHTML = `<p class="text-gray-400 text-center mt-12">Belum ada item dipilih</p>`;
        document.getElementById('kasir-total-harga').innerText = formatMataUang(0);
        hitungKembalian();
        return;
    }

    keranjang.forEach((item, idx) => {
        let subtotal = item.harga * item.qty;
        list.innerHTML += `
            <div class="flex justify-between items-center bg-gray-50 p-2 rounded border">
                <div>
                    <h5 class="font-semibold text-gray-800">${item.nama}</h5>
                    <p class="text-[11px] text-gray-500">${item.qty} x ${formatMataUang(item.harga)}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="font-bold text-sm">${formatMataUang(subtotal)}</span>
                    <button onclick="ubahQtyKeranjang(${idx}, -1)" class="text-gray-500 hover:text-red-600 px-1 cursor-pointer"><i class="fa-solid fa-minus"></i></button>
                    <button onclick="ubahQtyKeranjang(${idx}, 1)" class="text-gray-500 hover:text-blue-600 px-1 cursor-pointer"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        `;
    });

    hitungKembalian();
}

function ubahQtyKeranjang(idx, delta) {
    let item = keranjang[idx];
    let stokTersedia = produkList[item.index].stok;

    item.qty += delta;
    if (item.qty > stokTersedia) {
        item.qty = stokTersedia;
        alert("Stok tidak mencukupi!");
    }

    if (item.qty <= 0) {
        keranjang.splice(idx, 1);
    }
    renderKeranjang();
}

function hitungTotalAkhir() {
    let totalAkhir = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    return { subtotal: totalAkhir, diskon: 0, totalAkhir };
}

function hitungKembalian() {
    let { totalAkhir } = hitungTotalAkhir();
    let bayar = parseFloat(document.getElementById('input-uang-bayar').value) || 0;
    let kembalian = bayar - totalAkhir;

    document.getElementById('kasir-total-harga').innerText = formatMataUang(totalAkhir);
    document.getElementById('kasir-uang-kembalian').innerText = formatMataUang(kembalian >= 0 ? kembalian : 0);
}

function prosesPembayaranKasir() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    let { totalAkhir } = hitungTotalAkhir();
    let totalModal = keranjang.reduce((sum, item) => sum + (item.modal * item.qty), 0);
    let bayar = parseFloat(document.getElementById('input-uang-bayar').value) || 0;

    if (bayar < totalAkhir) {
        alert("Uang pembayaran kurang!");
        return;
    }

    bunyiSukses(); 

    keranjang.forEach(item => {
        produkList[item.index].stok -= item.qty;
    });

    let totalLaba = totalAkhir - totalModal;
    let waktuStr = new Date().toLocaleString('id-ID');
    let detailStr = keranjang.map(i => `${i.nama} (${i.qty}x)`).join(', ');

    riwayatTransaksi.unshift({
        waktu: new Date().toISOString(),
        waktuFormatted: waktuStr,
        detail: detailStr,
        totalOmset: totalAkhir,
        totalLaba: totalLaba
    });

    simpanData();
    muatDashboard();
    muatTabelStok();
    muatGridKasir();

    let isiStrukHtml = `<p><b>Waktu:</b> ${waktuStr}</p><hr class="my-1"><div class="space-y-1">`;
    keranjang.forEach(i => {
        isiStrukHtml += `<div class="flex justify-between"><span>${i.nama} (${i.qty}x)</span><span>${formatMataUang(i.harga * i.qty)}</span></div>`;
    });

    let kembalian = bayar - totalAkhir;
    isiStrukHtml += `</div><hr class="my-1"><div class="flex justify-between font-bold"><span>Total:</span><span>${formatMataUang(totalAkhir)}</span></div>`;
    isiStrukHtml += `<div class="flex justify-between"><span>Bayar:</span><span>${formatMataUang(bayar)}</span></div>`;
    isiStrukHtml += `<div class="flex justify-between"><span>Kembali:</span><span>${formatMataUang(kembalian)}</span></div>`;

    document.getElementById('isi-struk').innerHTML = isiStrukHtml;
    document.getElementById('modal-struk').classList.remove('hidden');

    keranjang = [];
    document.getElementById('input-uang-bayar').value = '';
    renderKeranjang();
    muatTabelRiwayat();
}

function tutupStruk() {
    document.getElementById('modal-struk').classList.add('hidden');
}

// RIWAYAT TRANSAKSI PENJUALAN (DENGAN BARIS TOTAL)
function muatTabelRiwayat() {
    let tbody = document.getElementById('tabel-riwayat-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    if (riwayatTransaksi.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-400">Belum ada riwayat transaksi.</td></tr>`;
        return;
    }

    let totalOmsetSemua = 0;
    let totalLabaSemua = 0;

    riwayatTransaksi.forEach(trx => {
        totalOmsetSemua += trx.totalOmset;
        totalLabaSemua += trx.totalLaba;

        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 text-gray-600">${trx.waktuFormatted}</td>
                <td class="p-3 text-gray-800">${trx.detail}</td>
                <td class="p-3 font-bold text-gray-800">${formatMataUang(trx.totalOmset)}</td>
                <td class="p-3 font-bold text-emerald-600">${formatMataUang(trx.totalLaba)}</td>
            </tr>
        `;
    });

    let t = kamus[bahasaAktif];
    tbody.innerHTML += `
        <tr class="bg-gray-100 font-bold border-t-2 border-gray-300">
            <td colspan="2" class="p-3 text-right text-gray-800 uppercase text-xs">${t.totalKeseluruhan}</td>
            <td class="p-3 text-gray-900">${formatMataUang(totalOmsetSemua)}</td>
            <td class="p-3 text-emerald-700">${formatMataUang(totalLabaSemua)}</td>
        </tr>
    `;
}

// EFEK SUARA DIGITAL BARCODE & KASIR
function bunyiBeep() {
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let now = audioCtx.currentTime;
        
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        
        osc.type = 'square'; 
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(1800, now + 0.04); 
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.08);
    } catch (e) {}
}

function bunyiSukses() {
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let now = audioCtx.currentTime;
        
        let notes = [523.25, 659.25, 783.99, 1046.50]; 
        
        notes.forEach((freq, index) => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(freq, now + (index * 0.07));
            
            gain.gain.setValueAtTime(0.1, now + (index * 0.07));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.07) + 0.2);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now + (index * 0.07));
            osc.stop(now + (index * 0.07) + 0.2);
        });
    } catch (e) {}
}