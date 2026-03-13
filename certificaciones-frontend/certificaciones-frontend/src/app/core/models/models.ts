// ==========================================
// Docente
// ==========================================
export interface Docente {
  id?: number;
  dni: string;
  apellido: string;
  nombre: string;
  legajo?: string;
  tituloDocente?: string;
  fechaIngreso?: string | null;
  email?: string | null;
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
  tipo?: string;
  cargoNombre?: string;
  cargoId?: number;
  cargoRequiereCurso?: boolean;
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
   notaPie?: string | null;
}

//cargo/
export interface Cargo {
  id?: number;
  nombre: string;
  requiereCurso?: boolean;
}

export interface MovimientoCertificacion {
  numero: number;
  tipo: string;
  espacioCurricular?: string;
  cargo?: string;
  cantidadHoras?: number;
  curso?: string;
  division?: string;
  modalidad?: string;
  situacionRevista: string;
  fechaAlta: string;
  instrumentoLegalAlta: string;
  fechaBaja?: string;
  instrumentoLegalBaja?: string;
  observaciones?: string;
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

// ==========================================
// Auth
// ==========================================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  nombre: string;
  rol: string;
  expiresIn: number;
}

export interface UsuarioLogueado {
  username: string;
  nombre: string;
  rol: string;
}
// ==========================================
// Usuarios (admin)
// ==========================================
export interface UsuarioResponse {
  id: number;
  username: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export interface CrearUsuarioRequest {
  username: string;
  password: string;
  nombre: string;
  rol: string;
}


export type TipoActa = 'ALTA_HORAS' | 'BAJA_HORAS' | 'CAMBIO_SITUACION_REVISTA';

export interface Acta {
  id?: number;
  movimientoId: number;
  tipoActa: TipoActa;
  numeroDisposicion: string;
  fechaActa: string;
  nombreDirectivo: string;
  visto: string;
  considerando: string;
  articulos: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  // Datos del movimiento
  docenteNombre?: string;
  docenteDni?: string;
  espacioCurricular?: string;
  cantidadHoras?: number;
  curso?: string;
  division?: string;
  situacionRevista?: string;
  instrumentoLegalAlta?: string;
  instrumentoLegalBaja?: string;
}