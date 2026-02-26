package com.escuela.certificaciones.controller;

import com.escuela.certificaciones.dto.DocenteDTO;
import com.escuela.certificaciones.service.DocenteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
@Tag(name = "Docentes", description = "CRUD de docentes")
public class DocenteController {

    private final DocenteService docenteService;

    @GetMapping
    @Operation(summary = "Listar todos los docentes")
    public ResponseEntity<List<DocenteDTO>> findAll() {
        return ResponseEntity.ok(docenteService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener docente por ID")
    public ResponseEntity<DocenteDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(docenteService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo docente")
    public ResponseEntity<DocenteDTO> create(@Valid @RequestBody DocenteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(docenteService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar docente")
    public ResponseEntity<DocenteDTO> update(@PathVariable Long id, @Valid @RequestBody DocenteDTO dto) {
        return ResponseEntity.ok(docenteService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar docente")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        docenteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
