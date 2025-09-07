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

// Download PNG via Canvas API
downloadBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Ukuran canvas
  canvas.width = 800;
  canvas.height = 1100;

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

  // Data
  ctx.textAlign = "left";
  ctx.font = "16px Segoe UI";
  let y = 120;
  let total = 0;
  data.forEach((item, i) => {
    const subtotal = item.hari * hargaPerHari;
    total += subtotal;
    ctx.fillText(`${i+1}. ${item.nama} - ${item.hari} Hari × Rp${hargaPerHari.toLocaleString()} = Rp${subtotal.toLocaleString()}`, 60, y);
    y += 28;
  });

  // Total
  y += 20;
  ctx.font = "bold 18px Segoe UI";
  ctx.fillText(`Total: Rp ${total.toLocaleString()}`, 60, y);

  // Uang sampah
  y += 26;
  ctx.font = "italic 14px Segoe UI";
  ctx.fillText("+ Uang Sampah", 60, y);

  // Tanggal
  y += 50;
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
