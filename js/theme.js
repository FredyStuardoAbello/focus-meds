// =============================================
// FOCUS-MEDS — theme.js
// .dark  → modo oscuro forzado
// .light → modo claro forzado (anula sistema)
// sin clase → sigue preferencia del sistema
// =============================================

const THEME_KEY = 'focusmeds_theme';

function applyTheme(mode) {
  // mode: 'dark' | 'light' | 'system'
  const html = document.documentElement;
  html.classList.remove('dark', 'light');

  if (mode === 'dark')  html.classList.add('dark');
  if (mode === 'light') html.classList.add('light');

  // Si es 'system' no se agrega clase — el CSS @media toma control

  updateToggleIcon(mode);
}

function updateToggleIcon(mode) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}

function toggleTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentlyDark = document.documentElement.classList.contains('dark')
    || (!document.documentElement.classList.contains('light') && systemDark);

  const next = currentlyDark ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || 'system');
}

// Aplicar ANTES del primer render para evitar flash
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);

  // Actualizar ícono si el sistema cambia y no hay preferencia guardada
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) {
      updateToggleIcon('system');
    }
  });
});
