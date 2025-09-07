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

// Download PNG via Canvas API (dinamis)
downloadBtn.addEventListener("click", () => {
  const rowHeight = 30;   // tinggi tiap baris data
  const headerHeight = 150;
  const footerHeight = 150;

  const contentHeight = data.length * rowHeight;
  const canvasHeight = headerHeight + contentHeight + footerHeight;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Ukuran canvas dinamis
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
  ctx.fillText("📑 Catatan Uang Makan", canvas.width / 2, 60);

  // Header tabel
  ctx.textAlign = "left";
  ctx.font = "bold 16px Segoe UI";
  ctx.fillText("No", 70, 110);
  ctx.fillText("Nama", 150, 110);
  ctx.fillText("Hari", 400, 110);
  ctx.fillText("Subtotal", 560, 110);

  // Garis bawah header
  ctx.beginPath();
  ctx.moveTo(60, 120);
  ctx.lineTo(740, 120);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.stroke();

  // Garis vertikal kolom
  ctx.beginPath();
  ctx.moveTo(120, 100); ctx.lineTo(120, canvas.height - footerHeight);
  ctx.moveTo(380, 100); ctx.lineTo(380, canvas.height - footerHeight);
  ctx.moveTo(540, 100); ctx.lineTo(540, canvas.height - footerHeight);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.stroke();

  // Data baris
  ctx.font = "14px Segoe UI";
  let y = 150;
  let total = 0;
  data.forEach((item, i) => {
    const subtotal = item.hari * hargaPerHari;
    total += subtotal;

    ctx.fillText(`${i+1}`, 70, y);
    ctx.fillText(item.nama, 150, y);
    ctx.fillText(`${item.hari} × Rp${hargaPerHari.toLocaleString()}`, 400, y);
    ctx.fillText(`Rp${subtotal.toLocaleString()}`, 560, y);

    // Garis pemisah antar baris
    y += 26;
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(740, y);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.stroke();

    y += 4; // spasi antar baris
  });

  // Total
  y += 30;
  ctx.font = "bold 18px Segoe UI";
  ctx.fillText("Total:", 400, y);
  ctx.fillText(`Rp ${total.toLocaleString()}`, 560, y);

  // Uang sampah
  y += 30;
  ctx.font = "italic 14px Segoe UI";
  ctx.fillText("+ Uang Sampah", 560, y);

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
