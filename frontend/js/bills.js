const API = "http://localhost:5000";
let _cachedBills = [];

/* ── HELPERS ── */
function showToast(msg, type) {
  type = type || 'success';
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type;
  t.style.animation = 'none';
  t.style.display = 'block';
  t.offsetHeight;
  t.style.animation = 'toastIn 0.3s both';
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.style.display = 'none'; }, 3500);
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtAmt(v) {
  var n = parseFloat(v);
  if (isNaN(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function initials(name) {
  if (!name) return '?';
  var p = String(name).trim().split(' ');
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}

var AV_COLORS = [
  ['rgba(132,204,22,0.15)','#84cc16'],
  ['rgba(14,165,233,0.15)','#0ea5e9'],
  ['rgba(16,185,129,0.15)','#10b981'],
  ['rgba(245,158,11,0.15)','#f59e0b'],
  ['rgba(168,85,247,0.15)','#a855f7'],
  ['rgba(244,63,94,0.15)','#f43f5e']
];
function avColor(s) {
  var h = 0;
  for (var i = 0; i < (s||'').length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return AV_COLORS[h % AV_COLORS.length];
}

/* ── LOAD APPOINTMENTS ── */
async function loadAppointments() {
  try {
    var res = await fetch(API + "/appointments");
    if (!res.ok) throw new Error(res.status);
    var appointments = await res.json();
    var dropdown = document.getElementById("appointmentSelect");
    dropdown.innerHTML = '<option value="" disabled selected>Select Appointment</option>';
    appointments.forEach(function(a) {
      var opt = document.createElement('option');
      opt.value = a.appointment_id;
      opt.textContent = a.patient_name + ' - ' + a.doctor_name + ' (' + a.appointment_date + ')';
      dropdown.appendChild(opt);
    });
  } catch(err) {
    console.error("loadAppointments:", err);
    showToast("Could not load appointments. Is the server running?", "error");
  }
}

/* ── LOAD BILLS ── */
async function loadBills() {
  try {
    var res = await fetch(API + "/bills");
    if (!res.ok) throw new Error(res.status);
    var bills = await res.json();
    _cachedBills = bills;
    renderBills(bills);
    updateStats(bills);
    document.getElementById('pageSubtitle').textContent =
      bills.length + ' bill' + (bills.length !== 1 ? 's' : '') + ' on record';
  } catch(err) {
    console.error("loadBills:", err);
    document.getElementById('billTable').innerHTML =
      '<tr><td colspan="5"><div class="empty-state"><p>Could not load bills. Is the backend running on port 5000?</p></div></td></tr>';
    document.getElementById('pageSubtitle').textContent = 'Server unreachable';
  }
}

/* ── RENDER BILLS ── */
function renderBills(bills) {
  var table = document.getElementById("billTable");
  var meta  = document.getElementById("tableMeta");
  meta.textContent = bills.length + ' result' + (bills.length !== 1 ? 's' : '');

  if (bills.length === 0) {
    table.innerHTML = '<tr><td colspan="5"><div class="empty-state"><p>No bills yet. Generate one above.</p></div></td></tr>';
    return;
  }

  table.innerHTML = "";
  bills.forEach(function(b) {
    var colors = avColor(b.patient_name);
    var bg = colors[0], fg = colors[1];
    var row = document.createElement('tr');

    var printBtn = document.createElement('button');
    printBtn.className = 'btn-print';
    printBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-7.5 0h.008v.008H10.5V10.5Z"/></svg> Print';
    printBtn.onclick = (function(id, name, amt, dt){
      return function(){ printReceipt(id, name, amt, dt); };
    })(b.bill_id, b.patient_name || '', b.amount, b.bill_date);

    row.innerHTML =
      '<td><span class="bill-num">#' + b.bill_id + '</span></td>' +
      '<td><div class="pat-cell">' +
        '<div class="pat-avatar" style="background:' + bg + ';color:' + fg + '">' + initials(b.patient_name) + '</div>' +
        '<span class="pat-name">' + (b.patient_name || '—') + '</span>' +
      '</div></td>' +
      '<td><span class="amount-val">' + fmtAmt(b.amount) + '</span></td>' +
      '<td><span class="date-chip-sm">' + fmtDate(b.bill_date) + '</span></td>' +
      '<td></td>';

    row.querySelector('td:last-child').appendChild(printBtn);
    table.appendChild(row);
  });
}

/* ── CREATE BILL ── */
async function createBill() {
  var appointment_id = document.getElementById("appointmentSelect").value;
  var amount         = document.getElementById("billAmount").value;
  var bill_date      = document.getElementById("billDate").value;

  if (!appointment_id) { showToast("Please select an appointment.", "error"); return; }
  if (!amount || parseFloat(amount) <= 0) { showToast("Please enter a valid amount.", "error"); return; }
  if (!bill_date) { showToast("Please select a bill date.", "error"); return; }

  try {
    var res = await fetch(API + "/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_id: appointment_id, amount: amount, bill_date: bill_date })
    });
    if (!res.ok) {
      var d = await res.json().catch(function(){ return {}; });
      showToast("Error: " + (d.error || "Unknown error"), "error");
      return;
    }
    document.getElementById("appointmentSelect").value = "";
    document.getElementById("billAmount").value = "";
    document.getElementById("billDate").value = new Date().toISOString().split('T')[0];
    showToast("Bill generated successfully!");
    loadBills();
  } catch(err) {
    console.error("createBill:", err);
    showToast("Failed to generate bill. Server unreachable.", "error");
  }
}

/* ── STATS ── */
function updateStats(bills) {
  var total = bills.length;
  var revenue = bills.reduce(function(s,b){ return s + (parseFloat(b.amount)||0); }, 0);
  var avg = total ? revenue / total : 0;
  var now = new Date();
  var thisMonth = bills
    .filter(function(b){
      var d = new Date(b.bill_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce(function(s,b){ return s + (parseFloat(b.amount)||0); }, 0);

  document.getElementById('statBills').textContent   = total;
  document.getElementById('statRevenue').textContent = fmtAmt(revenue);
  document.getElementById('statAvg').textContent     = total ? fmtAmt(Math.round(avg)) : '—';
  document.getElementById('statMonth').textContent   = fmtAmt(thisMonth);
}

/* ── FILTER ── */
function filterBills() {
  var q = document.getElementById('searchInput').value.toLowerCase();
  var filtered = _cachedBills.filter(function(b){
    return (b.patient_name||'').toLowerCase().indexOf(q) !== -1;
  });
  renderBills(filtered);
}

/* ── PRINT RECEIPT (uses DOM only — no HTML strings) ── */
function printReceipt(id, patient, amount, date) {
  var dateStr = date ? new Date(date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}) : '—';
  var w = window.open('', '_blank', 'width=500,height=600');
  var doc = w.document;

  // Build entirely via DOM — zero HTML strings, zero parser risk
  var html  = doc.createElement('html');
  var head  = doc.createElement('head');
  var body  = doc.createElement('body');

  var title = doc.createElement('title');
  title.textContent = 'Receipt #' + id;
  head.appendChild(title);

  var style = doc.createElement('style');
  style.textContent = [
    'body{font-family:sans-serif;padding:44px;color:#111;background:#fff;margin:0}',
    'h2{font-size:1.6rem;font-weight:800;margin:0 0 2px}',
    '.sub{color:#888;font-size:.8rem;margin-bottom:32px}',
    '.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0}',
    '.lbl{color:#999;font-size:.8rem}',
    '.val{font-weight:600;font-size:.88rem}',
    '.total{margin-top:22px;padding:14px 18px;background:#f7fef0;border-radius:10px;',
    '  border:1px solid #d4f09a;display:flex;justify-content:space-between;align-items:center}',
    '.tlbl{font-size:.88rem;color:#555}',
    '.tval{font-size:1.4rem;font-weight:800;color:#65a30d}',
    '.footer{margin-top:32px;font-size:.7rem;color:#bbb;text-align:center;line-height:1.6}'
  ].join('');
  head.appendChild(style);

  function el(tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function row(label, value) {
    var r = el('div','row');
    r.appendChild(el('span','lbl',label));
    r.appendChild(el('span','val',value));
    return r;
  }

  body.appendChild(el('h2', null, 'MedCore'));
  body.appendChild(el('div','sub','Official Billing Receipt'));
  body.appendChild(row('Bill ID', '#' + id));
  body.appendChild(row('Patient', patient));
  body.appendChild(row('Date', dateStr));

  var total = el('div','total');
  total.appendChild(el('span','tlbl','Total Amount'));
  total.appendChild(el('span','tval','₹' + Number(amount).toLocaleString('en-IN')));
  body.appendChild(total);

  body.appendChild(el('div','footer','Thank you for choosing MedCore. Please retain this receipt for your records.'));

  html.appendChild(head);
  html.appendChild(body);
  doc.appendChild(html);

  // Trigger print after a short delay to let styles apply
  w.setTimeout(function(){ w.print(); w.close(); }, 400);
}

/* ── INIT ── */
document.getElementById('dateChip').textContent = new Date().toLocaleDateString('en-IN', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
});
document.getElementById('billDate').value = new Date().toISOString().split('T')[0];

loadAppointments();
loadBills();
