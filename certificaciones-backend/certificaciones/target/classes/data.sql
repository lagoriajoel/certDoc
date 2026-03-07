-- Datos de prueba para el sistema de certificaciones

-- Insertar Situaciones de Revista (solo si no existen)
INSERT INTO situaciones_revista (id, nombre)
SELECT 1, 'Titular'
WHERE NOT EXISTS (SELECT 1 FROM situaciones_revista WHERE id = 1);

INSERT INTO situaciones_revista (id, nombre)
SELECT 2, 'Interino'
WHERE NOT EXISTS (SELECT 1 FROM situaciones_revista WHERE id = 2);

INSERT INTO situaciones_revista (id, nombre)
SELECT 3, 'Suplente'
WHERE NOT EXISTS (SELECT 1 FROM situaciones_revista WHERE id = 3);

-- Insertar Espacios Curriculares
INSERT INTO espacios_curriculares (id, nombre)
SELECT 1, 'Física'
WHERE NOT EXISTS (SELECT 1 FROM espacios_curriculares WHERE id = 1);

INSERT INTO espacios_curriculares (id, nombre)
SELECT 2, 'Física Aplicada'
WHERE NOT EXISTS (SELECT 1 FROM espacios_curriculares WHERE id = 2);

-- Insertar Docente
INSERT INTO docentes (id, dni, apellido, nombre)
SELECT 1, '25678901', 'García', 'María Laura'
WHERE NOT EXISTS (SELECT 1 FROM docentes WHERE id = 1);

-- Insertar Movimientos de Horas
-- Movimiento 1: con fecha de baja
INSERT INTO movimientos_horas (
    id, docente_id, espacio_curricular_id, curso, division, modalidad,
    cantidad_horas, situacion_revista_id, fecha_alta, instrumento_legal_alta,
    fecha_baja, instrumento_legal_baja, observaciones
)
SELECT
    1, 1, 1, '3°', 'A', 'Presencial',
    8, 1, '2020-03-01', 'Res. 0123/2020',
    '2022-12-31', 'Res. 0456/2022', NULL
WHERE NOT EXISTS (SELECT 1 FROM movimientos_horas WHERE id = 1);

-- Movimiento 2: con fecha de baja
INSERT INTO movimientos_horas (
    id, docente_id, espacio_curricular_id, curso, division, modalidad,
    cantidad_horas, situacion_revista_id, fecha_alta, instrumento_legal_alta,
    fecha_baja, instrumento_legal_baja, observaciones
)
SELECT
    2, 1, 2, '4°', 'B', 'Presencial',
    6, 2, '2022-03-01', 'Res. 0789/2022',
    '2023-12-15', 'Res. 0321/2023', NULL
WHERE NOT EXISTS (SELECT 1 FROM movimientos_horas WHERE id = 2);

-- Movimiento 3: SIN fecha de baja (continúa activo)
INSERT INTO movimientos_horas (
    id, docente_id, espacio_curricular_id, curso, division, modalidad,
    cantidad_horas, situacion_revista_id, fecha_alta, instrumento_legal_alta,
    fecha_baja, instrumento_legal_baja, observaciones
)
SELECT
    3, 1, 1, '5°', 'A', 'Presencial',
    10, 1, '2024-03-01', 'Res. 0050/2024',
    NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM movimientos_horas WHERE id = 3);


-- ==========================================
-- Usuarios del sistema (password: admin123)
-- Hash BCrypt de "admin123"
-- ==========================================
INSERT INTO usuarios (username, password, nombre, rol, activo)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', 'ADMIN', true
    WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'admin');

INSERT INTO usuarios (username, password, nombre, rol, activo)
SELECT 'operador', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Operador', 'OPERADOR', true
    WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'operador');
