// =============================================
// FOCUS-MEDS — onboarding.js
// Se muestra solo la primera vez que se abre la app
// =============================================

const ONBOARDING_KEY = 'focusmeds_onboarding_done';

const STEPS = [
  {
    icon: '💊',
    title: 'Bienvenido a Focus-Meds',
    desc:  'Tu asistente personal para recordar tus medicamentos durante la jornada laboral. Simple, rápido y siempre contigo.',
    color: '#1d4ed8',
  },
  {
    icon: '➕',
    title: 'Agrega tus medicamentos',
    desc:  'Toca el botón <strong>＋</strong> para registrar el nombre, dosis y hora de cada medicamento que debes tomar.',
    color: '#0f766e',
  },
  {
    icon: '✔',
    title: 'Confirma cada toma',
    desc:  'Cuando tomes un medicamento, pulsa <strong>"✔ Tomé"</strong>. Quedará registrado en el historial del día.',
    color: '#15803d',
  },
  {
    icon: '🔔',
    title: 'Activa las notificaciones',
    desc:  'Permite las notificaciones para recibir recordatorios automáticos en la hora exacta de cada medicamento.',
    color: '#7c3aed',
  },
];

function buildOnboarding() {
  const overlay = document.createElement('div');
  overlay.id        = 'onboarding-overlay';
  overlay.className = 'ob-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Introducción a Focus-Meds');

  overlay.innerHTML = `
    <div class="ob-card" id="ob-card">

      <!-- Indicadores de paso -->
      <div class="ob-dots" id="ob-dots" aria-hidden="true">
        ${STEPS.map((_, i) => `<span class="ob-dot${i === 0 ? ' ob-dot--active' : ''}" data-step="${i}"></span>`).join('')}
      </div>

      <!-- Slide dinámico -->
      <div class="ob-slide" id="ob-slide">
        <div class="ob-icon-wrap" id="ob-icon-wrap">
          <span class="ob-icon" id="ob-icon">${STEPS[0].icon}</span>
        </div>
        <h2 class="ob-title" id="ob-title">${STEPS[0].title}</h2>
        <p  class="ob-desc"  id="ob-desc">${STEPS[0].desc}</p>
      </div>

      <!-- Acciones -->
      <div class="ob-actions">
        <button class="ob-btn ob-btn--ghost" id="ob-skip">Omitir</button>
        <button class="ob-btn ob-btn--primary" id="ob-next">Siguiente</button>
      </div>

    </div>`;

  document.body.appendChild(overlay);

  let current = 0;

  const iconWrap = overlay.querySelector('#ob-icon-wrap');
  const iconEl   = overlay.querySelector('#ob-icon');
  const titleEl  = overlay.querySelector('#ob-title');
  const descEl   = overlay.querySelector('#ob-desc');
  const card     = overlay.querySelector('#ob-card');
  const btnNext  = overlay.querySelector('#ob-next');
  const btnSkip  = overlay.querySelector('#ob-skip');
  const dots     = overlay.querySelectorAll('.ob-dot');

  function applyStep(idx, dir = 1) {
    const s = STEPS[idx];

    // Animación salida
    const slideEl = overlay.querySelector('#ob-slide');
    slideEl.classList.add(dir > 0 ? 'ob-slide--out-left' : 'ob-slide--out-right');

    setTimeout(() => {
      // Actualizar contenido
      iconEl.textContent    = s.icon;
      titleEl.textContent   = s.title;
      descEl.innerHTML      = s.desc;
      iconWrap.style.background = s.color + '22';
      iconWrap.style.border     = `2px solid ${s.color}33`;

      // Actualizar dots
      dots.forEach((d, i) => d.classList.toggle('ob-dot--active', i === idx));

      // Botón final
      if (idx === STEPS.length - 1) {
        btnNext.textContent = '¡Comenzar!';
        btnNext.classList.add('ob-btn--success');
        btnNext.classList.remove('ob-btn--primary');
        btnSkip.classList.add('ob-hidden');
      } else {
        btnNext.textContent = 'Siguiente';
        btnNext.classList.add('ob-btn--primary');
        btnNext.classList.remove('ob-btn--success');
        btnSkip.classList.remove('ob-hidden');
      }

      // Animación entrada
      slideEl.classList.remove('ob-slide--out-left', 'ob-slide--out-right');
      slideEl.classList.add(dir > 0 ? 'ob-slide--in-right' : 'ob-slide--in-left');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => slideEl.classList.remove('ob-slide--in-right', 'ob-slide--in-left'));
      });
    }, 180);
  }

  btnNext.addEventListener('click', () => {
    if (current < STEPS.length - 1) {
      current++;
      applyStep(current, 1);
    } else {
      finishOnboarding(overlay);
    }
  });

  btnSkip.addEventListener('click', () => finishOnboarding(overlay));

  // Inicializar colores del primer paso
  iconWrap.style.background = STEPS[0].color + '22';
  iconWrap.style.border     = `2px solid ${STEPS[0].color}33`;

  // Animación de entrada inicial
  requestAnimationFrame(() => overlay.classList.add('ob-overlay--visible'));
}

function finishOnboarding(overlay) {
  overlay.classList.add('ob-overlay--exit');
  localStorage.setItem(ONBOARDING_KEY, '1');
  setTimeout(() => overlay.remove(), 380);
}

function initOnboarding() {
  if (localStorage.getItem(ONBOARDING_KEY)) return;
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildOnboarding);
  } else {
    buildOnboarding();
  }
}

initOnboarding();