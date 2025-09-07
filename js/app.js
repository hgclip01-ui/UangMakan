const splash = document.getElementById("splash");
const app = document.getElementById("app");
const mulaiBtn = document.getElementById("mulaiBtn");

const namaInput = document.getElementById("namaInput");
const hariInput = document.getElementById("hariInput");
const tambahBtn = document.getElementById("tambahBtn");
const listOrang = document.getElementById("listOrang");
const grandTotalEl = document.getElementById("grandTotal");
const downloadBtn = document.getElementById("downloadBtn");

let data = [];
const hargaPerHari = 6000; // Bisa diubah sesuai kebutuhan

// Mulai dari splash
mulaiBtn.addEventListener("click", () => {
  splash.style.display = "none";
  app.classList.remove("hidden");
});

// Tambah orang
tambahBtn.addEventListener("click", () => {
  const nama = namaInput.value.trim();
  const hari = parseInt(hariInput.value) || 0;

  if (!nama || hari <= 0) return;

  data.push({ nama, hari });
  render();
  namaInput.value = "";
  hariInput.value = "";
});

// Render list
function render() {
  listOrang.innerHTML = "";
  let total = 0;

  data.forEach((item, i) => {
    const subtotal = item.hari * hargaPerHari;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "orang glass";
    div.innerHTML = `
      <div>
        <span>${i + 1}. ${item.nama}</span><br>
        <small>${item.hari} Hari × Rp${hargaPerHari.toLocaleString()} = Rp${subtotal.toLocaleString()}</small>
      </div>
      <div class="aksi">
        <span onclick="editOrang(${i})">✏️</span>
        <span onclick="hapusOrang(${i})">🗑️</span>
      </div>
    `;
    listOrang.appendChild(div);
  });

  grandTotalEl.innerText = "Rp " + total.toLocaleString();
}

// Hapus orang
function hapusOrang(index) {
  data.splice(index, 1);
  render();
}

// Edit orang
function editOrang(index) {
  const baruHari = prompt("Masukkan jumlah hari baru:", data[index].hari);
  if (baruHari !== null && !isNaN(baruHari)) {
    data[index].hari = parseInt(baruHari);
    render();
  }
}

// Download PNG
downloadBtn.addEventListener("click", () => {
  html2canvas(app, {
    backgroundColor: null,
    scale: 2
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "uang-makan.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
