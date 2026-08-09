// ========================================
// SMART TOKO - DATABASE & LOCALSTORAGE
// ========================================

// Default Data Barang Supermarket yang Lebih Banyak
let defaultBarang = [
    { kode: "BRG001", nama: "Indomie Goreng 1 Dus", harga: 115000, stok: 25 },
    { kode: "BRG002", nama: "Aqua Botol 600ml", harga: 3500, stok: 100 },
    { kode: "BRG003", nama: "Teh Botol Sosro 450ml", harga: 5500, stok: 60 },
    { kode: "BRG004", nama: "Susu Ultra Milk Cokelat 1L", harga: 19000, stok: 30 },
    { kode: "BRG005", nama: "Minyak Goreng Bimoli 2L", harga: 38000, stok: 45 },
    { kode: "BRG006", nama: "Beras Premium 5kg", harga: 72000, stok: 20 },
    { kode: "BRG007", nama: "Gula Pasir 1kg", harga: 16500, stok: 50 },
    { kode: "BRG008", nama: "Telur Ayam 1kg", harga: 28000, stok: 35 },
    { kode: "BRG009", nama: "Chitato Snack Sapi Panggang", harga: 10000, stok: 40 },
    { kode: "BRG010", nama: "Sabun Mandi Lifebuoy", harga: 4500, stok: 80 }
];

// Ambil data dari localStorage atau gunakan default jika belum ada
let barang = JSON.parse(localStorage.getItem("smart_toko_barang")) || defaultBarang;
let riwayatTransaksi = JSON.parse(localStorage.getItem("smart_toko_riwayat")) || [];
let totalPenjualan = Number(localStorage.getItem("smart_toko_pendapatan")) || 0;

let keranjang = [];

// ========================================
// SISTEM LOGIN
// ========================================

function prosesLogin() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim(); // Perhatikan bagian .value di sini

    if (user === "andy" && pass === "andy88") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("appContainer").style.display = "flex";
        
        updateDashboard();
        tampilkanBarang();
        tampilkanProdukKasir();
        tampilkanRiwayat();
    } else {
        alert("Username atau Password salah! (Gunakan admin / 123)");
    }
}

function logout() {
    if (confirm("Keluar dari aplikasi?")) {
        document.getElementById("loginPage").style.display = "flex";
        document.getElementById("appContainer").style.display = "none";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }
}

// Simpan data otomatis ke memori browser
function simpanData() {
    localStorage.setItem("smart_toko_barang", JSON.stringify(barang));
    localStorage.setItem("smart_toko_riwayat", JSON.stringify(riwayatTransaksi));
    localStorage.setItem("smart_toko_pendapatan", totalPenjualan);
}

// ========================================
// NAVIGASI HALAMAN
// ========================================

function showPage(page) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(item => item.classList.remove("active"));

    document.getElementById(page).classList.add("active");

    if (page === "dashboard") updateDashboard();
    if (page === "barang") tampilkanBarang();
    if (page === "kasir") {
        tampilkanProdukKasir();
        tampilkanKeranjang();
    }
    if (page === "riwayat") tampilkanRiwayat();
}

// ========================================
// FORMAT RUPIAH
// ========================================

function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {
    document.getElementById("totalBarang").innerText = barang.length;

    let stok = 0;
    barang.forEach(item => stok += Number(item.stok));
    document.getElementById("totalStok").innerText = stok;

    document.getElementById("totalPenjualan").innerText = rupiah(totalPenjualan);
}

// ========================================
// TAMBAH BARANG
// ========================================

function tambahBarang() {
    const kode = document.getElementById("kodeBarang").value.trim();
    const nama = document.getElementById("namaBarang").value.trim();
    const harga = Number(document.getElementById("hargaBarang").value);
    const stok = Number(document.getElementById("stokBarang").value);

    if (!kode || !nama || harga <= 0 || stok < 0) {
        alert("Mohon isi semua data barang dengan benar.");
        return;
    }

    const sudahAda = barang.some(item => item.kode.toLowerCase() === kode.toLowerCase());
    if (sudahAda) {
        alert("Kode barang sudah digunakan.");
        return;
    }

    barang.push({ kode, nama, harga, stok });
    simpanData();

    alert("Barang berhasil ditambahkan!");

    document.getElementById("kodeBarang").value = "";
    document.getElementById("namaBarang").value = "";
    document.getElementById("hargaBarang").value = "";
    document.getElementById("stokBarang").value = "";

    showPage("barang");
}

// ========================================
// TAMPIL DATA BARANG
// ========================================

function tampilkanBarang() {
    const tabel = document.getElementById("tabelBarang");
    tabel.innerHTML = "";

    if (barang.length === 0) {
        tabel.innerHTML = `<tr><td colspan="6" style="text-align:center">Belum ada barang</td></tr>`;
        return;
    }

    barang.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td>${rupiah(item.harga)}</td>
            <td>${item.stok}</td>
            <td>
                <button class="btn-delete" onclick="hapusBarang(${index})">Hapus</button>
            </td>
        `;
        tabel.appendChild(row);
    });
}

function hapusBarang(index) {
    const nama = barang[index].nama;
    if (!confirm("Hapus barang " + nama + "?")) return;

    barang.splice(index, 1);
    simpanData();

    tampilkanBarang();
    tampilkanProdukKasir();
    updateDashboard();
}

// ========================================
// KASIR & KERANJANG
// ========================================

function tampilkanProdukKasir() {
    const container = document.getElementById("produkKasir");
    container.innerHTML = "";

    if (barang.length === 0) {
        container.innerHTML = "<p>Belum ada barang.</p>";
        return;
    }

    barang.forEach((item, index) => {
        const produk = document.createElement("div");
        produk.className = "produk";
        produk.onclick = () => tambahKeKeranjang(index);

        produk.innerHTML = `
            <div class="produk-name">${item.nama}</div>
            <div class="produk-price">${rupiah(item.harga)}</div>
            <div class="produk-stock">Stok: ${item.stok}</div>
        `;
        container.appendChild(produk);
    });
}

function tambahKeKeranjang(index) {
    const produk = barang[index];

    if (produk.stok <= 0) {
        alert("Stok barang habis!");
        return;
    }

    const existing = keranjang.find(item => item.kode === produk.kode);

    if (existing) {
        if (existing.qty >= produk.stok) {
            alert("Jumlah melebihi stok!");
            return;
        }
        existing.qty++;
    } else {
        keranjang.push({
            kode: produk.kode,
            nama: produk.nama,
            harga: produk.harga,
            qty: 1
        });
    }

    tampilkanKeranjang();
}

function tampilkanKeranjang() {
    const container = document.getElementById("keranjang");
    container.innerHTML = "";

    if (keranjang.length === 0) {
        container.innerHTML = '<p class="empty">Belum ada barang</p>';
        document.getElementById("totalKasir").innerText = rupiah(0);
        return;
    }

    keranjang.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        const subtotal = item.harga * item.qty;

        div.innerHTML = `
            <div>
                <div class="cart-item-name">${item.nama}</div>
                <div class="cart-item-price">${rupiah(item.harga)}</div>
            </div>
            <div class="qty">
                <button onclick="kurangiQty(${index})">-</button>
                <strong>${item.qty}</strong>
                <button onclick="tambahQty(${index})">+</button>
            </div>
            <div>${rupiah(subtotal)}</div>
        `;
        container.appendChild(div);
    });

    hitungTotal();
}

function tambahQty(index) {
    const item = keranjang[index];
    const produk = barang.find(b => b.kode === item.kode);

    if (item.qty >= produk.stok) {
        alert("Jumlah melebihi stok!");
        return;
    }
    item.qty++;
    tampilkanKeranjang();
}

function kurangiQty(index) {
    keranjang[index].qty--;
    if (keranjang[index].qty <= 0) {
        keranjang.splice(index, 1);
    }
    tampilkanKeranjang();
}

function hitungTotal() {
    let total = 0;
    keranjang.forEach(item => total += item.harga * item.qty);
    document.getElementById("totalKasir").innerText = rupiah(total);
    hitungKembalian();
}

function hitungKembalian() {
    let total = 0;
    keranjang.forEach(item => total += item.harga * item.qty);

    const pembayaran = Number(document.getElementById("pembayaran").value) || 0;
    const kembali = pembayaran - total;

    document.getElementById("kembalian").innerText = rupiah(Math.max(kembali, 0));
}

// ========================================
// PEMBAYARAN & RIWAYAT
// ========================================

function prosesPembayaran() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    let total = 0;
    keranjang.forEach(item => total += item.harga * item.qty);

    const pembayaran = Number(document.getElementById("pembayaran").value) || 0;

    if (pembayaran < total) {
        alert("Uang pembayaran kurang " + rupiah(total - pembayaran));
        return;
    }

    const kembali = pembayaran - total;

    // Buat Struk
    buatStruk(total, pembayaran, kembali);

    // Kurangi Stok Produk
    keranjang.forEach(item => {
        const produk = barang.find(b => b.kode === item.kode);
        if (produk) {
            produk.stok -= item.qty;
        }
    });

    totalPenjualan += total;

    // Simpan ke Riwayat Transaksi
    const waktuSkrg = new Date().toLocaleString("id-ID");
    const rincianStr = keranjang.map(i => `${i.nama} (x${i.qty})`).join(", ");

    riwayatTransaksi.unshift({
        waktu: waktuSkrg,
        rincian: rincianStr,
        total: total,
        bayar: pembayaran,
        kembali: kembali
    });

    // Simpan permanen ke localStorage
    simpanData();

    // Reset Kasir
    keranjang = [];
    document.getElementById("pembayaran").value = "";
    document.getElementById("kembalian").innerText = rupiah(0);

    tampilkanKeranjang();
    tampilkanProdukKasir();
    tampilkanBarang();
    updateDashboard();
    tampilkanRiwayat();
}

function tampilkanRiwayat() {
    const tabel = document.getElementById("tabelRiwayat");
    if (!tabel) return;
    
    tabel.innerHTML = "";

    if (riwayatTransaksi.length === 0) {
        tabel.innerHTML = `<tr><td colspan="6" style="text-align:center">Belum ada transaksi</td></tr>`;
        return;
    }

    riwayatTransaksi.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.waktu}</td>
            <td>${item.rincian}</td>
            <td>${rupiah(item.total)}</td>
            <td>${rupiah(item.bayar)}</td>
            <td>${rupiah(item.kembali)}</td>
        `;
        tabel.appendChild(row);
    });
}

// ========================================
// STRUK
// ========================================

function buatStruk(total, pembayaran, kembali) {
    const isi = document.getElementById("isiStruk");
    isi.innerHTML = "";

    keranjang.forEach(item => {
        const subtotal = item.harga * item.qty;
        const div = document.createElement("div");
        div.className = "struk-item";
        div.innerHTML = `<span>${item.nama} x${item.qty}</span><span>${rupiah(subtotal)}</span>`;
        isi.appendChild(div);
    });

    document.getElementById("strukTotal").innerText = rupiah(total);
    document.getElementById("strukBayar").innerText = rupiah(pembayaran);
    document.getElementById("strukKembali").innerText = rupiah(kembali);
    document.getElementById("struk").classList.add("show");
}

function tutupStruk() {
    document.getElementById("struk").classList.remove("show");
}