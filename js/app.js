const hargaPerHari = 6000;
let data = [];

// Elemen UI
const namaInput = document.getElementById("namaInput");
const hariInput = document.getElementById("hariInput");
const addBtn = document.getElementById("addBtn");
const listOrang = document.getElementById("listOrang");
const grandTotal = document.getElementById("grandTotal");
const downloadBtn = document.getElementById("downloadBtn");

// Welcome Screen
const welcome = document.getElementById("welcome");
const startBtn = document.getElementById("startBtn");
const app = document.getElementById("app");

startBtn.addEventListener("click", () => {
  welcome.classList.add("hidden");
  app.classList.remove("hidden");
});

// Load data dari localStorage
const saved = localStorage.getItem("uangMakanData");
if (saved) {
  data = JSON.parse(saved);
  renderList();
}

// Tambah data
addBtn.addEventListener("click", () => {
  const nama = namaInput.value.trim();
  const hari = parseInt(hariInput.value.trim());

  if (!nama || isNaN(hari) || hari <= 0) {
    alert("Isi nama dan jumlah hari dengan benar!");
    return;
  }

  data.push({ nama, hari });
  namaInput.value = "";
  hariInput.value = "";
  renderList();
});

// Render list di UI
function renderList() {
  listOrang.innerHTML = "";
  let total = 0;

  data.forEach((item, i) => {
    const subtotal = item.hari * hargaPerHari;
    total += subtotal;

    const div = document.createElement("div");
    div.classList.add("orang");
    div.innerHTML = `
      <div>
        <span>${i+1}. ${item.nama}</span><br>
        <small>${item.hari} Hari × Rp${hargaPerHari.toLocaleString()} = Rp${subtotal.toLocaleString()}</small>
      </div>
      <div class="aksi">
        <span onclick="editOrang(${i})">✏️</span>
        <span onclick="hapusOrang(${i})">🗑️</span>
      </div>
    `;
    listOrang.appendChild(div);
  });

  grandTotal.innerText = "Rp " + total.toLocaleString();
  localStorage.setItem("uangMakanData", JSON.stringify(data));
}

// Edit
function editOrang(i) {
  const item = data[i];
  const newHari = prompt(`Edit jumlah hari untuk ${item.nama}:`, item.hari);
  if (newHari !== null && !isNaN(newHari) && newHari > 0) {
    data[i].hari = parseInt(newHari);
    renderList();
  }
}

// Hapus
function hapusOrang(i) {
  if (confirm("Hapus data ini?")) {
    data.splice(i, 1);
    renderList();
  }
}

// Download PNG
downloadBtn.addEventListener("click", () => {
  const rowHeight = 30;
  const headerHeight = 150;
  const footerHeight = 150;
  const contentHeight = data.length * rowHeight;
  const canvasHeight = headerHeight + contentHeight + footerHeight;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = Math.max(400, canvasHeight);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(0.5, "#1e3a8a");
  gradient.addColorStop(1, "#2563eb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Judul
  ctx.fillStyle = "white";
  ctx.font = "bold 24px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("Catatan Uang Makan Supplier", canvas.width / 2, 60);

  // Definisi kolom
  const colNo   = { x: 60,  w: 50 };
  const colNama = { x: 110, w: 260 };
  const colHari = { x: 370, w: 170 };
  const colSub  = { x: 540, w: 200 };
  const tableRight = colSub.x + colSub.w;

  // Highlight header background
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(colNo.x, 90, tableRight - colNo.x, 30);

  // Header teks
  ctx.fillStyle = "white";
  ctx.font = "bold 16px Segoe UI";
  ctx.textAlign = "center"; ctx.fillText("No", colNo.x + colNo.w/2, 110);
  ctx.textAlign = "left";   ctx.fillText("Nama", colNama.x + 8, 110);
  ctx.textAlign = "center"; ctx.fillText("Hari", colHari.x + colHari.w/2, 110);
  ctx.textAlign = "right";  ctx.fillText("Subtotal", colSub.x + colSub.w - 8, 110);

  // Garis atas header
  ctx.beginPath();
  ctx.moveTo(colNo.x, 90);
  ctx.lineTo(tableRight, 90);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.stroke();

  // Garis bawah header
  ctx.beginPath();
  ctx.moveTo(colNo.x, 120);
  ctx.lineTo(tableRight, 120);
  ctx.stroke();

  // Data baris
  ctx.font = "14px Segoe UI";
  let y = 150;
  let total = 0;
  data.forEach((item, i) => {
    const subtotal = item.hari * hargaPerHari;
    total += subtotal;

    // Background striped
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(colNo.x, y - 20, tableRight - colNo.x, rowHeight);
    }
    ctx.fillStyle = "white";

    // No
    ctx.textAlign = "center";
    ctx.fillText(`${i+1}`, colNo.x + colNo.w/2, y);

    // Nama
    ctx.textAlign = "left";
    ctx.fillText(item.nama, colNama.x + 8, y);

    // Hari
    ctx.textAlign = "center";
    ctx.fillText(`${item.hari} × Rp${hargaPerHari.toLocaleString()}`, colHari.x + colHari.w/2, y);

    // Subtotal
    ctx.textAlign = "right";
    ctx.fillText(`Rp${subtotal.toLocaleString()}`, colSub.x + colSub.w - 8, y);

    // Garis antar baris
    ctx.beginPath();
    ctx.moveTo(colNo.x, y + 8);
    ctx.lineTo(tableRight, y + 8);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.stroke();

    y += rowHeight;
  });

  // Simpan posisi akhir tabel
  const endY = y;

  // Border kiri
  ctx.beginPath();
  ctx.moveTo(colNo.x, 90);
  ctx.lineTo(colNo.x, endY);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.stroke();

  // Border kanan
  ctx.beginPath();
  ctx.moveTo(tableRight, 90);
  ctx.lineTo(tableRight, endY);
  ctx.stroke();

  // Garis pemisah antar kolom
  ctx.beginPath();
  ctx.moveTo(colNo.x + colNo.w, 90); ctx.lineTo(colNo.x + colNo.w, endY);
  ctx.moveTo(colNama.x + colNama.w, 90); ctx.lineTo(colNama.x + colNama.w, endY);
  ctx.moveTo(colHari.x + colHari.w, 90); ctx.lineTo(colHari.x + colHari.w, endY);
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.stroke();

  // Garis bawah tabel
  ctx.beginPath();
  ctx.moveTo(colNo.x, endY);
  ctx.lineTo(tableRight, endY);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.stroke();

  // Total
  y += 30;
  ctx.font = "bold 18px Segoe UI";
  ctx.textAlign = "left";
  ctx.fillText("Total:", colHari.x + 15, y);
  ctx.textAlign = "right";
  ctx.fillText(`Rp ${total.toLocaleString()}`, colSub.x + colSub.w - 8, y);

  // Uang sampah
  y += 30;
  ctx.font = "italic 14px Segoe UI";
  ctx.textAlign = "right";
  ctx.fillText("+ Uang Sampah", colSub.x + colSub.w - 8, y);

  // Tanggal
  y += 60;
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  ctx.font = "12px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(now.toLocaleDateString("id-ID", options), canvas.width / 2, y);

  // Simpan PNG
  const link = document.createElement("a");
  link.download = "uang-makan.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
