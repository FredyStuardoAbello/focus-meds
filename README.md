[README.md](https://github.com/user-attachments/files/26161535/README.md)
# 💊 Focus-Meds

**Sistema de Soporte a la Adherencia Farmacológica y Seguridad Ocupacional**

Aplicación Web Progresiva (PWA) desarrollada para el Área de Prevención de Riesgos de GTD-Telsur, orientada a apoyar a trabajadores con rasgos TEA en la gestión autónoma de su medicación durante la jornada laboral.

🔗 **App en vivo:** [https://fredystuardoabello.github.io/focus-meds/](https://fredystuardoabello.github.io/focus-meds/)

---

## 📋 Descripción

Focus-Meds actúa como complemento discreto al tratamiento médico del trabajador, entregando recordatorios oportunos en los horarios configurados sin interferir con sus actividades laborales habituales.

La problemática abordada es la ausencia de una herramienta tecnológica accesible que apoye la adherencia farmacológica de trabajadores con rasgos del Trastorno del Espectro Autista (TEA), cuyo olvido o incertidumbre respecto a la toma de medicamentos puede derivar en episodios de ansiedad que representan un factor de riesgo en entornos que demandan atención sostenida.

---

## ✨ Funcionalidades

- ➕ **Registro de medicamentos** — nombre, dosis y hora de toma
- ✏️ **Edición y eliminación** de recordatorios
- ✔ **Confirmación de toma** con registro en historial del día
- ⏳ **Próxima toma** con cuenta regresiva en tiempo real
- 📅 **Historial del día** de tomas confirmadas
- 🔔 **Notificaciones automáticas** en los horarios configurados
- 🌙 **Modo oscuro / claro** con respeto a la preferencia del sistema
- 📖 **Onboarding** de bienvenida (accesible desde el footer)
- 📲 **Instalable como PWA** en Android e iOS
- ✈️ **Funciona sin conexión** una vez instalada

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura y accesibilidad (WCAG 2.1) |
| CSS3 | Estilos responsivos, dark mode, animaciones |
| JavaScript Vanilla | Lógica funcional sin frameworks externos |
| Service Workers | Caché offline y notificaciones en segundo plano |
| Web Notifications API | Recordatorios del sistema operativo |
| localStorage | Persistencia de datos sin servidor externo |
| Web App Manifest | Instalabilidad PWA |

---

## 📁 Estructura del proyecto

```
focus-meds/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── style.css
├── js/
│   ├── theme.js
│   ├── onboarding.js
│   ├── storage.js
│   ├── notifications.js
│   └── app.js
└── icons/
    ├── icon-72x72.png
    ├── icon-192x192.png
    └── icon-512x512.png
```

---

## 🚀 Uso

### En navegador
Accede directamente a [https://fredystuardoabello.github.io/focus-meds/](https://fredystuardoabello.github.io/focus-meds/)

### Instalar como app en Android
1. Abre la URL en **Chrome**
2. Toca el menú ⋮ → **"Agregar a pantalla de inicio"**
3. Toca **"Instalar"**

### Instalar como app en iPhone
1. Abre la URL en **Safari**
2. Toca el ícono compartir □↑
3. Selecciona **"Agregar a pantalla de inicio"**
4. Toca **"Agregar"**

> ⚠️ En iPhone, las notificaciones solo funcionan con la app instalada desde Safari.

---

## 🔔 Sobre las notificaciones

Focus-Meds utiliza la **Web Notifications API** junto al Service Worker para emitir recordatorios en los horarios configurados. Para recibir los avisos, mantén la app abierta o en segundo plano durante tu jornada laboral.

---

## 🏢 Contexto institucional

| | |
|---|---|
| **Organización** | GTD Teleductos S.A. (GTD-Telsur) |
| **Área** | Prevención de Riesgos — Gerencia Telsur |
| **Ubicación** | Talcahuano, Región del Biobío, Chile |
| **Marco normativo** | Ley N° 16.744 — Accidentes del Trabajo y Enfermedades Profesionales |

---

## 👤 Autor

**Fredy Stuardo Abello**
Ingeniería Informática — Instituto Profesional IACC
Práctica Profesional · GTD-Telsur · 2026

---

## ⚠️ Aviso

Focus-Meds es una herramienta de apoyo recordatorio. **No reemplaza indicaciones médicas**, no realiza diagnósticos y no gestiona información clínica sensible.
