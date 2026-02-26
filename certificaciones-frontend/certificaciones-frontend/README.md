# 🎓 CertDoc — Frontend Angular 17

Frontend Angular 17 + Angular Material para el sistema de Certificaciones de Servicios Docentes.

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js 18+ (se recomienda LTS)
- Angular CLI 17: `npm install -g @angular/cli@17`
- Backend Spring Boot corriendo en `http://localhost:8080`

### Pasos

```bash
# 1. Ir al directorio del proyecto
cd certificaciones-frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
ng serve

# La app estará en http://localhost:4200
```

---

## 📁 Estructura del proyecto

```
src/app/
├── core/
│   ├── models/
│   │   └── models.ts              # Interfaces: Docente, MovimientoHoras, etc.
│   ├── services/
│   │   ├── docente.service.ts     # HTTP CRUD docentes
│   │   ├── movimiento.service.ts  # HTTP CRUD movimientos + catálogos
│   │   └── loading.service.ts     # BehaviorSubject para spinner global
│   └── interceptors/
│       └── loading.interceptor.ts # Activa/desactiva spinner en cada request
│
├── shared/
│   ├── material/
│   │   └── material.module.ts     # Todos los módulos de Angular Material
│   └── components/
│       ├── confirm-dialog/        # Dialog de confirmación reutilizable
│       ├── loading-spinner/       # Overlay de carga global
│       └── certificacion-print/   # Vista imprimible de la certificación
│
├── features/
│   ├── docentes/
│   │   ├── docentes.routes.ts     # Lazy loading de rutas
│   │   ├── docente-list/          # Tabla con buscador, paginador, acciones
│   │   ├── docente-form/          # Alta/edición con Reactive Forms
│   │   └── docente-detalle/       # Detalle + tabla de movimientos
│   └── movimientos/
│       └── movimiento-form/       # Formulario completo con fechas y catálogos
│
├── app.component.ts               # Shell: sidenav + toolbar + router-outlet
├── app.routes.ts                  # Rutas raíz con lazy loading
└── app.config.ts                  # Providers: router, HTTP, animations, locale
```

---

## 🌐 Rutas disponibles

| Ruta                                          | Componente             | Descripción              |
|-----------------------------------------------|------------------------|--------------------------|
| `/docentes`                                   | DocenteListComponent   | Lista de docentes        |
| `/docentes/nuevo`                             | DocenteFormComponent   | Crear docente            |
| `/docentes/:id`                               | DocenteDetalleComponent| Detalle + movimientos    |
| `/docentes/:id/editar`                        | DocenteFormComponent   | Editar docente           |
| `/docentes/:docenteId/movimiento/nuevo`       | MovimientoFormComponent| Crear movimiento         |
| `/docentes/:docenteId/movimiento/:id/editar` | MovimientoFormComponent| Editar movimiento        |

---

## ⚙️ Configuración del backend

En `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ← URL de tu backend Spring Boot
};
```

---

## 📡 Endpoints que consume el frontend

### Docentes
- `GET /api/docentes`
- `GET /api/docentes/:id`
- `POST /api/docentes`
- `PUT /api/docentes/:id`
- `DELETE /api/docentes/:id`

### Movimientos de Horas
- `GET /api/movimientos-horas`
- `GET /api/movimientos-horas/:id`
- `GET /api/movimientos-horas/docente/:docenteId`
- `POST /api/movimientos-horas`
- `PUT /api/movimientos-horas/:id`
- `DELETE /api/movimientos-horas/:id`

### Catálogos
- `GET /api/espacios-curriculares`
- `GET /api/situaciones-revista`

### Certificaciones
- `GET /api/certificaciones/:docenteId` → JSON
- `GET /api/certificaciones/:docenteId/pdf` → Descarga PDF

---

## 🔧 Si el backend usa otro puerto o host

Editá `src/environments/environment.ts` y cambiá `apiUrl`.

---

## ✅ Funcionalidades implementadas

- [x] Lista de docentes con búsqueda en tiempo real (nombre/DNI)
- [x] Paginación y ordenamiento en tabla
- [x] CRUD completo de docentes con validaciones
- [x] Detalle de docente con tabla de movimientos
- [x] Formulario de movimientos con datepicker, selects y validaciones
- [x] Confirmación antes de eliminar (dialog)
- [x] Snackbar de feedback para operaciones
- [x] Spinner global en todas las llamadas HTTP
- [x] Vista de certificación imprimible con `window.print()`
- [x] Lazy loading de módulos/componentes
- [x] Tipado fuerte con interfaces TypeScript
- [x] Locale AR para datepickers (`dd/MM/yyyy`)
