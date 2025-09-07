// Utilities
const $ = id => document.getElementById(id);
const formatIDR = n => {
  const num = Number(n) || 0;
  return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
};

// Konstanta
const RATE = 6000;
const KEY = 'meal-tracker:items';

// Elements
const inpName = $('inp-name');
const inpDays = $('inp-days');
const btnAdd = $('btn-add');
const btnPNG = $('btn-png');
const btnCSV = $('btn-csv');
const btnPrint = $('btn-print');
const btnClear = $('btn-clear');
const tbody = $('tbody');
const totalEl = $('total');
const tfootTotal = $('tfoot-total');
const capture = $('capture');

// Storage
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch(e) { return []; }
};
let items = load();

const save = () => localStorage.setItem(KEY, JSON.stringify(items));

// Render Table
const render = () => {
  tbody.innerHTML = '';
  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="px-3 py-6 text-center text-sm text-gray-500">Belum ada data</td></tr>';
  } else {
    items.forEach((it, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b';
      tr.innerHTML = `
        <td class="px-3 py-2">${it.name}</td>
        <td class="px-3 py-2">${it.days}</td>
        <td class="px-3 py-2 font-medium">${formatIDR(it.days * RATE)}</td>
        <td class="px-3 py-2 text-right">
          <button data-del="${idx}" class="del-btn text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">🗑</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  const total = items.reduce((s, i) => s + (i.days * RATE), 0);
  totalEl.textContent = formatIDR(total);
  tfootTotal.textContent = formatIDR(total);
  save();
};
render();

// Add item
btnAdd.addEventListener('click', () => {
  const name = inpName.value.trim();
  const days = Math.round(Number(inpDays.value) || 0);
  if (!name || !days) return alert('Isi Nama & Jumlah Hari');
  items.push({ name, days });
  inpName.value = '';
  inpDays.value = '';
  render();
});

// Delete item
tbody.addEventListener('click', e => {
  if (e.target.closest('.del-btn')) {
    const idx = e.target.closest('.del-btn').dataset.del;
    items.splice(idx, 1);
    render();
  }
});

// Clear all
btnClear.addEventListener('click', () => {
  if (confirm('Hapus semua data?')) {
    items = [];
    render();
  }
});

// Print
btnPrint.addEventListener('click', () => window.print());

// CSV Download
btnCSV.addEventListener('click', () => {
  if (items.length === 0) return alert('Belum ada data untuk diunduh');

  const header = ['Nama','Hari','Total(IDR)'];
  const rows = items.map(it => [it.name, it.days, it.days * RATE]);
  const total = items.reduce((s,i)=>s+(i.days*RATE),0);
  const csv = [header, ...rows, ['', 'TOTAL', total]].map(r => r.join(',')).join('\n');

  const blob = new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'Catatan-Uang-Makan.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// PNG Export
btnPNG.addEventListener('click', async () => {
  if (items.length === 0) return alert('Belum ada data untuk diexport');
  try {
    const dataUrl = await htmlToImage.toPng(capture, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: 'white'
    });
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataUrl;
    a.download = `Catatan-Uang-Makan-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch(err) {
    console.error(err);
    alert('Gagal export PNG, cek console browser.');
  }
});

// Enter = tambah
inpDays.addEventListener('keydown', e => { if (e.key === 'Enter') btnAdd.click(); });
