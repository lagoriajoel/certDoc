package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.MovimientoHorasDTO;
import com.escuela.certificaciones.service.MovimientoHorasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos-horas")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@Tag(name = "Movimientos de Horas", description = "CRUD de movimientos de horas docentes")
public class MovimientoHorasController {

    private final MovimientoHorasService service;

    @GetMapping
    @Operation(summary = "Listar todos los movimientos")
    public ResponseEntity<List<MovimientoHorasDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener movimiento por ID")
    public ResponseEntity<MovimientoHorasDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/docente/{docenteId}")
    @Operation(summary = "Listar movimientos de un docente")
    public ResponseEntity<List<MovimientoHorasDTO>> findByDocente(@PathVariable Long docenteId) {
        return ResponseEntity.ok(service.findByDocente(docenteId));
    }

    @PostMapping
    @Operation(summary = "Crear movimiento de horas")
    public ResponseEntity<MovimientoHorasDTO> create(@Valid @RequestBody MovimientoHorasDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar movimiento de horas")
    public ResponseEntity<MovimientoHorasDTO> update(@PathVariable Long id, @Valid @RequestBody MovimientoHorasDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar movimiento de horas")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
