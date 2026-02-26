# 🎓 Sistema de Certificaciones de Servicios Docentes

API REST con Spring Boot para emitir certificaciones de servicios docentes en formato JSON y PDF.

---

## 🛠️ Stack Tecnológico

- **Java 17**
- **Spring Boot 3.2.3**
- **Spring Data JPA + MySQL 8**
- **Lombok + MapStruct**
- **OpenPDF** (generación de PDFs)
- **Springdoc OpenAPI** (Swagger UI)

---

## 🚀 Ejecución con Docker (recomendado)

### Requisitos previos
- Docker Desktop instalado y en ejecución
- Docker Compose v2+

### Pasos

```bash
# 1. Clonar / posicionarse en el directorio del proyecto
cd certificaciones

# 2. Construir y levantar los servicios
docker compose up --build

# 3. Esperar ~60 segundos hasta que el backend esté listo
# Verás en los logs: "Started CertificacionesApplication"
```

### Accesos
| Servicio       | URL                                        |
|----------------|-------------------------------------------|
| Swagger UI     | http://localhost:8080/swagger-ui.html     |
| API docs JSON  | http://localhost:8080/api-docs            |
| Backend API    | http://localhost:8080/api/                |
| MySQL          | localhost:3306 (usuario: admin / admin)   |

### Detener los servicios
```bash
docker compose down

# Para borrar también los datos de MySQL:
docker compose down -v
```

---

## 💻 Ejecución local (sin Docker)

### Requisitos
- JDK 17
- Maven 3.9+
- MySQL 8 corriendo en localhost:3306

### Preparar MySQL
```sql
CREATE DATABASE certificaciones;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON certificaciones.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

### Ejecutar
```bash
mvn clean package -DskipTests
java -jar target/certificaciones-1.0.0.jar
```

O con variables de entorno personalizadas:
```bash
DB_HOST=localhost DB_PORT=3306 DB_NAME=certificaciones \
DB_USER=admin DB_PASSWORD=admin \
java -jar target/certificaciones-1.0.0.jar
```

---

## 📡 Endpoints disponibles

### Docentes
| Método | Endpoint              | Descripción              |
|--------|-----------------------|--------------------------|
| GET    | /api/docentes         | Listar todos             |
| GET    | /api/docentes/{id}    | Obtener por ID           |
| POST   | /api/docentes         | Crear docente            |
| PUT    | /api/docentes/{id}    | Actualizar docente       |
| DELETE | /api/docentes/{id}    | Eliminar docente         |

### Movimientos de Horas
| Método | Endpoint                              | Descripción                 |
|--------|----------------------------------------|-----------------------------|
| GET    | /api/movimientos-horas                | Listar todos                |
| GET    | /api/movimientos-horas/{id}           | Obtener por ID              |
| GET    | /api/movimientos-horas/docente/{id}   | Movimientos de un docente   |
| POST   | /api/movimientos-horas                | Crear movimiento            |
| PUT    | /api/movimientos-horas/{id}           | Actualizar movimiento       |
| DELETE | /api/movimientos-horas/{id}           | Eliminar movimiento         |

### Espacios Curriculares
| Método | Endpoint                        | Descripción        |
|--------|---------------------------------|--------------------|
| GET    | /api/espacios-curriculares      | Listar todos       |
| GET    | /api/espacios-curriculares/{id} | Obtener por ID     |
| POST   | /api/espacios-curriculares      | Crear              |
| PUT    | /api/espacios-curriculares/{id} | Actualizar         |
| DELETE | /api/espacios-curriculares/{id} | Eliminar           |

### Certificaciones
| Método | Endpoint                          | Descripción                 |
|--------|-----------------------------------|-----------------------------|
| GET    | /api/certificaciones/{docenteId}     | JSON con la certificación   |
| GET    | /api/certificaciones/{docenteId}/pdf | Descarga el PDF             |

---

## 📋 Datos de prueba incluidos

Al iniciar la aplicación, `data.sql` carga automáticamente:

- **1 Docente:** María Laura García, DNI 25678901
- **2 Espacios curriculares:** Física, Física Aplicada
- **3 Situaciones de revista:** Titular, Interino, Suplente
- **3 Movimientos de horas** (el último sin fecha de baja → aparece como "Continúa")

### Probar la certificación
```bash
# JSON
curl http://localhost:8080/api/certificaciones/1

# PDF (guarda el archivo)
curl -o certificacion.pdf http://localhost:8080/api/certificaciones/1/pdf
```

---

## 🏗️ Estructura del proyecto

```
src/main/java/com/escuela/certificaciones/
├── CertificacionesApplication.java
├── config/          # SwaggerConfig
├── controller/      # DocenteController, MovimientoHorasController,
│                    # EspacioCurricularController, CertificacionController
├── dto/             # DocenteDTO, MovimientoHorasDTO, CertificacionResponseDTO,
│                    # MovimientoCertificacionDTO, EspacioCurricularDTO
├── entity/          # Docente, EspacioCurricular, SituacionRevista, MovimientoHoras
├── exception/       # ResourceNotFoundException, BusinessException,
│                    # GlobalExceptionHandler
├── mapper/          # DocenteMapper, EspacioCurricularMapper, MovimientoHorasMapper
├── pdf/             # PdfCertificacionGenerator
├── repository/      # Todos los repositorios JPA
└── service/         # DocenteService, MovimientoHorasService,
                     # EspacioCurricularService, CertificacionService
```
