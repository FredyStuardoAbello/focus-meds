// =============================================
// FOCUS-MEDS — storage.js
// CRUD sobre localStorage
// =============================================

const STORAGE_KEY = 'focusmeds_medications';

const Storage = {

  // Obtener todos los medicamentos
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer localStorage:', e);
      return [];
    }
  },

  // Guardar lista completa
  saveAll(medications) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  },

  // Agregar un medicamento nuevo
  add(medication) {
    const medications = this.getAll();
    medication.id = Date.now().toString();
    medication.createdAt = new Date().toISOString();
    medications.push(medication);
    this.saveAll(medications);
    return medication;
  },

  // Actualizar un medicamento existente por id
  update(id, updatedData) {
    const medications = this.getAll();
    const index = medications.findIndex(m => m.id === id);
    if (index !== -1) {
      medications[index] = { ...medications[index], ...updatedData };
      this.saveAll(medications);
      return medications[index];
    }
    return null;
  },

  // Eliminar un medicamento por id
  remove(id) {
    const medications = this.getAll().filter(m => m.id !== id);
    this.saveAll(medications);
  },

  // Obtener un medicamento por id
  getById(id) {
    return this.getAll().find(m => m.id === id) || null;
  },

  // Limpiar todos los registros
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
};