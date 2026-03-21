// =============================================
// FOCUS-MEDS — notifications.js  (v3)
// =============================================
const Notifications = {

  get permission() {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  },

  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  // IMPORTANTE: esta función DEBE invocarse directamente desde un click handler
  // para que el navegador móvil acepte mostrar el diálogo de permisos.
  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    if (this.permission === 'granted') return 'granted';
    if (this.permission === 'denied')  return 'denied';
    try {
      const result = await Notification.requestPermission();
      return result;
    } catch (e) {
      // Fallback para navegadores que usan callback en vez de Promise
      return new Promise(resolve => {
        Notification.requestPermission(resolve);
      });
    }
  },

  async send(title, options = {}) {
    if (this.permission !== 'granted') return;
    const opts = {
      body:    options.body  || '',
      icon:    'icons/icon-192x192.png',
      badge:   'icons/icon-72x72.png',
      tag:     options.tag   || 'focusmeds',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      silent:  false
    };
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, opts);
    } catch {
      // Fallback sin SW (ej: Chrome en escritorio sin SW activo)
      try { new Notification(title, opts); } catch {}
    }
  },

  updateStatusUI() {
    const textEl = document.getElementById('notif-text');
    const btnEl  = document.getElementById('btn-enable-notif');
    const badge  = document.getElementById('notif-badge');
    if (!textEl) return;

    textEl.className = 'notif-text';

    if (!this.isSupported()) {
      textEl.textContent = '⚠️ Navegador no compatible con notificaciones';
      textEl.classList.add('denied');
      if (btnEl) btnEl.classList.add('hidden');
      return;
    }

    // Detectar iOS sin app instalada
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone === true
      || window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      textEl.classList.add('pending');
      textEl.innerHTML = '📲 iPhone: instala la app para activar notificaciones';
      if (btnEl) btnEl.classList.add('hidden');
      return;
    }

    switch (this.permission) {
      case 'granted':
        textEl.classList.add('granted');
        textEl.textContent = '✅ Notificaciones activadas';
        if (btnEl)  btnEl.classList.add('hidden');
        if (badge)  badge.textContent = '🔔';
        break;
      case 'denied':
        textEl.classList.add('denied');
        textEl.innerHTML = '🚫 Bloqueadas &mdash; permítelas desde ajustes del navegador';
        if (btnEl) btnEl.classList.add('hidden');
        if (badge) badge.textContent = '🔕';
        break;
      default:
        textEl.classList.add('pending');
        textEl.textContent = 'Activa los recordatorios automáticos';
        if (btnEl) btnEl.classList.remove('hidden');
    }
  },

  async init() {
    this.updateStatusUI();
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.ready; } catch {}
    }
    this.updateStatusUI();
  }
};
