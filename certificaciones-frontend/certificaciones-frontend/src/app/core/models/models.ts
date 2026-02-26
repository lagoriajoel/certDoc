// ==========================================
// Docente
// ==========================================
export interface Docente {
  id?: number;
  dni: string;
  apellido: string;
  nombre: string;
}

// ==========================================
// Situación de Revista
// ==========================================
export enum SituacionRevista {
  TITULAR = 'Titular',
  INTERINO = 'Interino',
  SUPLENTE = 'Suplente'
}

// ==========================================
// Movimiento de Horas
// ==========================================
export interface MovimientoHoras {
  id?: number;
  docenteId: number;
  espacioCurricularId: number;
  espacioCurricularNombre?: string;
  curso: string;
  division: string;
  modalidad: string;
  cantidadHoras: number;
  situacionRevistaId: number;
  situacionRevistaNombre?: string;
  fechaAlta: string;
  instrumentoLegalAlta: string;
  fechaBaja?: string | null;
  instrumentoLegalBaja?: string | null;
  observaciones?: string | null;
}

// ==========================================
// Espacio Curricular
// ==========================================
export interface EspacioCurricular {
  id: number;
  nombre: string;
}

// ==========================================
// Situación de Revista (entidad)
// ==========================================
export interface SituacionRevistaEntity {
  id: number;
  nombre: string;
}

// ==========================================
// Certificación
// ==========================================
export interface CertificacionResponse {
  docenteId: number;
  apellidoNombre: string;
  dni: string;
  movimientos: MovimientoCertificacion[];
  totalHorasActivas: number;
}

export interface MovimientoCertificacion {
  numero: number;
  espacioCurricular: string;
  cantidadHoras: number;
  curso: string;
  division: string;
  modalidad: string;
  situacionRevista: string;
  fechaAlta: string;
  instrumentoLegalAlta: string;
  fechaBaja?: string | null;
  instrumentoLegalBaja?: string | null;
  observaciones?: string | null;
}

// ==========================================
// Confirmación dialog
// ==========================================
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}
