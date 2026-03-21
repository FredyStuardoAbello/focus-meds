// =============================================
// FOCUS-MEDS — notifications.js
// Gestión de permisos y envío de alertas
// =============================================

const Notifications = {

  // Estado actual del permiso
  get permission() {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  },

  // Verificar soporte del navegador
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  // Solicitar permiso al usuario
  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    try {
      const result = await Notification.requestPermission();
      return result;
    } catch (e) {
      console.error('Error al solicitar permisos:', e);
      return 'denied';
    }
  },

  // Enviar notificación mediante Service Worker
  async send(title, options = {}) {
    if (this.permission !== 'granted') return;
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(title, {
        body:    options.body    || '',
        icon:    options.icon    || 'icons/icon-192x192.png',
        badge:   options.badge   || 'icons/icon-72x72.png',
        tag:     options.tag     || 'focusmeds',
        vibrate: options.vibrate || [200, 100, 200],
        requireInteraction: false
      });
    } catch (e) {
      // Fallback: notificación directa si SW no está listo
      if (this.permission === 'granted') {
        new Notification(title, {
          body: options.body || '',
          icon: options.icon || 'icons/icon-192x192.png'
        });
      }
    }
  },

  // Actualizar UI del estado de notificaciones
  updateStatusUI() {
    const statusEl = document.getElementById('notif-status');
    const iconEl   = document.getElementById('notif-icon');
    const textEl   = document.getElementById('notif-text');
    const btnEl    = document.getElementById('btn-enable-notif');

    if (!statusEl) return;

    statusEl.className = 'notif-status';

    if (!this.isSupported()) {
      statusEl.classList.add('denied');
      iconEl.textContent = '⚠️';
      textEl.textContent = 'Tu navegador no soporta notificaciones.';
      if (btnEl) btnEl.classList.add('hidden');
      return;
    }

    switch (this.permission) {
      case 'granted':
        statusEl.classList.add('granted');
        iconEl.textContent = '✅';
        textEl.textContent = 'Notificaciones activadas.';
        if (btnEl) btnEl.classList.add('hidden');
        break;
      case 'denied':
        statusEl.classList.add('denied');
        iconEl.textContent = '🚫';
        textEl.textContent = 'Notificaciones bloqueadas. Actívalas desde la configuración del navegador.';
        if (btnEl) btnEl.classList.add('hidden');
        break;
      default:
        statusEl.classList.add('pending');
        iconEl.textContent = '🔔';
        textEl.textContent = 'Activa las notificaciones para recibir recordatorios.';
        if (btnEl) btnEl.classList.remove('hidden');
    }
  }
};