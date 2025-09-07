const hargaPerHari = 6000;
let data = [];

const namaInput = document.getElementById("namaInput");
const hariInput = document.getElementById("hariInput");
const addBtn = document.getElementById("addBtn");
const listOrang = document.getElementById("listOrang");
const grandTotal = document.getElementById("grandTotal");
const downloadBtn = document.getElementById("downloadBtn");
const exportArea = document.getElementById("exportArea");

// Splash screen
const splash = document.getElementById("splash");
const startBtn = document.getElementById("startBtn");
const app = document.getElementById("app");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    splash.classList.add("hidden");
    app.classList.remove("hidden");
  });
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

// Render Export
function renderExport() {
  exportArea.innerHTML = `
    <h1>Catatan Uang Makan</h1>
    <div id="listOrangExport"></div>
    <div class="total">
      <span>Total</span>
      <strong id="grandTotalExport">Rp 0</strong>
    </div>
    <p class="uang-sampah">+ Uang Sampah</p>
    <p class="footer"><span id="tanggalNow"></span></p>
  `;

  const listExport = document.getElementById("listOrangExport");
  const grandTotalExport = document.getElementById("grandTotalExport");

  let total = 0;
  data.forEach((item, i) => {
    const subtotal = item.hari * hargaPerHari;
    total += subtotal;

    const div = document.createElement("div");
    div.innerText = `${i+1}. ${item.nama} - ${item.hari} Hari × Rp${hargaPerHari.toLocaleString()} = Rp${subtotal.toLocaleString()}`;
    listExport.appendChild(div);
  });

  grandTotalExport.innerText = "Rp " + total.toLocaleString();

  // Tanggal
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("tanggalNow").innerText = now.toLocaleDateString("id-ID", options);
}

// Download JPG
downloadBtn.addEventListener("click", () => {
  renderExport();
  exportArea.classList.remove("hidden");
  document.getElementById("loading").classList.remove("hidden"); // tampilkan spinner

  setTimeout(() => {
    html2canvas(exportArea, {
      backgroundColor: "#0f172a",
      scale: 2
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = "uang-makan.jpg";
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.click();

      exportArea.classList.add("hidden");
      document.getElementById("loading").classList.add("hidden"); // sembunyikan spinner
    }).catch(err => {
      console.error("Gagal download:", err);
      alert("Download gagal, coba ulangi.");
      document.getElementById("loading").classList.add("hidden"); // sembunyikan spinner
    });
  }, 300);
});
