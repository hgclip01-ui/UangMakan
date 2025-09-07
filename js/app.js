// Utilities
const $ = id => document.getElementById(id);
const formatIDR = n => (Number(n) || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const nowString = () => new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

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
const tfootSummary = $('tfoot-summary');
const tfootTotal = $('tfoot-total');
const capture = $('capture');
const timestampEl = $('timestamp');

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
  const totalHari = items.reduce((s,i)=>s+i.days,0);
  const total = items.reduce((s, i) => s + (i.days * RATE), 0);
  tfootSummary.textContent = `${items.length} orang, ${totalHari} hari`;
  tfootTotal.textContent = formatIDR(total);
  timestampEl.textContent = `Generated at: ${nowString()}`;
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
  const header = [`Catatan Uang Makan - ${nowString()}`, '', 'Nama,Hari,Total(IDR)'];
  const rows = items.map(it => [it.name, it.days, it.days * RATE].join(','));
  const totalHari = items.reduce((s,i)=>s+i.days,0);
  const total = items.reduce((s,i)=>s+(i.days*RATE),0);
  const footer = ['', `TOTAL: ${totalHari} hari, ${formatIDR(total)}`];
  const csv = [...header, ...rows, ...footer].join('\n');
  const blob = new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Catatan-Uang-Makan-${Date.now()}.csv`;
  a.click();
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
    a.href = dataUrl;
    a.download = `Catatan-Uang-Makan-${Date.now()}.png`;
    a.click();
  } catch(err) {
    console.error(err);
    alert('Gagal export PNG, cek console browser.');
  }
});

// Enter = tambah
inpDays.addEventListener('keydown', e => { if (e.key === 'Enter') btnAdd.click(); });
