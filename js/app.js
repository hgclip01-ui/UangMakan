const $ = id => document.getElementById(id);
const formatIDR = n => (Number(n)||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});
const RATE = 6000;
const KEY = 'meal-tracker';

const inpName = $('inp-name');
const inpDays = $('inp-days');
const btnAdd = $('btn-add');
const tbody = $('tbody');
const grandTotalEl = $('grand-total');
const tfootTotal = $('tfoot-total');
const btnClear = $('btn-clear');
const btnPrint = $('btn-print');
const btnCSV = $('btn-csv');
const btnPNG = $('btn-png');
const capture = $('capture');

let items = JSON.parse(localStorage.getItem(KEY) || '[]');

function save() { localStorage.setItem(KEY, JSON.stringify(items)); }

function render() {
  tbody.innerHTML = '';
  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="px-3 py-6 text-center text-sm text-gray-500">Belum ada data</td></tr>';
  } else {
    items.forEach((it, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b';
      tr.innerHTML = `
        <td class="px-3 py-2">${it.name}</td>
        <td class="px-3 py-2">
          <input type="number" value="${it.days}" data-idx="${idx}" class="days-input w-20 border rounded px-2 py-1"/>
        </td>
        <td class="px-3 py-2 font-medium">${formatIDR(it.days * RATE)}</td>
        <td class="px-3 py-2 text-right">
          <button data-del="${idx}" class="del-btn text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">🗑</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  const total = items.reduce((s, i) => s + (i.days * RATE), 0);
  grandTotalEl.textContent = formatIDR(total);
  tfootTotal.textContent = formatIDR(total);
  save();
}

render();

btnAdd.addEventListener('click', () => {
  const name = inpName.value.trim();
  const days = Number(inpDays.value);
  if (!name || !days) return alert('Isi nama & jumlah hari');
  items.push({name, days});
  inpName.value = '';
  inpDays.value = '';
  render();
});

tbody.addEventListener('input', e => {
  if (e.target.matches('.days-input')) {
    const idx = e.target.dataset.idx;
    items[idx].days = Number(e.target.value)||0;
    render();
  }
});

tbody.addEventListener('click', e => {
  if (e.target.closest('.del-btn')) {
    const idx = e.target.closest('.del-btn').dataset.del;
    items.splice(idx, 1); // langsung hapus
    render();
  }
});

btnClear.addEventListener('click', () => {
  if (confirm('Hapus semua data?')) {
    items = [];
    render();
  }
});

btnPrint.addEventListener('click', () => window.print());

btnCSV.addEventListener('click', () => {
  const header = ['Nama','Hari','Total(IDR)'];
  const rows = items.map(it => [it.name, it.days, it.days * RATE]);
  const total = items.reduce((s,i)=>s+(i.days*RATE),0);
  const csv = [header, ...rows, ['', 'TOTAL', total]].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Catatan-Uang-Makan.csv';
  a.click();
  URL.revokeObjectURL(url);
});

btnPNG.addEventListener('click', async () => {
  try {
    const dataUrl = await htmlToImage.toPng(capture, {cacheBust:true, pixelRatio:2, backgroundColor:'white'});
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Catatan-Uang-Makan-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.png`;
    a.click();
  } catch(err) {
    alert('Gagal export PNG, cek console.');
    console.error(err);
  }
});
