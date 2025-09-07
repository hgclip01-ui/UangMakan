function startApp() {
  document.getElementById("start-screen").classList.add("hidden");
  const app = document.getElementById("app");
  app.classList.remove("hidden");
  app.classList.add("animate-fadeIn");

  // Animasi card muncul
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(card => {
      card.classList.remove("opacity-0", "translate-y-6");
    });
  }, 100);
}

// Hitung total otomatis
document.addEventListener("input", () => {
  let total = 0;
  document.querySelectorAll(".harga").forEach(el => {
    total += Number(el.value) || 0;
  });
  document.getElementById("total").innerText = total.toLocaleString();
});

// Download PNG (ikut gradient dongker, bukan putih polos)
function downloadPNG() {
  const body = document.body;
  html2canvas(body, {
    scale: 1.5,
    useCORS: true,
    backgroundColor: null,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "uang-makan.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  });
}
