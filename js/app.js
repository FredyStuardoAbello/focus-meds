// =============================================
// FOCUS-MEDS — app.js (v6 — FAB + drawer)
// =============================================

let editingId    = null;
let checkInterval = null;
let countdownInt  = null;
const HISTORY_KEY = 'focusmeds_history';

// ── DOM ──
const form      = document.getElementById('med-form');
const inputName = document.getElementById('med-name');
const inputDose = document.getElementById('med-dose');
const inputTime = document.getElementById('med-time');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel-edit');
const medList   = document.getElementById('med-list');
const emptyMsg  = document.getElementById('empty-msg');
const btnNotif  = document.getElementById('btn-enable-notif');
const medCount  = document.getElementById('med-count');
const histList  = document.getElementById('history-list');
const histEmpty = document.getElementById('history-empty');
const btnClearH = document.getElementById('btn-clear-history');
const fab       = document.getElementById('fab-btn');
const drawer    = document.getElementById('form-drawer');
const overlay   = document.getElementById('drawer-overlay');
const drawerClose = document.getElementById('drawer-close');
const drawerTitleText = document.getElementById('drawer-title-text');

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  Notifications.init();
  clearOldHistory();
  renderList();
  renderHistory();
  startChecker();
  startCountdown();

  form.addEventListener('submit', handleSubmit);
  btnCancel.addEventListener('click', cancelEdit);
  btnNotif.addEventListener('click', handleEnableNotif);
  btnClearH.addEventListener('click', clearHistory);

  // FAB — abrir/cerrar drawer
  fab.addEventListener('click', toggleDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Cerrar con Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
});

// ── FAB / DRAWER ──
function openDrawer() {
  drawer.classList.remove('hidden');
  overlay.classList.remove('hidden');
  fab.classList.add('open');
  fab.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  setTimeout(() => inputName.focus(), 200);
}
function closeDrawer() {
  drawer.classList.add('closing');
  setTimeout(() => {
    drawer.classList.remove('closing');
    drawer.classList.add('hidden');
    overlay.classList.add('hidden');
    fab.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (!editingId) form.reset();
    clearErrors();
  }, 220);
}
function toggleDrawer() {
  if (drawer.classList.contains('hidden')) openDrawer();
  else closeDrawer();
}

// ── SW ──
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try { await navigator.serviceWorker.register('sw.js'); }
  catch (e) { console.error('SW:', e); }
}

// ── SUBMIT ──
function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;
  const data = { name: inputName.value.trim(), dose: inputDose.value.trim(), time: inputTime.value };
  if (editingId) { Storage.update(editingId, data); cancelEdit(); }
  else           { Storage.add(data); }
  closeDrawer();
  renderList();
  updateNextTake();
}

// ── VALIDACIÓN ──
function validateForm() {
  let ok = true; clearErrors();
  if (!inputName.value.trim()) { setError('error-name', inputName, 'Campo obligatorio'); ok = false; }
  if (!inputDose.value.trim()) { setError('error-dose', inputDose, 'Campo obligatorio'); ok = false; }
  if (!inputTime.value)        { setError('error-time', inputTime, 'Selecciona una hora'); ok = false; }
  return ok;
}
function setError(id, el, msg) { document.getElementById(id).textContent = msg; el.classList.add('input-error'); }
function clearErrors() {
  ['error-name','error-dose','error-time'].forEach(id => document.getElementById(id).textContent = '');
  [inputName, inputDose, inputTime].forEach(el => el.classList.remove('input-error'));
}

// ── EDICIÓN ──
function startEdit(id) {
  const med = Storage.getById(id); if (!med) return;
  editingId = id;
  inputName.value = med.name; inputDose.value = med.dose; inputTime.value = med.time;
  drawerTitleText.textContent = 'Editar recordatorio';
  btnSubmit.innerHTML = '<span class="btn-icon">✓</span> Guardar cambios';
  btnCancel.classList.remove('hidden');
  openDrawer();
}
function cancelEdit() {
  editingId = null; form.reset(); clearErrors();
  drawerTitleText.textContent = 'Nuevo recordatorio';
  btnSubmit.innerHTML = '<span class="btn-icon">＋</span> Agregar recordatorio';
  btnCancel.classList.add('hidden');
  closeDrawer();
}

// ── ELIMINAR ──
function removeMed(id) {
  if (!confirm('¿Eliminar este recordatorio?')) return;
  Storage.remove(id);
  if (editingId === id) { editingId = null; }
  renderList(); updateNextTake();
}

// ── [1] CONFIRMAR TOMA ──
function confirmTake(id) {
  const med = Storage.getById(id); if (!med) return;
  const timeStr = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  addToHistory({ name: med.name, dose: med.dose, takenAt: timeStr });
  renderHistory();
  const btn = document.querySelector(`[data-confirm="${id}"]`);
  if (btn) { btn.textContent = '✅ ¡Tomado!'; btn.disabled = true; setTimeout(() => { btn.innerHTML = '✔ Tomé'; btn.disabled = false; }, 2500); }
}

// ── [2] HISTORIAL ──
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } }
function addToHistory(e) { const l = getHistory(); e.id = Date.now().toString(); e.date = new Date().toLocaleDateString('es-CL'); l.push(e); localStorage.setItem(HISTORY_KEY, JSON.stringify(l)); }
function clearOldHistory() { const t = new Date().toLocaleDateString('es-CL'); localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(e => e.date === t))); }
function clearHistory() { if (!confirm('¿Limpiar el historial de hoy?')) return; localStorage.setItem(HISTORY_KEY, '[]'); renderHistory(); }
function renderHistory() {
  const list = getHistory(); histList.innerHTML = '';
  if (list.length === 0) { histEmpty.classList.remove('hidden'); return; }
  histEmpty.classList.add('hidden');
  list.slice().reverse().forEach(e => {
    const item = document.createElement('div');
    item.className = 'history-item'; item.setAttribute('role', 'listitem');
    item.innerHTML = `<div class="history-check" aria-hidden="true">✅</div><div class="history-info"><div class="history-name">${escapeHtml(e.name)}</div><div class="history-meta">📏 ${escapeHtml(e.dose)} · ⏰ ${e.takenAt}</div></div>`;
    histList.appendChild(item);
  });
}

// ── RENDER LISTA ──
function renderList() {
  const meds = Storage.getAll(); medList.innerHTML = '';
  if (medCount) medCount.textContent = meds.length > 0 ? meds.length : '';
  if (meds.length === 0) { emptyMsg.classList.remove('hidden'); return; }
  emptyMsg.classList.add('hidden');
  meds.forEach(med => {
    const item = document.createElement('div');
    item.className = 'med-item'; item.setAttribute('role', 'listitem');
    item.innerHTML = `
      <div class="med-pill-icon" aria-hidden="true">💊</div>
      <div class="med-info">
        <div class="med-name">${escapeHtml(med.name)}</div>
        <div class="med-meta">
          <span class="meta-chip">📏 ${escapeHtml(med.dose)}</span>
          <span class="meta-chip">⏰ ${formatTime(med.time)}</span>
        </div>
      </div>
      <div class="med-actions">
        <button class="btn btn-confirm btn--sm" data-confirm="${med.id}"
          onclick="confirmTake('${med.id}')" aria-label="Confirmar toma de ${escapeHtml(med.name)}">✔ Tomé</button>
        <button class="btn btn-edit btn--sm"
          onclick="startEdit('${med.id}')" aria-label="Editar ${escapeHtml(med.name)}">✏️</button>
        <button class="btn btn-danger btn--sm"
          onclick="removeMed('${med.id}')" aria-label="Eliminar ${escapeHtml(med.name)}">🗑️</button>
      </div>`;
    medList.appendChild(item);
  });
}

// ── [5] PRÓXIMA TOMA ──
function updateNextTake() {
  const meds = Storage.getAll();
  const nameEl = document.getElementById('next-med-name');
  const timeEl = document.getElementById('next-countdown');
  if (meds.length === 0) { nameEl.textContent = '—'; timeEl.textContent = 'Sin recordatorios configurados'; timeEl.className = 'next-time'; return; }
  const now = new Date(); const nowMins = now.getHours() * 60 + now.getMinutes();
  const sorted = meds.map(m => { const [h,mi] = m.time.split(':').map(Number); let d = h*60+mi - nowMins; if(d<0) d+=1440; return {...m, diff:d}; }).sort((a,b)=>a.diff-b.diff);
  const next = sorted[0];
  nameEl.textContent = next.name + ' — ' + next.dose;
  if (next.diff === 0) { timeEl.textContent = '¡Ahora! Hora de tomar tu medicamento'; timeEl.className = 'next-time urgent'; }
  else if (next.diff <= 15) { timeEl.textContent = `En ${next.diff} min (${formatTime(next.time)})`; timeEl.className = 'next-time urgent'; }
  else if (next.diff <= 60) { timeEl.textContent = `En ${next.diff} min (${formatTime(next.time)})`; timeEl.className = 'next-time soon'; }
  else { const h=Math.floor(next.diff/60), m=next.diff%60; timeEl.textContent = m>0 ? `En ${h}h ${m}min (${formatTime(next.time)})` : `En ${h}h (${formatTime(next.time)})`; timeEl.className = 'next-time normal'; }
}
function startCountdown() { updateNextTake(); countdownInt = setInterval(updateNextTake, 60000); }

// ── NOTIFICACIONES ──
async function handleEnableNotif() {
  // requestPermission debe estar en el call stack directo del click
  const result = await Notifications.requestPermission();
  Notifications.updateStatusUI();
  if (result === 'granted') {
    Notifications.send('Focus-Meds activo ✅', { body: 'Recibirás recordatorios en los horarios configurados.' });
  } else if (result === 'denied') {
    Notifications.updateStatusUI();
  }
}
function startChecker() { checkMeds(); checkInterval = setInterval(checkMeds, 60000); }
function checkMeds() {
  if (Notifications.permission !== 'granted') return;
  const now = new Date(); const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const last = localStorage.getItem('focusmeds_last_notif') || '';
  Storage.getAll().forEach(med => { const key=`${med.id}_${hhmm}`; if(med.time===hhmm&&last!==key){Notifications.send(`💊 Hora de tomar ${med.name}`,{body:`Dosis: ${med.dose}`,tag:`fm_${med.id}`});localStorage.setItem('focusmeds_last_notif',key);} });
}

// ── UTILS ──
function formatTime(t) { if(!t) return ''; const [hh,mm]=t.split(':'); const h=parseInt(hh); return `${h%12||12}:${mm} ${h>=12?'PM':'AM'}`; }
function escapeHtml(s) { const d=document.createElement('div'); d.appendChild(document.createTextNode(s)); return d.innerHTML; }